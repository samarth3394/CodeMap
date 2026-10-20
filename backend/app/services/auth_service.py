import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.auth import UserCreate
from app.core.security import hash_password, verify_password, create_access_token


class AuthService:
    @staticmethod
    async def get_by_email(db: AsyncSession, email: str) -> Optional[User]:
        stmt = select(User).where(User.email == email.lower().strip())
        res = await db.execute(stmt)
        return res.scalar_one_or_none()

    @staticmethod
    async def register_user(db: AsyncSession, user_in: UserCreate) -> User:
        existing = await AuthService.get_by_email(db, user_in.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email address already exists.",
            )

        new_user = User(
            email=user_in.email.lower().strip(),
            hashed_password=hash_password(user_in.password),
            full_name=user_in.full_name.strip(),
            is_active=True,
            is_superuser=False,
        )

        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        return new_user

    @staticmethod
    async def authenticate_user(
        db: AsyncSession, email: str, password: str
    ) -> Optional[User]:
        user = await AuthService.get_by_email(db, email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    @staticmethod
    async def create_user_token(user: User) -> dict:
        access_token = create_access_token(
            subject=user.id,
            extra_claims={"email": user.email, "name": user.full_name},
        )
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user,
        }

    @staticmethod
    async def initiate_password_reset(db: AsyncSession, email: str) -> Optional[str]:
        user = await AuthService.get_by_email(db, email)
        if not user:
            # Prevent email enumeration: return mock token or silently succeed
            return None

        reset_token = secrets.token_urlsafe(32)
        user.reset_token = reset_token
        user.reset_token_expires_at = datetime.now(timezone.utc) + timedelta(hours=2)

        await db.commit()
        return reset_token

    @staticmethod
    async def complete_password_reset(
        db: AsyncSession, token: str, new_password: str
    ) -> bool:
        stmt = select(User).where(User.reset_token == token)
        res = await db.execute(stmt)
        user = res.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired password reset token.",
            )

        if user.reset_token_expires_at and user.reset_token_expires_at < datetime.now(timezone.utc):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password reset token has expired.",
            )

        user.hashed_password = hash_password(new_password)
        user.reset_token = None
        user.reset_token_expires_at = None

        await db.commit()
        return True
