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
    <div className="card">
      <h2>Step 2: Human Review & Approval</h2>
      <p>Only approved evidence enters the tracker for reporting.</p>

      {drafts.length === 0 ? (
        <p>No drafts pending review.</p>
      ) : (
        <ul>
          {drafts.map((draft) => (
            <li key={draft._id}>
              <div style={{marginBottom: "0.5rem"}}>
                 <span className="status-badge status-draft" style={{marginRight: "0.5rem"}}>{draft.category}</span>
                 {draft.content}
              </div>
              <div>
                <button className="success" onClick={() => handleApprove(draft._id)} style={{ marginRight: "0.5rem" }}>
                  Approve
                </button>
                <button className="danger" onClick={() => handleReject(draft._id)}>
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
