import { ConvexProvider, ConvexReactClient } from "convex/react";
import ExtractionUI from './components/ExtractionUI';
import ApprovalUI from './components/ApprovalUI';
import ReportGenerationUI from './components/ReportGenerationUI';

const convexUrl = import.meta.env.VITE_CONVEX_URL as string;
const convex = new ConvexReactClient(convexUrl);

function App() {
  return (
    <ConvexProvider client={convex}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>CLEAR Climate OS/ERP Demo</h1>
        <p>Proof-of-work application for structured reporting evidence workflow.</p>

        <ExtractionUI />
        <ApprovalUI />
        <ReportGenerationUI />
      </div>
    </ConvexProvider>
  )
}

export default App
