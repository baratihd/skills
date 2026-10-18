# Approved testing enhancements (mandatory when applicable)

These eight items were explicitly approved by the user. Integrate them into the test strategy while preserving the original seed separation, class-based tests, substantial English Given/When/Then docstrings, and no invented domain rules. Inspect existing repo conventions/dependencies before choosing tools.

## 1. Reusable factory fixtures
- Choose **factory_boy** OR **model_bakery**, according to the project's current dependencies and relation complexity; avoid installing both without a clear need.
- Provide composable factory fixtures for real models such as Contract, Insured, Dependant and related entities **only after checking model definitions and required fields**.
- Create deterministic valid defaults, explicitly override uniqueness keys, FKs and status fields. Avoid static primary keys, hidden global objects, real customer data or production credentials.
- Function-scope mutable instances; factories/build functions may be longer-lived if stateless. Clearly distinguish unsaved `.build()` objects from persisted `.create()` entities.

## 2. Line and branch coverage
- Configure pytest-cov/coverage.py `branch = true` or `--cov-branch`. Enforce **>=95% line and >=95% branch separately** for the agreed scope; coverage.py's combined `--cov-fail-under` percentage alone does not prove separate thresholds.
- Read coverage JSON (`coverage json`) or equivalent and calculate `covered_lines / num_statements` and `covered_branches / num_branches` using reported counters. Handle no-branch scopes explicitly and report them as N/A, not 100% branch coverage.
- Exclusions must be narrowly justified, reviewed and documented; fail a CI gate if an applicable threshold is missed. Report overall combined score separately.

## 3. Migration and legacy-data compatibility
- Test schema and data migrations against isolated, disposable databases, exercising forward migrations and, **only if supported and safe**, reverse migrations.
- Test Choice/Enum refactors with existing persisted values, defaults, Django model validation, serializers and API contracts where applicable.
- Use the project's verified migration dependencies / MigrationExecutor or existing approach; do not run actual schema changes against development, staging or production automatically.
- Confirm idempotency for data migrations where it is a documented requirement, and check historical model access via migration apps.

## 4. Performance and DB query regression
- Add representative query-count assertions using `django_assert_num_queries`, `CaptureQueriesContext` or verified equivalent.
- Test N+1 risks in serializers/list endpoints using data sizes >1, ideally compare behavior across two dataset sizes.
- Set explicit query budgets only after measuring a representative baseline and reviewing intended behavior; don't invent a universal query number.
- For timing/load performance, use a stable controlled environment and meaningful baselines; keep flaky wall-clock timings out of mandatory normal CI unless justified.

## 5. Domain test-data builders
- Provide readable builders for supported domain aggregates (Contract, InsurancePolicy, Expense, and linked Insured/Dependant) based on **verified relationships and constraints**.
- Expose explicit options for state, role, ownership, coverage, dates, and associations when they exist; don't invent unsupported fields.
- Compose lower-level factories; do not bury business setup in global seed fixtures; document created records and guaranteed invariants.
- Add builder tests for complex invariant-preserving scenarios.

## 6. Security, authorization, and isolation
- Cover unauthenticated/unauthorized access, actual role permissions, object ownership, cross-contract and cross-tenant isolation where applicable.
- Test API list/detail/write/export endpoints for IDOR, query scoping, inadvertent data exposure, and sensitive fields.
- Assert both response semantics and lack of forbidden DB side effects; include negative tests with users having similar permissions but different object scopes.
- Never assume that all roles, endpoints or tenant models exist; enumerate verified controls.

## 7. Mandatory CI testing and coverage gate
- Integrate pytest, Ruff/repository checks, safe migration compatibility checks, and dual coverage threshold verification into existing CI workflows or supply a verified new workflow.
- Cache dependencies appropriately; use ephemeral PostgreSQL and service doubles as needed. Never connect CI to a live database or actual external integrations.
- Trigger for relevant pull requests; upload readable coverage/test artifacts while ensuring secrets are absent.
- CI workflow failures block a merge **only when the actual repository branch protection/ruleset makes the status check required**. Instruct the repository administrator how to configure this, and verify before claiming merge protection is active.

## 8. Property-based tests with Hypothesis
- Use Hypothesis for verified invariants on numeric limits, dates, monetary calculations, enum boundaries, and other applicable pure/domain logic.
- Define domain-aware bounded strategies, meaningful examples, reproducible shrink behavior and stable database handling (`hypothesis.extra.django` when appropriate).
- Avoid combining uncontrolled third-party I/O, clock-dependent behavior or non-deterministic external state with property tests.
- Add a specific failure reproduction example when Hypothesis discovers a bug; never change a business rule based solely on a guessed invariant.

## Execution and reporting
1. Inspect source and documentation; map applicable enhancements to code locations and existing tests.
2. Plan changes to factories/builders, tests, migration validation, CI and configuration before modifying files.
3. Implement and run targeted pytest classes, then wider affected suites; check both coverage counters and query baselines.
4. Report: commands, executed tests, line % and branch %, migration compatibility, performance baselines, security matrix, Hypothesis results, CI status, files changed, open ambiguities and reasons for N/A cases.
5. If infrastructure or repository permissions prevent an actual check, report **not verified** rather than marking it passed.
