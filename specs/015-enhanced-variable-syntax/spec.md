# Feature Specification: Enhanced Variable Syntax and Uniformity

**Feature Branch**: `015-enhanced-variable-syntax`  
**Created**: 2026-06-03  
**Status**: Draft  
**Input**: User description: "Eu como criador de fluxos, quero poder utilizar qualquer variável do json global, utilizando a sintaxe padrão do python. tanto para colocar como variável {{}}, quanto na decisão, que alias, também deve seguir o padrão {{}}."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Python-style Nested Variable Access (Priority: P1)

As a Flow Creator, I want to access nested properties in the global state JSON using dot notation (e.g., `{{meta.ticket_id}}`), so that I can use specific data points in my prompts without flattening the entire JSON object.

**Why this priority**: Crucial for complex flows where nodes return structured objects.

**Acceptance Scenarios**:
1. **Given** a global state containing `{"metadados": {"nome_cliente": "Empresa X"}}`, **When** I use `{{metadados.nome_cliente}}` in an LLM node prompt, **Then** the variable MUST be resolved correctly.
2. **Given** a nested JSON, **When** I access a non-existent path (e.g., `{{missing.key}}`), **Then** the system MUST handle it gracefully (e.g., replace with an empty string or literal).

---

### User Story 2 - Uniform Variable Syntax in Router (Priority: P1)

As a Flow Creator, I want to define routing rules using the `{{variable}}` syntax in the "Variable" field, so that the experience is consistent across all node types (LLM and Condition nodes).

**Why this priority**: Consistency reduces cognitive load and prevents mistakes.

**Acceptance Scenarios**:
1. **Given** a Condition Node rule, **When** I type `{{elegibilidade.deve_avaliar}}` in the variable name field, **Then** the router MUST correctly extract the value from the state using Python-style path resolution.
2. **Given** a rule, **When** the variable is written without `{{}}` (legacy support), **Then** it SHOULD still work or the UI SHOULD migrate it automatically.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Backend MUST implement a robust variable resolver that supports dot notation (e.g., `obj.key.subkey`).
- **FR-002**: LLM Nodes MUST resolve nested paths in their `prompt_template`.
- **FR-003**: Condition Nodes MUST resolve nested paths specified in their `rules[].variable` field, using the `{{}}` syntax.
- **FR-004**: Frontend `ConditionNode` UI MUST allow typing `{{}}` in the variable input field.
- **FR-005**: The variable resolution logic SHOULD be centralized in a Domain Service (e.g., `VariableResolver`) to ensure consistency.

### Key Entities *(include if feature involves data)*

- **Flow Node Configuration**: Variable definitions now support nested paths.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of tested nested paths (up to 3 levels deep) resolve correctly in both prompts and routing decisions.
- **SC-002**: The same syntax `{{path}}` works interchangeably for injecting text and triggering routes.

## Assumptions

- We will use standard Python attribute/key access patterns for the "standard syntax".
- The frontend will not strictly enforce the `{{}}` but will encourage it; the backend will be responsible for stripping `{{}}` if present or handling them as part of the key lookup.
