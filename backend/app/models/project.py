import uuid
from datetime import datetime, timezone
from typing import Optional, Any, Dict, TYPE_CHECKING
from sqlalchemy import String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

if TYPE_CHECKING:
    from app.models.user import User


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        index=True,
    )
    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
        index=True,
    )
    description: Mapped[str] = mapped_column(
        Text,
        default="",
        nullable=False,
    )
    default_branch: Mapped[str] = mapped_column(
        String(50),
        default="main",
        nullable=False,
    )
    visibility: Mapped[str] = mapped_column(
        String(20),
        default="private",  # private | public
        nullable=False,
    )
    repository_source: Mapped[str] = mapped_column(
        String(20),
        default="zip",  # zip | github | sample
        nullable=False,
    )
    github_repo_url: Mapped[Optional[str]] = mapped_column(
        String(300),
        nullable=True,
    )
    commit_hash: Mapped[str] = mapped_column(
        String(40),
        default="init",
        nullable=False,
    )
    status: Mapped[str] = mapped_column(
        String(30),
        default="pending",  # pending | uploading | extracting | indexing | ready | failed
        nullable=False,
        index=True,
    )
    error_message: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    storage_path: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True,
    )
    stats: Mapped[Dict[str, Any]] = mapped_column(
        JSON,
        default=lambda: {
            "filesCount": 0,
            "modulesCount": 0,
            "symbolsCount": 0,
            "linesOfCode": 0,
            "testCoverage": 0.0,
            "securityScore": 100,
            "dependencyCount": 0,
        },
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    owner: Mapped["User"] = relationship(
        "User",
        back_populates="projects",
        lazy="joined",
    )
