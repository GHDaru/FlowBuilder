# Quickstart: NPS IA Evaluation Flow

## 1. Prerequisites
- Python 3.12+
- OpenAI or Gemini API Key configured in `.env`
- Dependencies installed: `pip install -r aitest/requirements.txt`

## 2. Setting Up Rules
1. Open the Streamlit Dashboard: `streamlit run aitest/app.py`.
2. Navigate to the **⚙️ Configuração Avançada** tab.
3. Define rules mapping classifications to dimensions.
   - Example: `Folha` -> `["Comunicação e Clareza", "Profissionalismo e Conformidade"]`.
   - Example: `Suporte Técnico` -> `["Resolução e Eficiência"]`.

## 3. Running an Evaluation
1. Go to the **🚀 Execução Atual** tab.
2. Select your input folder (default: `data/test_samples`).
3. Click **▶ Iniciar Processamento**.
4. The system will:
   - Extract metadata.
   - Classify the service.
   - Select and run dimensions in parallel based on your rules.
   - Consolidate the score and summary.

## 4. Auditing Results
1. Navigate to the **🔍 Auditoria Detalhada** tab.
2. Select an atendimento to see the full audit trail, including every AI prompt/response and the rules that were triggered.
