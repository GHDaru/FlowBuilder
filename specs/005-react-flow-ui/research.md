# Research: React Flow UI Refactor

## Decision: Backend-Frontend Integration
- **Chosen**: FastAPI for the Python backend to serve the React frontend.
- **Rationale**: FastAPI is modern, high-performance, and provides automatic OpenAPI documentation, making it easy for the React frontend to consume. It integrates well with the existing `aitest` structure.
- **Alternatives considered**: Flask (too minimal), Django (too heavy for this scope).

## Decision: Visual Flow Storage
- **Chosen**: Store Flow and Node definitions as JSON in the SQLite database (`audit.db`).
- **Rationale**: Keeps the configuration persistent and versionable alongside execution logs. The linear/digraph structure is simple enough for relational storage or a single JSON blob per Flow.
- **Implementation Detail**:
  - `flows` table: `id`, `name`, `created_at`.
  - `nodes` table: `id`, `flow_id`, `sequence_num`, `prompt_template`, `variables_json`, `output_schema_json`.

## Decision: Tracking and Telemetry
- **Chosen**: Extend `Execution` and `AuditLog` to support the new Tracking ID and granular status updates.
- **Rationale**: Reuses existing observability principles from the Constitution. 
- **Mapping**: 
  - `Execution` -> `Tracking` (1-to-1 for this feature's context).
  - Each Node execution generates an `AuditLog` entry.

## Decision: LLM Assistance for Node Creation
- **Chosen**: Use a specialized "System Architect" prompt with the existing IA Client.
- **Rationale**: Leverages existing infrastructure to provide the "Assist" feature.
- **Prompt Logic**: Provide the previous node's output schema and the user's intent to suggest the next node's prompt and schema.

## Decision: Visual Library
- **Chosen**: React Flow.
- **Rationale**: Confirmed by user. Industry standard for node-based UIs in React.
