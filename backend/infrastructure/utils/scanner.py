import os
import re
from pathlib import Path
from typing import List, Optional

def scan_atendimentos(folder_path: str) -> List[Path]:
    """Scans a folder for processable atendimento files (.txt, .md, .pdf)."""
    p = Path(folder_path).resolve()
    if not p.exists() or not p.is_dir():
        return []
    
    files = []
    # Support common text formats
    extensions = [".txt", ".md", ".pdf"]
    
    for file in p.iterdir():
        if file.is_file() and file.suffix.lower() in extensions:
            files.append(file)
            
    return sorted(files)

def extract_atendimento_id(file_path: Path) -> Optional[str]:
    """
    Extracts numeric ID from filename. 
    Example: 12345.pdf -> 12345
    """
    filename = file_path.stem
    # Match first sequence of digits
    match = re.search(r'\d+', filename)
    return match.group(0) if match else filename
