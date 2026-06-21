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
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

function App() {
  return (
    <ConvexProvider client={convex}>
      {/* Background Animated Blobs for Glassmorphism Context */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0]
        }}
        transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
        style={{
          position: "fixed",
          top: "-10%",
          left: "-10%",
          width: "50vw",
          height: "50vw",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, rgba(0,0,0,0) 70%)",
          borderRadius: "50%",
          zIndex: -1,
          filter: "blur(40px)"
        }}
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -60, 0],
          y: [0, -40, 0]
        }}
        transition={{ repeat: Infinity, duration: 20, ease: "easeInOut", delay: 2 }}
        style={{
          position: "fixed",
          bottom: "-10%",
          right: "-10%",
          width: "60vw",
          height: "60vw",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(0,0,0,0) 70%)",
          borderRadius: "50%",
          zIndex: -1,
          filter: "blur(60px)"
        }}
      />

      <motion.div
        style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem", fontFamily: "sans-serif", position: "relative", zIndex: 1 }}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants}>
          <h1>CLEAR Climate OS/ERP Demo</h1>
          <p>Proof-of-work application for structured reporting evidence workflow.</p>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }}><ExtractionUI /></motion.div>
        <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }}><ApprovalUI /></motion.div>
        <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }}><EvidenceTrackerUI /></motion.div>
        <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }}><ReportGenerationUI /></motion.div>
      </motion.div>
    </ConvexProvider>
  )
}

export default App
