# Quickstart: rules-mgmt-module

## Setup
1. Ensure the backend is running with the new `Rule` entity in `connection.py`.
2. The auto-backup system will initialize `aitest/backend/data/backups/`.

## Usage

### 1. Manual Creation
1. Go to the **Regras** tab in the AI Visual Lab.
2. Click **Nova Regra**.
3. Describe the rule in plain text.
4. Review the AI-generated instruction.
5. Save and Activate.

### 2. From Feedback
1. In the **History** or **official Data** view, click **Contestar Avaliação** on a specific dimension.
2. Enter your feedback (e.g., "The client was away, the attendant shouldn't be penalized").
3. Click **Gerar Regra**.
4. Review the auto-generated JSON rule.
5. Click **Adicionar ao Repositório**.

## Verification
- Run a flow that processes the same type of atendimento and verify that the new rule is listed in the trace and impacts the final score.
- Check the backend console for `[BACKUP]` logs during startup.
