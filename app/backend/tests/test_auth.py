import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_register_user(client: AsyncClient):
    response = await client.post(
        "/api/auth/register",
        json={"username": "testuser", "email": "test@example.com", "password": "secret123"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "testuser"
    assert data["email"] == "test@example.com"
    assert data["role"] == "User"
    assert "id" in data


@pytest.mark.asyncio
async def test_register_duplicate_user(client: AsyncClient):
    payload = {"username": "duplicate", "email": "dup@example.com", "password": "secret123"}
    await client.post("/api/auth/register", json=payload)
    response = await client.post("/api/auth/register", json=payload)
    assert response.status_code == 409


@pytest.mark.asyncio
async def test_login_success(client: AsyncClient):
    await client.post(
        "/api/auth/register",
        json={"username": "loginuser", "email": "login@example.com", "password": "secret123"},
    )
    response = await client.post(
        "/api/auth/login",
        json={"username": "loginuser", "password": "secret123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["username"] == "loginuser"


@pytest.mark.asyncio
async def test_login_invalid_credentials(client: AsyncClient):
    response = await client.post(
        "/api/auth/login",
        json={"username": "noexiste", "password": "wrong"},
    )
    assert response.status_code == 401
