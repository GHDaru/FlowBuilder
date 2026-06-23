# Data Model: React Flow UI Refactor

## Entities

### Flow (Aggregate Root)
The definition of a sequence of LLM interactions.
- **id**: UUID
- **name**: String
- **description**: String (Optional)
- **created_at**: DateTime
- **updated_at**: DateTime

### Node (Entity)
A single step within a Flow.
- **id**: UUID
- **flow_id**: UUID (FK to Flow)
- **sequence_num**: Integer (Execution order)
- **title**: String (e.g., "Metadata Extraction")
- **prompt_template**: Text (Supports `{{variable}}`)
- **variables**: List[String] (Extracted from prompt)
- **output_schema**: JSON (Expected JSON structure)

### Tracking (Entity)
A record of a single run for one Atendimento.
- **id**: UUID (Tracking ID)
- **atendimento_id**: String (Extracted from filename)
- **execution_id**: UUID (FK to Execution)
- **current_status**: String (ENUM: PENDING, PROCESSING, COMPLETED, ERROR)
- **started_at**: DateTime
- **ended_at**: DateTime

### TraceLog (Value Object / Entity)
Granular logs for each node execution within a Tracking.
- **id**: UUID
- **tracking_id**: UUID
- **node_id**: UUID
- **prompt_sent**: Text (Resolved variables)
- **response_raw**: Text
- **response_json**: JSON
- **status**: String (SUCCESS, ERROR)
- **error_message**: String (Optional)

## Storage Schema (SQLite)

- `flows`: `id (PK)`, `name`, `created_at`, `updated_at`
- `nodes`: `id (PK)`, `flow_id (FK)`, `seq`, `title`, `prompt`, `vars_json`, `schema_json`
- `trackings`: `id (PK)`, `atendimento_id`, `status`, `start`, `end`
- `trace_logs`: `id (PK)`, `tracking_id (FK)`, `node_id (FK)`, `prompt`, `raw`, `json`, `status`, `error`
