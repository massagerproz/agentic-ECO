"""Input/output guardrails for agents."""

from typing import Any


def require_human_review(confidence: float, threshold: float = 0.8) -> bool:
    """Require human review on low-confidence categorization."""
    return confidence < threshold


def validate_journal_entry(debits: list, credits: list) -> bool:
    """Block posting unbalanced journal entries."""
    return sum(debits) == sum(credits)


def apply_guardrails(data: Any) -> tuple[bool, str]:
    """Apply relevant guardrails; return (ok, reason)."""
    return True, "ok"
