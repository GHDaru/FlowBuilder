# Research: sql-context-node

## Decision: SQL Execution Security
To execute SQL with dynamic variables, we will use standard parameterized queries. The `VariableResolver` will extract values from the context, and we will pass them to the database drivers (`psycopg2` for Postgres, `sqlite3` for SQLite) as query parameters (e.g., using `%s` or `?`). We will NEVER use string concatenation for variable interpolation to prevent SQL injection.

## Decision: Preview Endpoint
A new API endpoint `POST /tools/sql/preview` will be created in FastAPI. It will receive the database type, credentials, the raw query, and the dictionary of variables to inject. It will return the JSON formatted result.

## Decision: LangGraph Integration
We will update `GraphCompiler` to recognize the new `sql` node type and extract `database_type`, `connection_details`, and `sql_query`. 
In `LangGraphAdapter`, we will create a `_make_sql_fn` method to handle the node execution. This function will resolve variables from the current state, execute the query securely, stringify the result into JSON, and append it to the `outputs` dictionary using a slugified version of the node's title as the key.

## Decision: Result Limiting
To prevent memory crashes from large datasets, the SQL execution logic will forcefully append a `LIMIT 50` clause or wrap the query if possible, or alternatively fetch only `fetchmany(50)` at the cursor level and serialize that.

## Alternatives Considered
- **SQLAlchemy for dynamic queries**: Rejected. We need to execute raw SQL written by the user. SQLAlchemy's `text()` construct is useful, but direct driver usage gives more control over parameter binding for arbitrary dialects. We will stick to `sqlite3` and `psycopg2` direct connections to keep it simple and safe for raw execution.
