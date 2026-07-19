"""
Code conversion endpoints.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies import get_ai_service
from app.core.logging import get_logger
from app.schemas.common import APIResponse
from app.schemas.requests import ConvertRequest
from app.services.ai_service import AIService

router = APIRouter()

logger = get_logger(__name__)


@router.post(
    "",
    response_model=APIResponse,
    summary="Convert Source Code",
)
async def convert_code(
    request: ConvertRequest,
    service: AIService = Depends(get_ai_service),
):
    """
    Convert source code from one programming language to another.
    """

    try:
        result = service.convert_code(
            code=request.code,
            language=request.language,
            target_language=request.target_language,
        )

        return APIResponse(
            success=True,
            message="Code converted successfully",
            data=result,
        )

    except HTTPException:
        raise

    except Exception:
        logger.exception("Code conversion failed")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Code conversion failed",
        )