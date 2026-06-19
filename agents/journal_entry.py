"""Journal entry agent."""

from .tools import BeancountLedger
from .guardrails import validate_journal_entry


class JournalEntryAgent:
    """Agent for creating journal entries."""

    def __init__(self):
        self.ledger = BeancountLedger()

    def create_entry(self, debits: list, credits: list) -> bool:
        if not validate_journal_entry(debits, credits):
            return False
        return self.ledger.append("entry")
