# Quickstart: Flow Management and LangGraph Integration

## Setup

1. **Install Backend Dependencies**:
   ```bash
   cd backend
   uv add langgraph langchain
   uv sync
   ```

2. **Run Backend**:
   ```bash
   uv run python main.py
   ```

3. **Run Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

## Workflow

### 1. Managing Flows
- Use the **"Novo"** button in the Flow Builder toolbar to start from scratch.
- Use **"Carregar"** to see a list of saved flows.
- Use **"Salvar Como"** to duplicate a flow under a new name.

### 2. Creating a Graph
- Drag a **"Start Node"** into the canvas.
- Drag **"LLM Nodes"** and connect the **right handle** of one to the **left handle** of the next.
- Configure prompts and schemas in the sidebar.

### 3. Execution
- LangGraph will automatically build the `StateGraph` from your visual connections.
- The `Tracking` tab will show the step-by-step execution managed by LangGraph.
