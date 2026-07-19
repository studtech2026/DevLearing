"""
Repair common JSON formatting mistakes.
"""

from __future__ import annotations

import re

from app.core.logging import get_logger

logger = get_logger(__name__)


class JsonRepair:
    """
    Utility class for repairing common JSON formatting issues
    returned by AI models.
    """

    @classmethod
    def repair(cls, text: str) -> str:
        """
        Repair common JSON mistakes.

        Supported fixes:
        - Remove UTF-8 BOM
        - Remove trailing commas
        - Convert Python literals to JSON
        - Normalize smart quotes
        - Remove control characters
        """

        if not text:
            return ""

        # Remove UTF-8 BOM
        text = text.replace("\ufeff", "")

        # Normalize quotes
        text = (
            text.replace("“", '"')
            .replace("”", '"')
            .replace("‘", "'")
            .replace("’", "'")
        )

        # Python -> JSON
        text = text.replace("True", "true")
        text = text.replace("False", "false")
        text = text.replace("None", "null")

        # Remove trailing commas
        text = re.sub(
            r",(\s*[}\]])",
            r"\1",
            text,
        )

        # Remove non-printable control characters
        text = re.sub(
            r"[\x00-\x08\x0B\x0C\x0E-\x1F]",
            "",
            text,
        )

        repaired = text.strip()

        logger.debug("JSON repaired successfully.")

        return repaired