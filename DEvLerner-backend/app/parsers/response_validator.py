"""
Validate AI JSON responses.
"""

from __future__ import annotations

from typing import Any

from app.core.logging import get_logger

logger = get_logger(__name__)


class ResponseValidator:
    """
    Validate AI responses before returning them to the API.
    """

    REQUIRED_FIELDS = {
        "summary",
        "explanation",
        "bugs",
        "complexity",
        "unit_tests",
        "interview_questions",
    }

    @classmethod
    def validate(cls, response: dict[str, Any]) -> None:
        """
        Validate AI response.
        """

        if not isinstance(response, dict):
            raise ValueError("AI response must be a JSON object.")

        missing = cls.REQUIRED_FIELDS - response.keys()

        if missing:
            raise ValueError(
                f"Missing required fields: {', '.join(sorted(missing))}"
            )

        cls._validate_string(response, "summary")
        cls._validate_string(response, "explanation")
        cls._validate_string(response, "complexity")

        cls._validate_list(response, "bugs")
        cls._validate_list(response, "unit_tests")
        cls._validate_list(response, "interview_questions")

        logger.debug("AI response validation passed.")

    # =====================================================
    # Helpers
    # =====================================================

    @staticmethod
    def _validate_string(
        response: dict[str, Any],
        field: str,
    ) -> None:
        value = response.get(field)

        if not isinstance(value, str):
            raise ValueError(f"'{field}' must be a string.")

        if not value.strip():
            raise ValueError(f"'{field}' cannot be empty.")

    @staticmethod
    def _validate_list(
        response: dict[str, Any],
        field: str,
    ) -> None:
        value = response.get(field)

        if not isinstance(value, list):
            raise ValueError(f"'{field}' must be a list.")