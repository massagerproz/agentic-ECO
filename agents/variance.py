"""Variance analysis agent."""

class VarianceAgent:
    """Agent for variance analysis."""

    def analyze(self, actual: float, budget: float) -> dict:
        return {"variance": actual - budget, "pct": (actual - budget) / budget if budget else 0}
