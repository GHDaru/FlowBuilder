# Feature Specification: Conditional Flows

**Feature Branch**: `011-conditional-flows`  
**Created**: 2026-06-02  
**Status**: Draft  
**Input**: User description: "implemente o fluxo condicional."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Define Conditional Logic in UI (Priority: P1)

As a Flow Builder, I want to add a "Condition Node" to my flow that allows me to route execution to different paths based on the output of a previous node.

**Why this priority**: It is the core requirement for implementing non-linear logic.

**Acceptance Scenarios**:
1. **Given** the flow editor, **When** I click the "Add Node" FAB, **Then** I SHOULD have the option to add a "Condition Node" (Router).
2. **Given** a Condition Node on the canvas, **When** I open its configuration sidebar, **Then** I MUST be able to define rules (e.g., "if `status` == 'OK'") and associate them with different output handles.
3. **Given** a configured Condition Node, **When** viewed on the canvas, **Then** it MUST display multiple output handles corresponding to the defined rules, plus a "Default" fallback handle.

---

### User Story 2 - LangGraph Conditional Execution (Priority: P1)

As an IA Evaluator, I want the execution engine to respect the visual conditional paths, so that the flow dynamically routes the text processing based on AI decisions.

**Why this priority**: Essential for the actual execution of the drawn logic.

**Independent Test**: Create a flow with an LLM Node that outputs `{"sentiment": "positive"}`. Connect it to a Condition Node that routes "positive" to Node A and "Default" to Node B. Execute the flow and verify that only Node A runs.

**Acceptance Scenarios**:
1. **Given** a compiled graph with conditional edges, **When** the `LangGraphAdapter` executes it, **Then** it MUST use LangGraph's `add_conditional_edges` mechanism.
2. **Given** a routing decision, **When** a condition is met, **Then** only the specific branch connected to that condition MUST be executed.
3. **Given** no conditions are met, **When** routing occurs, **Then** the execution MUST follow the "Default" fallback path.

---

### User Story 3 - TraceLog Observability for Branches (Priority: P2)

As a Developer, I want the TraceLog history to clearly show which path was taken during a conditional evaluation so that I can debug the routing logic.

**Why this priority**: Crucial for auditing and understanding why the AI took a specific path.

**Acceptance Scenarios**:
1. **Given** a completed execution with a Condition Node, **When** I view the History trace, **Then** the Condition Node MUST log its evaluated decision (e.g., "Routed to Node X based on rule Y").

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Implement a new React Flow node type: `ConditionNode`.
- **FR-002**: The `ConditionNode` MUST allow defining multiple conditional rules based on state variables (e.g., checking if an output key matches a value).
- **FR-003**: The `ConditionNode` MUST dynamically render output handles (`source`) for each defined rule, plus a default handle.
- **FR-004**: The `GraphCompiler` MUST parse the `ConditionNode` and its specific edges, storing the routing map.
- **FR-005**: The `LangGraphAdapter` MUST translate the parsed routing map into an internal router function and apply it via `workflow.add_conditional_edges()`.
- **FR-006**: The router function MUST log its decision to the `TraceLog` using the `log_callback` before returning the next node ID.

### Key Entities *(include if feature involves data)*

- **Node (Updated)**: Nodes can now be of type `condition`. Their data will include an array of `rules` (e.g., `[{ variable: "sentiment", operator: "equals", value: "positive", targetHandle: "rule-1" }]`).
- **Edge (Updated)**: Edges connected from a `ConditionNode` MUST specify which `sourceHandle` they originate from to map correctly to the rules.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A flow with conditional branching executes successfully from start to finish.
- **SC-002**: The skipped branch of a conditional flow consumes exactly 0 tokens (verifiable in TraceLog).
- **SC-003**: The History UI displays the evaluation result of the Condition Node.

## Assumptions

- **Rules Engine**: The initial implementation for the `ConditionNode` will support simple string equality checks against the `GraphState` outputs (e.g., `state["outputs"]["key"] == "value"`). Complex expressions (like regex or greater-than) can be added in future iterations.
- **Single Router Output**: A Condition Node routes to exactly ONE subsequent node (or ends the flow). Parallel execution (routing to multiple nodes simultaneously) is out of scope for this specific feature.
