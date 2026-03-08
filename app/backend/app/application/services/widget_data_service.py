from datetime import date, datetime
from decimal import Decimal
from typing import Any
from uuid import UUID

from fastapi import HTTPException, status

from app.infrastructure.database.models import DashboardWidgetModel, EntityFieldModel
from app.infrastructure.database.repositories.dashboard_repository import DashboardRepository
from app.infrastructure.database.repositories.dynamic_data_repository import DynamicDataRepository
from app.infrastructure.database.repositories.metadata_repository import MetadataRepository


class WidgetDataService:
    def __init__(
        self,
        dashboard_repo: DashboardRepository,
        meta_repo: MetadataRepository,
        data_repo: DynamicDataRepository,
    ):
        self._dashboards = dashboard_repo
        self._meta = meta_repo
        self._data = data_repo

    @staticmethod
    def _serialize(value: Any) -> Any:
        if isinstance(value, Decimal):
            return float(value)
        if isinstance(value, datetime):
            return value.isoformat()
        if isinstance(value, date):
            return value.isoformat()
        return value

    def _field_column_name(self, fields: list[EntityFieldModel], field_name: str) -> str:
        for f in fields:
            if f.name == field_name:
                return f.column_name
        return field_name

    async def get_widget_data(self, dashboard_id: UUID, widget_id: UUID) -> dict[str, Any]:
        widget = await self._dashboards.get_widget_by_id(widget_id)
        if not widget or widget.dashboard_id != dashboard_id:
            raise HTTPException(status.HTTP_404_NOT_FOUND, f"Widget {widget_id} no encontrado")

        entity = await self._meta.get_entity_by_id(widget.entity_id)
        if not entity:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Entidad del widget no encontrada")

        handler = {
            "STAT_CARD": self._stat_card_data,
            "KPI_CARD": self._kpi_card_data,
            "DATA_GRID": self._data_grid_data,
            "BAR_CHART": self._bar_chart_data,
            "PIE_CHART": self._pie_chart_data,
            "LINE_CHART": self._line_chart_data,
            "RECENT_LIST": self._recent_list_data,
        }.get(widget.widget_type)

        if not handler:
            return {"error": f"Tipo de widget no soportado: {widget.widget_type}"}

        return await handler(widget, entity)

    async def get_all_widgets_data(self, dashboard_id: UUID) -> list[dict[str, Any]]:
        dashboard = await self._dashboards.get_dashboard_by_id(dashboard_id)
        if not dashboard:
            raise HTTPException(status.HTTP_404_NOT_FOUND, f"Dashboard {dashboard_id} no encontrado")

        results = []
        for widget in dashboard.widgets:
            try:
                data = await self.get_widget_data(dashboard_id, widget.id)
                results.append({
                    "widget_id": str(widget.id),
                    "widget_type": widget.widget_type,
                    "data": data,
                })
            except Exception as e:
                results.append({
                    "widget_id": str(widget.id),
                    "widget_type": widget.widget_type,
                    "data": None,
                    "error": str(e),
                })
        return results

    async def _stat_card_data(self, widget: DashboardWidgetModel, entity) -> dict:
        config = widget.config or {}
        aggregation = config.get("aggregation", "count")
        field_name = config.get("field")
        column = self._field_column_name(entity.fields, field_name) if field_name else None

        value = await self._data.aggregate(entity.table_name, aggregation, column)
        return {"value": self._serialize(value)}

    async def _kpi_card_data(self, widget: DashboardWidgetModel, entity) -> dict:
        config = widget.config or {}
        aggregation = config.get("aggregation", "count")
        field_name = config.get("field")
        column = self._field_column_name(entity.fields, field_name) if field_name else None

        value = await self._data.aggregate(entity.table_name, aggregation, column)
        return {
            "value": self._serialize(value),
            "format": config.get("format", "number"),
            "label": config.get("label", widget.title),
        }

    async def _data_grid_data(self, widget: DashboardWidgetModel, entity) -> dict:
        config = widget.config or {}
        page_size = config.get("pageSize", 5)
        column_names = config.get("columns", [])

        columns_meta = []
        for f in entity.fields:
            if not column_names or f.name in column_names:
                columns_meta.append({
                    "name": f.name,
                    "display_name": f.display_name,
                    "column_name": f.column_name,
                    "field_type": f.field_type,
                })

        column_to_name = {f.column_name: f.name for f in entity.fields}
        total = await self._data.count_records(entity.table_name)
        rows = await self._data.get_records(entity.table_name, page=1, page_size=page_size)

        items = []
        for row in rows:
            item = {"id": str(row["id"]), "created_at": self._serialize(row.get("created_at"))}
            for key, val in row.items():
                if key in ("id", "created_at"):
                    continue
                name = column_to_name.get(key, key)
                if not column_names or name in column_names:
                    item[name] = self._serialize(val)
            items.append(item)

        return {
            "columns": columns_meta,
            "items": items,
            "total": total,
            "page_size": page_size,
        }

    async def _bar_chart_data(self, widget: DashboardWidgetModel, entity) -> dict:
        config = widget.config or {}
        group_field = config.get("groupBy")
        aggregation = config.get("aggregation", "count")
        agg_field = config.get("field")

        if not group_field:
            return {"series": []}

        group_col = self._field_column_name(entity.fields, group_field)
        agg_col = self._field_column_name(entity.fields, agg_field) if agg_field else None
        rows = await self._data.group_by(entity.table_name, group_col, aggregation, agg_col)
        series = [{"label": self._serialize(r["label"]), "value": self._serialize(r["value"])} for r in rows]
        return {"series": series}

    async def _pie_chart_data(self, widget: DashboardWidgetModel, entity) -> dict:
        return await self._bar_chart_data(widget, entity)

    async def _line_chart_data(self, widget: DashboardWidgetModel, entity) -> dict:
        config = widget.config or {}
        x_axis = config.get("xAxis", "created_at")
        y_axis = config.get("yAxis")
        aggregation = config.get("aggregation", "count")
        interval = config.get("interval", "month")

        date_col = self._field_column_name(entity.fields, x_axis) if x_axis != "created_at" else "created_at"
        agg_col = self._field_column_name(entity.fields, y_axis) if y_axis else None
        rows = await self._data.group_by_date(
            entity.table_name, date_col, aggregation, agg_col, interval
        )
        series = [{"label": self._serialize(r["label"]), "value": self._serialize(r["value"])} for r in rows]
        return {"series": series}

    async def _recent_list_data(self, widget: DashboardWidgetModel, entity) -> dict:
        config = widget.config or {}
        field_names = config.get("fields", [])
        limit = config.get("limit", 5)

        field_cols = [self._field_column_name(entity.fields, fn) for fn in field_names] if field_names else None
        rows = await self._data.get_recent(entity.table_name, field_cols, limit)

        column_to_name = {f.column_name: f.name for f in entity.fields}
        items = []
        for row in rows:
            item = {"id": str(row["id"]), "created_at": self._serialize(row.get("created_at"))}
            for key, val in row.items():
                if key in ("id", "created_at"):
                    continue
                name = column_to_name.get(key, key)
                item[name] = self._serialize(val)
            items.append(item)

        return {"items": items}
