# Research: History UI Refinements

## Decision 1: Collapsible UI Component
**Decision**: Use MUI `Accordion`, `AccordionSummary`, and `AccordionDetails`.
**Rationale**: Native to the Material UI library already in use. Provides built-in expanding/collapsing animations and accessibility features.
**Alternatives considered**: 
- Custom state-driven visibility within existing `Card` (Rejected: Unnecessary custom logic when standard components exist).

## Decision 2: Storing Node Labels
**Decision**: Update `TraceLog` table in SQLite to include `node_label` as an optional string. The `LangGraphAdapter` will extract the `label` from `node_def["title"]` (or similar data attribute) and pass it through the `log_callback` down to the DB persistence layer.
**Rationale**: `TraceLog` currently stores `node_id` (e.g., `llm-12345`), which lacks context in the UI. Storing the label at the time of execution ensures the history record is immutable and accurately reflects the node's name when it ran, even if the node is later renamed or deleted from the flow.
**Alternatives considered**:
- Fetching the flow definition and mapping `node_id` to label on the frontend on the fly (Rejected: Overly complex, requires parsing the JSON definition for every history view, and fails if the flow structure was changed after the execution).

## Decision 3: Handling Text Overflow
**Decision**: Apply `sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowX: 'auto' }}` to text container wrappers within the `AccordionDetails`.
**Rationale**: `pre-wrap` preserves formatting (newlines) while allowing text to wrap. `break-word` ensures extremely long, unbroken strings (like base64 tokens or very long URLs) wrap instead of breaking the container. `overflowX: auto` is a fallback for `pre` blocks containing structured JSON where wrapping might ruin readability.
**Alternatives considered**:
- Truncating text with ellipsis (Rejected: IA Evaluators need to read the full prompt/response in the history).
