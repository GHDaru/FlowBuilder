# Feature Specification: Prompt Management and Flow Visualization

**Feature Branch**: `004-prompt-mgmt-viz`  
**Created**: 2026-05-30  
**Status**: Draft  
**Input**: User description: "Copie de src/main/resources/prompt para dentro da pasta aitest, em algum lugar conforme ddd/hexagonal. Com isto, no front deve ter a possibilidade de editar e visualizar os prompts que ficarão nesta pasta. A sequencia da aplicação metadados --> ... >nota final gere um grafo mostrando esta sequencia."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Prompt Management (Priority: P1)

As a developer or AI researcher, I want to manage AI prompts directly from the Streamlit dashboard so that I can quickly iterate on prompt engineering without manually editing files in the codebase.

**Why this priority**: Core requirement for rapid iteration and experimentation (Vibe Coding).

**Independent Test**: Can be tested by navigating to the "Configuração" tab, selecting a prompt, editing it, saving, and verifying that the file on disk has changed.

**Acceptance Scenarios**:

1. **Given** a list of existing prompts, **When** I select a prompt from the UI, **Then** I should see its current content in an editable text area.
2. **Given** an edited prompt, **When** I click "Salvar Prompt", **Then** the system should update the local file and confirm success.
3. **Given** a missing prompt directory, **When** I access the management tab, **Then** I should see a clear error message.

---

### User Story 2 - Flow Visualization (Priority: P2)

As an auditor, I want to see a visual graph of the evaluation flow for a specific atendimento so that I can better understand the sequence of operations and the logic transition from metadata extraction to final scoring.

**Why this priority**: High value for transparency and debugging of the evaluation logic.

**Independent Test**: Can be tested by opening the "Auditoria Detalhada" tab for a processed atendimento and verifying that a graph/diagram is rendered.

**Acceptance Scenarios**:

1. **Given** a successfully processed atendimento, **When** I view its audit details, **Then** I should see a directed graph showing the sequence: Metadata -> Tagueamento -> Scores -> Resumo -> Nota Final.
2. **Given** a failed step in the flow, **When** I view the graph, **Then** the failed node should be visually distinct (e.g., color coded).

---

### User Story 3 - Prompt Local Migration (Priority: P1)

As a system architect, I want prompts to be stored within the `aitest` module structure so that the module is self-contained and follows the local DDD/Hexagonal architecture.

**Why this priority**: Essential for module isolation and architectural consistency.

**Independent Test**: Verify that `aitest/src/infrastructure/prompts/` contains the migrated prompt files.

**Acceptance Scenarios**:

1. **Given** prompts in `src/main/resources/prompts`, **When** the migration is executed, **Then** all `.md` files should be copied to the target `aitest` infrastructure folder.
2. **Given** the new storage location, **When** the evaluation flow runs, **Then** it must load prompts from the new local path instead of the global project path.

---

### Edge Cases

- **Concurrent Edits**: What happens when two sessions try to edit the same prompt file simultaneously? (Assumption: Last-write-wins is acceptable for local development).
- **Invalid Prompt Content**: How does the system handle an empty prompt or a prompt that breaks the JSON response format? (Requirement: Validation before saving or clear error reporting during execution).
- **Graph Complexity**: How does the system handle very large flows if more steps are added? (Assumption: Graph should be scalable or scrollable).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a UI for listing, viewing, and editing local markdown prompt files.
- **FR-002**: System MUST persist prompt changes directly to the filesystem within the `aitest` structure.
- **FR-003**: System MUST implement a migration script or mechanism to move prompts from the global resource folder to `aitest/src/infrastructure/prompts`.
- **FR-004**: System MUST render a directed graph for each evaluation execution in the audit view.
- **FR-005**: The flow visualization MUST show the state (Success/Error) and key outputs (Scores, Tags) for each node.
- **FR-006**: System MUST load prompts from the local `aitest` infrastructure path by default.

### Key Entities *(include if feature involves data)*

- **Prompt**: Represents a template used by the IA Client. Attributes: filename, content, version/timestamp.
- **Evaluation Flow Graph**: A visual representation of the `Atendimento` processing lifecycle.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Prompt migration is completed with 100% file parity between global and local folders.
- **SC-002**: Users can edit and save a prompt in under 30 seconds via the UI.
- **SC-003**: Flow visualization renders in under 2 seconds for any processed atendimento.
- **SC-004**: 100% of audit logs are correctly mapped to their corresponding nodes in the flow graph.

## Assumptions

- **Storage**: Prompts are stored as flat files in `aitest/src/infrastructure/prompts` to maintain simplicity for the AI Lab.
- **Visualization Library**: Streamlit-compatible graphing libraries (like `graphviz` or `st-annotated-text`) will be used.
- **Scope**: Migration is a one-time or manual sync process, not a real-time bi-directional link with the Java core.
- **User Permissions**: All users of the AI Lab have full permissions to edit prompts.
