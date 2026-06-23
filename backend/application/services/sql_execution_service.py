from typing import Dict, Any
from infrastructure.adapters.sqlite_execution_adapter import SqliteExecutionAdapter
from infrastructure.adapters.postgres_execution_adapter import PostgresExecutionAdapter
from domain.ports.sql_execution_port import ISqlExecutionPort

class SqlExecutionService:
    """
    Application Service coordinating SQL execution via Ports.
    """
    @staticmethod
    def _get_adapter(database_type: str) -> ISqlExecutionPort:
        if database_type.lower() == "sqlite":
            return SqliteExecutionAdapter()
        elif database_type.lower() == "postgres":
            return PostgresExecutionAdapter()
        else:
            raise ValueError(f"Unsupported database type: {database_type}")

    @staticmethod
    def execute(database_type: str, connection_details: Dict[str, Any], query: str, variables: Dict[str, Any] = None) -> str:
        variables = variables or {}
        adapter = SqlExecutionService._get_adapter(database_type)
        return adapter.execute(connection_details, query, variables)

    @staticmethod
    def test_connection(database_type: str, connection_details: Dict[str, Any]) -> bool:
        adapter = SqlExecutionService._get_adapter(database_type)
        return adapter.test_connection(connection_details)