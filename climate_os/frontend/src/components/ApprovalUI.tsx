import React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const ApprovalUI: React.FC = () => {
  const drafts = useQuery(api.functions.getEvidence, { status: "draft" });
  const updateStatus = useMutation(api.functions.updateEvidenceStatus);

  if (drafts === undefined) {
    return <div>Loading drafts...</div>;
  }

  const handleApprove = async (id: any) => {
    await updateStatus({ id, status: "approved" });
  };

  const handleReject = async (id: any) => {
    await updateStatus({ id, status: "rejected" });
  };

  return (
    <div style={{ padding: "1rem", border: "1px solid #ccc", marginBottom: "1rem" }}>
      <h2>Step 2: Human Review & Approval</h2>
      <p>Only approved evidence enters the tracker for reporting.</p>

      {drafts.length === 0 ? (
        <p>No drafts pending review.</p>
      ) : (
        <ul>
          {drafts.map((draft) => (
            <li key={draft._id} style={{ marginBottom: "0.5rem" }}>
              <strong>{draft.category}</strong>: {draft.content}
              <div style={{ marginTop: "0.25rem" }}>
                <button onClick={() => handleApprove(draft._id)} style={{ marginRight: "0.5rem", color: "green" }}>
                  Approve
                </button>
                <button onClick={() => handleReject(draft._id)} style={{ color: "red" }}>
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ApprovalUI;
