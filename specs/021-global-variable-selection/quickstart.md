# Quickstart: global-variable-selection

## Setup
1. Run backend migrations/startup to ensure `OfficialDataService` is ready.
2. Open the AI Visual Lab frontend.

## Usage
1. **Create/Open a Flow**: Go to the Flow Builder.
2. **Configure Start Node**: Click on the circular "Start" node.
3. **Select Variables**: In the sidebar, you will see a list of "Global Variables". Check the ones you want to use.
4. **Save**: Click "Salvar Configuração".
5. **Use in Prompts**: In any LLM node, type `{{contabilidade_nome}}` (or any other selected variable) to inject the value during execution.
6. **Run**: Execute the flow on official data or local samples. The variables will be resolved automatically.

## Verification
- Check the "Trace" in the History tab.
- The "Input" section of the first LLM node should show the resolved values of the global variables.
