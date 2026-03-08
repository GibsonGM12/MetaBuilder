from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, require_admin
from app.application.dto.dashboard_dto import (
    DashboardCreate,
    DashboardListResponse,
    DashboardResponse,
    DashboardUpdate,
    WidgetCreate,
    WidgetResponse,
    WidgetUpdate,
)
from app.application.services.dashboard_service import DashboardService
from app.application.services.widget_data_service import WidgetDataService
from app.core.database import get_db
from app.infrastructure.database.repositories.dashboard_repository import DashboardRepository
from app.infrastructure.database.repositories.dynamic_data_repository import DynamicDataRepository
from app.infrastructure.database.repositories.metadata_repository import MetadataRepository

router = APIRouter(prefix="/api/dashboards", tags=["dashboards"])


async def _get_dashboard_service(db: AsyncSession = Depends(get_db)) -> DashboardService:
    return DashboardService(DashboardRepository(db), MetadataRepository(db))


async def _get_widget_data_service(db: AsyncSession = Depends(get_db)) -> WidgetDataService:
    return WidgetDataService(DashboardRepository(db), MetadataRepository(db), DynamicDataRepository(db))


@router.get("", response_model=list[DashboardListResponse])
async def list_dashboards(
    service: DashboardService = Depends(_get_dashboard_service),
    _user: dict = Depends(get_current_user),
):
    return await service.get_all_dashboards()


@router.post("", response_model=DashboardResponse, status_code=201)
async def create_dashboard(
    payload: DashboardCreate,
    service: DashboardService = Depends(_get_dashboard_service),
    user: dict = Depends(require_admin),
):
    return await service.create_dashboard(payload, user["user_id"])


@router.get("/default", response_model=DashboardResponse | None)
async def get_default_dashboard(
    service: DashboardService = Depends(_get_dashboard_service),
    _user: dict = Depends(get_current_user),
):
    return await service.get_default_dashboard()


@router.get("/{dashboard_id}", response_model=DashboardResponse)
async def get_dashboard(
    dashboard_id: UUID,
    service: DashboardService = Depends(_get_dashboard_service),
    _user: dict = Depends(get_current_user),
):
    return await service.get_dashboard(dashboard_id)


@router.put("/{dashboard_id}", response_model=DashboardResponse)
async def update_dashboard(
    dashboard_id: UUID,
    payload: DashboardUpdate,
    service: DashboardService = Depends(_get_dashboard_service),
    _user: dict = Depends(require_admin),
):
    return await service.update_dashboard(dashboard_id, payload)


@router.delete("/{dashboard_id}", status_code=204)
async def delete_dashboard(
    dashboard_id: UUID,
    service: DashboardService = Depends(_get_dashboard_service),
    _user: dict = Depends(require_admin),
):
    await service.delete_dashboard(dashboard_id)


@router.post("/{dashboard_id}/widgets", response_model=WidgetResponse, status_code=201)
async def add_widget(
    dashboard_id: UUID,
    payload: WidgetCreate,
    service: DashboardService = Depends(_get_dashboard_service),
    _user: dict = Depends(require_admin),
):
    return await service.add_widget(dashboard_id, payload)


@router.put("/{dashboard_id}/widgets/{widget_id}", response_model=WidgetResponse)
async def update_widget(
    dashboard_id: UUID,
    widget_id: UUID,
    payload: WidgetUpdate,
    service: DashboardService = Depends(_get_dashboard_service),
    _user: dict = Depends(require_admin),
):
    return await service.update_widget(dashboard_id, widget_id, payload)


@router.delete("/{dashboard_id}/widgets/{widget_id}", status_code=204)
async def delete_widget(
    dashboard_id: UUID,
    widget_id: UUID,
    service: DashboardService = Depends(_get_dashboard_service),
    _user: dict = Depends(require_admin),
):
    await service.delete_widget(dashboard_id, widget_id)


@router.get("/{dashboard_id}/widgets/{widget_id}/data")
async def get_widget_data(
    dashboard_id: UUID,
    widget_id: UUID,
    service: WidgetDataService = Depends(_get_widget_data_service),
    _user: dict = Depends(get_current_user),
):
    return await service.get_widget_data(dashboard_id, widget_id)


@router.get("/{dashboard_id}/data")
async def get_all_widgets_data(
    dashboard_id: UUID,
    service: WidgetDataService = Depends(_get_widget_data_service),
    _user: dict = Depends(get_current_user),
):
    return await service.get_all_widgets_data(dashboard_id)
