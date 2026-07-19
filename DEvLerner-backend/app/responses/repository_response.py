"""
Response model for repository analysis.
"""

from __future__ import annotations

from pydantic import BaseModel

from app.responses.base_response import BaseResponse


class RepositoryStatistics(BaseModel):
    total_files: int = 0
    total_lines: int = 0
    languages: list[str] = []


class RepositoryData(BaseModel):
    repository: str
    branch: str | None = None
    summary: str
    issues: list[str] = []
    recommendations: list[str] = []
    statistics: RepositoryStatistics


class RepositoryResponse(BaseResponse):
    """
    Repository analysis response.
    """

    data: RepositoryData