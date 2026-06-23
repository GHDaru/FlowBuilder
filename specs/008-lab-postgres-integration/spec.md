# Feature Specification: Lab Postgres Integration

**Feature Branch**: `008-lab-postgres-integration`  
**Created**: 2026-06-01  
**Status**: Draft  
**Input**: User description: "Eu como implementador e responsável pela construção e avaliação de IA, no ambiente de aitest, quero poder puxar as contabilidades (do banco de dados oficial que se encontra em postgres - sempre somente leitura) e ver quais existem e quantows atendimentos já foram avaliados. Também desejo poder processar um ou mais atendimentos rodando um fluxo selecionado no nps visual ai labs."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse Accounting Firms (Priority: P1)

As an IA Evaluator, I want to list all accounting firms from the official database so that I can see the scope of available data and their evaluation status.

**Why this priority**: Fundamental requirement for data discovery and selection.

**Independent Test**: Successfully connects to Postgres and renders a list of accounting firms with their respective evaluation counts.

**Acceptance Scenarios**:

1. **Given** a valid Postgres connection, **When** I access the Lab dashboard, **Then** I should see a list of accounting firms.
2. **Given** the list of firms, **When** it renders, **Then** each firm MUST show the total number of "atendimentos" already evaluated.

---

### User Story 2 - Select and Process Interactions (Priority: P1)

As an IA Evaluator, I want to select specific service interactions from an accounting firm and run an AI Visual Lab flow on them to validate and iterate on AI behavior.

**Why this priority**: Core value of the feature - enabling testing with real data from the official source.

**Independent Test**: Selects a firm, chooses one or more "atendimentos", selects a visual flow, and triggers execution, resulting in trace logs.

**Acceptance Scenarios**:

1. **Given** a selected accounting firm, **When** I view its interactions, **Then** I should be able to select multiple records for processing.
2. **Given** selected interactions, **When** I choose an AI Flow and click "Process", **Then** the system MUST trigger the execution engine for each interaction.

---

### User Story 3 - Execution Trace Observation (Priority: P2)

As an IA Evaluator, I want to see the progress and results of the batch processing within the Lab environment so that I can analyze the quality of the AI responses.

**Why this priority**: Necessary for the "Evaluate" part of the user's role.

**Independent Test**: After triggering processing, the user is redirected or shown the history/trace of these specific executions.

**Acceptance Scenarios**:

1. **Given** a batch execution started, **When** it completes, **Then** I MUST be able to view the full trace of nodes, prompts, and outputs for each interaction.

### Edge Cases

- **Postgres Connection Timeout**: If the official DB is unreachable, the system SHOULD show a clear error message instead of failing silently.
- **Read-Only Violation Attempt**: The system MUST NOT attempt any WRITE operations on the Postgres DB.
- **Empty Interaction Set**: If a firm has no interactions, the selection UI SHOULD state this clearly.
- **Missing AI Flow**: If a previously selected flow is deleted, the selection MUST invalidate.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST connect to the official Postgres database using read-only credentials.
- **FR-002**: System MUST retrieve a list of all accounting firms (Contabilidades).
- **FR-003**: System MUST calculate the count of "atendimentos" with existing evaluations for each firm.
- **FR-004**: System MUST allow searching accounting firms by name.
- **FR-005**: System MUST allow selecting one or more "atendimentos" from a selected firm.
- **FR-006**: System MUST list available AI flows from the Visual AI Labs (LangGraph based).
- **FR-007**: System MUST trigger the `FlowExecutionUseCase` for each selected interaction.
- **FR-008**: System MUST support processing batches of interactions (up to 50 at a time for initial implementation).

### Key Entities *(include if feature involves data)*

- **Contabilidade (Official)**: Represents an accounting firm in the official DB. Attributes: ID, Name.
- **Atendimento (Official)**: Represents a service interaction record in the official DB. Attributes: ID, Content (text).
- **Visual AI Flow**: The configuration of nodes and edges defined in the Lab.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Listing accounting firms takes less than 2 seconds for up to 1000 firms.
- **SC-002**: Selecting and triggering processing for 10 interactions takes less than 5 seconds (excluding AI execution time).
- **SC-003**: 100% of processing attempts are logged in the Lab's execution history.

## Assumptions

- Official Postgres credentials will be provided via `AITEST_POSTGRES_READ_ONLY_URL` or similar environment variables.
- The `atendimentos` and `atendimento_chat` tables in Postgres have a standard schema as analyzed.
- Processing will use the existing `FlowExecutionUseCase` logic to maintain consistency.
- UI will be integrated into the existing `aitest/frontend` React application.
