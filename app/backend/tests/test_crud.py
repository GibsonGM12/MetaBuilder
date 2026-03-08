"""Integration tests for the dynamic CRUD endpoints."""
import pytest
from httpx import AsyncClient


@pytest.fixture
async def entity_with_fields(client: AsyncClient, admin_headers: dict) -> dict:
    """Create an entity with several field types for CRUD testing."""
    resp = await client.post(
        "/api/metadata/entities",
        json={"name": "productos", "display_name": "Productos", "description": "Test"},
        headers=admin_headers,
    )
    assert resp.status_code == 201
    entity = resp.json()
    entity_id = entity["id"]

    fields = [
        {"name": "nombre", "display_name": "Nombre", "field_type": "TEXT", "is_required": True, "max_length": 100},
        {"name": "precio", "display_name": "Precio", "field_type": "NUMBER", "is_required": True},
        {"name": "cantidad", "display_name": "Cantidad", "field_type": "INTEGER", "is_required": False},
        {"name": "activo", "display_name": "Activo", "field_type": "BOOLEAN", "is_required": False},
        {"name": "fecha_alta", "display_name": "Fecha Alta", "field_type": "DATE", "is_required": False},
    ]
    for f in fields:
        r = await client.post(
            f"/api/metadata/entities/{entity_id}/fields",
            json=f,
            headers=admin_headers,
        )
        assert r.status_code == 201

    resp2 = await client.get(f"/api/metadata/entities/{entity_id}", headers=admin_headers)
    return resp2.json()


class TestCreateRecord:
    @pytest.mark.asyncio
    async def test_create_record_success(self, client: AsyncClient, admin_headers: dict, entity_with_fields: dict):
        entity_id = entity_with_fields["id"]
        resp = await client.post(
            f"/api/entities/{entity_id}/records",
            json={"data": {"nombre": "Laptop", "precio": 999.99, "cantidad": 10, "activo": True, "fecha_alta": "2024-06-15"}},
            headers=admin_headers,
        )
        assert resp.status_code == 201
        body = resp.json()
        assert body["data"]["nombre"] == "Laptop"
        assert body["data"]["precio"] == 999.99
        assert body["id"] is not None

    @pytest.mark.asyncio
    async def test_create_record_missing_required(self, client: AsyncClient, admin_headers: dict, entity_with_fields: dict):
        entity_id = entity_with_fields["id"]
        resp = await client.post(
            f"/api/entities/{entity_id}/records",
            json={"data": {"cantidad": 5}},
            headers=admin_headers,
        )
        assert resp.status_code == 422

    @pytest.mark.asyncio
    async def test_create_record_unknown_field(self, client: AsyncClient, admin_headers: dict, entity_with_fields: dict):
        entity_id = entity_with_fields["id"]
        resp = await client.post(
            f"/api/entities/{entity_id}/records",
            json={"data": {"nombre": "X", "precio": 1, "campo_falso": "nope"}},
            headers=admin_headers,
        )
        assert resp.status_code == 422

    @pytest.mark.asyncio
    async def test_create_record_invalid_type(self, client: AsyncClient, admin_headers: dict, entity_with_fields: dict):
        entity_id = entity_with_fields["id"]
        resp = await client.post(
            f"/api/entities/{entity_id}/records",
            json={"data": {"nombre": "X", "precio": "no_es_numero"}},
            headers=admin_headers,
        )
        assert resp.status_code == 422


class TestGetRecords:
    @pytest.mark.asyncio
    async def test_list_records_empty(self, client: AsyncClient, admin_headers: dict, entity_with_fields: dict):
        entity_id = entity_with_fields["id"]
        resp = await client.get(f"/api/entities/{entity_id}/records", headers=admin_headers)
        assert resp.status_code == 200
        body = resp.json()
        assert body["total"] == 0
        assert body["items"] == []

    @pytest.mark.asyncio
    async def test_list_records_with_pagination(self, client: AsyncClient, admin_headers: dict, entity_with_fields: dict):
        entity_id = entity_with_fields["id"]
        for i in range(3):
            await client.post(
                f"/api/entities/{entity_id}/records",
                json={"data": {"nombre": f"Item {i}", "precio": i * 10}},
                headers=admin_headers,
            )

        resp = await client.get(
            f"/api/entities/{entity_id}/records?page=1&page_size=2",
            headers=admin_headers,
        )
        assert resp.status_code == 200
        body = resp.json()
        assert body["total"] == 3
        assert len(body["items"]) == 2
        assert body["total_pages"] == 2

    @pytest.mark.asyncio
    async def test_get_single_record(self, client: AsyncClient, admin_headers: dict, entity_with_fields: dict):
        entity_id = entity_with_fields["id"]
        create_resp = await client.post(
            f"/api/entities/{entity_id}/records",
            json={"data": {"nombre": "Test", "precio": 50}},
            headers=admin_headers,
        )
        record_id = create_resp.json()["id"]

        resp = await client.get(f"/api/entities/{entity_id}/records/{record_id}", headers=admin_headers)
        assert resp.status_code == 200
        assert resp.json()["data"]["nombre"] == "Test"

    @pytest.mark.asyncio
    async def test_get_record_not_found(self, client: AsyncClient, admin_headers: dict, entity_with_fields: dict):
        entity_id = entity_with_fields["id"]
        fake_id = "00000000-0000-0000-0000-000000000000"
        resp = await client.get(f"/api/entities/{entity_id}/records/{fake_id}", headers=admin_headers)
        assert resp.status_code == 404


