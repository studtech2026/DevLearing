"""
Main AI response parser.

Normalizes, repairs, validates and parses AI responses.
"""

from __future__ import annotations

import json
from typing import Any

from app.core.logging import get_logger
from app.parsers.json_repair import JsonRepair
from app.parsers.markdown_parser import MarkdownParser
from app.parsers.response_validator import ResponseValidator

logger = get_logger(__name__)


class AIResponseParser:
    """
    Parse AI responses into validated dictionaries.
    """

    @classmethod
    def parse(cls, text: str) -> dict[str, Any]:
        """
        Parse an AI response into a validated JSON object.

        Steps:
        1. Remove Markdown formatting
        2. Repair malformed JSON
        3. Parse JSON
        4. Validate required fields
        """

        if not text or not text.strip():
            raise ValueError("AI returned an empty response.")

        logger.debug("Raw AI response received.")

        try:
            # Remove ```json ... ```
            cleaned = MarkdownParser.remove_markdown(text)

            # Repair common JSON issues
            cleaned = JsonRepair.repair(cleaned)

            # Parse JSON
            data = json.loads(cleaned)

            if not isinstance(data, dict):
                raise ValueError("Expected a JSON object.")

            # Validate schema
            ResponseValidator.validate(data)

            logger.debug("AI response parsed successfully.")

            return data

        except json.JSONDecodeError as exc:
            logger.exception("Invalid JSON returned by AI.")

            raise ValueError(
                "AI returned invalid JSON."
            ) from exc

        except Exception as exc:
            logger.exception("Failed to parse AI response.")

            raise ValueError(
                f"Unable to parse AI response: {exc}"
            ) from exc