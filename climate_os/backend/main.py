from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import (
    ExtractRequest, ExtractResponse, EvidenceItem,
    GenerateReportRequest, GenerateReportResponse,
    QAReviewRequest, QAReviewResponse, QAFlag,
    RewriteRequest, RewriteResponse
)
import os
import json
import asyncio

app = FastAPI(title="CLEAR Climate OS Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# For a real implementation, we'd use the openai client, e.g.:
# from openai import AsyncOpenAI
# client = AsyncOpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

@app.post("/api/extract", response_model=ExtractResponse)
async def extract_evidence(request: ExtractRequest):
    """
    Mock implementation: Extracts structured evidence from raw notes.
    """
    if not request.notes.strip():
        raise HTTPException(status_code=400, detail="Notes cannot be empty.")

    # Simulate AI processing time
    await asyncio.sleep(1.5)

    # In a real implementation we would call an LLM here to structure the notes.
    # We will use simple mock data logic.
    mock_evidence = []

    notes_lower = request.notes.lower()
    if "decided" in notes_lower or "decision" in notes_lower:
        mock_evidence.append(EvidenceItem(category="decisions", content="A decision was made based on the notes."))
    if "risk" in notes_lower or "issue" in notes_lower:
        mock_evidence.append(EvidenceItem(category="risks", content="A potential risk was identified."))
    if "todo" in notes_lower or "action" in notes_lower:
        mock_evidence.append(EvidenceItem(category="follow-up actions", content="Action item identified."))

    # Always return at least one generic item if nothing matched
    if not mock_evidence:
         mock_evidence.append(EvidenceItem(category="meeting notes", content="General meeting notes extracted."))

    return ExtractResponse(evidence=mock_evidence)


@app.post("/api/generate_report", response_model=GenerateReportResponse)
async def generate_report(request: GenerateReportRequest):
    """
    Mock implementation: Generates a donor report draft using approved evidence.
    """
    if not request.approved_evidence:
        raise HTTPException(status_code=400, detail="Must provide approved evidence.")

    # Simulate AI processing time
    await asyncio.sleep(2.0)

    report = f"## {request.project_name} - Donor Report Draft\n\n"
    report += "### Summary of Activities and Evidence\n"

    for item in request.approved_evidence:
        report += f"- **{item.category.capitalize()}**: {item.content}\n"

    report += "\n### Conclusion\nProject is progressing as noted."

    return GenerateReportResponse(draft_report=report)

@app.post("/api/qa_review", response_model=QAReviewResponse)
async def qa_review(request: QAReviewRequest):
    """
    Mock implementation: Flags unsupported claims, missing evidence, etc.
    """
    # Simulate AI processing time
    await asyncio.sleep(1.0)

    flags = []
    passed = True

    # Simple heuristic for mock
    if "100%" in request.draft_report or "perfect" in request.draft_report.lower():
        flags.append(QAFlag(
            flag_type="overclaiming",
            description="The report contains absolute terms like '100%' or 'perfect' which may be overclaiming.",
            severity="high"
        ))
        passed = False

    if len(request.approved_evidence) == 0:
        flags.append(QAFlag(
            flag_type="missing_evidence",
            description="No evidence was provided to back up the report.",
            severity="high"
        ))
        passed = False

    return QAReviewResponse(flags=flags, passed=passed)

@app.post("/api/rewrite_report", response_model=RewriteResponse)
async def rewrite_report(request: RewriteRequest):
    """
    Mock implementation: Rewrites the report based on instructions.
    """
    if not request.draft_report.strip():
        raise HTTPException(status_code=400, detail="Draft report cannot be empty.")

    if not request.instructions.strip():
        raise HTTPException(status_code=400, detail="Instructions cannot be empty.")

    # Simulate AI processing time
    await asyncio.sleep(1.5)

    # In a real app we'd call an LLM here. We'll just do a simple string append for the mock.
    rewritten = request.draft_report + f"\n\n[AI Rewrite applied: {request.instructions}]"

    return RewriteResponse(rewritten_report=rewritten)
