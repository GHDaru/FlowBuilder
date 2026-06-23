# Quickstart: Enhanced Variable Syntax

## 🚀 Testing Nested Variables in Prompts
1. Open the AI Visual Lab.
2. Create a flow where the first node returns a structured JSON, e.g.:
   ```json
   { "user": { "name": "John", "role": "Admin" } }
   ```
3. Create a second LLM Node and set its prompt to:
   "Hello {{user.name}}, you are an {{user.role}}."
4. Execute the flow and verify the prompt in the **Histórico** tab.

## 🔀 Testing Nested Variables in Routes
1. Create a Condition Node.
2. Add a rule:
   - **Variable**: `{{user.role}}`
   - **Operator**: `equals`
   - **Value**: `Admin`
3. Connect the "Admin" edge to a specific node.
4. Execute the flow and verify that it routes correctly based on the nested value.
