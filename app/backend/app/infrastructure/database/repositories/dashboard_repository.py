from uuid import UUID

from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.infrastructure.database.models import DashboardModel, DashboardWidgetModel


class DashboardRepository:
    def __init__(self, session: AsyncSession):
        self._session = session

    async def create_dashboard(self, dashboard: DashboardModel) -> DashboardModel:
        self._session.add(dashboard)
        await self._session.flush()
        await self._session.refresh(dashboard, attribute_names=["widgets"])
        return dashboard

    async def get_dashboard_by_id(self, dashboard_id: UUID) -> DashboardModel | None:
        stmt = (
            select(DashboardModel)
            .where(DashboardModel.id == dashboard_id)
            .options(selectinload(DashboardModel.widgets))
        )
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_all_dashboards(self) -> list[DashboardModel]:
        stmt = (
            select(DashboardModel)
            .options(selectinload(DashboardModel.widgets))
            .order_by(DashboardModel.is_default.desc(), DashboardModel.created_at.desc())
        )
        result = await self._session.execute(stmt)
        return list(result.scalars().all())

    async def get_default_dashboard(self) -> DashboardModel | None:
        stmt = (
            select(DashboardModel)
            .where(DashboardModel.is_default.is_(True))
            .options(selectinload(DashboardModel.widgets))
        )
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()

    async def update_dashboard(self, dashboard: DashboardModel) -> DashboardModel:
        await self._session.flush()
        await self._session.refresh(dashboard, attribute_names=["widgets"])
        return dashboard

    async def delete_dashboard(self, dashboard_id: UUID) -> bool:
        dashboard = await self.get_dashboard_by_id(dashboard_id)
        if not dashboard:
            return False
        await self._session.delete(dashboard)
        await self._session.flush()
        return True

    async def clear_default(self) -> None:
        stmt = (
            update(DashboardModel)
            .where(DashboardModel.is_default.is_(True))
            .values(is_default=False)
        )
        await self._session.execute(stmt)

    async def create_widget(self, widget: DashboardWidgetModel) -> DashboardWidgetModel:
        self._session.add(widget)
        await self._session.flush()
        await self._session.refresh(widget)
        return widget

    async def get_widget_by_id(self, widget_id: UUID) -> DashboardWidgetModel | None:
        stmt = select(DashboardWidgetModel).where(DashboardWidgetModel.id == widget_id)
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()

    async def update_widget(self, widget: DashboardWidgetModel) -> DashboardWidgetModel:
        await self._session.flush()
        await self._session.refresh(widget)
        return widget

    async def delete_widget(self, widget_id: UUID) -> bool:
        widget = await self.get_widget_by_id(widget_id)
        if not widget:
            return False
        await self._session.delete(widget)
        await self._session.flush()
        return True

    async def get_max_widget_order(self, dashboard_id: UUID) -> int:
        stmt = select(func.coalesce(func.max(DashboardWidgetModel.display_order), 0)).where(
            DashboardWidgetModel.dashboard_id == dashboard_id
        )
        result = await self._session.execute(stmt)
        return result.scalar_one()
