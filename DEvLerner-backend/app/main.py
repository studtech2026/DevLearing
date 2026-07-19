"""
Application entry point.
"""

from __future__ import annotations

from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.db.session import init_db


from app.api.v1.router import router
from app.core.config import settings
from app.core.exceptions import (
    general_exception_handler,
    http_exception_handler,
    validation_exception_handler,
)
from app.core.logging import get_logger, setup_logging

# =====================================================
# Logging
# =====================================================

setup_logging()
logger = get_logger(__name__)


# =====================================================
# Application Lifespan
# =====================================================

@asynccontextmanager
async def lifespan(app: FastAPI):

    init_db()

    Path(settings.upload_dir).mkdir(
        parents=True,
        exist_ok=True,
    )

    Path(
        settings.upload_dir,
        "profile_pictures",
    ).mkdir(
        parents=True,
        exist_ok=True,
    )

    logger.info("=" * 50)
    logger.info("%s Started", settings.app_name)
    logger.info("Environment : %s", settings.environment)
    logger.info("AI Provider : %s", settings.ai_provider)
    logger.info("=" * 50)

    yield

    logger.info("%s Stopped", settings.app_name)


# =====================================================
# FastAPI
# =====================================================

app = FastAPI(
    title=settings.app_name,
    description=(
        "AI-powered backend for code explanation, optimization, "
        "conversion, repository analysis and authentication."
    ),
    version=settings.app_version,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# Static Files
# =====================================================

app.mount(
    "/uploads",
    StaticFiles(directory=settings.upload_dir),
    name="uploads",
)

# =====================================================
# API Routes
# =====================================================

app.include_router(
    router,
    prefix=settings.api_v1_prefix,
)

# =====================================================
# Exception Handlers
# =====================================================

app.add_exception_handler(
    RequestValidationError,
    validation_exception_handler,
)

app.add_exception_handler(
    HTTPException,
    http_exception_handler,
)

app.add_exception_handler(
    Exception,
    general_exception_handler,
)

# =====================================================
# Root Endpoint
# =====================================================

@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint.
    """

    return {
        "application": settings.app_name,
        "version": settings.app_version,
        "docs": "/docs",
        "redoc": "/redoc",
        "api": settings.api_v1_prefix,
    }