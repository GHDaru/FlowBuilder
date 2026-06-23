# Quickstart: Enhanced File Processing

## 1. Prerequisites
Ensure you have the latest dependencies installed:
```bash
cd aitest
uv pip install pypdf
```

## 2. Setup Input Folder
1. Create a folder (e.g., `aitest/data/test_samples`).
2. Add your `.txt`, `.md`, and `.pdf` files.

## 3. Running the App
```bash
cd aitest
uv run streamlit run app.py
```

## 4. How to Use
1. In the sidebar, enter the path to your "Pasta de Atendimentos".
2. Click **Refresh** to see the detected files in the sidebar explorer.
3. Verify that your PDF files are listed.
4. Go to the "🚀 Execução Atual" tab and click **Iniciar Processamento**.
5. Monitor the logs to see the files being processed.
