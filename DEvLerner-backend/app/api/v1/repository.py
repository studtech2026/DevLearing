"""
Repository analysis endpoints.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies import get_ai_service
from app.core.logging import get_logger
from app.schemas.common import APIResponse
from app.schemas.requests import RepositoryRequest
from app.services.ai_service import AIService

router = APIRouter()

logger = get_logger(__name__)


@router.post(
    "",
    response_model=APIResponse,
    summary="Analyze Git Repository",
)
async def analyze_repository(
    request: RepositoryRequest,
    service: AIService = Depends(get_ai_service),
):
    """
    Analyze a Git repository using the configured AI provider.
    """

    try:
        result = service.analyze_repository(
            repository_url=request.repository_url,
            branch=request.branch,
        )

        return APIResponse(
            success=True,
            message="Repository analyzed successfully",
            data=result,
        )

    except HTTPException:
        raise

    except Exception:
        logger.exception("Repository analysis failed")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Repository analysis failed",
        )