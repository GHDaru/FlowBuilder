# Feature Specification: global-variable-selection

**Feature Branch**: `021-global-variable-selection`  
**Created**: 2026-06-08  
**Status**: Draft  
**Input**: User description: "Eu como planejador de fluxo desejo selecionar quais variáveis globais utilizar no fluxo. Desejo selecionar quais variáveis estarão disponíveis para o fluxo isto no nó inicial."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Select Global Variables at Start Node (Priority: P1)

As a Flow Planner, I want to open the configuration of the starting node of a flow and see a list of available global variables, so I can select which ones will be initialized and available throughout the entire flow execution.

**Why this priority**: This is the core functionality. Without selecting which variables are active, the flow cannot reliably use external data sources or system-wide configurations.

**Independent Test**: Can be tested by creating a new flow, clicking the "Start" node, selecting one or more variables from a list, and saving.

**Acceptance Scenarios**:

1. **Given** a flow with a Start node, **When** I click the Start node, **Then** I should see a section titled "Global Variables".
2. **Given** the Global Variables section is visible, **When** I select a variable from the available options, **Then** it should be marked as active for this flow.

---

### User Story 2 - Variable Availability in Subsequent Nodes (Priority: P2)

As a Flow Planner, I want the variables I selected in the Start node to appear as suggestions or be valid in the prompt templates of all subsequent nodes in the flow.

**Why this priority**: Ensures the selection has a functional impact on the flow's logic.

**Independent Test**: Select a variable at the Start node, then verify it is recognized as a valid variable in a subsequent LLM node.

**Acceptance Scenarios**:

1. **Given** variable "user_name" was selected in the Start node, **When** I use `{{user_name}}` in a subsequent LLM node, **Then** the variable extractor should identify it as a valid, resolved variable.

---

### User Story 3 - Persistence of Selection (Priority: P2)

As a Flow Planner, I want my selection of global variables to be saved as part of the flow definition so that it persists between sessions.

**Why this priority**: Essential for usability and flow management.

**Independent Test**: Select variables, save the flow, refresh the page, and verify the selection is still there.

**Acceptance Scenarios**:

1. **Given** I have selected and saved variables in a flow, **When** I reload the flow, **Then** the same variables should remain selected.

---

### Edge Cases

- **Empty Global Variable List**: What happens if there are no global variables defined in the system? (Expected: UI shows an informative message).
- **Variable Renaming/Deletion**: How does the system handle a flow that selected a global variable that has since been deleted from the global pool? (Expected: UI marks it as "missing" or "invalid").

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a list of predefined global variables in the configuration sidebar of the flow's starting node.
- **FR-002**: Users MUST be able to toggle (select/deselect) multiple global variables for a single flow.
- **FR-003**: The system MUST store the list of selected variable IDs within the flow's JSON definition.
- **FR-004**: The flow's "Start" node MUST be the exclusive place for defining which global variables are active for that specific flow instance.
- **FR-005**: The UI MUST distinguish between system-provided global variables and flow-local variables (extracted from previous node outputs).

### Key Entities *(include if feature involves data)*

- **Global Variable Definition**: Represents a variable available system-wide (e.g., `contabilidade_nome`, `empresa_id`). Attributes: ID, Name, Description, Sample Value.
- **Flow Definition**: The main entity representing the visual flow. Now includes a `global_variables` collection.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can select and save global variables in under 30 seconds from the Start node.
- **SC-002**: 100% of selected global variables are correctly persisted in the flow JSON definition.
- **SC-003**: Variable validation in subsequent nodes identifies 100% of the variables selected in the Start node.

## Assumptions

- There is an existing repository or API endpoint that provides the list of available global variables.
- The "Start" node is always the entry point of the flow and exists by default.
- Global variables have static names that don't conflict with system reserved keywords.
