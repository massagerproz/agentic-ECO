import React, { useState } from "react";
import axios from "axios";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

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
      setExtractedEvidence(response.data.evidence);
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
    <div style={{ padding: "1rem", border: "1px solid #ccc", marginBottom: "1rem" }}>
      <h2>Step 1: Extract Evidence from Notes</h2>
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
                <strong>{item.category}:</strong> {item.content}{" "}
                <button onClick={() => handleSaveToTracker(item)}>Save as Draft</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ExtractionUI;
