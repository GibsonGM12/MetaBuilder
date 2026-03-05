"""Tests for Form Builder endpoints."""

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.fixture
def admin_headers(admin_token: str) -> dict:
    return {"Authorization": f"Bearer {admin_token}"}


@pytest.fixture
def user_headers(user_token: str) -> dict:
    return {"Authorization": f"Bearer {user_token}"}


@pytest.mark.asyncio
class TestFormCRUD:
    async def test_create_form_requires_admin(self, user_headers):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.post(
                "/api/forms",
                json={
                    "name": "Test Form",
                    "primary_entity_id": "00000000-0000-0000-0000-000000000001",
                },
                headers=user_headers,
            )
            assert response.status_code == 403

    async def test_list_forms(self, admin_headers):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.get("/api/forms", headers=admin_headers)
            assert response.status_code == 200
            assert isinstance(response.json(), list)

    async def test_get_form_not_found(self, admin_headers):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.get(
                "/api/forms/00000000-0000-0000-0000-000000000000",
                headers=admin_headers,
            )
            assert response.status_code == 404

    async def test_delete_form_requires_admin(self, user_headers):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.delete(
                "/api/forms/00000000-0000-0000-0000-000000000000",
                headers=user_headers,
            )
            assert response.status_code == 403


@pytest.mark.asyncio
class TestFormSubmission:
    async def test_submit_form_not_found(self, admin_headers):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.post(
                "/api/forms/00000000-0000-0000-0000-000000000000/submit",
                json={"header": {}, "lookups": {}, "detail_lines": []},
                headers=admin_headers,
            )
            assert response.status_code == 404

    async def test_submit_requires_auth(self):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.post(
                "/api/forms/00000000-0000-0000-0000-000000000000/submit",
                json={"header": {}, "lookups": {}, "detail_lines": []},
            )
            assert response.status_code == 401
