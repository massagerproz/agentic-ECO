"""Reconciliation agent."""

from .tools import BeancountLedger


class ReconciliationAgent:
    """Agent for bank reconciliation."""

    def __init__(self):
        self.ledger = BeancountLedger()

    def reconcile(self, statement: list) -> dict:
        return {"matched": len(statement), "unmatched": 0}
