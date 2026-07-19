"""
Authentication routes.

All endpoints are mounted under /api/v1/auth.
"""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Body, Depends, File, Request, UploadFile
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, get_db
from app.core.logging import get_logger
from app.core.security import decode_access_token
from app.models.user import User
from app.schemas.auth import (
    ChangePasswordRequest,
    ForgotPasswordRequest,
    LoginRequest,
    LogoutRequest,
    RefreshTokenRequest,
    RegisterRequest,
    ResetPasswordRequest,
    UserResponse,
)
from app.schemas.common import APIResponse
from app.schemas.user import UserUpdate
from app.services.auth_service import AuthService

logger = get_logger(__name__)

router = APIRouter()


# =====================================================
# Helpers
# =====================================================


def _user_to_response(user: User) -> UserResponse:
    return UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        username=user.username,
        phone=user.phone,
        gender=user.gender,
        date_of_birth=user.date_of_birth,
        address=user.address,
        city=user.city,
        state=user.state,
        country=user.country,
        bio=user.bio,
        profile_picture=user.profile_picture,
        is_active=user.is_active,
        created_at=user.created_at.isoformat() if user.created_at else None,
        updated_at=user.updated_at.isoformat() if user.updated_at else None,
    )


def _extract_bearer(request: Request) -> str | None:
    auth = request.headers.get("authorization") or request.headers.get(
        "Authorization"
    )
    if not auth:
        return None
    parts = auth.split()
    if len(parts) == 2 and parts[0].lower() == "bearer":
        return parts[1]
    return None


# =====================================================
# POST /api/v1/auth/register
# =====================================================


@router.post(
    "/register",
    response_model=APIResponse,
    status_code=201,
    summary="Register a new user",
)
def register(
    body: RegisterRequest,
    db: Session = Depends(get_db),
):
    service = AuthService(db)
    result = service.register(
        name=body.name,
        email=body.email,
        password=body.password,
        username=body.username,
    )
    return APIResponse(
        success=True,
        message="Account created successfully",
        data={
            "user": _user_to_response(result["user"]).model_dump(),
            "tokens": result["tokens"],
        },
    )


# =====================================================
# POST /api/v1/auth/login
# =====================================================


@router.post(
    "/login",
    response_model=APIResponse,
    summary="Login and obtain tokens",
)
def login(
    body: LoginRequest,
    db: Session = Depends(get_db),
):
    service = AuthService(db)
    result = service.login(
    identifier=body.email,
    password=body.password,
    )
    return APIResponse(
        success=True,
        message="Login successful",
        data={
            "user": _user_to_response(result["user"]).model_dump(),
            "tokens": result["tokens"],
        },
    )


# =====================================================
# POST /api/v1/auth/refresh
# =====================================================


@router.post(
    "/refresh",
    response_model=APIResponse,
    summary="Refresh access token",
)
def refresh(
    body: RefreshTokenRequest,
    db: Session = Depends(get_db),
):
    service = AuthService(db)
    result = service.refresh(body.refresh_token)
    return APIResponse(
        success=True,
        message="Token refreshed",
        data={
            "user": _user_to_response(result["user"]).model_dump(),
            "tokens": result["tokens"],
        },
    )


# =====================================================
# POST /api/v1/auth/logout
# =====================================================


@router.post(
    "/logout",
    response_model=APIResponse,
    summary="Logout (revoke tokens)",
)
def logout(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    body: Optional[LogoutRequest] = Body(default=None),
):
    """Revoke the supplied refresh token (or all of the user's
    refresh tokens if none is supplied) and blacklist the access token.
    """
    service = AuthService(db)

    # Decode current access token to blacklist its jti
    access_jti: str | None = None
    access_exp: int | None = None
    token = _extract_bearer(request)
    if token:
        try:
            payload = decode_access_token(token)
            access_jti = payload.get("jti")
            access_exp = payload.get("exp")
        except Exception as e:
            logger.exception(e)

    service.logout(
        user=current_user,
        access_jti=access_jti,
        access_exp_ts=access_exp,
        refresh_token=body.refresh_token if body else None,
    )
    return APIResponse(success=True, message="Logged out successfully")


# =====================================================
# GET /api/v1/auth/me
# =====================================================


@router.get(
    "/me",
    response_model=APIResponse,
    summary="Get current user profile",
)
def me(
    current_user: User = Depends(get_current_user),
):
    return APIResponse(
        success=True,
        message="Current user",
        data={"user": _user_to_response(current_user).model_dump()},
    )


# =====================================================
# PATCH /api/v1/auth/me
# =====================================================


@router.patch(
    "/me",
    response_model=APIResponse,
    summary="Update current user profile",
)
def update_me(
    body: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = AuthService(db)
    updated = service.update_profile(
        user=current_user,
        data=body.model_dump(exclude_unset=True),
    )
    return APIResponse(
        success=True,
        message="Profile updated",
        data={"user": _user_to_response(updated).model_dump()},
    )


# =====================================================
# POST /api/v1/auth/change-password
# =====================================================


@router.post(
    "/change-password",
    response_model=APIResponse,
    summary="Change current user's password",
)
def change_password(
    body: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = AuthService(db)
    service.change_password(
        user=current_user,
        current_password=body.current_password,
        new_password=body.new_password,
    )
    return APIResponse(
        success=True,
        message="Password changed successfully",
    )


# =====================================================
# POST /api/v1/auth/forgot-password
# =====================================================


@router.post(
    "/forgot-password",
    response_model=APIResponse,
    summary="Request a password reset token",
)
def forgot_password(
    body: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    service = AuthService(db)
    result = service.forgot_password(email=body.email)

    payload: dict = {
        "expires_in_minutes": result["expires_in_minutes"],
    }
    if result["dev_reset_token"]:
        payload["dev_reset_token"] = result["dev_reset_token"]

    return APIResponse(
        success=True,
        message=(
            "If an account exists for that email, a reset link has been sent."
        ),
        data=payload,
    )


# =====================================================
# POST /api/v1/auth/reset-password
# =====================================================


@router.post(
    "/reset-password",
    response_model=APIResponse,
    summary="Reset password using a one-time token",
)
def reset_password(
    body: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    service = AuthService(db)
    service.reset_password(
        token=body.token,
        new_password=body.new_password,
    )
    return APIResponse(
        success=True,
        message="Password reset successful. Please log in again.",
    )


# =====================================================
# POST /api/v1/auth/upload-profile-picture
# =====================================================


@router.post(
    "/upload-profile-picture",
    response_model=APIResponse,
    summary="Upload a profile picture (multipart/form-data)",
)
def upload_profile_picture(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = AuthService(db)
    url = service.upload_profile_picture(user=current_user, upload=file)
    return APIResponse(
        success=True,
        message="Profile picture uploaded successfully",
        data={"profile_picture_url": url},
    )
