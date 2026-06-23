# Quickstart: sql-context-node

## Setup
No new infrastructure is required. The backend uses the existing `psycopg2-binary` and `sqlite3` packages to execute the queries.

## Usage
1. Open the AI Visual Lab frontend and navigate to the Flow Builder.
2. Drag and drop a new **SQL Context** node onto the canvas.
3. Click the node to open its configuration sidebar.
4. Select the Database Type (PostgreSQL or SQLite).
5. Fill in the connection credentials.
6. Write your SQL query. You can use variables from the global context or previous nodes using the `{{variable_name}}` syntax.
7. Click the "Preview" button. A modal will ask you to provide mock values for any `{{variables}}` detected in your query.
8. The results will be displayed in the modal as a JSON string.
9. Connect the SQL Context node to an LLM node. The LLM node can now use `{{slugified_sql_node_title}}` in its prompt to access the query results.
