import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";

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
              <AnimatePresence>
                {allEvidence.filter(e => e.status === "draft").map(e => (
                  <motion.li
                    key={e._id}
                    style={{fontSize: "0.85rem"}}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <strong>{e.category}</strong>: {e.content}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
          <div>
            <h3>Approved</h3>
            <ul>
              <AnimatePresence>
                {allEvidence.filter(e => e.status === "approved").map(e => (
                  <motion.li
                    key={e._id}
                    style={{fontSize: "0.85rem", borderLeft: "3px solid var(--primary)"}}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <strong>{e.category}</strong>: {e.content}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
          <div>
            <h3>Rejected</h3>
            <ul>
              <AnimatePresence>
                {allEvidence.filter(e => e.status === "rejected").map(e => (
                  <motion.li
                    key={e._id}
                    style={{fontSize: "0.85rem", borderLeft: "3px solid var(--danger)"}}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <strong>{e.category}</strong>: {e.content}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvidenceTrackerUI;
