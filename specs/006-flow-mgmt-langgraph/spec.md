# Feature Specification: Flow Management and LangGraph Integration

**Feature Branch**: `006-flow-mgmt-langgraph`  
**Created**: 2026-05-31  
**Status**: Draft  
**Input**: User description: "NO lab visual, eu desejo adicionar um novo fluxo a partir do zero, a partir de uma cópia e salvar como. Ser possível visualizar os fluxos salvos e carregá-los. No visual permitir ligá-los, assim, os pontinhos deve ser da esquerda para direita nos nós. O modelo deveria ser um json que deveria iniciar no langgraph que o código monta para ser executado."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Flow Lifecycle Management (Priority: P1)

As an AI Researcher, I want to create, copy, and rename flows so that I can experiment with different evaluation versions without losing previous work.

**Why this priority**: Fundamental for iteration and versioning in the AI Visual Lab.

**Independent Test**: Create a flow, save it, click "Copy", save as a new name, and verify both exist in the list with identical node structures but different names.

**Acceptance Scenarios**:
1. **Given** a "New Flow" button, **When** clicked, **Then** the canvas should clear and reset to a default state.
2. **Given** an existing flow, **When** I click "Salvar como...", **Then** the system should prompt for a new name and create a new record in the database.
3. **Given** a list of saved flows, **When** I select one, **Then** it should load all its nodes and edges correctly into the React Flow canvas.

---

### User Story 2 - Visual Left-to-Right Connections (Priority: P2)

As a UI user, I want nodes to have connection points on their left and right sides so that the visual flow follows a standard horizontal logical progression.

**Why this priority**: Enhanced UX and alignment with industry standards for directed graphs.

**Independent Test**: Add two nodes and connect the right handle of node A to the left handle of node B.

**Acceptance Scenarios**:
1. **Given** a custom node type, **When** rendered, **Then** it must have a Target handle on the left and a Source handle on the right.
2. **Given** a connection attempt, **When** dragging from right to left, **Then** a visual edge should be created.

---

### User Story 3 - LangGraph Execution Integration (Priority: P1)

As a Developer, I want the visual flow (JSON) to be automatically assembled into a LangGraph structure in the backend so that the execution logic is robust and state-managed.

**Why this priority**: Enables complex graph logic (cycles, conditions, state management) using a production-grade framework.

**Independent Test**: Define a 2-node flow in the UI, click "Execute", and verify the backend logs show LangGraph nodes being invoked in the correct sequence.

**Acceptance Scenarios**:
1. **Given** a flow JSON with nodes and edges, **When** a run is triggered, **Then** the backend MUST instantiate a `langgraph.graph.StateGraph`.
2. **Given** edges in the JSON, **When** the graph is built, **Then** they MUST be added as `add_edge(source, target)` in the LangGraph instance.

---

### Edge Cases

- **Multiple Starts**: What if the graph has multiple nodes with no incoming edges? (Assumption: Only one "Start" node is allowed, or all roots are treated as parallel start points).
- **Broken JSON on Load**: How to handle corrupted flow data in the DB? (Requirement: Show a validation error and offer to reset the flow).
- **Renaming to Existing Name**: Prevent overwriting existing flows during "Save As" without confirmation.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a "New", "Save", and "Save As" toolbar in the Flow Builder.
- **FR-002**: System MUST provide a "Load Flow" modal or list to browse saved definitions.
- **FR-003**: React Flow nodes MUST use Left (Target) and Right (Source) handles.
- **FR-004**: System MUST store flow definitions as a JSON structure that includes both visual layout (positions) and execution logic (prompts, schemas).
- **FR-005**: Backend MUST implement a factory or builder to convert Flow JSON into a Runnable LangGraph object.
- **FR-006**: System MUST support duplicating an entire flow structure including all metadata.

### Key Entities *(include if feature involves data)*

- **Flow (updated)**: Now includes a `json_definition` blob containing React Flow nodes, edges, and node metadata.
- **LangGraph State**: The shared dictionary passed between nodes during execution.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Loading a 10-node flow takes less than 800ms.
- **SC-002**: "Save As" operation creates a perfect deep copy of the original flow (including prompts) in one click.
- **SC-003**: 100% of visual edges in the UI are correctly translated to LangGraph edges in the execution trace.

## Assumptions

- **Deep Copy**: "Save As" and "Copy" will generate new UUIDs for the flow but keep node logic identical.
- **LangGraph Model**: The backend will use `langgraph.graph.StateGraph` and nodes will be generic LLM wrappers that take the state and return updated fields.
- **Horizontal Layout**: Users prefer a horizontal flow, so auto-layout (if implemented) should follow LR orientation.

## Architectural Design (DDD + Hexagonal)

To maintain consistency with the project constitution and ensure a robust implementation, the following architectural mapping will be followed:

### 1. Domain Layer (Core Logic)
- **Aggregate Root: `Flow`**: Contains the identity, metadata, and the list of `Nodes` and `Edges`.
- **Entity: `Node`**: Defines the prompt, schema, and visual position.
- **Value Object: `Edge`**: Defines the source and target relationship.
- **Domain Service: `GraphCompiler`**: Responsible for the pure logic of converting the visual JSON structure into a logical sequence (independent of LangGraph).

### 2. Application Layer (Use Cases)
- **`FlowLifecycleService`**: Orchestrates Save, Copy (Deep Copy), and Load operations.
- **`FlowExecutionService`**: Manages the state of a run, coordinating the translation and execution.

### 3. Infrastructure Layer (Adapters)
- **Inbound: `FastAPI Controller`**: Exposes endpoints for the React frontend.
- **Outbound: `SqliteFlowRepository`**: Persists the `json_definition` and metadata.
- **Outbound: `LangGraphAdapter`**: The "Translation Layer". It receives the Domain representation of a Flow and instantiates the `langgraph.graph.StateGraph`, mapping node outputs to the shared state.

---

## [RESOLVED CLARIFICATIONS]

1. **Start Node Identification**: **Option A - Special "Start" node**. A dedicated component will be used to anchor the beginning of the execution.
2. **JSON Schema Mapping**: **Option A - Translation Layer**. The UI will send the visual layout (nodes/edges), and the `LangGraphAdapter` in the infrastructure layer will parse this into the LangGraph engine format.
