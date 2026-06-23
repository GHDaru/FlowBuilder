# Research: Flow Management and LangGraph Integration

## Decision: Visual-to-Logical Graph Translation
- **Chosen**: Infrastructure-layer `LangGraphAdapter`.
- **Rationale**: Keeps the core domain free of dependencies on specific graph libraries. The adapter will parse the `json_definition` (from React Flow) and build the `StateGraph` object.
- **Node Logic**: Each React Flow node will map to a LangGraph node that:
  1. Extracts required variables from the shared state.
  2. Renders the prompt template.
  3. Calls the LLM.
  4. Updates the shared state with the JSON output.

## Decision: Deep Copy Strategy
- **Chosen**: Create a new `Flow` Aggregate Root in the backend, copying the `json_definition` and assigning a new UUID and name.
- **Rationale**: "Save As" and "Copy" should create independent entities to allow diverging versions.

## Decision: Start Node UX
- **Chosen**: Dedicated "Start Node" component in React Flow.
- **Rationale**: Provides the best UX by visually anchoring the beginning of the flow. In the backend, this node will be identified by its `type: "start"` and mapped to `set_entry_point` in LangGraph.

## Decision: Node Handles
- **Chosen**: Custom Node components using `Handle` from `reactflow` with `position={Position.Left}` for Targets and `position={Position.Right}` for Sources.
- **Rationale**: Directly fulfills the user requirement for Left-to-Right progression.
