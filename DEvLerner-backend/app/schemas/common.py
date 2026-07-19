"""
Common API response schemas.
"""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


class APIResponse(BaseModel):
    """
    Standard API response used throughout the application.
    """

    success: bool = True
    message: str
    data: Any | None = None
    errors: list[str] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)


class ErrorResponse(BaseModel):
    """
    Standard error response.
    """

    success: bool = False
    message: str
    errors: list[str] = Field(default_factory=list)