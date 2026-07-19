"""
Programming language detection.
"""

import re


class LanguageDetector:

    @staticmethod
    def detect(code: str) -> str:

        if re.search(r"public\s+class", code):
            return "java"

        if re.search(r"def\s+\w+", code):
            return "python"

        if re.search(r"#include", code):
            return "cpp"

        if re.search(r"func\s+\w+", code):
            return "go"

        if re.search(r"import Foundation", code):
            return "swift"

        return "text"