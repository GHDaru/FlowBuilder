# Data Model: File Processing

## Entities

### FileMetadata
Represents a file detected in the input directory.

| Field | Type | Description |
|-------|------|-------------|
| name | string | Filename including extension. |
| path | string | Absolute or relative path to the file. |
| extension | string | File extension (e.g., .txt, .pdf). |
| size_kb | float | File size in Kilobytes. |
| is_supported | boolean | True if extension is in [.txt, .md, .pdf]. |
| status | string | UI-specific status (e.g., "Ready", "Processed", "Error"). |

## Relationships
- An **Execution** (existing entity) contains multiple **Atendimentos**.
- Each **Atendimento** is created from one **FileMetadata**.
