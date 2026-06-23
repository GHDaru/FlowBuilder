import json
import sqlite3
import re
from typing import Dict, Any, Tuple
from domain.ports.sql_execution_port import ISqlExecutionPort

class SqliteExecutionAdapter(ISqlExecutionPort):
    def _extract_variables(self, query: str, variables: Dict[str, Any]) -> Tuple[str, list]:
        pattern = r"\{\{(.*?)\}\}"
        matches = re.findall(pattern, query)
        prepared_query = re.sub(pattern, "?", query)
        params = [variables.get(match.strip()) for match in matches]
        return prepared_query, params

    def execute(self, connection_details: Dict[str, Any], query: str, variables: Dict[str, Any]) -> str:
        file_path = connection_details.get("file_path")
        if not file_path:
            raise ValueError("SQLite file_path is required.")
        
        prepared_query, params = self._extract_variables(query, variables)
        
        if "limit" not in prepared_query.lower() and prepared_query.strip().lower().startswith("select"):
            prepared_query = f"{prepared_query} LIMIT 50"
            
        conn = None
        try:
            conn = sqlite3.connect(file_path)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute(prepared_query, params)
            rows = cursor.fetchmany(50)
            result = [dict(row) for row in rows]
            return json.dumps(result, default=str)
        except Exception as e:
            raise Exception(f"SQLite execution failed: {str(e)}")
        finally:
            if conn:
                conn.close()

    def test_connection(self, connection_details: Dict[str, Any]) -> bool:
        file_path = connection_details.get("file_path")
        if not file_path:
            raise ValueError("SQLite file_path is required.")
        conn = None
        try:
            conn = sqlite3.connect(file_path)
            cursor = conn.cursor()
            cursor.execute("SELECT 1")
            return True
        except Exception as e:
            raise Exception(f"SQLite connection failed: {str(e)}")
        finally:
            if conn:
                conn.close()