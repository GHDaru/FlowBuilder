# Feature Specification: sql-context-node

**Feature Branch**: `022-sql-context-node`  
**Created**: 2026-06-09  
**Status**: Draft  
**Input**: User description: "Eu como arquiteto de fluxo necessito de um nó de contexto, que permite configurar o banco de dados e escrever um sql com {{}}. O banco suportado neste primeiro momento é sqlite e postgres. As credenciais podem ser entradas na configuração do nó. O json de retorno é no formato { \"nome_do_no_sem_acento_tudo_minusculo_com_underscore_no_lugar_do_espaço\" : \"string com o resultado do sql\"}. O nó deve permitir simular a execução do sql(em uma tela de preview por exemplo), de forma ao modelador poder inserir os valores da variáveis."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Configure SQL Context Node (Priority: P1)

As a Flow Architect, I want to add an SQL Context node to the canvas, select the database type (PostgreSQL or SQLite), enter credentials (if applicable), and write an SQL query with variable interpolation `{{variable}}`.

**Why this priority**: This is the core functionality. Without the ability to configure the node and write the query, the feature does not exist.

**Independent Test**: Can be tested by dragging an SQL node to the canvas, opening its configuration sidebar, and successfully filling out the database connection details and an SQL query containing variables.

**Acceptance Scenarios**:

1. **Given** the flow builder canvas, **When** I add an SQL Context node and click it, **Then** I should see a configuration sidebar with fields for Database Type, Credentials (Host, User, Password, DB Name), and a SQL Query text area.
2. **Given** a configured SQL Context node, **When** I type `SELECT * FROM users WHERE id = {{user_id}}` in the query editor, **Then** the variable `user_id` should be detected and visually indicated in the UI.

---

### User Story 2 - Preview SQL Execution (Priority: P1)

As a Flow Architect, I want to preview the execution of my configured SQL query directly within the node's configuration UI, providing mock values for any interpolated variables, so I can validate my query before running the entire flow.

**Why this priority**: Crucial for developer experience and debugging. Writing SQL without a way to test it locally within the tool leads to errors during flow execution.

**Independent Test**: Configure a node with a valid query (e.g., against a local test SQLite DB), provide a mock value for a variable, click "Preview", and see the results formatted as the expected JSON.

**Acceptance Scenarios**:

1. **Given** an SQL query with a variable `{{id}}`, **When** I click "Preview", **Then** I should be prompted to provide a value for `id`.
2. **Given** mock values are provided, **When** the preview executes successfully, **Then** the UI should display the result in the format `{"node_name_slug": "JSON string of query results"}`.
3. **Given** the query fails (e.g., syntax error or bad connection), **When** I click "Preview", **Then** I should see a clear error message explaining the failure.

---

### User Story 3 - Flow Execution Integration (Priority: P1)

As a Flow Architect, I want the SQL Context node to execute automatically when the flow runs, resolving variables from the flow's current state, and appending its formatted JSON result to the state for subsequent nodes to use.

**Why this priority**: The node must actually work during a real execution, otherwise it's just a UI mockup.

**Independent Test**: Create a flow: Start -> SQL Node -> LLM Node. Run the flow and verify the LLM node receives the SQL execution results in its input context.

**Acceptance Scenarios**:

1. **Given** an active flow execution reaching an SQL Context node, **When** the node executes, **Then** it should resolve variables from the current state (e.g., previous node outputs or global variables).
2. **Given** the SQL executes successfully, **When** the node completes, **Then** it should add its output to the flow state using its slugified name as the key (e.g., `{"meu_sql_node": "[{\"id\": 1, \"name\": \"Test\"}]"}`).

---

### Edge Cases

- **Invalid Credentials/Connection Timeout**: How does the system handle an unreachable database during Preview or Execution? (Expected: Fails gracefully with a clear timeout/connection error).
- **SQL Injection/Safety**: How are variables interpolated? (Expected: Use parameterized queries to prevent SQL injection, rather than naive string replacement).
- **Large Result Sets**: What happens if the query returns 1,000,000 rows? (Expected: Results should be truncated or a limit should be enforced to prevent memory crashes and context window overflow in subsequent LLM nodes).
- **SQLite File Path**: For SQLite, how is the file path provided? (Expected: Absolute path or path relative to the backend server).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a new node type called "SQL Context".
- **FR-002**: The node configuration MUST allow selecting between "PostgreSQL" and "SQLite".
- **FR-003**: The node configuration MUST accept connection strings or individual credential fields (Host, Port, User, Password, Database for Postgres; Filepath for SQLite).
- **FR-004**: The node configuration MUST include a SQL editor that supports syntax highlighting and identifies variables enclosed in `{{}}`.
- **FR-005**: The system MUST slugify the node's name (lowercase, no accents, underscores for spaces) to use as the output JSON key.
- **FR-006**: The node MUST return a JSON object structured as `{ "slugified_node_name": "stringified_query_results" }`.
- **FR-007**: The node configuration MUST feature a "Preview" button.
- **FR-008**: The Preview functionality MUST prompt the user to input values for any detected variables before executing.
- **FR-009**: The backend MUST execute the SQL query using secure parameterized queries (e.g., converting `{{var}}` to `%s` or `?` depending on the DB driver).
- **FR-010**: The backend MUST limit the query results to a sensible default (e.g., 50 rows) to prevent massive payloads.

### Key Entities

- **SQL Node Configuration**:
  - `database_type` (Enum: postgres, sqlite)
  - `connection_details` (Object: host, port, user, password, database, file_path)
  - `sql_query` (String)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can configure and successfully preview a Postgres query within 60 seconds of adding the node.
- **SC-002**: 100% of variables defined via `{{}}` are correctly parameterized during actual database execution to prevent SQL injection.
- **SC-003**: Flow execution correctly merges the SQL node's output into the global state using the slugified name as the key.

## Assumptions

- The backend server has network access to the PostgreSQL databases configured by the user.
- The user is responsible for providing valid read-only credentials; the system will not enforce read-only at the proxy level, but documentation should advise it.
- Python's `psycopg2` (or equivalent) and standard `sqlite3` libraries are sufficient for execution.
