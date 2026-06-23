# Feature Specification: React Flow UI Refactor

**Feature Branch**: `005-react-flow-ui`  
**Created**: 2026-05-30  
**Status**: Draft  
**Input**: User description: "Vamos refatorar a UI. Vamos chamar de frontend e utilizar react. Requisitos, permitir criar um fluxo visualmente aonde crio um nó. Um nó é uma interação com a LLM. Em um primeiro momento, cada nó terá um número de sequencia (faremos apenas digrafo e linear), a ordem de execução é dada pelo núemro de sequencia a qual já atualiza em tela. O que o nó deve conter: O imput do nó anterior, o prompt, as variáveis que serão injetadas (identificadas no código quando o usuário coloca {{}} e a saída, que sempre será em json. A configuração deve ser facilitada e permitir chamar LLM para auxiliar na criação. A interface deve conter os requisitos levantados na streamlit, visualização de uma pasta, definição da pasta de output. As execuções deverão ser todas gravadas para permitir comparação posterior. No processamento deve aparecer o status da execução, processando metadados, classificando documentos, avaliando dimensão X, consolidando resultados, gravando resultados. Cada processamento deve ter um id de rastreamento. Cada Rastreamento é associado a um e somente um atendimento."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visual Flow Construction (Priority: P1)

As an AI Researcher, I want to visually build a sequence of LLM interactions (nodes) so that I can easily define complex evaluation logic without writing code.

**Why this priority**: Core value of the refactor - moving from static scripts to a dynamic visual builder.

**Independent Test**: Can be tested by creating three nodes, assigning them sequence numbers 1, 2, and 3, and verifying the visual order updates.

**Acceptance Scenarios**:

1. **Given** an empty canvas, **When** I add a "Node", **Then** I should be able to input a prompt and define JSON output fields.
2. **Given** a prompt with `{{variable_name}}`, **When** the node is saved, **Then** the system should automatically identify `variable_name` as an injection point.
3. **Given** multiple nodes, **When** I change the sequence number of a node, **Then** its position in the linear/digraph flow should update visually.

---

### User Story 2 - Execution and Tracking (Priority: P1)

As a Developer, I want to run a batch process and track its progress step-by-step so that I can monitor system performance and identify bottlenecks.

**Why this priority**: Essential for operationalizing the AI flows.

**Independent Test**: Can be tested by selecting a source folder and clicking "Start", then observing the status badges (Metadata -> Classification -> etc.) change in real-time.

**Acceptance Scenarios**:

1. **Given** a selected input folder, **When** I start the execution, **Then** a unique Tracking ID should be generated for each "atendimento".
2. **Given** a running flow, **When** it moves through steps, **Then** the UI MUST display specific statuses: "Processando Metadados", "Classificando Documentos", "Avaliando Dimensão X", "Consolidando Resultados", "Gravando Resultados".

---

### User Story 3 - LLM-Assisted Configuration (Priority: P2)

As a user, I want the system to help me write prompts and configure nodes using an LLM so that I can create effective flows faster.

**Why this priority**: High UX value for facilitating prompt engineering.

**Independent Test**: Can be tested by opening a node configuration panel and using the "Assist" feature to generate a prompt.

**Acceptance Scenarios**:

1. **Given** a node being created, **When** I click "Auxiliar com IA", **Then** the system should suggest prompt improvements or JSON schema definitions based on the previous node's output.

---

### User Story 4 - History and Comparison (Priority: P2)

As an Auditor, I want to see a history of all previous executions and compare results so that I can evaluate the impact of prompt changes over time.

**Why this priority**: Critical for iteraive improvement of AI quality.

**Independent Test**: Can be tested by opening the "History" view and selecting two tracking IDs to view side-by-side.

**Acceptance Scenarios**:

1. **Given** multiple recorded executions, **When** I select an execution from the list, **Then** I should see the full trace of nodes, prompts, and outputs for that specific "atendimento".

---

### Edge Cases

- **Circular Dependencies**: What happens if two nodes are assigned the same sequence number? (Requirement: System MUST enforce unique sequence numbers or handle ties gracefully).
- **Broken JSON**: How does the system handle an LLM response that isn't valid JSON? (Requirement: Node MUST show an ERROR status and allow manual retry or skip).
- **Missing Variables**: What happens if a variable `{{x}}` is used but never provided by a previous node? (Requirement: Validation check before execution starts).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST be implemented as a React frontend.
- **FR-002**: System MUST provide a canvas for visual node creation.
- **FR-003**: Each Node MUST support: Input (from previous), Prompt template, Variables (`{{}}`), and JSON Output schema.
- **FR-004**: System MUST record all execution telemetry (prompts, raw responses, metadata) in a persistent store.
- **FR-005**: System MUST associate each processing "Tracking" with exactly one "Atendimento".
- **FR-006**: UI MUST show real-time execution status for each file/atendimento.
- **FR-007**: System MUST allow configuring Source (Input) and Output folders.
- **FR-008**: System MUST implement an LLM-assisted prompt/node generation feature.

### Key Entities *(include if feature involves data)*

- **Flow**: The top-level sequence definition.
- **Node**: A single LLM interaction unit.
- **Execution**: A record of a run of a Flow.
- **Tracking**: A specific trace of an Execution for one Atendimento.
- **Atendimento**: The domain entity representing the service ticket/interaction being evaluated.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can build a 3-node flow in under 5 minutes.
- **SC-002**: 100% of LLM calls are recorded with their respective Tracking IDs.
- **SC-003**: UI state reflects status transitions (e.g., from "Metadata" to "Classification") with less than 500ms latency.
- **SC-004**: System successfully identifies and lists all `{{}}` variables in a prompt immediately upon node saving.

## Assumptions

- **Architecture**: A Python backend (likely continuing from `aitest`) will serve the React frontend via an API.
- **Visual Library**: **React Flow** will be used to manage the canvas and nodes.
- **Atendimento ID**: The "Atendimento" identity is extracted directly from the **input filename** (e.g., `12345.pdf` maps to Atendimento 12345).
