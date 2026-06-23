# Research: Official Data Performance & Filtering

## Decision 1: Backend Search Implementation
**Decision**: Update the `list_firms` API and adapter to accept a `search` string parameter. If provided, the SQLAlchemy query will use `.filter(OfficialContabilidade.nome.ilike(f"%{search}%"))`.
**Rationale**: Filtering 2000+ firms in memory on the frontend causes rendering lag. Database-level filtering ensures we only transfer and render the relevant records.

## Decision 2: Search Debouncing
**Decision**: Implement a 300ms debounce in the `FirmList` search input before triggering an API call.
**Rationale**: Prevents overwhelming the backend with requests for every keystroke while maintaining a responsive "feel".

## Decision 3: Interaction Status Filter (Frontend Only)
**Decision**: Filtering by status (Pendente/Avaliado) in `AtendimentoPicker` will remain a frontend-only operation.
**Rationale**: We already limit interactions to a maximum of 200 per batch. Filtering 200 records in memory is extremely fast and avoids complex SQL logic for checking the existence of evaluation JSONs across multiple joins.

## Decision 4: Global Selection Consistency
**Decision**: The "Select All" checkbox in `AtendimentoPicker` will only toggle the rows currently visible after the status filter is applied.
**Rationale**: This is the most intuitive behavior for users (selecting what they see).
