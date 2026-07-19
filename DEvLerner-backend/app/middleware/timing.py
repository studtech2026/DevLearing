"""
Execution time middleware.
"""

import time

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware


class TimingMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request: Request, call_next):

        start = time.perf_counter()

        response = await call_next(request)

        response.headers["X-Execution-Time"] = (
            f"{time.perf_counter()-start:.4f}"
        )

        return response