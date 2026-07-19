"""
Extract source code blocks.
"""

from __future__ import annotations

import re


class CodeExtractor:

    @staticmethod
    def extract(text: str) -> str:

        matches = re.findall(
            r"```(?:\w+)?\s*(.*?)```",
            text,
            re.DOTALL,
        )

        if matches:
            return "\n\n".join(matches)

        return text