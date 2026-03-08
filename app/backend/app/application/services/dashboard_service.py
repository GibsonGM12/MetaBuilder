import uuid

from fastapi import HTTPException, status

from app.application.dto.dashboard_dto import (
    DashboardCreate,
    DashboardListResponse,
    DashboardResponse,
    DashboardUpdate,
    VALID_WIDGET_TYPES,
    WidgetCreate,
    WidgetResponse,
    WidgetUpdate,
)
from app.infrastructure.database.models import DashboardModel, DashboardWidgetModel
from app.infrastructure.database.repositories.dashboard_repository import DashboardRepository
from app.infrastructure.database.repositories.metadata_repository import MetadataRepository


class DashboardService:
    def __init__(self, dashboard_repo: DashboardRepository, meta_repo: MetadataRepository):
        self._repo = dashboard_repo
        self._meta = meta_repo

    async def create_dashboard(
        self, payload: DashboardCreate, user_id: uuid.UUID
    ) -> DashboardResponse:
        model = DashboardModel(
            name=payload.name,
            description=payload.description,
            created_by=user_id,
        )
        created = await self._repo.create_dashboard(model)
        return DashboardResponse.model_validate(created)

    async def get_dashboard(self, dashboard_id: uuid.UUID) -> DashboardResponse:
        dashboard = await self._repo.get_dashboard_by_id(dashboard_id)
        if not dashboard:
            raise HTTPException(status.HTTP_404_NOT_FOUND, f"Dashboard {dashboard_id} no encontrado")
        return DashboardResponse.model_validate(dashboard)

    async def get_all_dashboards(self) -> list[DashboardListResponse]:
        dashboards = await self._repo.get_all_dashboards()
        result = []
        for d in dashboards:
            result.append(
                DashboardListResponse(
                    id=d.id,
                    name=d.name,
                    description=d.description,
                    is_default=d.is_default,
                    created_by=d.created_by,
                    created_at=d.created_at,
                    widget_count=len(d.widgets),
                )
            )
        return result

    async def get_default_dashboard(self) -> DashboardResponse | None:
        dashboard = await self._repo.get_default_dashboard()
        if not dashboard:
            return None
        return DashboardResponse.model_validate(dashboard)

    async def update_dashboard(
        self, dashboard_id: uuid.UUID, payload: DashboardUpdate
    ) -> DashboardResponse:
        dashboard = await self._repo.get_dashboard_by_id(dashboard_id)
        if not dashboard:
            raise HTTPException(status.HTTP_404_NOT_FOUND, f"Dashboard {dashboard_id} no encontrado")

        if payload.name is not None:
            dashboard.name = payload.name
        if payload.description is not None:
            dashboard.description = payload.description
        if payload.is_default is True:
            await self._repo.clear_default()
            dashboard.is_default = True
        elif payload.is_default is False:
            dashboard.is_default = False

        updated = await self._repo.update_dashboard(dashboard)
        return DashboardResponse.model_validate(updated)

    async def delete_dashboard(self, dashboard_id: uuid.UUID) -> None:
        deleted = await self._repo.delete_dashboard(dashboard_id)
        if not deleted:
            raise HTTPException(status.HTTP_404_NOT_FOUND, f"Dashboard {dashboard_id} no encontrado")

    async def add_widget(
        self, dashboard_id: uuid.UUID, payload: WidgetCreate
    ) -> WidgetResponse:
        dashboard = await self._repo.get_dashboard_by_id(dashboard_id)
        if not dashboard:
            raise HTTPException(status.HTTP_404_NOT_FOUND, f"Dashboard {dashboard_id} no encontrado")

        if payload.widget_type not in VALID_WIDGET_TYPES:
            raise HTTPException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                f"Tipo de widget inválido: {payload.widget_type}. Válidos: {VALID_WIDGET_TYPES}",
            )

        entity = await self._meta.get_entity_by_id(payload.entity_id)
        if not entity:
            raise HTTPException(status.HTTP_404_NOT_FOUND, f"Entidad {payload.entity_id} no encontrada")

        max_order = await self._repo.get_max_widget_order(dashboard_id)
        widget = DashboardWidgetModel(
            dashboard_id=dashboard_id,
            entity_id=payload.entity_id,
            widget_type=payload.widget_type,
            title=payload.title,
            position=payload.position,
            config=payload.config,
            display_order=max_order + 1,
        )
        created = await self._repo.create_widget(widget)
        return WidgetResponse.model_validate(created)

    async def update_widget(
        self, dashboard_id: uuid.UUID, widget_id: uuid.UUID, payload: WidgetUpdate
    ) -> WidgetResponse:
        widget = await self._repo.get_widget_by_id(widget_id)
        if not widget or widget.dashboard_id != dashboard_id:
            raise HTTPException(status.HTTP_404_NOT_FOUND, f"Widget {widget_id} no encontrado")

        if payload.title is not None:
            widget.title = payload.title
        if payload.position is not None:
            widget.position = payload.position
        if payload.config is not None:
            widget.config = payload.config
        if payload.entity_id is not None:
            entity = await self._meta.get_entity_by_id(payload.entity_id)
            if not entity:
                raise HTTPException(status.HTTP_404_NOT_FOUND, f"Entidad {payload.entity_id} no encontrada")
            widget.entity_id = payload.entity_id
        if payload.widget_type is not None:
            if payload.widget_type not in VALID_WIDGET_TYPES:
                raise HTTPException(
                    status.HTTP_422_UNPROCESSABLE_ENTITY,
                    f"Tipo de widget inválido: {payload.widget_type}",
                )
            widget.widget_type = payload.widget_type

        updated = await self._repo.update_widget(widget)
        return WidgetResponse.model_validate(updated)

    async def delete_widget(self, dashboard_id: uuid.UUID, widget_id: uuid.UUID) -> None:
        widget = await self._repo.get_widget_by_id(widget_id)
        if not widget or widget.dashboard_id != dashboard_id:
            raise HTTPException(status.HTTP_404_NOT_FOUND, f"Widget {widget_id} no encontrado")
        await self._repo.delete_widget(widget_id)
