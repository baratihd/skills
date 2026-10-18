# Documentation-first tests and isolated side effects (mandatory)

## Documentation discovery and gap reporting

1. Before writing each test class, locate documentation for the exact app, model, service, API endpoint, task or business rule being tested. Search the documentation repository/site, `docs/`, technical and quality docs, API/OpenAPI schemas, linked feature/business rules and traceability records. If the documentation repository is external or unavailable, ask for its path; continue with code inspection where possible instead of fabricating documents.
2. Record the documentation path and the relevant source/test evidence for each behavior. Use published and verified requirements to drive the Given/When/Then cases, expected results, authorization, error paths and boundaries. Verify against current code/migrations; do not turn outdated or conflicting documentation into asserted requirements without flagging the discrepancy.
3. **When docs for the tested area cannot be found, announce the missing documentation in the progress/chat output as soon as discovered** (give feature/service name, searched locations, and that tests will be derived from code plus identified evidence). Do not stop writing safe tests solely because docs are absent. Ask for clarification when a missing business contract makes expected behavior uncertain.
4. **After writing tests, explicitly repeat missing-documentation findings in the final chat work report**, even if all tests pass. Include affected test classes/files, absent doc subjects/paths, evidence used instead, assumptions blocked, and whether documentation should be added or corrected. Never quietly omit a gap. If no gaps, state that only after checking.
5. If documentation and implementation disagree, report the concrete mismatch both during work and in the final report; distinguish observed behavior from intended behavior. Do not silently edit Product/Business docs while writing tests unless separately requested.
6. A test-level docstring should mention the specification/documentation reference when known, alongside Scenario, Given, When, Then, and relevant edge conditions. If missing, annotate `Documentation: Not found; derived from <verified code path>` in the docstring, without asserting missing documents exist.

## Mock all outbound third-party, SMS and Celery dispatch by default

- **Third-party requests:** All HTTP/S3/email/external provider or other network requests initiated through third-party clients/gateways must be mocked/stubbed in unit, API, service and ordinary integration/E2E/FireTest automation. Cover success, timeout, connection error, invalid response, auth failure, rate limit and retry behavior when applicable. Patch the symbol **at the point where application code looks it up**, preferably the own gateway/adapter boundary; use HTTP mocking libraries only where the request/response interaction itself is under test.
- **SMS:** Never send actual SMS. Mock the SMS gateway/provider or the application SMS adapter, and assert recipient, normalized template/payload, intended call count, and behavior on provider failures. Use synthetic recipient numbers only.
- **Celery:** Never enqueue real jobs to Redis/RabbitMQ or connect to a live worker in automated tests. Mock task-dispatch APIs (`delay`, `apply_async`, project TaskRegistry/provider, transaction `on_commit` callbacks as needed) at the calling module, and assert dispatch arguments, queue routing, retry/idempotency boundaries and **on-commit timing**. Unit-test task functions/logic synchronously with mocked dependencies and explicit context, without enqueuing. Do not assume `CELERY_TASK_ALWAYS_EAGER` alone prevents all side effects or simulates broker semantics accurately.
- Use `pytest-mock` / `unittest.mock` / `respx` / `responses` as appropriate to existing project libraries. All mocks must be deterministic and assert call and return semantics. Avoid broad patches hiding application bugs. Reset mock state per test.
- Add a fail-closed network guard in test settings/fixtures where technically feasible; whitelist only explicit ephemeral/local test services when justified. Ensure no real external credential or production endpoint is needed to run pytest.
- **Explicit exceptions:** Broker/protocol contract tests or integration tests with ephemeral local containers may be allowed only in a separately identified opt-in suite and isolated environment, with no real third-party or SMS traffic, and with explicit approval. Do not accidentally run such tests in the default CI suite. Normal E2E/FireTest also uses mocked provider boundaries; real-provider smoke checks require a separate manual approval and are outside the default skill workflow.
- When a mock can conceal real adapter behavior, add isolated contract validation against documented schemas or recorded sanitized fixtures and report the limitation; never call a real provider implicitly.

## Work report excerpts (chat output, not only saved files)

During execution, for each missing document: `Documentation gap: <area> — no documentation found in <searched paths>; tests will use verified code evidence <paths>. Expected behavior requiring business confirmation: <...|none>.`

After tests: `Missing documentation: <area>; affected tests: <paths/classes>; searches: <paths>; fallback evidence: <paths>; unresolved expected behavior: <...|none>.`

Also report mocked external boundaries, any attempted outbound network operations prevented, test commands and measured coverage as required by the main skill.
