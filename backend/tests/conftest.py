import os
import sys
import pytest
import pytest_asyncio

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

# Use in-memory SQLite for blazing fast, isolated test runs
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

from app.core.database import Base, get_db
from app.main import app
from app.models.user import User
from app.models.project import Project
from app.core.security import hash_password, create_access_token

test_engine = create_async_engine(TEST_DATABASE_URL, future=True)
TestSessionLocal = async_sessionmaker(
    bind=test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


@pytest_asyncio.fixture(scope="function")
async def db_session():
    """Provides a fresh, isolated database session per test."""
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with TestSessionLocal() as session:
        yield session

    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture(scope="function")
async def client(db_session: AsyncSession):
    """Provides an async HTTP client wired to the test database."""
    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as ac:
        yield ac

    app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def user_a(db_session: AsyncSession) -> User:
    """Create primary test user."""
    user = User(
        email="alice@example.com",
        hashed_password=hash_password("Password123!"),
        full_name="Alice Architect",
        is_active=True,
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return user


@pytest_asyncio.fixture
async def user_b(db_session: AsyncSession) -> User:
    """Create secondary test user for permission isolation tests."""
    user = User(
        email="bob@example.com",
        hashed_password=hash_password("Password123!"),
        full_name="Bob Backend",
        is_active=True,
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return user


@pytest.fixture
def auth_headers_a(user_a: User) -> dict:
    """Authorization headers for User A."""
    token = create_access_token(subject=user_a.id)
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def auth_headers_b(user_b: User) -> dict:
    """Authorization headers for User B."""
    token = create_access_token(subject=user_b.id)
    return {"Authorization": f"Bearer {token}"}
