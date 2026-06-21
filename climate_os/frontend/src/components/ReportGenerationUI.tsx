import React, { useState } from "react";
import axios from "axios";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { GenerateReportResponseSchema, QAReviewResponseSchema } from "../schemas";
import { motion, AnimatePresence } from "framer-motion";

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
      const parsed = GenerateReportResponseSchema.parse(response.data);
      setDraftReport(parsed.draft_report);
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
      const parsed = QAReviewResponseSchema.parse(response.data);
      setQaResult(parsed);
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
    <div className="card">
      <h2>Step 3 & 4: Generate Report & QA Review</h2>
      <p>Uses {approvedEvidence.length} approved evidence items.</p>

      <motion.button
        onClick={handleGenerate}
        disabled={isLoading || approvedEvidence.length === 0}
        whileHover={!(isLoading || approvedEvidence.length === 0) ? { scale: 1.02 } : {}}
        whileTap={!(isLoading || approvedEvidence.length === 0) ? { scale: 0.98 } : {}}
      >
        {isLoading ? "Generating..." : "Generate Donor Report"}
      </motion.button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <AnimatePresence>
        {draftReport && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            style={{ marginTop: "1rem" }}
          >
            <h3>Draft Report</h3>
            <pre style={{ background: "#f5f5f5", padding: "1rem", whiteSpace: "pre-wrap", color: "black" }}>
              {draftReport}
            </pre>

            <div style={{ marginTop: "1rem" }}>
               <motion.button
                 onClick={handleRunQA}
                 disabled={qaIsLoading}
                 style={{ marginRight: "1rem" }}
                 whileHover={!qaIsLoading ? { scale: 1.05 } : {}}
                 whileTap={!qaIsLoading ? { scale: 0.95 } : {}}
               >
                 {qaIsLoading ? "Running QA..." : "Run QA Review"}
               </motion.button>
               <motion.button
                 onClick={handleSaveReport}
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
               >
                 Save Report
               </motion.button>
            </div>

            <AnimatePresence>
              {qaResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`qa-box ${qaResult.passed ? 'passed' : 'failed'}`}
                >
                  <h4 style={{marginTop: 0}}>QA Results</h4>
                  <p style={{margin: "0.5rem 0", fontWeight: 600}}>
                    Status: {qaResult.passed ? <span style={{color: "var(--success)"}}>Passed</span> : <span style={{color: "var(--danger)"}}>Failed</span>}
                  </p>

                  {qaResult.flags.length > 0 && (
                    <ul>
                      {qaResult.flags.map((flag: any, index: number) => (
                        <li key={index}>
                          <strong>{flag.flag_type}</strong> ({flag.severity}): {flag.description}
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportGenerationUI;
