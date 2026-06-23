# Quickstart: Conditional Flows

## 🎨 Building a Conditional Flow

1. Open the **Flow Builder**.
2. Click the `+` FAB to add a Node.
3. Select **"Condição (Router)"** from the menu (or if simply added, change its type/configure it).
4. In the Sidebar, add a rule:
   - **Variável**: `sentiment`
   - **Operador**: `equals`
   - **Valor**: `positive`
5. Connect the `rule-1` handle on the right of the Condition Node to an LLM Node.
6. Connect the `default` handle to a different LLM Node.

## 🧪 Testing the Execution

1. Save the flow and run it against an interaction.
2. Go to the **Histórico** tab.
3. Observe the TraceLog for the Condition node. It will show the rule it evaluated and the path it chose.
4. Verify that only the correct path (LLM nodes connected to the chosen handle) was executed.
