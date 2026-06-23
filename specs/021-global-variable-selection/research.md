# Research: global-variable-selection

## Decision: Data Storage
The selection of global variables will be stored within the `json_definition` of the `Flow` entity. Specifically, the data will reside in the `data` property of the node with `type: 'start'`.

- **Field**: `nodes[type='start'].data.selected_globals`
- **Format**: `List[str]` (IDs of the variables)

## Decision: Backend Integration
A new service and endpoint will be created to provide the list of available global variables. For now, this will be a static list derived from the domain (Atendimento metadata), but designed to be extensible.

- **Endpoint**: `GET /official/variables`
- **Returns**: `List[Dict]` with `id`, `label`, `description`.

## Decision: Frontend Component
The `Sidebar.tsx` component will be updated to handle the `start` node type. When a start node is selected, it will display a checklist of global variables fetched from the new backend endpoint.

## Decision: Execution Logic
The `FlowExecutionUseCase` and `LangGraphAdapter` were updated. The `start` node function in `LangGraphAdapter` reads the `selected_globals` and populates the `outputs` state with values from `initial_metadata`.

- **Input Provider Pattern**: Instead of hardcoding content injection, the system now uses an `initial_metadata` dictionary passed to the executor.
  - **Local Files**: Injects `atendimento` from file content.
  - **Official DB**: Injects `atendimento`, `contabilidade_nome`, `cliente_nome`, etc., from PostgreSQL.

## Decision: Graph Compilation
The `GraphCompiler` service was updated to explicitly extract `selected_globals` from the visual JSON nodes. This ensures that the execution engine receives the user's selection stored in the start node.

## Alternatives Considered
- **New Table for Global Variables**: Rejected for now to keep the `aitest` schema simple. Storing in the flow JSON is sufficient for a lab environment.
- **Global Config in Flow root**: Rejected. Using the `start` node is more intuitive as it represents the "Input" phase of the flow.
