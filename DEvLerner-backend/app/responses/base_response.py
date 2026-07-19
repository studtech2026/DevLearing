"""
Base API response models.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class BaseResponse(BaseModel):
    """
    Standard API response.
    """

    success: bool = True

    message: str = "Request completed successfully."

    provider: str | None = None

    timestamp: datetime = Field(default_factory=datetime.utcnow)


class SuccessResponse(BaseResponse):
    """
    Success response with data.
    """

    data: Any


class ErrorResponse(BaseResponse):
    """
    Error response.
    """

    success: bool = False

    error: str

    data: Any | None = None