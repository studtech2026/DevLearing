"""
Reusable API response schemas.
"""

from typing import Any

from pydantic import BaseModel, ConfigDict


class ResponseMetadata(BaseModel):
    """
    Metadata included with responses.
    """

    page: int | None = None
    size: int | None = None
    total: int | None = None

    model_config = ConfigDict(from_attributes=True)


class SuccessResponse(BaseModel):
    """
    Standard success response.
    """

    success: bool = True
    message: str
    data: Any | None = None
    metadata: ResponseMetadata | None = None


class ErrorResponse(BaseModel):
    """
    Standard error response.
    """

    success: bool = False
    message: str
    errors: list[str]
    data: Any | None = None


class PaginatedResponse(BaseModel):
    """
    Paginated API response.
    """

    success: bool = True
    message: str
    data: list[Any]
    metadata: ResponseMetadata