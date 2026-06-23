import json
import psycopg2
from psycopg2.extras import RealDictCursor
import re
from typing import Dict, Any, Tuple
from domain.ports.sql_execution_port import ISqlExecutionPort

class PostgresExecutionAdapter(ISqlExecutionPort):
    def _extract_variables(self, query: str, variables: Dict[str, Any]) -> Tuple[str, list]:
        pattern = r"\{\{(.*?)\}\}"
        matches = re.findall(pattern, query)
        prepared_query = re.sub(pattern, "%s", query)
        params = [variables.get(match.strip()) for match in matches]
        return prepared_query, params

    def _get_connection(self, connection_details: Dict[str, Any]):
        host = connection_details.get("host")
        port = connection_details.get("port", "5432")
        user = connection_details.get("user")
        password = connection_details.get("password")
        database = connection_details.get("database")
        
        if not all([host, user, password, database]):
            raise ValueError("PostgreSQL host, user, password, and database are required.")
            
        return psycopg2.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            dbname=database
        )

    def execute(self, connection_details: Dict[str, Any], query: str, variables: Dict[str, Any]) -> str:
        prepared_query, params = self._extract_variables(query, variables)
        
        conn = None
        try:
            conn = self._get_connection(connection_details)
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            cursor.execute(prepared_query, params)
            
            if cursor.description:
                rows = cursor.fetchmany(50)
                result = [dict(row) for row in rows]
                return json.dumps(result, default=str)
            else:
                conn.commit()
                return json.dumps({"status": "executed", "rows_affected": cursor.rowcount})
        except Exception as e:
            raise Exception(f"PostgreSQL execution failed: {str(e)}")
        finally:
            if conn:
                conn.close()

    def test_connection(self, connection_details: Dict[str, Any]) -> bool:
        conn = None
        try:
            conn = self._get_connection(connection_details)
            cursor = conn.cursor()
            cursor.execute("SELECT 1")
            return True
        except Exception as e:
            raise Exception(f"PostgreSQL connection failed: {str(e)}")
        finally:
            if conn:
                conn.close()