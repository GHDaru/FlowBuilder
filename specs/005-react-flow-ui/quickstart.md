# Quickstart: React Flow UI Refactor

## Setup Environment

### Backend
1. Navigate to `aitest/backend/`:
   ```bash
   uv sync
   ```
2. Start the FastAPI server:
   ```bash
   uv run python main.py
   ```

### Frontend
1. Navigate to `aitest/frontend/`:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

## How to use

### 1. Build a Flow
- Open the dashboard at `http://localhost:5173`.
- Go to the **Flow Builder** tab.
- Add nodes representing LLM steps.
- Configure the prompt (use `{{}}` for variables) and the expected JSON output.
- Assign sequence numbers to define the order.

### 2. Run an Execution
- Go to the **Batch Runner** tab.
- Enter the source folder path (e.g., `data/test_samples`).
- Click **Start Execution**.
- Monitor the real-time progress for each "Tracking ID" extracted from the filenames.

### 3. Review History
- Go to the **History** tab to see all previous runs.
- Click on a Tracking ID to see the full trace of prompts and responses.
