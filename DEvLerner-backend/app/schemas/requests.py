"""
API Request Schemas.
"""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field, HttpUrl


# =====================================================
# Analyze Code
# =====================================================

class AnalyzeRequest(BaseModel):
    """Request to analyze source code."""

    code: str = Field(
        ...,
        min_length=1,
        description="Source code to analyze",
    )

    language: str = Field(
        default="python",
        description="Programming language",
    )

    task: str = Field(
        default="explain",
        description="Analysis task (explain, review, optimize, bug_fix, etc.)",
    )

    model_config = ConfigDict(
        str_strip_whitespace=True,
    )


# =====================================================
# Optimize Code
# =====================================================

class OptimizeRequest(BaseModel):
    """Request to optimize source code."""

    code: str = Field(
        ...,
        min_length=1,
        description="Source code to optimize",
    )

    language: str = Field(
        default="python",
        description="Programming language",
    )

    model_config = ConfigDict(
        str_strip_whitespace=True,
    )


# =====================================================
# Convert Code
# =====================================================

class ConvertRequest(BaseModel):
    """Request to convert code to another language."""

    code: str = Field(
        ...,
        min_length=1,
        description="Source code",
    )

    language: str = Field(
        default="python",
        description="Current programming language",
    )

    target_language: str = Field(
        ...,
        description="Target programming language",
    )

    model_config = ConfigDict(
        str_strip_whitespace=True,
    )


# =====================================================
# Analyze Repository
# =====================================================

class RepositoryRequest(BaseModel):
    """Request to analyze a Git repository."""

    repository_url: HttpUrl = Field(
        ...,
        description="Git repository URL",
    )

    branch: str | None = Field(
        default=None,
        description="Repository branch",
    )

    model_config = ConfigDict(
        str_strip_whitespace=True,
    )