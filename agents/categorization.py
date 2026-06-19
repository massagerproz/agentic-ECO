"""Categorization agent."""

from .llm import get_llm_client, get_model
from .guardrails import require_human_review


class CategorizationAgent:
    """Agent for transaction categorization."""

    def __init__(self):
        self.llm = get_llm_client()
        self.model = get_model()

    def categorize(self, transaction: dict) -> dict:
        confidence = 0.9
        if require_human_review(confidence):
            return {"needs_review": True}
        return {"category": "expense", "confidence": confidence}
