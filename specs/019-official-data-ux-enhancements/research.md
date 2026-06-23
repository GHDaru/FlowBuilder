# Research: Official Data UX Enhancements

## Decision 1: Backend Query Support for Multiple Firms
**Decision**: Update `IOfficialDbPort.list_interactions` to accept a list of IDs: `list_interactions(self, firm_ids: List[str])`. Use the SQL `IN` operator in the `PostgresAdapter`.
**Rationale**: This minimizes round-trips to the database and simplifies the frontend logic. The frontend can now send all selected firm IDs in a single query parameter (e.g., `?firm_ids=id1,id2,id3`).

## Decision 2: Frontend Sorting Strategy
**Decision**: Implement sorting purely on the client-side using JavaScript's `.sort()` method.
**Rationale**: Since we limit the interaction list to 100-200 items per firm (or total), client-side sorting provides instant feedback without the overhead of re-fetching data from the backend. This aligns with the "Vibe Coding" principle of low-friction UX.

## Decision 3: Default Selection Logic
**Decision**:
- **Firms**: All firms currently visible in the list (after filtering) will be selected by default when the page first loads.
- **Interactions**: All interactions fetched will be selected by default when the `AtendimentoPicker` loads.
**Rationale**: This optimizes for the "run everything" use case, which is common during bulk audits.

## Decision 4: Select All / Deselect All UI
**Decision**: Use a checkbox in the table header to toggle all visible rows.
**Rationale**: Standard UI pattern that users expect in data grids.
