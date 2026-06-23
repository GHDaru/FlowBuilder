import os
from pathlib import Path
from typing import List, Dict, Union
from pypdf import PdfReader

class FileService:
    @staticmethod
    def list_files(folder_path: Union[str, Path], extensions: List[str] = [".txt", ".md", ".pdf"]) -> List[Dict]:
        """Lists files in a folder with metadata."""
        p = Path(folder_path).resolve()
        if not p.exists() or not p.is_dir():
            return []
        
        files_metadata = []
        for file in p.iterdir():
            if file.is_file():
                ext = file.suffix.lower()
                files_metadata.append({
                    "name": file.name,
                    "path": str(file),
                    "extension": ext,
                    "size_kb": round(file.stat().st_size / 1024, 2),
                    "is_supported": ext in extensions
                })
        
        return sorted(files_metadata, key=lambda x: x["name"])

    @staticmethod
    def read_file(file_path: Union[str, Path]) -> str:
        """Reads content from a supported file (.txt, .md, .pdf)."""
        p = Path(file_path).resolve()
        if not p.exists():
            raise FileNotFoundError(f"File not found: {p}")
        
        ext = p.suffix.lower()
        if ext in [".txt", ".md"]:
            with open(p, 'r', encoding='utf-8') as f:
                return f.read()
        elif ext == ".pdf":
            reader = PdfReader(p)
            text = ""
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            return text.strip()
        else:
            raise ValueError(f"Unsupported file extension: {ext}")
