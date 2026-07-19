"""
Response model for code analysis.
"""

from __future__ import annotations

from pydantic import BaseModel

from app.responses.base_response import BaseResponse


class AnalysisData(BaseModel):
    summary: str
    explanation: str
    bugs: list[str]
    complexity: str
    unit_tests: list[str]
    interview_questions: list[str]


class AnalyzeResponse(BaseResponse):
    """
    Code analysis response.
    """

    data: AnalysisData