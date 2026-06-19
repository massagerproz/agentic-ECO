"""Runner orchestrating the close pipeline with Human Review Queue."""

from .categorization import CategorizationAgent
from .reconciliation import ReconciliationAgent
from .journal_entry import JournalEntryAgent
from .close_checklist import CloseChecklistAgent
from .variance import VarianceAgent
from .report import ReportAgent


class HumanReviewQueue:
    """Simple human review queue for exceptions."""

    def __init__(self):
        self.items = []

    def add(self, item: dict):
        self.items.append(item)

    def process(self):
        return len(self.items)


def run_close_pipeline() -> dict:
    """Run the accounting close pipeline."""
    cat = CategorizationAgent()
    rec = ReconciliationAgent()
    je = JournalEntryAgent()
    chk = CloseChecklistAgent()
    var = VarianceAgent()
    rep = ReportAgent()
    queue = HumanReviewQueue()

    # Stub run
    cat.categorize({})
    rec.reconcile([])
    je.create_entry([100], [100])
    chk.run_checklist()
    var.analyze(100, 90)
    rep.generate("2024-01")

    return {"status": "complete", "review_queue": queue.process()}
