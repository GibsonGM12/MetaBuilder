import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_entity(client: AsyncClient, admin_headers: dict):
    response = await client.post(
        "/api/metadata/entities",
        json={"name": "productos", "display_name": "Productos", "description": "Catálogo de productos"},
        headers=admin_headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "productos"
    assert data["display_name"] == "Productos"
    assert data["table_name"].startswith("entity_")
    assert "id" in data


@pytest.mark.asyncio
async def test_create_duplicate_entity(client: AsyncClient, admin_headers: dict):
    payload = {"name": "duplicated", "display_name": "Duplicado"}
    await client.post("/api/metadata/entities", json=payload, headers=admin_headers)
    response = await client.post("/api/metadata/entities", json=payload, headers=admin_headers)
    assert response.status_code == 409


@pytest.mark.asyncio
async def test_list_entities(client: AsyncClient, admin_headers: dict):
    await client.post(
        "/api/metadata/entities",
        json={"name": "clientes", "display_name": "Clientes"},
        headers=admin_headers,
    )
    response = await client.get("/api/metadata/entities", headers=admin_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert any(e["name"] == "clientes" for e in data)


@pytest.mark.asyncio
async def test_get_entity_by_id(client: AsyncClient, admin_headers: dict):
    create_resp = await client.post(
        "/api/metadata/entities",
        json={"name": "pedidos", "display_name": "Pedidos"},
        headers=admin_headers,
    )
    entity_id = create_resp.json()["id"]

    response = await client.get(f"/api/metadata/entities/{entity_id}", headers=admin_headers)
    assert response.status_code == 200
    assert response.json()["id"] == entity_id
    assert response.json()["name"] == "pedidos"


@pytest.mark.asyncio
async def test_update_entity(client: AsyncClient, admin_headers: dict):
    create_resp = await client.post(
        "/api/metadata/entities",
        json={"name": "usuarios", "display_name": "Usuarios"},
        headers=admin_headers,
    )
    entity_id = create_resp.json()["id"]

    response = await client.put(
        f"/api/metadata/entities/{entity_id}",
        json={"display_name": "Usuarios del Sistema"},
        headers=admin_headers,
    )
    assert response.status_code == 200
    assert response.json()["display_name"] == "Usuarios del Sistema"


@pytest.mark.asyncio
async def test_delete_entity(client: AsyncClient, admin_headers: dict):
    create_resp = await client.post(
        "/api/metadata/entities",
        json={"name": "temporal", "display_name": "Temporal"},
        headers=admin_headers,
    )
    entity_id = create_resp.json()["id"]

    response = await client.delete(f"/api/metadata/entities/{entity_id}", headers=admin_headers)
    assert response.status_code == 204

    get_resp = await client.get(f"/api/metadata/entities/{entity_id}", headers=admin_headers)
    assert get_resp.status_code == 404


@pytest.mark.asyncio
async def test_add_field_to_entity(client: AsyncClient, admin_headers: dict):
    create_resp = await client.post(
        "/api/metadata/entities",
        json={"name": "inventario", "display_name": "Inventario"},
        headers=admin_headers,
    )
    entity_id = create_resp.json()["id"]

    response = await client.post(
        f"/api/metadata/entities/{entity_id}/fields",
        json={
            "name": "nombre",
            "display_name": "Nombre del Producto",
            "field_type": "TEXT",
            "is_required": True,
            "max_length": 200,
        },
        headers=admin_headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "nombre"
    assert data["field_type"] == "TEXT"
    assert data["is_required"] is True
    assert data["column_name"] == "nombre"


@pytest.mark.asyncio
async def test_add_multiple_field_types(client: AsyncClient, admin_headers: dict):
    create_resp = await client.post(
        "/api/metadata/entities",
        json={"name": "catalogo", "display_name": "Catálogo"},
        headers=admin_headers,
    )
    entity_id = create_resp.json()["id"]

    fields = [
        {"name": "titulo", "display_name": "Título", "field_type": "TEXT", "max_length": 100},
        {"name": "precio", "display_name": "Precio", "field_type": "NUMBER"},
        {"name": "cantidad", "display_name": "Cantidad", "field_type": "INTEGER"},
        {"name": "fecha_creacion", "display_name": "Fecha", "field_type": "DATE"},
        {"name": "activo", "display_name": "Activo", "field_type": "BOOLEAN"},
    ]

    for i, field_data in enumerate(fields):
        resp = await client.post(
            f"/api/metadata/entities/{entity_id}/fields",
            json=field_data,
            headers=admin_headers,
        )
        assert resp.status_code == 201, f"Fallo al crear campo {field_data['name']}: {resp.text}"
        assert resp.json()["display_order"] == i + 1

    entity_resp = await client.get(f"/api/metadata/entities/{entity_id}", headers=admin_headers)
    assert len(entity_resp.json()["fields"]) == 5


@pytest.mark.asyncio
async def test_delete_field(client: AsyncClient, admin_headers: dict):
    create_resp = await client.post(
        "/api/metadata/entities",
        json={"name": "borrable", "display_name": "Borrable"},
        headers=admin_headers,
    )
    entity_id = create_resp.json()["id"]

    field_resp = await client.post(
        f"/api/metadata/entities/{entity_id}/fields",
        json={"name": "campo_temp", "display_name": "Campo Temporal", "field_type": "TEXT"},
        headers=admin_headers,
    )
    field_id = field_resp.json()["id"]

    response = await client.delete(
        f"/api/metadata/entities/{entity_id}/fields/{field_id}",
        headers=admin_headers,
    )
    assert response.status_code == 204


@pytest.mark.asyncio
async def test_unauthorized_access(client: AsyncClient):
    response = await client.get("/api/metadata/entities")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_non_admin_forbidden(client: AsyncClient):
    await client.post(
        "/api/auth/register",
        json={"username": "regular_user", "email": "user@test.com", "password": "user123", "role": "User"},
    )
    login_resp = await client.post(
        "/api/auth/login",
        json={"username": "regular_user", "password": "user123"},
    )
    user_token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {user_token}"}

    response = await client.get("/api/metadata/entities", headers=headers)
    assert response.status_code == 403
