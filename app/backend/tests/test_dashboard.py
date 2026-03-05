"""Tests for Dashboard Builder endpoints."""

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
class TestDashboardCRUD:
    async def test_create_dashboard(self, admin_headers):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.post(
                "/api/dashboards",
                json={"name": "Test Dashboard", "description": "Test description"},
                headers=admin_headers,
            )
            assert response.status_code == 201
            data = response.json()
            assert data["name"] == "Test Dashboard"
            assert data["description"] == "Test description"
            assert data["is_default"] is False
            assert "id" in data
            assert "widgets" in data

    async def test_create_dashboard_requires_admin(self, user_headers):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.post(
                "/api/dashboards",
                json={"name": "User Dashboard"},
                headers=user_headers,
            )
            assert response.status_code == 403

    async def test_list_dashboards(self, admin_headers):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.get("/api/dashboards", headers=admin_headers)
            assert response.status_code == 200
            assert isinstance(response.json(), list)

    async def test_get_dashboard_not_found(self, admin_headers):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.get(
                "/api/dashboards/00000000-0000-0000-0000-000000000000",
                headers=admin_headers,
            )
            assert response.status_code == 404

    async def test_delete_dashboard_requires_admin(self, user_headers):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.delete(
                "/api/dashboards/00000000-0000-0000-0000-000000000000",
                headers=user_headers,
            )
            assert response.status_code == 403


@pytest.mark.asyncio
class TestWidgetCRUD:
    async def test_add_widget_requires_dashboard(self, admin_headers):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.post(
                "/api/dashboards/00000000-0000-0000-0000-000000000000/widgets",
                json={
                    "entity_id": "00000000-0000-0000-0000-000000000001",
                    "widget_type": "STAT_CARD",
                    "title": "Test Widget",
                },
                headers=admin_headers,
            )
            assert response.status_code == 404

    async def test_invalid_widget_type(self, admin_headers):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            dash_response = await client.post(
                "/api/dashboards",
                json={"name": "Widget Test Dashboard"},
                headers=admin_headers,
            )
            if dash_response.status_code == 201:
                dashboard_id = dash_response.json()["id"]
                response = await client.post(
                    f"/api/dashboards/{dashboard_id}/widgets",
                    json={
                        "entity_id": "00000000-0000-0000-0000-000000000001",
                        "widget_type": "INVALID_TYPE",
                        "title": "Bad Widget",
                    },
                    headers=admin_headers,
                )
                assert response.status_code == 422


@pytest.mark.asyncio
class TestWidgetData:
    async def test_widget_data_not_found(self, admin_headers):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.get(
                "/api/dashboards/00000000-0000-0000-0000-000000000000/widgets/00000000-0000-0000-0000-000000000001/data",
                headers=admin_headers,
            )
            assert response.status_code == 404

    async def test_all_widgets_data_not_found(self, admin_headers):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.get(
                "/api/dashboards/00000000-0000-0000-0000-000000000000/data",
                headers=admin_headers,
            )
            assert response.status_code == 404
