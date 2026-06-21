# CLEAR Climate OS/ERP - Feature Module

This is an isolated feature module for CLEAR Climate OS/ERP, providing a proof-of-work application that structures meeting notes into reporting evidence, allows human review, generates reports, and runs QA checks.

## Architecture

- **Backend**: Python + FastAPI
  - Models: Pydantic schemas (`models.py`)
  - Endpoints: Extract notes, generate reports, run QA (`main.py`)
- **Frontend**: React + Vite + TypeScript, using **Framer Motion** for polished entrance animations and interactive microinteractions (hover/tap states).
- **State/Database**: Convex (Real-time tracking of drafted and approved evidence, and generated reports). Components utilize `AnimatePresence` to smoothly animate evidence moving between columns.

## Quickstart

### 1. Run the Backend

```bash
cd climate_os/backend
pip install -r requirements.txt
uvicorn main:app --port 8000
```
Backend will be available at `http://127.0.0.1:8000`. You can view the API docs at `http://127.0.0.1:8000/docs`.

### 2. Run the Frontend & Convex

In a separate terminal:

```bash
cd climate_os/frontend
npm install
npx convex dev
```

In another terminal, start the Vite server:

```bash
cd climate_os/frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## Demo Loop Workflow

1. **Extract**: Paste notes in the Extraction UI and click "Extract Evidence". Extracted drafts are shown.
2. **Draft**: Click "Save as Draft" for an extracted item to push it to the Convex tracker as a draft.
3. **Approve**: In the Approval UI, review drafts and click "Approve". Only approved items can be used for reporting.
4. **Generate**: In the Report UI, click "Generate Donor Report" to draft a report using all approved evidence.
5. **QA Review**: Click "Run QA Review" to run heuristic checks on the drafted report (e.g., flagging overclaims like "100% perfect").
6. **Save**: Save the report to the Convex datastore.

## Tests

To run backend tests:

```bash
cd climate_os/backend
pytest
```
