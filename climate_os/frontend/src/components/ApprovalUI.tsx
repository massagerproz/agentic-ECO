import React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";

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
          <AnimatePresence>
            {drafts.map((draft) => (
              <motion.li
                key={draft._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              >
                <div style={{marginBottom: "0.5rem"}}>
                   <span className="status-badge status-draft" style={{marginRight: "0.5rem"}}>{draft.category}</span>
                   {draft.content}
                </div>
                <div>
                  <motion.button
                    className="success"
                    onClick={() => handleApprove(draft._id)}
                    style={{ marginRight: "0.5rem" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Approve
                  </motion.button>
                  <motion.button
                    className="danger"
                    onClick={() => handleReject(draft._id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Reject
                  </motion.button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
};

export default ApprovalUI;
