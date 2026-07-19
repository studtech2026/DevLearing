"""
User schemas (request/response).
"""

from __future__ import annotations

from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# =====================================================
# User Update Request
# =====================================================

class UserUpdate(BaseModel):
    """
    Schema for updating an authenticated user's profile.
    """

    name: str | None = Field(default=None, min_length=2, max_length=100)
    username: str | None = Field(default=None, min_length=3, max_length=100)
    phone: str | None = Field(default=None, max_length=50)
    gender: str | None = Field(default=None, max_length=20)
    date_of_birth: date | None = None

    address: str | None = None
    city: str | None = Field(default=None, max_length=100)
    state: str | None = Field(default=None, max_length=100)
    country: str | None = Field(default=None, max_length=100)

    bio: str | None = None

    model_config = ConfigDict(
        extra="forbid",
        str_strip_whitespace=True,
    )


# =====================================================
# Public User Response
# =====================================================

class UserPublic(BaseModel):
    """
    Public-facing user representation.
    """

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