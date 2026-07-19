"""
API v1 router.
"""

from fastapi import APIRouter

from app.api.v1.analyze import router as analyze_router
from app.api.v1.auth import router as auth_router
from app.api.v1.convert import router as convert_router
from app.api.v1.health import router as health_router
from app.api.v1.optimize import router as optimize_router
from app.api.v1.repository import router as repository_router

router = APIRouter()

router.include_router(
    health_router,
    tags=["Health"],
)

router.include_router(
    auth_router,
    prefix="/auth",
    tags=["Authentication"],
)

router.include_router(
    analyze_router,
    prefix="/analyze",
    tags=["Analysis"],
)

router.include_router(
    optimize_router,
    prefix="/optimize",
    tags=["Optimization"],
)

router.include_router(
    convert_router,
    prefix="/convert",
    tags=["Conversion"],
)

router.include_router(
    repository_router,
    prefix="/repository",
    tags=["Repository"],
)
