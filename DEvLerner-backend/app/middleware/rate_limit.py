"""
Simple in-memory rate limiter.
"""

import time

from fastapi import HTTPException, Request
from starlette.middleware.base import BaseHTTPMiddleware


class RateLimitMiddleware(BaseHTTPMiddleware):

    requests = {}

    LIMIT = 100

    WINDOW = 60

    async def dispatch(self, request: Request, call_next):

        ip = request.client.host

        now = time.time()

        history = self.requests.setdefault(ip, [])

        history[:] = [
            t for t in history
            if now - t < self.WINDOW
        ]

        if len(history) >= self.LIMIT:

            raise HTTPException(
                status_code=429,
                detail="Too many requests",
            )

        history.append(now)

        return await call_next(request)