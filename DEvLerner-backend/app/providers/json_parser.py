"""
Utilities for extracting and repairing JSON returned by AI models.
"""

from __future__ import annotations

import json
import re
from typing import Any

from app.core.logging import get_logger

logger = get_logger(__name__)


class JsonParser:
    """
    Parse and repair JSON returned by LLMs.

    Supports:
    - Markdown code blocks
    - Plain JSON
    - Extra explanation text
    - Minor JSON syntax issues
    """

    # =====================================================
    # Public
    # =====================================================

    @classmethod
    def parse(cls, text: str) -> dict[str, Any]:
        """
        Extract and parse JSON.
        """

        if not text or not text.strip():
            raise ValueError("Empty AI response.")

        cleaned = cls.extract_json(text)
        cleaned = cls.repair(cleaned)

        try:
            result = json.loads(cleaned)

            if not isinstance(result, dict):
                raise ValueError("Expected JSON object.")

            return result

        except json.JSONDecodeError as exc:

            logger.error("Failed to parse JSON:\n%s", cleaned)

            raise ValueError(
                "AI returned invalid JSON."
            ) from exc

    # =====================================================
    # Extract
    # =====================================================

    @staticmethod
    def extract_json(text: str) -> str:
        """
        Extract JSON from markdown or mixed responses.
        """

        # ```json ... ```
        match = re.search(
            r"```(?:json)?\s*(.*?)```",
            text,
            re.DOTALL | re.IGNORECASE,
        )

        if match:
            return match.group(1).strip()

        # {...}
        start = text.find("{")
        end = text.rfind("}")

        if start != -1 and end != -1 and end > start:
            return text[start : end + 1]

        return text.strip()

    # =====================================================
    # Repair
    # =====================================================

    @staticmethod
    def repair(text: str) -> str:
        """
        Repair common JSON mistakes.
        """

        # Remove trailing commas
        text = re.sub(
            r",(\s*[}\]])",
            r"\1",
            text,
        )

        # Python -> JSON
        text = text.replace("True", "true")
        text = text.replace("False", "false")
        text = text.replace("None", "null")

        # Remove BOM
        text = text.replace("\ufeff", "")

        return text.strip()

    # =====================================================
    # Validation
    # =====================================================

    @staticmethod
    def is_valid(text: str) -> bool:
        """
        Check whether text is valid JSON.
        """

        try:
            json.loads(text)
            return True

        except Exception:
            return False

    # =====================================================
    # Pretty
    # =====================================================

    @staticmethod
    def dumps(data: dict[str, Any]) -> str:
        """
        Pretty-print JSON.
        """

        return json.dumps(
            data,
            indent=2,
            ensure_ascii=False,
        )