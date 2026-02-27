from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import require_admin
from app.application.dto.metadata_dto import (
    EntityCreate,
    EntityListResponse,
    EntityResponse,
    EntityUpdate,
    FieldCreate,
    FieldResponse,
)
from app.application.services.metadata_service import MetadataService
from app.core.database import get_db
from app.infrastructure.database.repositories.metadata_repository import MetadataRepository
from app.infrastructure.database.table_manager import TableManager

router = APIRouter(prefix="/api/metadata", tags=["metadata"])


async def _get_service(db: AsyncSession = Depends(get_db)) -> MetadataService:
    return MetadataService(MetadataRepository(db), TableManager(db))


@router.get("/entities", response_model=list[EntityListResponse])
async def list_entities(
    service: MetadataService = Depends(_get_service),
    _admin: dict = Depends(require_admin),
):
    return await service.get_all_entities()


@router.get("/entities/{entity_id}", response_model=EntityResponse)
async def get_entity(
    entity_id: UUID,
    service: MetadataService = Depends(_get_service),
    _admin: dict = Depends(require_admin),
):
    return await service.get_entity(entity_id)


@router.post("/entities", response_model=EntityResponse, status_code=201)
async def create_entity(
    data: EntityCreate,
    service: MetadataService = Depends(_get_service),
    _admin: dict = Depends(require_admin),
):
    return await service.create_entity(data)


@router.put("/entities/{entity_id}", response_model=EntityResponse)
async def update_entity(
    entity_id: UUID,
    data: EntityUpdate,
    service: MetadataService = Depends(_get_service),
    _admin: dict = Depends(require_admin),
):
    return await service.update_entity(entity_id, data)


@router.delete("/entities/{entity_id}", status_code=204)
async def delete_entity(
    entity_id: UUID,
    service: MetadataService = Depends(_get_service),
    _admin: dict = Depends(require_admin),
):
    await service.delete_entity(entity_id)


@router.post("/entities/{entity_id}/fields", response_model=FieldResponse, status_code=201)
async def add_field(
    entity_id: UUID,
    data: FieldCreate,
    service: MetadataService = Depends(_get_service),
    _admin: dict = Depends(require_admin),
):
    return await service.add_field(entity_id, data)


@router.delete("/entities/{entity_id}/fields/{field_id}", status_code=204)
async def delete_field(
    entity_id: UUID,
    field_id: UUID,
    service: MetadataService = Depends(_get_service),
    _admin: dict = Depends(require_admin),
):
    await service.delete_field(entity_id, field_id)
