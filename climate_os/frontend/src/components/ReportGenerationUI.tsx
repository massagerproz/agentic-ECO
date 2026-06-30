import React, { useState } from "react";
import axios from "axios";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { GenerateReportResponseSchema, QAReviewResponseSchema, RewriteResponseSchema } from "../schemas";
import type { QAReviewResponse, QAFlag } from "../schemas";
import { motion, AnimatePresence } from "framer-motion";

const ReportGenerationUI: React.FC = () => {
  const approvedEvidence = useQuery(api.functions.getEvidence, { status: "approved" });
  const saveReport = useMutation(api.functions.saveReport);

  const [draftReport, setDraftReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // QA state
  const [qaIsLoading, setQaIsLoading] = useState(false);
  const [qaResult, setQaResult] = useState<QAReviewResponse | null>(null);

  // Rewrite state
  const [rewriteInstructions, setRewriteInstructions] = useState("");
  const [rewriteIsLoading, setRewriteIsLoading] = useState(false);

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
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } }, message?: string };
      setError(error.response?.data?.detail || error.message || "Failed to generate report");
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
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } }, message?: string };
      alert("QA failed: " + (error.response?.data?.detail || error.message));
    } finally {
      setQaIsLoading(false);
    }
  };

  const handleRewrite = async () => {
    if (!draftReport || !rewriteInstructions.trim()) return;

    setRewriteIsLoading(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";
      const response = await axios.post(`${backendUrl}/api/rewrite_report`, {
        draft_report: draftReport,
        instructions: rewriteInstructions,
      });
      const parsed = RewriteResponseSchema.parse(response.data);
      setDraftReport(parsed.rewritten_report);
      setRewriteInstructions("");
      setQaResult(null); // Clear QA since report changed
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } }, message?: string };
      alert("Rewrite failed: " + (error.response?.data?.detail || error.message));
    } finally {
      setRewriteIsLoading(false);
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
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } }, message?: string };
      alert("Failed to save report: " + error.message);
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
        {isLoading ? (
          <span style={{display: "flex", alignItems: "center"}}>
            Generating Draft... <span className="loader">✨</span>
          </span>
        ) : "Generate Donor Report"}
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <textarea
                value={draftReport}
                onChange={(e) => setDraftReport(e.target.value)}
                style={{
                  background: "rgba(0,0,0,0.4)",
                  padding: "1rem",
                  color: "#f8fafc",
                  width: "100%",
                  minHeight: "200px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                  fontSize: "0.875rem"
                }}
              />
            </motion.div>

            <div style={{ marginTop: "1rem", background: "rgba(255, 255, 255, 0.05)", padding: "1rem", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <h4 style={{marginTop: 0}}>AI Rewrite</h4>
              <div style={{ display: "flex", gap: "1rem" }}>
                <input
                  type="text"
                  value={rewriteInstructions}
                  onChange={(e) => setRewriteInstructions(e.target.value)}
                  placeholder="e.g. Make it more formal, fix typos, emphasize risks..."
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    borderRadius: "6px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    background: "rgba(255, 255, 255, 0.1)",
                    color: "white"
                  }}
                />
                <motion.button
                  onClick={handleRewrite}
                  disabled={rewriteIsLoading || !rewriteInstructions.trim()}
                  whileHover={!(rewriteIsLoading || !rewriteInstructions.trim()) ? { scale: 1.05 } : {}}
                  whileTap={!(rewriteIsLoading || !rewriteInstructions.trim()) ? { scale: 0.95 } : {}}
                  className="secondary"
                >
                  {rewriteIsLoading ? (
                    <span style={{display: "flex", alignItems: "center"}}>
                      Rewriting... <span className="loader">✨</span>
                    </span>
                  ) : "Rewrite"}
                </motion.button>
              </div>
            </div>

            <div style={{ marginTop: "1rem" }}>
               <motion.button
                 onClick={handleRunQA}
                 disabled={qaIsLoading}
                 style={{ marginRight: "1rem" }}
                 whileHover={!qaIsLoading ? { scale: 1.05 } : {}}
                 whileTap={!qaIsLoading ? { scale: 0.95 } : {}}
               >
                 {qaIsLoading ? (
                   <span style={{display: "flex", alignItems: "center"}}>
                     Running checks... <span className="loader">🔍</span>
                   </span>
                 ) : "Run QA Review"}
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
                      {qaResult.flags.map((flag: QAFlag, index: number) => (
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
