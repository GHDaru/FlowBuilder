# Quickstart: Prompt Management and Flow Visualization

## Initial Setup

1. **Migrate Prompts**:
   Run the migration script to copy templates from the core resources to the local AI Lab:
   ```bash
   python scripts/sync_prompts.py
   ```

2. **Verify Dependencies**:
   Ensure `graphviz` is installed on your system (for graph rendering). 
   Note: On Windows, you might need to install Graphviz via `choco install graphviz` or download it from the official site.

3. **Start the Dashboard**:
   ```bash
   uv run streamlit run app.py
   ```

## How to use

### Managing Prompts
1. Navigate to the **"⚙️ Configuração Avançada"** tab.
2. Locate the **"📋 Gestão de Prompts"** section.
3. Select a prompt from the dropdown.
4. Edit the content in the text area.
5. Click **"💾 Salvar Prompt"** to persist changes.

### Visualizing Flow
1. Process a new batch or select a previous execution in the **"📜 Histórico"** tab.
2. Go to the **"🔍 Auditoria Detalhada"** tab.
3. Select an atendimento.
4. Expand the **"🗺️ Grafo do Fluxo de Avaliação"** section to see the visual sequence and status of each step.
