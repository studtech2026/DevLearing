"""
Global exception classes and handlers.
"""

from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi import HTTPException


# =====================================================
# Custom Exceptions
# =====================================================

class AppException(Exception):
    """
    Base application exception.
    """

    def __init__(
        self,
        message: str,
        status_code: int = status.HTTP_400_BAD_REQUEST,
    ):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class AuthenticationException(AppException):
    """
    Authentication failure.
    """

    def __init__(
        self,
        message: str = "Authentication failed",
    ):
        super().__init__(
            message,
            status.HTTP_401_UNAUTHORIZED,
        )


class AuthorizationException(AppException):
    """
    Authorization failure.
    """

    def __init__(
        self,
        message: str = "Permission denied",
    ):
        super().__init__(
            message,
            status.HTTP_403_FORBIDDEN,
        )


class NotFoundException(AppException):
    """
    Resource not found.
    """

    def __init__(
        self,
        message: str = "Resource not found",
    ):
        super().__init__(
            message,
            status.HTTP_404_NOT_FOUND,
        )


class DatabaseException(AppException):
    """
    Database error.
    """

    def __init__(
        self,
        message: str = "Database error",
    ):
        super().__init__(
            message,
            status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


# =====================================================
# Exception Handlers
# =====================================================


async def http_exception_handler(
    request: Request,
    exc: HTTPException,
):
    """
    Handles FastAPI HTTPException.
    """

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.detail,
            "data": None,
            "errors": [
                exc.detail
            ],
        },
    )


async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
):
    """
    Handles request validation errors.
    """

    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": "Validation error",
            "data": None,
            "errors": exc.errors(),
        },
    )


async def general_exception_handler(
    request: Request,
    exc: Exception,
):
    """
    Handles unexpected errors.
    """

    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal Server Error",
            "data": None,
            "errors": [
                str(exc)
            ],
        },
    )


async def app_exception_handler(
    request: Request,
    exc: AppException,
):
    """
    Handles custom application exceptions.
    """

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.message,
            "data": None,
            "errors": [
                exc.message
            ],
        },
    )


def register_exception_handlers(app):
    """
    Register all exception handlers.
    """

    app.add_exception_handler(
        AppException,
        app_exception_handler,
    )

    app.add_exception_handler(
        HTTPException,
        http_exception_handler,
    )

    app.add_exception_handler(
        RequestValidationError,
        validation_exception_handler,
    )

    app.add_exception_handler(
        Exception,
        general_exception_handler,
    )