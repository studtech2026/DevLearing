from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


class CodeAnalysisRequest(BaseModel):
    code: str
    language: str = "python"
    task: str = "explain"


class CodeOptimizationRequest(BaseModel):
    code: str
    language: str = "python"


class CodeGenerationRequest(BaseModel):
    code: str
    language: str = "python"
    target_language: str = "javascript"


class RepositoryAnalysisRequest(BaseModel):
    repository_url: str
    branch: Optional[str] = None


class CodeAnalysisResponse(BaseModel):
    summary: str
    explanation: str
    bugs: List[str] = Field(default_factory=list)
    complexity: str
    unit_tests: List[str] = Field(default_factory=list)
    interview_questions: List[str] = Field(default_factory=list)
    provider: str = "local"


class CodeOptimizationResponse(BaseModel):
    optimized_code: str
    explanation: str
    improvements: List[str] = Field(default_factory=list)
    provider: str = "local"


class CodeConversionResponse(BaseModel):
    converted_code: str
    explanation: str
    provider: str = "local"


class RepositoryAnalysisResponse(BaseModel):
    repository_url: str
    summary: str
    key_points: List[str] = Field(default_factory=list)
    risks: List[str] = Field(default_factory=list)
    provider: str = "local"
