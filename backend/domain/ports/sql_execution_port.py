from abc import ABC, abstractmethod
from typing import Dict, Any, Optional

class ISqlExecutionPort(ABC):
    """
    Port for executing raw SQL queries against an external database.
    """
    @abstractmethod
    def execute(self, connection_details: Dict[str, Any], query: str, variables: Dict[str, Any]) -> str:
        """
        Executes the query and returns a JSON stringified result.
        Must enforce safety (parameterized queries) and limits (e.g., 50 rows).
        """
        pass

    @abstractmethod
    def test_connection(self, connection_details: Dict[str, Any]) -> bool:
        """
        Tests the connection using the provided details. Returns True if successful.
        """
        pass