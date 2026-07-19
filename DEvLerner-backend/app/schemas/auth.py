"""
Authentication schemas.

Request and response models for authentication.
"""

from __future__ import annotations

from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# =====================================================
# Requests
# =====================================================


class LoginRequest(BaseModel):
    """Login request schema."""

    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)

    model_config = ConfigDict(
        str_strip_whitespace=True,
    )


class RegisterRequest(BaseModel):
    """User registration schema."""

    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    username: str | None = Field(
        default=None,
        min_length=3,
        max_length=100,
    )

    model_config = ConfigDict(
        str_strip_whitespace=True,
    )


class RefreshTokenRequest(BaseModel):
    """Refresh access token request."""

    refresh_token: str = Field(..., min_length=10)


class LogoutRequest(BaseModel):
    """Logout request."""

    refresh_token: str | None = Field(default=None)


class ChangePasswordRequest(BaseModel):
    """Change password request."""

    current_password: str = Field(..., min_length=8, max_length=128)
    new_password: str = Field(..., min_length=8, max_length=128)


class ForgotPasswordRequest(BaseModel):
    """Forgot password request."""

    email: EmailStr


class ResetPasswordRequest(BaseModel):
    """Reset password request."""

    token: str = Field(..., min_length=10)
    new_password: str = Field(..., min_length=8, max_length=128)


# =====================================================
# Responses
# =====================================================


class TokenPair(BaseModel):
    """JWT token pair."""

    access_token: str
    refresh_token: str
    token_type: Literal["bearer"] = "bearer"
    expires_in: int


class UserResponse(BaseModel):
    """Public user response."""

    id: int
    name: str
    email: EmailStr
    username: str | None = None
    phone: str | None = None
    gender: str | None = None
    date_of_birth: date | None = None

    address: str | None = None
    city: str | None = None
    state: str | None = None
    country: str | None = None

    bio: str | None = None
    profile_picture: str | None = None

    is_active: bool

    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(
        from_attributes=True,
    )


class AuthResponse(BaseModel):
    """Authentication response."""

    user: UserResponse
    tokens: TokenPair