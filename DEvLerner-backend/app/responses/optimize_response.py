"""
Response model for code optimization.
"""

from __future__ import annotations

from pydantic import BaseModel

from app.responses.base_response import BaseResponse


class OptimizationData(BaseModel):
    optimized_code: str
    improvements: list[str] = []
    complexity_before: str | None = None
    complexity_after: str | None = None


class OptimizeResponse(BaseResponse):
    """
    Code optimization response.
    """

    data: OptimizationData