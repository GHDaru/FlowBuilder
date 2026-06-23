# UI Contract: Streamlit File Explorer

## 1. File Explorer Section (Sidebar)

A new collapsible section in the sidebar to show found files.

### Components
- **Refresh Button**: 🔄 Button to trigger `scanner.scan_atendimentos()`.
- **File Table**: A `st.dataframe` or `st.table` showing:
  - Select (Checkbox for inclusion in processing)
  - Filename
  - Type (.txt, .pdf)
  - Size

### Interactions
- Clicking **Refresh** updates the session state `available_files`.
- If no files are found, display a warning: "No supported files found in the specified path."
- If the path is invalid, display an error: "Invalid directory path."

## 2. Processing Feedback (Main Tab)

### Components
- **Pre-flight Log**: Before starting, show a summary: "Preparing to process 5 files (3 text, 2 PDF)..."
- **Live Status**: Update the "Arquivo" column in the results table to include the file type icon.

## 3. PDF Support Details
- When a PDF is processed, the "Audit Log" should show the extracted text under "Conteúdo Original".
