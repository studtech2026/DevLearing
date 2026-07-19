"""
Response model for code conversion.
"""

from __future__ import annotations

from pydantic import BaseModel

from app.responses.base_response import BaseResponse


class ConversionData(BaseModel):
    source_language: str
    target_language: str
    converted_code: str
    notes: list[str] = []


class ConvertResponse(BaseResponse):
    """
    Code conversion response.
    """

    data: ConversionData