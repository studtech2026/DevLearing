"""
Markdown parser utilities.
"""

from __future__ import annotations

import re

from app.core.logging import get_logger

logger = get_logger(__name__)


class MarkdownParser:
    """
    Utilities for removing Markdown formatting from AI responses.
    """

    @classmethod
    def remove_markdown(cls, text: str) -> str:
        """
        Remove Markdown code fences.

        Supports:

        ```json
        ```

        ```python
        ```

        ```java
        ```

        ```anything
        ```

        and plain
        ```
        ```
        """

        if not text:
            return ""

        text = text.strip()

        # Extract first fenced code block
        match = re.search(
            r"```(?:[a-zA-Z0-9_+-]*)?\s*(.*?)```",
            text,
            flags=re.DOTALL | re.IGNORECASE,
        )

        if match:
            cleaned = match.group(1).strip()

            logger.debug("Markdown code fence removed.")

            return cleaned

        # Remove remaining backticks if present
        text = text.replace("```", "").strip()

        return text