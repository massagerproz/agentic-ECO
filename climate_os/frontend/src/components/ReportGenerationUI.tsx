import React, { useState } from "react";
import axios from "axios";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const ReportGenerationUI: React.FC = () => {
  const approvedEvidence = useQuery(api.functions.getEvidence, { status: "approved" });
  const saveReport = useMutation(api.functions.saveReport);

  const [draftReport, setDraftReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // QA state
  const [qaIsLoading, setQaIsLoading] = useState(false);
  const [qaResult, setQaResult] = useState<any>(null);

  if (approvedEvidence === undefined) {
    return <div>Loading approved evidence...</div>;
  }

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setQaResult(null);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";
      const response = await axios.post(`${backendUrl}/api/generate_report`, {
        approved_evidence: approvedEvidence,
        project_name: "Demo Climate Project"
      });
      setDraftReport(response.data.draft_report);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "Failed to generate report");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunQA = async () => {
    if (!draftReport) return;

    setQaIsLoading(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";
      const response = await axios.post(`${backendUrl}/api/qa_review`, {
        draft_report: draftReport,
        approved_evidence: approvedEvidence,
      });
      setQaResult(response.data);
    } catch (err: any) {
      alert("QA failed: " + (err.response?.data?.detail || err.message));
    } finally {
      setQaIsLoading(false);
    }
  };

  const handleSaveReport = async () => {
    if (!draftReport) return;
    try {
      await saveReport({
        projectName: "Demo Climate Project",
        draftReport: draftReport,
        status: "draft",
      });
      alert("Report saved to database!");
    } catch (err: any) {
      alert("Failed to save report: " + err.message);
    }
  };

  return (
    <div style={{ padding: "1rem", border: "1px solid #ccc", marginBottom: "1rem" }}>
      <h2>Step 3 & 4: Generate Report & QA Review</h2>
      <p>Uses {approvedEvidence.length} approved evidence items.</p>

      <button onClick={handleGenerate} disabled={isLoading || approvedEvidence.length === 0}>
        {isLoading ? "Generating..." : "Generate Donor Report"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {draftReport && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Draft Report</h3>
          <pre style={{ background: "#f5f5f5", padding: "1rem", whiteSpace: "pre-wrap", color: "black" }}>
            {draftReport}
          </pre>

          <div style={{ marginTop: "1rem" }}>
             <button onClick={handleRunQA} disabled={qaIsLoading} style={{ marginRight: "1rem" }}>
               {qaIsLoading ? "Running QA..." : "Run QA Review"}
             </button>
             <button onClick={handleSaveReport}>
               Save Report
             </button>
          </div>

          {qaResult && (
            <div style={{ marginTop: "1rem", padding: "1rem", border: "1px dashed red" }}>
              <h4>QA Results</h4>
              <p>Status: {qaResult.passed ? <span style={{color: "green"}}>Passed</span> : <span style={{color: "red"}}>Failed</span>}</p>

              {qaResult.flags.length > 0 && (
                <ul>
                  {qaResult.flags.map((flag: any, index: number) => (
                    <li key={index}>
                      <strong>{flag.flag_type}</strong> ({flag.severity}): {flag.description}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportGenerationUI;
