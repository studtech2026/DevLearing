"""
File utilities.
"""

from pathlib import Path


class FileUtils:

    @staticmethod
    def read(path: str) -> str:

        return Path(path).read_text(
            encoding="utf-8",
        )

    @staticmethod
    def write(
        path: str,
        content: str,
    ) -> None:

        Path(path).write_text(
            content,
            encoding="utf-8",
        )