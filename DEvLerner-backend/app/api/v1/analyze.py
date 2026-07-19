"""
Code analysis endpoints.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies import get_ai_service
from app.core.logging import get_logger
from app.schemas.common import APIResponse
from app.schemas.requests import AnalyzeRequest
from app.services.ai_service import AIService

router = APIRouter()

logger = get_logger(__name__)


@router.post(
    "",
    response_model=APIResponse,
    summary="Analyze Source Code",
)
async def analyze_code(
    request: AnalyzeRequest,
    service: AIService = Depends(get_ai_service),
):
    """
    Analyze source code using the configured AI provider.
    """

    try:
        result = service.analyze_code(
            code=request.code,
            language=request.language,
            task=request.task,
        )

        return APIResponse(
            success=True,
            message="Code analyzed successfully",
            data=result,
        )

    except HTTPException:
        raise

    except Exception:
        logger.exception("Code analysis failed")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Code analysis failed",
        )   