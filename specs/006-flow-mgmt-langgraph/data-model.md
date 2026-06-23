# Data Model: Flow Management and LangGraph Integration

## Updated Entities

### Flow (Aggregate Root)
The definition of a sequence of LLM interactions.
- **id**: UUID
- **name**: String
- **description**: String
- **json_definition**: JSON (Contains React Flow's `nodes` and `edges`)
- **created_at**: DateTime
- **updated_at**: DateTime

### Node (Value Object in JSON)
Stored within `json_definition.nodes`.
- **id**: String
- **type**: String ("llm_step", "start")
- **position**: {x, y}
- **data**:
  - **title**: String
  - **prompt_template**: Text
  - **variables**: List[String]
  - **output_schema**: JSON

### Edge (Value Object in JSON)
Stored within `json_definition.edges`.
- **id**: String
- **source**: NodeID
- **target**: NodeID

## LangGraph State Model

The state dictionary passed between nodes:
```json
{
  "atendimento_content": "raw text...",
  "node_outputs": {
    "node_1_id": { ... },
    "node_2_id": { ... }
  },
  "current_node": "node_id"
}
```

## Storage Schema (SQLite)

Update the `flows` table:
- `flows`: `id (PK)`, `name`, `description`, `json_definition (TEXT/JSON)`, `created_at`, `updated_at`
- *Note: The separate `nodes` table from previous specs will be deprecated in favor of the unifed `json_definition` to maintain synchronization between layout and logic.*
