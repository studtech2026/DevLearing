"""
Health endpoints.
"""

from fastapi import APIRouter

from app.core.config import settings
from app.schemas.common import APIResponse

router = APIRouter()


@router.get(
    "/health",
    response_model=APIResponse,
    summary="Health Check",
)
async def health():
    """
    Check API health status.
    """

    return APIResponse(
        success=True,
        message="Service is healthy",
        data={
            "status": "healthy",
            "provider": settings.ai_provider,
            "version": settings.app_version,
        },
    )