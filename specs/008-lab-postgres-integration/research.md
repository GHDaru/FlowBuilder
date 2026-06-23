# Research: Lab Postgres Integration

## Decision 1: Secondary SQLAlchemy Engine for Official Data
**Decision**: Implement a secondary `official_engine` in `infrastructure/adapters/postgres_adapter.py`.
**Rationale**: Keeps the local Lab data (SQLite) completely isolated from the official production-like data (Postgres). This prevents accidental schema contamination and strictly enforces read-only access by using a dedicated session.
**Alternatives considered**: 
- Routing all queries through the primary `engine` (Rejected: SQLAlchemy models for local vs official tables would collide).
- Using raw SQL only (Rejected: SQLAlchemy Core or ORM provides better type safety and integration with existing repository patterns).

## Decision 2: Environment-Based Database Configuration
**Decision**: Use `OFFICIAL_DATABASE_URL` from `.env` to configure the Postgres connection.
**Rationale**: Standard practice in the project. Allows developers to point to different environments (local docker-compose vs staging) without code changes.
**Alternatives considered**:
- Hardcoding the URL (Rejected: violates security and portability).

## Decision 3: Use Case Integration via OfficialDataService
**Decision**: Create `OfficialDataService` to bridge the official DB and the Lab's `FlowExecutionUseCase`.
**Rationale**: This use case will fetch the `text_content` from Postgres but will use the Lab's standard execution flow, ensuring that "official" runs are logged exactly like "local" runs in the execution history.
**Alternatives considered**:
- Direct API calls to the Java core (Rejected: Too complex for current scope; direct DB access is simpler for IA evaluation needs).

## Decision 4: Frontend "Official Data" Tab
**Decision**: Add a new navigation tab "Official Data" in the Lab UI.
**Rationale**: Provides a clear entry point for browsing firms and interactions without cluttering the Flow Builder.
**Alternatives considered**:
- Integrating firm selection inside the Flow Builder (Rejected: Makes the UI too busy).
