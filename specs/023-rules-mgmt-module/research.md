# Research: rules-mgmt-module

## Decision: Database Schema Refactoring
The existing `EvaluationRuleTable` in `connection.py` is too simple. We will replace it with a new `Rule` model that supports the AVALIA v1 requirements.

- **Entity**: `Rule`
- **Fields**:
    - `id`: UUID (Primary Key)
    - `name`: String (identifiable name)
    - `text`: Text (IA instruction)
    - `dimension`: String (id of dimension or 'todas')
    - `scope`: String ('global' or 'especifico')
    - `context`: String (null for global, context ID for específico)
    - `is_active`: Boolean
    - `origin_type`: String ('manual' or 'feedback')
    - `origin_ref`: String (atendimento_ref if feedback)
    - `origin_feedback`: Text (original supervisor text)
    - `created_at`: DateTime

## Decision: AI Prompt for Feedback Generalization
We will implement an AI service that uses a specific prompt to convert (Transcript, Evaluation, Feedback) into a Rule. 
The prompt will follow the principles:
1. Generalize over classes of situations.
2. Address the AI Evaluator in the second person.
3. Explicitly state the impact (ignore, floor, ceiling, etc.).

## Decision: Automated Backup & Restore
To comply with the Constitution (Data Backup & Restore mandate):
1. **Backup**: Before `init_db()` runs (which might drop/recreate tables during development), the system will check if `audit.db` exists. If it does, it will export all `Rule` and `Flow` records to a JSON file in `aitest/backend/data/backups/`.
2. **Restore**: After `init_db()`, if the database is empty but backup files exist, it will re-populate the tables.
3. **Trigger**: This will be part of the `infrastructure/database/connection.py` initialization logic or a separate management script.

## Alternatives Considered
- **SQLAlchemy Migrations (Alembic)**: While professional, for a "Visual Lab" environment, the auto-backup/restore strategy defined in the Constitution provides more flexibility for rapid iteration and "destructive" schema changes.
- **Separate Feedback Entity**: Rejected. Feedback is just metadata for a rule origin. Storing it directly in the `Rule` record keeps queries simple.
