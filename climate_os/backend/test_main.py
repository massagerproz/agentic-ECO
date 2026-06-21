import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_extract_endpoint_success():
    response = client.post("/api/extract", json={"notes": "We had a meeting. A decision was made. Also an action item."})
    assert response.status_code == 200
    data = response.json()
    assert "evidence" in data
    assert len(data["evidence"]) >= 1

def test_extract_endpoint_empty():
    response = client.post("/api/extract", json={"notes": "   "})
    assert response.status_code == 400

def test_generate_report_endpoint():
    evidence = [
        {"category": "decisions", "content": "Approved budget.", "source": "notes"},
        {"category": "risks", "content": "Delay in delivery.", "source": "notes"}
    ]
    response = client.post("/api/generate_report", json={
        "approved_evidence": evidence,
        "project_name": "Test Project"
    })
    assert response.status_code == 200
    data = response.json()
    assert "Test Project" in data["draft_report"]
    assert "Approved budget." in data["draft_report"]

def test_qa_review_endpoint_passed():
    evidence = [{"category": "decisions", "content": "Approved budget.", "source": "notes"}]
    report = "The project is going well. We approved the budget."
    response = client.post("/api/qa_review", json={
        "approved_evidence": evidence,
        "draft_report": report
    })
    assert response.status_code == 200
    data = response.json()
    assert data["passed"] is True
    assert len(data["flags"]) == 0

def test_qa_review_endpoint_failed():
    evidence = [{"category": "decisions", "content": "Approved budget.", "source": "notes"}]
    report = "The project is going 100% perfect."
    response = client.post("/api/qa_review", json={
        "approved_evidence": evidence,
        "draft_report": report
    })
    assert response.status_code == 200
    data = response.json()
    assert data["passed"] is False
    assert len(data["flags"]) > 0
    assert data["flags"][0]["flag_type"] == "overclaiming"
