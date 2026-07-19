"""
GitHub helper utilities.
"""

import re


class GitHubUtils:

    @staticmethod
    def is_valid(url: str) -> bool:

        pattern = (
            r"^https://github\.com/"
            r"[\w.-]+/[\w.-]+/?$"
        )

        return bool(re.match(pattern, url))