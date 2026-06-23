# Implementation Tasks: sql-context-node

**Feature**: sql-context-node  
**Plan**: [specs/022-sql-context-node/plan.md](plan.md)  
**Branch**: `022-sql-context-node`

## Implementation Strategy
We will build the foundation first by creating the secure SQL execution backend service and preview endpoint. Then, we'll move to the frontend to build the UI components for configuring the node and previewing queries. Finally, we'll integrate the new node type into the LangGraph execution engine.

## Phase 1: Setup
- [x] T001 Add `SqlPreviewRequest` and `SqlPreviewResponse` schemas to `aitest/backend/models/schemas.py`
- [x] T002 Add DTO interfaces to `aitest/frontend/src/services/api.ts` or a new `sqlService.ts`

## Phase 2: Foundational
- [x] T003 Implement safe parameterized SQL execution logic (for Postgres and SQLite) with a 50-row limit in a new service `aitest/backend/domain/services/sql_executor.py`
- [x] T004 Add the `POST /tools/sql/preview` endpoint to `aitest/backend/main.py` mapping to the executor

## Phase 3: [US1] Configure SQL Context Node (P1)
**Story Goal**: Allow users to add and configure an SQL node with credentials and a query.
**Independent Test**: Drag an SQL node, fill out DB details and query in the sidebar.

- [x] T005 [P] [US1] Create a visual component `SqlNode.tsx` in `aitest/frontend/src/components/FlowBuilder/` (similar to StartNode)
- [x] T006 [US1] Register `sql: SqlNode` in the `nodeTypes` of `aitest/frontend/src/components/FlowBuilder/FlowBuilder.tsx`
- [x] T007 [US1] Add a button/drag-source in `FlowBuilder.tsx` to add an "SQL Context" node
- [x] T008 [US1] Update `aitest/frontend/src/components/Sidebar/Sidebar.tsx` to render configuration fields (DB Type, Host, User, Password, DB Name/Filepath, SQL Query text area) when `selectedNode.type === 'sql'`
- [x] T009 [US1] Ensure `Sidebar.tsx` correctly saves the `database_type`, `connection_details`, and `sql_query` to the node's data object

## Phase 4: [US2] Preview SQL Execution (P1)
**Story Goal**: Allow users to preview their SQL query directly from the UI.
**Independent Test**: Click "Preview", enter mock variables, and see the JSON result.

- [x] T010 [P] [US2] Create a modal component `SqlPreviewModal.tsx` in `aitest/frontend/src/components/Sidebar/` to prompt for mock values for detected variables
- [x] T011 [US2] Add a "Preview" button in `Sidebar.tsx` for SQL nodes that opens the modal
- [x] T012 [US2] Implement the API call to `/tools/sql/preview` within the modal and display the formatted JSON or error message

## Phase 5: [US3] Flow Execution Integration (P1)
**Story Goal**: Execute the SQL node as part of the overall flow and inject its output.
**Independent Test**: Run a flow containing an SQL node and see its output used by an LLM node.

- [x] T013 [US3] Update `GraphCompiler.compile` in `aitest/backend/domain/services/graph_compiler.py` to extract `database_type`, `connection_details`, and `sql_query` for `sql` nodes
- [x] T014 [US3] Add a helper function `slugify` to `aitest/backend/infrastructure/adapters/langgraph_adapter.py` (or a utils file)
- [x] T015 [US3] Implement `_make_sql_fn` in `aitest/backend/infrastructure/adapters/langgraph_adapter.py` to resolve variables, execute via `sql_executor`, and append `{ slugify(title): stringified_json }` to the `outputs` state
- [x] T016 [US3] Update `LangGraphAdapter.run` to route `node_def["type"] == "sql"` to `_make_sql_fn`

## Phase 6: Polish
- [x] T017 Improve error handling and timeout messaging in the Preview modal UI
- [x] T018 Add a small visual indicator on `SqlNode.tsx` to show the chosen DB type (e.g., a tiny PG or SQLite logo/text)

## Dependencies
- Phase 3 (US1) and Phase 2 can be developed somewhat in parallel, but US2 depends on both US1 and Phase 2.
- Phase 5 (US3) depends on the core execution logic in Phase 2 and the node configuration from US1.

## Parallel Execution
- `T003` (Backend Executor) and `T005`/`T008` (Frontend UI) can be executed in parallel.
