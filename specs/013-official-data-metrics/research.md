# Research: Official Data Metrics and Scores

## Decision 1: Big Numbers Calculation Strategy
**Decision**: Calculate the summary metrics directly in the frontend component (`FirmList.tsx`) using `reduce` on the existing `firms` array.
**Rationale**: The `GET /official/firms` endpoint already returns the complete list of all firms and their respective `evaluation_count`. Creating a separate backend endpoint for total stats would introduce an unnecessary network call and database query for data the client already possesses in memory.
**Alternatives considered**:
- New backend endpoint `GET /official/stats` (Rejected: Unnecessary overhead since the full firm list is always fetched).

## Decision 2: Interaction Scores Retrieval
**Decision**: Extend the `OfficialAtendimento` SQLAlchemy model and the query in `PostgresAdapter.list_interactions` to include the `nota_media`, `nota_comunicacao`, `nota_profissionalismo`, and `nota_resolucao` columns.
**Rationale**: These columns exist in the PostgreSQL database (`atendimentos` table). Fetching them along with the base interaction data allows the `AtendimentoPicker` to display a rich audit table immediately.
**Alternatives considered**:
- Fetching scores only when expanding/selecting a specific interaction (Rejected: Makes bulk auditing and quick scanning impossible).
