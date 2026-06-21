import React, { useState } from "react";
import axios from "axios";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ExtractResponseSchema } from "../schemas";

const ExtractionUI: React.FC = () => {
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedEvidence, setExtractedEvidence] = useState<any[]>([]);
  const addEvidence = useMutation(api.functions.addEvidence);

  const handleExtract = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";
      const response = await axios.post(`${backendUrl}/api/extract`, {
        notes,
      });
      const parsed = ExtractResponseSchema.parse(response.data);
      setExtractedEvidence(parsed.evidence);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "Failed to extract");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToTracker = async (evidenceItem: any) => {
    try {
      await addEvidence({
        category: evidenceItem.category,
        content: evidenceItem.content,
        source: evidenceItem.source,
        status: "draft",
      });
      alert("Added to tracker as draft!");
    } catch (err: any) {
      alert("Failed to save: " + err.message);
    }
  };

  return (
    <div className="card">
      <h2>Step 1: Extract Evidence from Notes</h2>
      <p>Paste raw meeting notes, updates, or inputs to let AI structure them.</p>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={8}
        cols={60}
        placeholder="Paste meeting notes or updates here..."
        style={{ width: "100%", marginBottom: "1rem" }}
      />
      <br />
      <button onClick={handleExtract} disabled={isLoading}>
        {isLoading ? "Extracting..." : "Extract Evidence"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {extractedEvidence.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Extracted Drafts (AI Output)</h3>
          <ul>
            {extractedEvidence.map((item, index) => (
              <li key={index} style={{ marginBottom: "0.5rem" }}>
                <div>
                  <span className="status-badge status-draft" style={{marginRight: "0.5rem"}}>{item.category}</span>
                  {item.content}
                </div>
                <button className="secondary" style={{marginTop: "0.5rem"}} onClick={() => handleSaveToTracker(item)}>Save as Draft</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ExtractionUI;
