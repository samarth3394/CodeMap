from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.auth import (
    UserCreate,
    UserLogin,
    UserResponse,
    Token,
    PasswordResetRequest,
    PasswordResetConfirm,
)
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
async def signup(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    """Create a new user account and return signed JWT."""
    user = await AuthService.register_user(db, user_in)
    return await AuthService.create_user_token(user)


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    """Authenticate with email and password and return signed JWT."""
    user = await AuthService.authenticate_user(
        db, email=credentials.email, password=credentials.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return await AuthService.create_user_token(user)


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Retrieve profile of currently authenticated user."""
    return current_user


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """Client-side logout acknowledgement."""
    return {"message": "Successfully logged out.", "status": "ok"}


@router.post("/forgot-password")
async def forgot_password(
    payload: PasswordResetRequest, db: AsyncSession = Depends(get_db)
):
    """
    Initiate password reset workflow.
    Generates a secure token (in production, emailed to the user).
    Returns token in response for local development demonstration.
    """
    token = await AuthService.initiate_password_reset(db, payload.email)
    return {
        "message": "If this email exists in our system, a password reset link has been dispatched.",
        "dev_reset_token": token,  # Provided for easy local dev testing
    }


@router.post("/reset-password")
async def reset_password(
    payload: PasswordResetConfirm, db: AsyncSession = Depends(get_db)
):
    """Complete password reset using secure token."""
    await AuthService.complete_password_reset(db, payload.token, payload.new_password)
    return {"message": "Password updated successfully. You can now login with your new credentials."}
