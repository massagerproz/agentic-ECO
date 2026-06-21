import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const EvidenceTrackerUI: React.FC = () => {
  const allEvidence = useQuery(api.functions.getEvidence, {});

  if (allEvidence === undefined) {
    return <div>Loading tracker...</div>;
  }

  return (
    <div className="card">
      <h2>Evidence Master Tracker</h2>
      <p>Global view of all extracted structured data.</p>

      {allEvidence.length === 0 ? (
        <p>No evidence found.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
          <div>
            <h3>Drafts</h3>
            <ul>
              {allEvidence.filter(e => e.status === "draft").map(e => (
                <li key={e._id} style={{fontSize: "0.85rem"}}>
                  <strong>{e.category}</strong>: {e.content}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Approved</h3>
            <ul>
              {allEvidence.filter(e => e.status === "approved").map(e => (
                <li key={e._id} style={{fontSize: "0.85rem", borderLeft: "3px solid var(--primary)"}}>
                  <strong>{e.category}</strong>: {e.content}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Rejected</h3>
            <ul>
              {allEvidence.filter(e => e.status === "rejected").map(e => (
                <li key={e._id} style={{fontSize: "0.85rem", borderLeft: "3px solid var(--danger)"}}>
                  <strong>{e.category}</strong>: {e.content}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvidenceTrackerUI;
