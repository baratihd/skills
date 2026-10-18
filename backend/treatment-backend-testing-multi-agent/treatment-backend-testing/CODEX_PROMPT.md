# Codex prompt: one-time setup vs normal test implementation

**Normal test invocation (default):** Use `$treatment-backend-testing` in `test` mode. Read `SKILL.md`, `references/bootstrap-lifecycle.md`, and `references/test-package-architecture.md`. Reuse the previously created Choices/Enums, reference seed commands, factories and domain builders. Do not audit the entire Django database, rebuild seed profiles, or refactor unrelated enums. Read the requested feature's documentation; notify me during the work and again in the final report if documentation is missing. Mock third-party, SMS, and Celery dispatch. Write class-based pytest tests with detailed English scenarios and run the relevant coverage/quality checks.

**Initial one-time setup (explicit only):** Use `$treatment-backend-testing` in `bootstrap` mode and follow the one-time phases below. Complete once, validate, and record the project-level bootstrap manifest. Future uses should default to `test` mode.

**Targeted evolution (explicit or evidence-backed):** Use `maintain-bootstrap` mode to update a specific changed enum/seed dependency and manifest without a full database audit.

---

# One-time bootstrap detailed instructions

Use `$django-product-documentation` and `$treatment-backend-testing`. Reread the latest `SKILL.md` and reference files of both skills before working.

**Scope:** Work in the actual Treatment Django backend repository. First produce an evidence-backed inventory of all apps, models, status/type fields, existing `choices`/`Enum` classes, database reference tables, migrations, role definitions, and current seed/fixture/test conventions. Cross-check technical/database documentation and code; where docs disagree with code, report the discrepancy. Use Graphify if available, otherwise inspect the repository directly.

**Phase A — Audit and plan:** Identify repeated magic-string/magic-integer values suitable for `TextChoices`, `IntegerChoices`, or Python `Enum`. Distinguish bounded enums from genuinely dynamic lookups. For every proposed refactor include the actual persisted values, source references, all consumers, API/serializer effects, migrations/data preservation needs, tests and potential backward compatibility problems. Never guess business semantics; ask before a material unknown or destructive action.

**Phase B — Implement approved safe refactors:** Extract reusable Choices/Enums for applicable code-backed constants; retain existing database values and public API contracts. Update all safe usages and tests. Do not perform unsafe data migrations or rewrite existing rows without approval.

**Phase C — Deterministic seed profiles:** Implement a repo-conventional Django management command with explicit `reference`, `development` and `test` profiles, `--database` and a safe dry-run option where feasible. `reference`: mandatory DB-backed reference rows only. `development`: reference + synthetic valid sample contracts/relations, including three synthetic users per **actual** role (based on source definitions), without production identities or known passwords. `test`: **reference only**; no sample contracts, users, policies, insureds or other demo business objects. Python Enum/Choices do not require database insertion. Derive required reference rows from actual dependencies rather than seeding every lookup table. Ensure idempotence, stable natural keys, FK ordering, transaction safety, verified database aliases and strict refusal of ambiguous production targeting. Never connect to or mutate an unverified DB. Explain how pytest-django creates its transient test database and loads only required reference rows; create business scenario objects only using pytest fixtures. Do not run seeds against real environments without explicit target confirmation.

**Mandatory documentation and external-boundary rules:** Before developing tests for any specific feature, locate and read its documentation and cross-check the code. If the feature docs cannot be found, notify me in the chat as soon as you discover the gap and continue with verified source evidence; after creating the tests, explicitly list every missing document in your final chat report (area, searched directories, source fallback, affected tests, uncertainties). Do not silently omit missing documentation. Mock all outbound third-party/provider operations, SMS sending and Celery enqueue/dispatch in default tests, including E2E/FireTest. Validate mock payloads and task arguments and on-commit timing, use a fail-closed network policy when feasible, and never contact real providers or brokers. Read `references/documentation-and-isolation.md` for the exact policy.

**Phase D — Test prerequisites:** Set up or adapt pytest, pytest-django, pytest-cov and class-based `Test*` suites. Build layered fixtures for reference, model, domain, service and API cases. Organize tests as importable hierarchical `tests` packages by Django app/domain and test layer (unit, integration, API, security, property-based, migration and smoke/FireTest when relevant); keep factories/builders reusable and put scoped fixtures in nearby `conftest.py`. Do not create monolithic test files. Every test class and method must have a detailed **English** docstring including scenario / Given / When / Then. Fixtures must document guarantees. No standalone function-based test cases. Test behavior with success, failure, boundary, isolation and side-effects as supported by the implementation. Target at least 95% measured coverage for the explicitly stated scope; no fake measurements or blanket exclusions. Never load development seeds into the test DB.

**Phase E — Verification and reporting:** Run dry-run seed validation, verify repeatability in an isolated development DB and clean test DB when safe, pytest test classes and affected suites, pytest-cov with `--cov-fail-under=95`, Ruff, and relevant project checks. Record exactly what was executed vs not executed. Report in English all changed files, enum mappings, profile contents, CLI commands, test results, measured coverage, uncovered areas, documentation discrepancies, risks and questions. Do not claim a passing gate unless demonstrated.

Keep all unrelated application code and documentation unchanged. Preserve the established Technical/Quality English and Product/Business Persian language policy. Optional further enhancements must not be adopted without explicit user approval.


## Additional user-approved requirements (vNext)

Read `references/approved-enhancements.md` and incorporate all eight approved enhancements where applicable. Use one factory library selected after repository inspection; compose domain builders; measure >=95% **line AND branch** coverage separately; test migration/legacy data compatibility, query budgets/N+1, authorization/ownership/cross-contract isolation, and Hypothesis properties. Implement PR CI checks and explain that branch protection must separately mark checks as required before merging is blocked. Preserve class-based pytest tests and comprehensive English scenario docstrings. Never fabricate results or invent business invariants.

**Final chat report requirement:** Include a dedicated `Missing documentation` section even when tests pass. State doc gaps found, affected test paths, searched sources, code fallback, and open business questions; mention mocked third-party, SMS, and Celery boundaries.


## Standing instructions for all future uses

All the policies in `SKILL.md` and its referenced files are mandatory on every relevant run; the user need only say `$treatment-backend-testing` and name the target feature (or explicitly request `bootstrap`/`maintain-bootstrap`). Before writing new tests, read the matching docs and report missing docs twice (during the run and in final chat), mock third-party/SMS/Celery, place tests in the hierarchical package, and reuse one-time bootstrap artifacts. See `references/test-package-architecture.md`.
