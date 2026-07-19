"""
Code optimization endpoints.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies import get_ai_service
from app.core.logging import get_logger
from app.schemas.common import APIResponse
from app.schemas.requests import OptimizeRequest
from app.services.ai_service import AIService

router = APIRouter()

logger = get_logger(__name__)


@router.post(
    "",
    response_model=APIResponse,
    summary="Optimize Source Code",
)
async def optimize_code(
    request: OptimizeRequest,
    service: AIService = Depends(get_ai_service),
):
    """
    Optimize source code using the configured AI provider.
    """

    try:
        result = service.optimize_code(
            code=request.code,
            language=request.language,
        )

        return APIResponse(
            success=True,
            message="Code optimized successfully",
            data=result,
        )

    except HTTPException:
        raise

    except Exception:
        logger.exception("Code optimization failed")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Code optimization failed",
        )