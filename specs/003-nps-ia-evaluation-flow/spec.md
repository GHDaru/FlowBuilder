# Specification: NPS IA Evaluation Flow

## 1. Overview
This document specifies the target architecture and behavior for the NPS IA Evaluation Flow. The flow is designed to analyze customer support interactions (atendimentos) through a multi-step process utilizing AI models with Structured Outputs.

## 2. Core Components

### 2.1 Execution Dashboard
- **Purpose**: Provides visibility into the processing of batches or individual files.
- **Features**:
  - Displays the current state of each execution (e.g., RUNNING, COMPLETED, ERROR).
  - Shows processing progress.
  - Allows detailed visualization of the results for each processed item, including scores, extracted metadata, and the audit trail of AI calls.

### 2.2 Metadata Extractor
- **Purpose**: Extracts key information from the raw text (e.g., dates, names, ticket IDs).
- **Implementation**:
  - Driven by a specific Markdown prompt file.
  - Uses AI Structured Output (JSON Schema) to guarantee the format of the extracted data.

### 2.3 Classifier (Tagueamento)
- **Purpose**: Categorizes the interaction based on predefined classes and items.
- **Implementation**:
  - Driven by a Markdown prompt.
  - Uses AI Structured Output.
- **Configuration Interface**:
  - The UI must allow users to edit the Markdown prompt directly to define the available classes, items per category, and their descriptions. This ensures the classification logic is dynamic and user-configurable without code changes.

### 2.4 Rules Configurator
- **Purpose**: Determines which scoring dimensions or categories are applicable to a given interaction based on the extracted metadata and classification.
- **Implementation**:
  - A configurable rules engine (accessible via UI) that acts as a gatekeeper.
  - E.g., "If classification is 'Technical Support', execute Dim01 and Dim03. If 'Billing', execute Dim02."

### 2.5 Scoring Dimensions
- **Purpose**: Evaluate the interaction across multiple axes to generate an objective score.
- **Dimensions**:
  - **Dim01**: Cliente (Customer Sentiment / Satisfaction)
  - **Dim02**: Dimensão 02 (e.g. Comunicação e Clareza)
  - **Dim03**: Dimensão 03 (e.g. Resolução e Eficiência)
- **Implementation**:
  - Each dimension is powered by its own dedicated Markdown prompt.
  - Each dimension calls the AI and requires a specific Structured Output containing the score and the justification.

### 2.6 Consolidator
- **Purpose**: Aggregates the results from the Metadata Extractor, Classifier, and Scoring Dimensions to produce the final evaluation report.
- **Implementation**:
  - Calculates the final score (e.g., weighted average of dimensions).
  - Uses a final AI call (optional) or deterministic logic to generate a coherent summary of the evaluation.

## 3. Data Flow
1. **Input**: Raw text/Markdown/PDF is loaded.
2. **Step 1 - Metadata**: AI extracts metadata using `prompt_metadata.md` -> Validates Structured Output.
3. **Step 2 - Classification**: AI classifies using the dynamically configured `prompt_classifier.md` -> Validates Structured Output.
4. **Step 3 - Rules Evaluation**: The system evaluates the output of Steps 1 & 2 against configured rules to select applicable Scoring Dimensions.
5. **Step 4 - Scoring**: Executes the selected Dimension prompts (`prompt_dim01.md`, etc.) in parallel or sequentially -> Validates Structured Outputs.
6. **Step 5 - Consolidation**: Aggregates results, calculates final score, and generates the final summary.
7. **Output**: Result is saved to the database and displayed on the Dashboard.
