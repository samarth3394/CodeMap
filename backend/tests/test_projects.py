import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_project_authenticated(client: AsyncClient, auth_headers_a):
    payload = {
        "name": "FastAPI Payment Microservice",
        "description": "Orchestrates order payment events and webhook dispatch.",
        "default_branch": "main",
        "visibility": "private",
        "repository_source": "zip",
    }
    response = await client.post("/api/v1/projects", json=payload, headers=auth_headers_a)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "FastAPI Payment Microservice"
    assert data["visibility"] == "private"
    assert data["status"] == "pending"


@pytest.mark.asyncio
async def test_create_project_unauthorized(client: AsyncClient):
    payload = {
        "name": "Unauthorized Proj",
    }
    response = await client.post("/api/v1/projects", json=payload)
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_project_permission_isolation(
    client: AsyncClient, auth_headers_a, auth_headers_b
):
    # User A creates a private project
    create_res = await client.post(
        "/api/v1/projects",
        json={"name": "Alice Private Core", "visibility": "private"},
        headers=auth_headers_a,
    )
    assert create_res.status_code == 201
    project_id = create_res.json()["id"]

    # User A can view it
    view_a = await client.get(f"/api/v1/projects/{project_id}", headers=auth_headers_a)
    assert view_a.status_code == 200

    # User B CANNOT view it (403 Forbidden)
    view_b = await client.get(f"/api/v1/projects/{project_id}", headers=auth_headers_b)
    assert view_b.status_code == 403

    # User B CANNOT update it (403 Forbidden)
    update_b = await client.put(
        f"/api/v1/projects/{project_id}",
        json={"name": "Hacked Name"},
        headers=auth_headers_b,
    )
    assert update_b.status_code == 403

    # User B CANNOT delete it (403 Forbidden)
    delete_b = await client.delete(f"/api/v1/projects/{project_id}", headers=auth_headers_b)
    assert delete_b.status_code == 403

    # Project still exists and unmodified
    verify_a = await client.get(f"/api/v1/projects/{project_id}", headers=auth_headers_a)
    assert verify_a.status_code == 200
    assert verify_a.json()["name"] == "Alice Private Core"

    # User A CAN update it
    update_a = await client.put(
        f"/api/v1/projects/{project_id}",
        json={"name": "Alice Renamed Core"},
        headers=auth_headers_a,
    )
    assert update_a.status_code == 200
    assert update_a.json()["name"] == "Alice Renamed Core"

    # User A CAN delete it
    delete_a = await client.delete(f"/api/v1/projects/{project_id}", headers=auth_headers_a)
    assert delete_a.status_code == 204

    # Deleted project is now 404
    view_after = await client.get(f"/api/v1/projects/{project_id}", headers=auth_headers_a)
    assert view_after.status_code == 404
