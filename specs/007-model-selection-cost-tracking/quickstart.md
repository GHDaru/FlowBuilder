# Quickstart: Model Selection and Cost Tracking

## 🛠 Backend Configuration
1. Ensure `OPENAI_API_KEY` and `GEMINI_API_KEY` are set in your `.env`.
2. Run migrations (or delete `audit.db` and restart) to update `TraceLog` columns.
3. Test model discovery:
   ```bash
   curl http://localhost:8000/models
   ```

## 🎨 Frontend Usage
1. Open the **Flow Builder**.
2. Select an **LLM Node**.
3. In the sidebar, use the new **Modelo** dropdown to pick your engine.
4. Click **Salvar Configuração**.

## 📊 Monitoring Costs
1. Run a flow.
2. Go to the **Histórico** view.
3. Observe the `Input Tokens` and `Output Tokens` badges in each step log.
4. Check the execution summary for the total "bill".
