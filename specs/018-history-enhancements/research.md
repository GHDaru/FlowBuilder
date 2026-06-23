# Research: Execution History Enhancements

## Decision 1: Metadata Storage Strategy
**Decision**: Extract Firm, Client, and Attendant information from the final execution state (consolidated JSON) during retrieval, but also allow the `Tracking` model to cache these values for faster listing if needed. For now, we will look for specific keys in the `TraceLog` corresponding to the extraction step.
**Rationale**: Storing it in the state is flexible. Caching it in `Tracking` makes the history sidebar much more useful without having to fetch logs for every item.

## Decision 2: Timing Calculation
**Decision**: 
- **Per-node**: Use `time.perf_counter()` inside the LLM and Router functions in `LangGraphAdapter` to measure milliseconds. Store this in `TraceLog.duration_ms`.
- **Total**: Record `finished_at` in the `Tracking` table when the `execute` method in `FlowExecutionUseCase` completes. The total duration will be the difference between `started_at` and `finished_at`.
**Rationale**: `perf_counter` is high-resolution. Total time must be aggregate to account for overhead and potential future concurrency.

## Decision 3: Bulk Copy Format
**Decision**: Generate a consolidated JSON object where each key is the `node_id` (or `node_label`) and the value is the parsed `response_json`.
**Rationale**: This provides a clean "summary of truth" for the entire execution in one click.
