# Data Model: global-variable-selection

## Entities

### GlobalVariable (Value Object)
Represents a predefined variable available for injection into flows.
- `id`: string (unique identifier, e.g., "contabilidade_nome")
- `label`: string (display name)
- `description`: string (explanation of what it contains)

### Node (Extension)
The `data` property of nodes with `type: 'start'` now includes:
- `selected_globals`: `List[str]` - IDs of the variables the user wants to enable.

## Relationships
- **Flow** has one **Start Node**.
- **Start Node** references multiple **GlobalVariables** by ID.
- **LLM Nodes** can reference these variables in their `prompt_template` using `{{variable_id}}`.

## State Changes
During execution, the `outputs` dictionary in the `GraphState` will be initialized with the values of the `selected_globals` fetched from the `OfficialAtendimento` record.