class TestUpdateRecord:
    @pytest.mark.asyncio
    async def test_update_record_success(self, client: AsyncClient, admin_headers: dict, entity_with_fields: dict):
        entity_id = entity_with_fields["id"]
        create_resp = await client.post(
            f"/api/entities/{entity_id}/records",
            json={"data": {"nombre": "Original", "precio": 100}},
            headers=admin_headers,
        )
        record_id = create_resp.json()["id"]

        resp = await client.put(
            f"/api/entities/{entity_id}/records/{record_id}",
            json={"data": {"nombre": "Actualizado", "precio": 200}},
            headers=admin_headers,
        )
        assert resp.status_code == 200
        assert resp.json()["data"]["nombre"] == "Actualizado"
        assert resp.json()["data"]["precio"] == 200

    @pytest.mark.asyncio
    async def test_update_record_not_found(self, client: AsyncClient, admin_headers: dict, entity_with_fields: dict):
        entity_id = entity_with_fields["id"]
        fake_id = "00000000-0000-0000-0000-000000000000"
        resp = await client.put(
            f"/api/entities/{entity_id}/records/{fake_id}",
            json={"data": {"nombre": "X", "precio": 1}},
            headers=admin_headers,
        )
        assert resp.status_code == 404


class TestDeleteRecord:
    @pytest.mark.asyncio
    async def test_delete_record_success(self, client: AsyncClient, admin_headers: dict, entity_with_fields: dict):
        entity_id = entity_with_fields["id"]
        create_resp = await client.post(
            f"/api/entities/{entity_id}/records",
            json={"data": {"nombre": "A borrar", "precio": 10}},
            headers=admin_headers,
        )
        record_id = create_resp.json()["id"]

        resp = await client.delete(f"/api/entities/{entity_id}/records/{record_id}", headers=admin_headers)
        assert resp.status_code == 204

        get_resp = await client.get(f"/api/entities/{entity_id}/records/{record_id}", headers=admin_headers)
        assert get_resp.status_code == 404

    @pytest.mark.asyncio
    async def test_delete_record_not_found(self, client: AsyncClient, admin_headers: dict, entity_with_fields: dict):
        entity_id = entity_with_fields["id"]
        fake_id = "00000000-0000-0000-0000-000000000000"
        resp = await client.delete(f"/api/entities/{entity_id}/records/{fake_id}", headers=admin_headers)
        assert resp.status_code == 404


class TestAuth:
    @pytest.mark.asyncio
    async def test_records_require_auth(self, client: AsyncClient, entity_with_fields: dict):
        entity_id = entity_with_fields["id"]
        resp = await client.get(f"/api/entities/{entity_id}/records")
        assert resp.status_code == 401

    @pytest.mark.asyncio
    async def test_non_admin_can_access_records(self, client: AsyncClient, entity_with_fields: dict):
        """Regular users (not admin) should also be able to use CRUD endpoints."""
        await client.post(
            "/api/auth/register",
            json={"username": "regular_user", "email": "user@test.com", "password": "user123", "role": "User"},
        )
        login_resp = await client.post(
            "/api/auth/login",
            json={"username": "regular_user", "password": "user123"},
        )
        token = login_resp.json()["access_token"]
        user_headers = {"Authorization": f"Bearer {token}"}

        entity_id = entity_with_fields["id"]
        resp = await client.get(f"/api/entities/{entity_id}/records", headers=user_headers)
        assert resp.status_code == 200
