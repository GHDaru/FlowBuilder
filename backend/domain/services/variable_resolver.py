import re
from typing import Any, List, Optional

class VariableResolver:
    """
    Domain service to resolve nested JSON paths and extract variable names from templates.
    Supports dot notation (e.g., 'a.b.c') and legacy exact matching.
    """

    @staticmethod
    def resolve(data: dict, path: str) -> Any:
        """
        Resolves a path string against a dictionary.
        Path can be optionally wrapped in {{}}.
        Returns None if not found.
        """
        if not path or not isinstance(data, dict):
            return None

        # Clean path: remove {{ and }} if present
        clean_path = path.strip()
        if clean_path.startswith("{{") and clean_path.endswith("}}"):
            clean_path = clean_path[2:-2].strip()

        # 1. Try exact match first (legacy support)
        if clean_path in data:
            return data[clean_path]

        # 2. Try nested resolution via dot notation
        parts = clean_path.split(".")
        current = data
        
        for part in parts:
            if isinstance(current, dict) and part in current:
                current = current[part]
            else:
                return None
        
        return current

    @staticmethod
    def extract_variable_names(text: str) -> List[str]:
        """
        Extracts all unique variable names wrapped in {{}} from a text.
        Returns a list of clean paths (without {{}}).
        """
        if not text:
            return []
        
        # Regex to find everything between {{ and }}
        pattern = r"\{\{(.*?)\}\}"
        matches = re.findall(pattern, text)
        
        # Return unique, stripped paths
        return list(set(m.strip() for m in matches if m.strip()))
