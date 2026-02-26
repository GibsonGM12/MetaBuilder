from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.application.dto.crud_dto import (
    PaginatedResponse,
    RecordCreate,
    RecordResponse,
    RecordUpdate,
)
from app.application.services.crud_service import DynamicCrudService
from app.core.database import get_db
from app.infrastructure.database.repositories.dynamic_data_repository import DynamicDataRepository
from app.infrastructure.database.repositories.metadata_repository import MetadataRepository

router = APIRouter(prefix="/api/entities", tags=["records"])


async def _get_crud_service(db: AsyncSession = Depends(get_db)) -> DynamicCrudService:
    return DynamicCrudService(MetadataRepository(db), DynamicDataRepository(db))


@router.get("/{entity_id}/records", response_model=PaginatedResponse)
async def list_records(
    entity_id: UUID,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    service: DynamicCrudService = Depends(_get_crud_service),
    _user: dict = Depends(get_current_user),
):
    return await service.get_records(entity_id, page, page_size)


@router.get("/{entity_id}/records/{record_id}", response_model=RecordResponse)
async def get_record(
    entity_id: UUID,
    record_id: UUID,
    service: DynamicCrudService = Depends(_get_crud_service),
    _user: dict = Depends(get_current_user),
):
    return await service.get_record(entity_id, record_id)


@router.post("/{entity_id}/records", response_model=RecordResponse, status_code=201)
async def create_record(
    entity_id: UUID,
    payload: RecordCreate,
    service: DynamicCrudService = Depends(_get_crud_service),
    _user: dict = Depends(get_current_user),
):
    return await service.create_record(entity_id, payload)


@router.put("/{entity_id}/records/{record_id}", response_model=RecordResponse)
async def update_record(
    entity_id: UUID,
    record_id: UUID,
    payload: RecordUpdate,
    service: DynamicCrudService = Depends(_get_crud_service),
    _user: dict = Depends(get_current_user),
):
    return await service.update_record(entity_id, record_id, payload)


@router.delete("/{entity_id}/records/{record_id}", status_code=204)
async def delete_record(
    entity_id: UUID,
    record_id: UUID,
    service: DynamicCrudService = Depends(_get_crud_service),
    _user: dict = Depends(get_current_user),
):
    await service.delete_record(entity_id, record_id)
