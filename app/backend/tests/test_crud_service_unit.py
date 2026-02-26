import uuid
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi import HTTPException

from app.application.dto.crud_dto import RecordCreate, RecordUpdate
from app.application.services.crud_service import DynamicCrudService
from app.infrastructure.database.models import EntityFieldModel, EntityModel


def _make_entity(fields=None):
    entity = MagicMock(spec=EntityModel)
    entity.id = uuid.uuid4()
    entity.table_name = f"entity_{entity.id.hex}"
    entity.fields = fields or []
    return entity


def _make_field(name="nombre", column_name="nombre", field_type="TEXT", is_required=False, max_length=None):
    field = MagicMock(spec=EntityFieldModel)
    field.name = name
    field.display_name = name.title()
    field.field_type = field_type
    field.is_required = is_required
    field.max_length = max_length
    field.column_name = column_name
    return field


class TestCreateRecord:
    @pytest.mark.asyncio
    async def test_create_record_success(self):
        field = _make_field()
        entity = _make_entity(fields=[field])
        record_id = uuid.uuid4()

        meta_repo = AsyncMock()
        meta_repo.get_entity_by_id.return_value = entity
        data_repo = AsyncMock()
        data_repo.insert_record.return_value = {
            "id": record_id,
            "created_at": "2024-01-01T00:00:00+00:00",
        }
        data_repo.get_record.return_value = {
            "id": record_id,
            "created_at": "2024-01-01T00:00:00+00:00",
            "nombre": "Juan",
        }

        service = DynamicCrudService(meta_repo, data_repo)
        result = await service.create_record(entity.id, RecordCreate(data={"nombre": "Juan"}))

        assert result.id == record_id
        assert result.data["nombre"] == "Juan"
        data_repo.insert_record.assert_called_once()

    @pytest.mark.asyncio
    async def test_create_record_entity_not_found(self):
        meta_repo = AsyncMock()
        meta_repo.get_entity_by_id.return_value = None
        data_repo = AsyncMock()

        service = DynamicCrudService(meta_repo, data_repo)
        with pytest.raises(HTTPException) as exc_info:
            await service.create_record(uuid.uuid4(), RecordCreate(data={"x": 1}))
        assert exc_info.value.status_code == 404


class TestGetRecord:
    @pytest.mark.asyncio
    async def test_get_record_success(self):
        field = _make_field()
        entity = _make_entity(fields=[field])
        record_id = uuid.uuid4()

        meta_repo = AsyncMock()
        meta_repo.get_entity_by_id.return_value = entity
        data_repo = AsyncMock()
        data_repo.get_record.return_value = {
            "id": record_id,
            "created_at": "2024-01-01T00:00:00+00:00",
            "nombre": "Juan",
        }

        service = DynamicCrudService(meta_repo, data_repo)
        result = await service.get_record(entity.id, record_id)
        assert result.id == record_id

    @pytest.mark.asyncio
    async def test_get_record_not_found(self):
        entity = _make_entity()
        meta_repo = AsyncMock()
        meta_repo.get_entity_by_id.return_value = entity
        data_repo = AsyncMock()
        data_repo.get_record.return_value = None

        service = DynamicCrudService(meta_repo, data_repo)
        with pytest.raises(HTTPException) as exc_info:
            await service.get_record(entity.id, uuid.uuid4())
        assert exc_info.value.status_code == 404


class TestGetRecords:
    @pytest.mark.asyncio
    async def test_get_records_paginated(self):
        field = _make_field()
        entity = _make_entity(fields=[field])
        record_id = uuid.uuid4()

        meta_repo = AsyncMock()
        meta_repo.get_entity_by_id.return_value = entity
        data_repo = AsyncMock()
        data_repo.count_records.return_value = 1
        data_repo.get_records.return_value = [
            {"id": record_id, "created_at": "2024-01-01T00:00:00+00:00", "nombre": "Juan"}
        ]

        service = DynamicCrudService(meta_repo, data_repo)
        result = await service.get_records(entity.id, page=1, page_size=10)
        assert result.total == 1
        assert len(result.items) == 1
        assert result.total_pages == 1


class TestUpdateRecord:
    @pytest.mark.asyncio
    async def test_update_record_success(self):
        field = _make_field()
        entity = _make_entity(fields=[field])
        record_id = uuid.uuid4()

        meta_repo = AsyncMock()
        meta_repo.get_entity_by_id.return_value = entity
        data_repo = AsyncMock()
        data_repo.get_record.return_value = {
            "id": record_id,
            "created_at": "2024-01-01T00:00:00+00:00",
            "nombre": "Juan",
        }
        data_repo.update_record.return_value = {
            "id": record_id,
            "created_at": "2024-01-01T00:00:00+00:00",
            "nombre": "Pedro",
        }

        service = DynamicCrudService(meta_repo, data_repo)
        result = await service.update_record(entity.id, record_id, RecordUpdate(data={"nombre": "Pedro"}))
        assert result.data["nombre"] == "Pedro"

    @pytest.mark.asyncio
    async def test_update_record_not_found(self):
        entity = _make_entity()
        meta_repo = AsyncMock()
        meta_repo.get_entity_by_id.return_value = entity
        data_repo = AsyncMock()
        data_repo.get_record.return_value = None

        service = DynamicCrudService(meta_repo, data_repo)
        with pytest.raises(HTTPException) as exc_info:
            await service.update_record(entity.id, uuid.uuid4(), RecordUpdate(data={"x": 1}))
        assert exc_info.value.status_code == 404


class TestDeleteRecord:
    @pytest.mark.asyncio
    async def test_delete_record_success(self):
        entity = _make_entity()
        meta_repo = AsyncMock()
        meta_repo.get_entity_by_id.return_value = entity
        data_repo = AsyncMock()
        data_repo.delete_record.return_value = True

        service = DynamicCrudService(meta_repo, data_repo)
        await service.delete_record(entity.id, uuid.uuid4())
        data_repo.delete_record.assert_called_once()

    @pytest.mark.asyncio
    async def test_delete_record_not_found(self):
        entity = _make_entity()
        meta_repo = AsyncMock()
        meta_repo.get_entity_by_id.return_value = entity
        data_repo = AsyncMock()
        data_repo.delete_record.return_value = False

        service = DynamicCrudService(meta_repo, data_repo)
        with pytest.raises(HTTPException) as exc_info:
            await service.delete_record(entity.id, uuid.uuid4())
        assert exc_info.value.status_code == 404
