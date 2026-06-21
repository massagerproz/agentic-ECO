from pydantic import BaseModel, Field
from typing import List, Optional

class ExtractRequest(BaseModel):
    notes: str

class EvidenceItem(BaseModel):
    category: str = Field(description="One of: meeting notes, activity updates, stakeholder inputs, risks, decisions, follow-up actions")
    content: str
    source: str = "meeting_notes"

class ExtractResponse(BaseModel):
    evidence: List[EvidenceItem]

class GenerateReportRequest(BaseModel):
    approved_evidence: List[EvidenceItem]
    project_name: str = "Climate Project"

class GenerateReportResponse(BaseModel):
    draft_report: str

class QAReviewRequest(BaseModel):
    draft_report: str
    approved_evidence: List[EvidenceItem]

class QAFlag(BaseModel):
    flag_type: str = Field(description="e.g. unsupported_claim, weak_linkage, missing_evidence, overclaiming")
    description: str
    severity: str = Field(description="high, medium, low")

class QAReviewResponse(BaseModel):
    flags: List[QAFlag]
    passed: bool
