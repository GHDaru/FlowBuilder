# Quickstart: Lab Postgres Integration

## 🛠 Backend Setup
1. Update your `.env` file with the official database URL:
   ```env
   OFFICIAL_DATABASE_URL=postgresql://user:pass@host:port/dbname
   ```
2. Ensure you have the `psycopg2-binary` package installed in the backend environment (`uv sync`).

## 🧪 Testing the Integration
1. **List Firms**:
   ```bash
   curl http://localhost:8000/official/firms
   ```
2. **List Interactions**:
   ```bash
   curl http://localhost:8000/official/firms/{firm_id}/interactions
   ```

## 🎨 UI Access
1. Start the frontend: `npm run dev` in `aitest/frontend`.
2. Navigate to the new **Official Data** tab.
3. Search for a firm and click to view its interactions.
4. Select one or more interactions.
5. Choose an **AI Flow** from the dropdown.
6. Click **Executar Fluxo**.
7. Observe the results in the **Histórico** tab.
