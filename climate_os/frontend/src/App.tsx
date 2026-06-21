import { ConvexProvider, ConvexReactClient } from "convex/react";
import { motion } from "framer-motion";
import ExtractionUI from './components/ExtractionUI';
import ApprovalUI from './components/ApprovalUI';
import ReportGenerationUI from './components/ReportGenerationUI';
import EvidenceTrackerUI from './components/EvidenceTrackerUI';

const convexUrl = import.meta.env.VITE_CONVEX_URL as string;
const convex = new ConvexReactClient(convexUrl);

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

import type { Variants } from "framer-motion";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function App() {
  return (
    <ConvexProvider client={convex}>
      <motion.div
        style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem", fontFamily: "sans-serif" }}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants}>
          <h1>CLEAR Climate OS/ERP Demo</h1>
          <p>Proof-of-work application for structured reporting evidence workflow.</p>
        </motion.div>

        <motion.div variants={itemVariants}><ExtractionUI /></motion.div>
        <motion.div variants={itemVariants}><ApprovalUI /></motion.div>
        <motion.div variants={itemVariants}><EvidenceTrackerUI /></motion.div>
        <motion.div variants={itemVariants}><ReportGenerationUI /></motion.div>
      </motion.div>
    </ConvexProvider>
  )
}

export default App
