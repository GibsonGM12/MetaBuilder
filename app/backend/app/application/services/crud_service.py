import uuid
from datetime import date, datetime
from decimal import Decimal

from fastapi import HTTPException, status

from app.application.dto.crud_dto import (
    PaginatedResponse,
    RecordCreate,
    RecordResponse,
    RecordUpdate,
)
from app.application.services.data_validator import validate_record
from app.infrastructure.database.models import EntityFieldModel
from app.infrastructure.database.repositories.dynamic_data_repository import DynamicDataRepository
from app.infrastructure.database.repositories.metadata_repository import MetadataRepository


class DynamicCrudService:
    def __init__(self, meta_repo: MetadataRepository, data_repo: DynamicDataRepository):
        self._meta = meta_repo
        self._data = data_repo

    async def _get_entity_or_404(self, entity_id: uuid.UUID):
        entity = await self._meta.get_entity_by_id(entity_id)
        if not entity:
            raise HTTPException(status.HTTP_404_NOT_FOUND, f"Entidad {entity_id} no encontrada")
        return entity

    @staticmethod
    def _serialize_value(value):
        if isinstance(value, Decimal):
            return float(value)
        if isinstance(value, date) and not isinstance(value, datetime):
            return value.isoformat()
        return value

    def _build_response(
        self, row: dict, fields: list[EntityFieldModel]
    ) -> RecordResponse:
        column_to_name = {f.column_name: f.name for f in fields}
        data = {}
        for key, value in row.items():
            if key in ("id", "created_at"):
                continue
            field_name = column_to_name.get(key, key)
            data[field_name] = self._serialize_value(value)
        return RecordResponse(id=row["id"], created_at=row["created_at"], data=data)

    async def create_record(
        self, entity_id: uuid.UUID, payload: RecordCreate
    ) -> RecordResponse:
        entity = await self._get_entity_or_404(entity_id)
        cleaned = validate_record(entity.fields, payload.data)
        result = await self._data.insert_record(entity.table_name, cleaned)
        full_row = await self._data.get_record(entity.table_name, result["id"])
        return self._build_response(full_row, entity.fields)

    async def get_record(
        self, entity_id: uuid.UUID, record_id: uuid.UUID
    ) -> RecordResponse:
        entity = await self._get_entity_or_404(entity_id)
        row = await self._data.get_record(entity.table_name, record_id)
        if not row:
            raise HTTPException(status.HTTP_404_NOT_FOUND, f"Registro {record_id} no encontrado")
        return self._build_response(row, entity.fields)

    async def get_records(
        self, entity_id: uuid.UUID, page: int = 1, page_size: int = 20
    ) -> PaginatedResponse:
        entity = await self._get_entity_or_404(entity_id)
        total = await self._data.count_records(entity.table_name)
        rows = await self._data.get_records(entity.table_name, page, page_size)
        items = [self._build_response(row, entity.fields) for row in rows]
        total_pages = DynamicDataRepository.calc_total_pages(total, page_size)
        return PaginatedResponse(
            items=items, total=total, page=page, page_size=page_size, total_pages=total_pages
        )

    async def update_record(
        self, entity_id: uuid.UUID, record_id: uuid.UUID, payload: RecordUpdate
    ) -> RecordResponse:
        entity = await self._get_entity_or_404(entity_id)
        existing = await self._data.get_record(entity.table_name, record_id)
        if not existing:
            raise HTTPException(status.HTTP_404_NOT_FOUND, f"Registro {record_id} no encontrado")
        cleaned = validate_record(entity.fields, payload.data)
        updated = await self._data.update_record(entity.table_name, record_id, cleaned)
        return self._build_response(updated, entity.fields)

    async def delete_record(
        self, entity_id: uuid.UUID, record_id: uuid.UUID
    ) -> None:
        entity = await self._get_entity_or_404(entity_id)
        deleted = await self._data.delete_record(entity.table_name, record_id)
        if not deleted:
            raise HTTPException(status.HTTP_404_NOT_FOUND, f"Registro {record_id} no encontrado")
