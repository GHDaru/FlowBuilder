# Research: File Processing and PDF Support

## 1. Root Cause Analysis: "File Not Found"

The "file not found" issue reported by the user has two likely causes:
1. **Strict Extension Filtering**: The current `scanner.py` only looks for `.txt` and `.md`. If the user has other files (like `.pdf` or even `.txt` with different casing on some OS), they won't be listed.
2. **Relative Path Resolution**: The default path `../data/test_samples` in `app.py` depends on the current working directory. If the user runs streamlit from the project root instead of the `aitest` directory, the path might resolve incorrectly.

**Decision**:
- Add `.pdf` to supported extensions.
- Use `pathlib` for all path operations to ensure robustness across Windows/Linux.
- Implement a proactive file listing in the UI so the user can see exactly what the system detects.

## 2. PDF Library Selection

Evaluated options for PDF text extraction in Python:
- **pypdf**: Lightweight, pure Python, easy to install. Good for basic text extraction.
- **PyMuPDF (fitz)**: Very fast and robust, but has C dependencies and a larger footprint.
- **pdfminer.six**: High accuracy for complex layouts, but slower and more complex API.

**Decision**: 
- **pypdf** will be used. It aligns with the "Vibe Coding" principle of low friction and is sufficient for the text extraction needs of this project.

## 3. Streamlit UI Integration

The current UI starts processing immediately after clicking the button. There is no intermediate step to verify files.

**Decision**:
- Add a "File Explorer" section in the sidebar or main tab.
- This section will display a table of found files, their sizes, and status (Supported/Unsupported).
- Add a "Refresh" button to re-scan the folder without restarting the app.

## 4. Integration with Evaluation Flow

The `EvaluationFlow.run_full_evaluation` currently expects `content` (string). For PDFs, we need to extract the text first.

**Decision**:
- Create `FileService.read_file(path)` which handles different extensions.
- `.txt`, `.md` -> simple read.
- `.pdf` -> extract text using `pypdf`.
