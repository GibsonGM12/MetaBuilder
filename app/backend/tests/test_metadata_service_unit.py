"""Unit tests for MetadataService using mocks."""

from unittest.mock import AsyncMock, MagicMock, patch
from uuid import uuid4

import pytest
from fastapi import HTTPException

from app.application.dto.metadata_dto import EntityCreate, EntityUpdate, FieldCreate
from app.application.services.metadata_service import MetadataService
from app.infrastructure.database.models import EntityFieldModel, EntityModel


def _make_entity(**kwargs):
    defaults = {
        "id": uuid4(),
        "name": "test_entity",
        "display_name": "Test Entity",
        "description": None,
        "table_name": "entity_abc123",
    }
    defaults.update(kwargs)
    entity = MagicMock(spec=EntityModel)
    for k, v in defaults.items():
        setattr(entity, k, v)
    entity.fields = []
    return entity


def _make_field(**kwargs):
    defaults = {
        "id": uuid4(),
        "entity_id": uuid4(),
        "name": "test_field",
        "display_name": "Test Field",
        "field_type": "TEXT",
        "is_required": False,
        "max_length": None,
        "column_name": "test_field",
        "display_order": 1,
    }
    defaults.update(kwargs)
    field = MagicMock(spec=EntityFieldModel)
    for k, v in defaults.items():
        setattr(field, k, v)
    return field


@pytest.fixture
def mock_repo():
    return AsyncMock()


@pytest.fixture
def mock_tm():
    return AsyncMock()


@pytest.fixture
def service(mock_repo, mock_tm):
    return MetadataService(mock_repo, mock_tm)


@pytest.mark.asyncio
async def test_create_entity_success(service, mock_repo, mock_tm):
    mock_repo.get_entity_by_name.return_value = None
    created = _make_entity()
    mock_repo.create_entity.return_value = created
    mock_repo.get_entity_by_id.return_value = created

    result = await service.create_entity(EntityCreate(name="productos", display_name="Productos"))

    mock_repo.get_entity_by_name.assert_awaited_once_with("productos")
    mock_repo.create_entity.assert_awaited_once()
    mock_tm.create_table.assert_awaited_once()
    assert result == created


@pytest.mark.asyncio
async def test_create_entity_duplicate_raises(service, mock_repo):
    mock_repo.get_entity_by_name.return_value = _make_entity(name="dup")

    with pytest.raises(HTTPException) as exc_info:
        await service.create_entity(EntityCreate(name="dup", display_name="Dup"))

    assert exc_info.value.status_code == 409


@pytest.mark.asyncio
async def test_get_entity_success(service, mock_repo):
    entity_id = uuid4()
    entity = _make_entity(id=entity_id)
    mock_repo.get_entity_by_id.return_value = entity

    result = await service.get_entity(entity_id)

    assert result == entity
    mock_repo.get_entity_by_id.assert_awaited_once_with(entity_id)


@pytest.mark.asyncio
async def test_get_entity_not_found(service, mock_repo):
    mock_repo.get_entity_by_id.return_value = None

    with pytest.raises(HTTPException) as exc_info:
        await service.get_entity(uuid4())

    assert exc_info.value.status_code == 404


@pytest.mark.asyncio
async def test_get_all_entities(service, mock_repo):
    entities = [_make_entity(), _make_entity()]
    mock_repo.get_all_entities.return_value = entities

    result = await service.get_all_entities()

    assert result == entities
    mock_repo.get_all_entities.assert_awaited_once()


@pytest.mark.asyncio
async def test_update_entity(service, mock_repo):
    entity_id = uuid4()
    entity = _make_entity(id=entity_id)
    mock_repo.get_entity_by_id.return_value = entity
    mock_repo.update_entity.return_value = entity

    result = await service.update_entity(entity_id, EntityUpdate(display_name="Nuevo Nombre"))

    assert entity.display_name == "Nuevo Nombre"
    mock_repo.update_entity.assert_awaited_once()


@pytest.mark.asyncio
async def test_delete_entity(service, mock_repo, mock_tm):
    entity_id = uuid4()
    entity = _make_entity(id=entity_id, table_name="entity_abc")
    mock_repo.get_entity_by_id.return_value = entity
    mock_repo.delete_entity.return_value = True

    await service.delete_entity(entity_id)

    mock_repo.delete_entity.assert_awaited_once_with(entity_id)
    mock_tm.drop_table.assert_awaited_once_with("entity_abc")


@pytest.mark.asyncio
async def test_add_field_success(service, mock_repo, mock_tm):
    entity_id = uuid4()
    entity = _make_entity(id=entity_id, table_name="entity_xyz")
    mock_repo.get_entity_by_id.return_value = entity
    mock_repo.get_max_display_order.return_value = 2

    field = _make_field(entity_id=entity_id)
    mock_repo.create_field.return_value = field
    mock_repo.get_field_by_id.return_value = field

    result = await service.add_field(
        entity_id,
        FieldCreate(name="precio", display_name="Precio", field_type="NUMBER"),
    )

    mock_repo.create_field.assert_awaited_once()
    mock_tm.add_column.assert_awaited_once_with("entity_xyz", "precio", "NUMBER", None)
    assert result == field


@pytest.mark.asyncio
async def test_delete_field_success(service, mock_repo, mock_tm):
    entity_id = uuid4()
    field_id = uuid4()
    entity = _make_entity(id=entity_id, table_name="entity_tbl")
    field = _make_field(id=field_id, entity_id=entity_id, column_name="col_x")

    mock_repo.get_entity_by_id.return_value = entity
    mock_repo.get_field_by_id.return_value = field
    mock_repo.delete_field.return_value = True

    await service.delete_field(entity_id, field_id)

    mock_repo.delete_field.assert_awaited_once_with(field_id)
    mock_tm.drop_column.assert_awaited_once_with("entity_tbl", "col_x")


@pytest.mark.asyncio
async def test_delete_field_not_found(service, mock_repo):
    entity_id = uuid4()
    field_id = uuid4()
    entity = _make_entity(id=entity_id)
    mock_repo.get_entity_by_id.return_value = entity
    mock_repo.get_field_by_id.return_value = None

    with pytest.raises(HTTPException) as exc_info:
        await service.delete_field(entity_id, field_id)

    assert exc_info.value.status_code == 404


@pytest.mark.asyncio
async def test_delete_field_wrong_entity(service, mock_repo):
    entity_id = uuid4()
    other_entity_id = uuid4()
    field_id = uuid4()
    entity = _make_entity(id=entity_id)
    field = _make_field(id=field_id, entity_id=other_entity_id)

    mock_repo.get_entity_by_id.return_value = entity
    mock_repo.get_field_by_id.return_value = field

    with pytest.raises(HTTPException) as exc_info:
        await service.delete_field(entity_id, field_id)

    assert exc_info.value.status_code == 404
