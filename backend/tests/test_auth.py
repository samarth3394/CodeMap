import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_signup_success(client: AsyncClient):
    payload = {
        "email": "carol@example.com",
        "password": "SecurePassword123!",
        "full_name": "Carol Cloud",
    }
    response = await client.post("/api/v1/auth/signup", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "carol@example.com"
    assert data["user"]["full_name"] == "Carol Cloud"


@pytest.mark.asyncio
async def test_signup_duplicate_email(client: AsyncClient, user_a):
    payload = {
        "email": "alice@example.com",
        "password": "Password123!",
        "full_name": "Duplicate Alice",
    }
    response = await client.post("/api/v1/auth/signup", json=payload)
    assert response.status_code == 409
    assert "already exists" in response.json()["detail"].lower()


@pytest.mark.asyncio
async def test_signup_short_password(client: AsyncClient):
    payload = {
        "email": "dave@example.com",
        "password": "short",
        "full_name": "Dave Developer",
    }
    response = await client.post("/api/v1/auth/signup", json=payload)
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_login_success(client: AsyncClient, user_a):
    payload = {
        "email": "alice@example.com",
        "password": "Password123!",
    }
    response = await client.post("/api/v1/auth/login", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "alice@example.com"


@pytest.mark.asyncio
async def test_login_wrong_password(client: AsyncClient, user_a):
    payload = {
        "email": "alice@example.com",
        "password": "WrongPassword!",
    }
    response = await client.post("/api/v1/auth/login", json=payload)
    assert response.status_code == 401
    assert "incorrect email or password" in response.json()["detail"].lower()


@pytest.mark.asyncio
async def test_get_current_user_profile(client: AsyncClient, auth_headers_a):
    response = await client.get("/api/v1/auth/me", headers=auth_headers_a)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "alice@example.com"
    assert data["full_name"] == "Alice Architect"


@pytest.mark.asyncio
async def test_get_current_user_unauthorized(client: AsyncClient):
    response = await client.get("/api/v1/auth/me")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_password_reset_workflow(client: AsyncClient, user_a):
    # 1. Request reset
    req_res = await client.post(
        "/api/v1/auth/forgot-password", json={"email": "alice@example.com"}
    )
    assert req_res.status_code == 200
    token = req_res.json().get("dev_reset_token")
    assert token is not None

    # 2. Reset with new password
    confirm_res = await client.post(
        "/api/v1/auth/reset-password",
        json={"token": token, "new_password": "NewSecretPassword123!"},
    )
    assert confirm_res.status_code == 200

    # 3. Old password should now fail
    old_login = await client.post(
        "/api/v1/auth/login",
        json={"email": "alice@example.com", "password": "Password123!"},
    )
    assert old_login.status_code == 401

    # 4. New password succeeds
    new_login = await client.post(
        "/api/v1/auth/login",
        json={"email": "alice@example.com", "password": "NewSecretPassword123!"},
    )
    assert new_login.status_code == 200
