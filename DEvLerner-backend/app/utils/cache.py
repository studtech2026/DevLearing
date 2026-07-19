"""
Simple cache.
"""

from functools import lru_cache


class Cache:

    @staticmethod
    @lru_cache(maxsize=128)
    def language(name: str):

        return name.lower()