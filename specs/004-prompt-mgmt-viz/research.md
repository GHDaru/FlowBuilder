# Research: Prompt Management and Flow Visualization

## Decision: Visualization Library
- **Chosen**: Native `st.graphviz_chart` (Graphviz DOT language).
- **Rationale**: It is built-in to Streamlit, requires no extra Python dependencies, and is perfectly suited for representing static or semi-dynamic directed acyclic graphs (DAGs) like our evaluation flow.
- **Alternatives considered**: 
  - `streamlit-agraph`: Rejected because it adds extra dependency overhead and we don't need high interactivity for this visualization.
  - `st.graphviz_chart`: Selected for its simplicity and alignment with the "Vibe Coding" principle of low friction.

## Decision: Prompt Management Architecture
- **Chosen**: Implement `IPromptRepository` (Domain Port) and `FilePromptRepository` (Infrastructure Adapter).
- **Rationale**: The project already follows DDD/Hexagonal patterns for repositories. Refactoring the utility `PromptLoader` into a proper repository ensures architectural consistency and allows the UI to perform Write operations safely.
- **Implementation Detail**:
  - Port: `aitest/src/domain/ports/prompt_repository.py`
  - Adapter: `aitest/src/infrastructure/adapters/file_prompt_repository.py`
  - Migration: Prompts will move to `aitest/data/prompts/`.

## Decision: Flow Mapping for Visualization
- **Chosen**: Dynamic graph generation in the Audit view using the `AuditLog` records.
- **Rationale**: By querying the `AuditLog` for a specific `Atendimento`, we can reconstruct the sequence of steps and their outcomes (Success/Failure) in real-time.
- **Sequence**: Metadata Extraction -> Classification -> Dimension Scoring (Parallel or Sequential) -> Consolidation -> Final Result.

## Decision: Migration Strategy
- **Chosen**: One-way sync script `sync_prompts.py`.
- **Rationale**: Simple to execute and maintains a clear source-of-truth during development.
- **Target Path**: `aitest/data/prompts/`.
