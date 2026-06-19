"""OpenAI-compatible LLM client."""

import os
from typing import Optional

try:
    from openai import OpenAI
except ImportError:
    OpenAI = None


def get_llm_client() -> Optional[object]:
    """Create OpenAI-compatible client from env vars."""
    base_url = os.getenv("OPENAI_BASE_URL")
    api_key = os.getenv("OPENAI_API_KEY", "dummy")
    if OpenAI is None or not base_url:
        return None
    return OpenAI(base_url=base_url, api_key=api_key)


def get_model() -> str:
    """Get model name from env."""
    return os.getenv("MODEL", "gpt-4o-mini")
