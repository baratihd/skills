# Evidence, traceability, and confidence rules

- Evidence notation: `path/to/file.py::Class.method` (optionally verified line range), `METHOD /api/path/`, `Model.field`, `tests/path.py::test_name`, `docs/path.md#heading`, plus `commit: <SHA>`.
- Confidence/status: `تأییدشده از کد`, `تأییدشده از تست`, `تأییدشده از سند`, `نیازمند تأیید`, `متناقض با منبع دیگر`.
- A test alone cannot prove production configuration, network path or deployment behavior.
- Do not infer business rationale from method names. If business intent cannot be confirmed, use exactly: `مستند این بخش بر مبنای جزئیات موجود در کد نوشته شده است.` immediately after the relevant explanation, then state questions.
- Traceability matrix: ID | behavior/rule | evidence | tests existing/proposed | pages | confidence | updated commit.
- Assign IDs persistently; never recycle retired IDs. No fabricated paths, endpoints, test names or source line numbers.
- Sources from frontend require explicit path and actual inspection; absent frontend source is a GAP, not a guess.
- Coverage denominator must be declared: e.g., 18 discovered HTTP endpoints, 12 reviewed; 6 pending. Do not assign full coverage simply because a page exists.
