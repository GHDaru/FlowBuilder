# Feature Specification: rules-mgmt-module

**Feature Branch**: `023-rules-mgmt-module`  
**Created**: 2026-06-09  
**Status**: Draft  
**Input**: User description for Rules Management Module — AVALIA v1

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Manual Rule Creation with AI Assistance (Priority: P1)

As a System Admin or Accounting Firm Architect, I want to describe a desired scoring behavior in natural language and have an AI assistant generate a structured rule (name and text instruction) so that I can easily populate the rule repository.

**Why this priority**: Core administrative functionality required to establish the baseline logic of the system.

**Independent Test**: Enter a text like "Penalty for being rude" in the admin screen, verify the AI suggests a structured instruction and name, refine it through a cycle, and save it.

**Acceptance Scenarios**:
1. **Given** the rule creation screen, **When** I describe a behavior, **Then** the system MUST display a proposed "nome" and "texto" (second-person instruction).
2. **Given** a proposed rule, **When** I ask for a refinement (e.g., "make it more strict"), **Then** the AI MUST update the instruction accordingly.
3. **Given** a finalized rule, **When** I click save, **Then** it MUST be persisted in the database.

---

### User Story 2 - Automatic Rule Generation from Feedback (Priority: P1)

As a Supervisor, I want to provide feedback on an automated evaluation so that the system can automatically extract a general rule that prevents similar incorrect evaluations in the future.

**Why this priority**: Essential for the system's ability to learn from human expertise and reduce recurring errors.

**Independent Test**: Submit a transcript, a specific evaluation JSON, and supervisor feedback. Verify that the output is a valid Rule JSON that generalizes the feedback principle.

**Acceptance Scenarios**:
1. **Given** a contested evaluation, **When** the system receives the transcript, original evaluation, and feedback text, **Then** it MUST generate a JSON rule containing `origem` metadata.
2. **Given** the generated rule text, **When** I review it, **Then** it MUST be written in second person as an instruction to the AI Evaluator.

---

### User Story 3 - Hierarchical Rule Application (Priority: P1)

As the Scoring Engine, I need to fetch all active rules (Global and context-specific) and apply them to an evaluation so that the final score reflects both general standards and contextual nuances.

**Why this priority**: This is the functional "glue" that makes the rules impactful during analysis.

**Independent Test**: Trigger an analysis for a specific context (e.g., a specific accounting firm) and verify that both Global rules and rules specific to that firm are included in the execution trace.

**Acceptance Scenarios**:
1. **Given** active Global and Specific rules, **When** an evaluation is processed, **Then** the engine MUST aggregate all applicable rules.
2. **Given** a conflict between a Global and a Specific rule for the same dimension, **When** the evaluation occurs, **Then** the most specific rule MUST take precedence.

---

### Edge Cases

- **Circular Conflict**: Two rules at the same hierarchy level providing contradictory instructions. (Expected: System logs a warning and uses a default priority or timestamp-based resolution).
- **Empty Logic from Feedback**: Feedback like "this is wrong" without explanation. (Expected: AI agent should attempt to generalize but may return an error if the principle cannot be extracted).
- **Rule Accumulation**: So many active rules that they exceed the LLM's context limit. (Expected: System MUST prioritize or truncate rules while maintaining integrity).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support two hierarchy scopes: **global** (system-wide) and **específico** (linked to a specific context).
- **FR-002**: Specific rules MUST be associated with a **Context** identifier (e.g., office, sector, or attendant).
- **FR-003**: System MUST provide an automated pipeline to generate rules from three inputs: (1) Transcript, (2) System Evaluation JSON, (3) Supervisor Feedback.
- **FR-004**: Generated rule instructions (`texto`) MUST be written in **second person**, addressed to the AI Evaluator.
- **FR-005**: Every rule MUST support manual activation and deactivation (`is_active`).
- **FR-006**: Rules MUST be data-driven (changeable without code deployment).
- **FR-007**: The Scoring Engine MUST implement a "Merge-Up" logic to aggregate Global and Specific rules.

### Key Entities

- **Rule**:
    - `nome`: Short identifier string.
    - `texto`: Natural language instruction (Activation condition + Impact).
    - `dimensao`: affected dimension ID or "todas".
    - `escopo`: "global" | "específico".
    - `contexto`: identifier for specific scope (null if global).
    - `is_active`: Boolean status.
    - `origem`: Metadata object (tipo: "feedback" | "manual", atendimento_ref, feedback_original).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: AI-generated rules from feedback correctly generalize the core principle in 90% of cases.
- **SC-002**: Rule aggregation and injection into the prompt completes in under 200ms.

## Principles for Rule Generation

1. **Generalize, don't particularize**: Protect the class of situations, not just the specific case.
2. **Evaluate the attendant, not the client**: Focus on performance metrics.
3. **Don't punish the uncontrollable**: Protect the attendant if the issue was external.
4. **Identifiable condition**: The rule activation criteria must be clear in any transcript.
5. **Declared impact**: Instruction must explicitly state the effect on the score (up, down, floor, ceiling, or ignore).

## Assumptions

- Dimensions are consistent across the system.
- The AI Evaluator can interpret and follow multiple natural language instructions injected into its context.
- The existing SQLite/Postgres infrastructure will handle Rule persistence.
