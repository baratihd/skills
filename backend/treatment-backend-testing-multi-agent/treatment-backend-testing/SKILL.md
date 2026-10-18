---
name: treatment-backend-testing
description: Use for Treatment Django backend testing in Codex, OpenCode, or Claude Code. Documentation-first class-based pytest, one-time Choices/Enums and seed bootstrap, isolated fixtures and external mocks, >=95% line/branch coverage, and reusable testing workflows.
---

# Treatment Backend Testing

**Cross-agent compatible:** Codex, OpenCode, and Claude Code share this exact skill. Agent-specific entrypoints and permissions do not alter any mandatory testing rule. Read `references/cross-agent-compatibility.md` for activation, install paths, and portability conventions. Modes: `bootstrap` (one-time), `test` (default), and `maintain-bootstrap` (scoped prerequisite updates).

## Mission and precedence

Write reliable, repeatable tests based on **verified** Treatment backend behavior. Consult the project documentation, relevant source code, migration history, and existing tests together; do not mistake documentation for executable truth. Preserve the project's actual contracts and ask about material ambiguities. Do not introduce proposed, optional testing enhancements without user approval.

**Documentation language:** Technical and Quality documentation, pytest class/method docstrings, fixture docstrings, scenarios and test reports are **English**. Existing Product/Business documentation remains Persian per `django-product-documentation` policy. Do not translate or rewrite unrelated documents.

Read `references/cross-agent-compatibility.md` and `references/bootstrap-lifecycle.md` and, as applicable, `references/model-and-seed-policy.md`, `references/pytest-design.md`, `references/verification-and-reporting.md`, `references/approved-enhancements.md`, and `references/documentation-and-isolation.md`, and **`references/test-package-architecture.md`** before performing relevant work. The eight enhancements in `approved-enhancements.md` are explicitly approved; other proposals still require approval.

## Execution modes — one-time bootstrap vs normal testing (MANDATORY)

**Default mode: `test`.** A regular request to write/update/run tests MUST NOT repeat the repository-wide database/model/Choices/Enums audit, regenerate seed files, refactor enums, or load development seed data. Read `references/bootstrap-lifecycle.md` first. Locate the established project-level bootstrap manifest and commands; consume existing Choices/Enums, reference seed tooling, factories, and domain builders. Inspect only the models, migrations and dependencies directly relevant to the requested tests. Documentation-first checks still apply per feature.

**Explicit mode: `bootstrap`.** Perform the initial broad audit and install/refactor Choices/Enums, reference/development/test seed profiles, and pytest foundations **once**, only when the user requests initial setup or explicitly authorizes a missing prerequisite. Persist a bootstrap manifest in the **project repository** (not inside the Skill) with schema/version, paths, inventory, code revision, setup status and validation evidence. Never treat the existence of the manifest alone as proof that setup succeeded; verify referenced artifacts exist. Do not run seed commands against unknown databases.

**Mode: `maintain-bootstrap`.** On concrete drift (new required reference row, new model/type, broken seed command or user-requested schema change), identify and update only affected components; no unconditional full audit or seed rebuild. State why maintenance was necessary. If bootstrap is absent in regular `test` mode, report the missing prerequisite and propose/implement the smallest safe test-local fixture fallback; do not silently start a repository-wide bootstrap.

Existing step headings below describe what to do **only when their work is applicable**: Step 1's repository-wide inventory and Step 2 are `bootstrap`/`maintain-bootstrap` steps. Steps 3–5 apply to normal feature-testing with scoped inspection. Bootstrap seed creation, seed loading, and test execution are separate operations; no seed is loaded implicitly merely because this Skill was invoked.

## Step 1 — Discover behavior and dependencies

1. **Documentation-first, mandatory:** Before each test suite/class, find and read docs for its exact behavior. Follow `references/documentation-and-isolation.md`. Announce missing area-specific docs **during work in the chat**, and report them **again after test writing in the final chat report**. Do not invent expected behavior. Read `django-product-documentation` outputs when available: technical/database schemas, API contracts, business rules, quality/scenarios, traceability, and known unknowns. When absent, inspect the source directly and record gaps; do not assume documentation exists.
2. When available run Graphify: `graphify query "BEHAVIOR tests callers side effects" --budget 900`. If missing, continue with repository searches and code navigation rather than blocking.
3. In `bootstrap` only, inventory the full project (apps, models, schema, choices, migrations, roles and seeds) read-only. In normal `test` mode, inspect **only feature-relevant** models, managers, serializers, validators, permissions, migration history, signals, factories and tasks.
4. In `bootstrap` or targeted `maintain-bootstrap` only, inventory states/statuses/type identifiers represented by raw strings or integers. Decide case by case whether they deserve `TextChoices`, `IntegerChoices` or `Enum`; avoid enums for arbitrary user-editable values, dynamically administered taxonomies, or external values not bounded by an established contract.
5. Document for each candidate its evidence, use sites, persisted data, wire contract, default values, migration impact, compatibility risk and proposed class. Do not silently change persisted values or public response payloads.
6. For unclear business meaning or value mapping, record a question. No guessing, no destructive migration or data rewriting without explicit approval.

## Step 2 — Choices/Enums and seed separation (bootstrap/targeted maintenance ONLY)

Follow `references/model-and-seed-policy.md` strictly. Create or refactor choice classes with stable values and tests for backwards compatibility. Django `TextChoices`/`IntegerChoices` are Python definitions and **are not records to insert**. Seed only required database-backed reference records when actually needed.

Create these explicit commands/seed profiles **once during bootstrap**, then reuse them in later test sessions:

- **reference**: only essential persisted code-backed reference catalog rows whose absence breaks a valid blank environment; idempotent, deterministic, safe for both development and test. Never include demo users or contracts.
- **development**: reference plus optional realistic synthetic records, e.g. sample contracts and exactly three synthetic users per actual role if approved by schema and role model. Keep consistent FKs, constraints and contractual invariants; never import production data.
- **test**: reference ONLY. No demo contracts, sample insured people, or demo users. Scenario data must be generated and torn down by pytest fixtures.

Provide an explicit environment-selected `manage.py` command with `--profile reference|development|test`, `--database`, `--dry-run` where feasible, validation and documented examples. Names and implementation should follow the repository's established conventions; these are behavior requirements, not a forced public API. Default must be non-destructive and never silently target production. Do not bypass migrations, permissions, transaction safety, or database routers. Use transactions, get_or_create/update_or_create only with stable natural keys and carefully controlled defaults. Never delete user data as a means of making seeds idempotent.

Do not auto-apply seed commands, edit a real database, run migrations on an unknown environment, or create development users without verifying the target and obtaining appropriate authorization. Never use fixed or published passwords; provide local-only secure provisioning.

## Permanent rules — no repeated user prompts required

**All requirements in this file and its references are standing instructions**, not optional suggestions and not one-time prompts. In every `test` run, enforce documentation-first behavior, missing-documentation notifications during work and in the final chat report, third-party/SMS/Celery dispatch mocking, English class-based pytest and detailed scenario docstrings, layered fixtures, factory/builders, isolated test data, separate >=95% line and branch targets, and relevant migration, performance, security, Hypothesis and CI policies. Use the approved `references/approved-enhancements.md` without requiring the user to repeat its list. See `references/test-package-architecture.md` for mandatory hierarchical test package placement. Do not claim any gate passed without real execution evidence. Repository settings for required CI checks may need separate administrator action.

## Step 3 — Class-based pytest design

Use **pytest + pytest-django**, rather than Django's `manage.py test` runner. Write tests as pytest-collected **classes**, e.g. `class TestContractCreation:` with `def test_...` methods. Do not introduce standalone function-based test cases. (pytest fixture functions and helper functions remain permitted.) Do not subclass `unittest.TestCase` unless a repository-specific necessity is documented and approved.

**Mandatory test file placement:** Organize test files in a scalable hierarchical `tests` package grouped by app/domain and test layer (unit, integration, API, security, properties, migration, E2E/FireTest where applicable). Follow `references/test-package-architecture.md`; avoid a flat `tests/` directory and giant catch-all modules. Respect existing app-local test packages that provide equivalent hierarchy. Do not reorganize unrelated tests during normal `test` runs.

Adopt layered and composable fixtures: minimal primitives/reference, model factories, domain aggregates, service mocks/fakes, request/API clients and role/auth contexts; scoped by need and reusable without becoming hidden global seed state. Use `@pytest.fixture`, `@pytest.mark.django_db` / `transaction=True` appropriately. A test needing a contract **creates it explicitly** through its fixture, even though a development profile may have sample contracts. Prefer function scope for mutable DB records; avoid shared mutable session fixtures.

Each test **class** has an English docstring documenting the component/invariant, supporting documentation reference (or verified code fallback when missing), and coverage matrix. Each test **method** has a substantial English docstring explaining Scenario, Given, When, Then and important edge conditions; assert observable behavior and side effects. Fixture docstrings explain dependencies and object guarantees. Use descriptive class and method names. Avoid redundant, implementation-mirroring assertions.

Behavior matrix, where applicable: success, validation, empty/boundary/malformed inputs, permission/object/cross-contract isolation, persistence/uniqueness, rollbacks/concurrency, query counts, async/on-commit/idempotency/retries, caching, Elasticsearch, HTTP failures/auth and backward compatibility. Document excluded risks, not pretend everything is applicable.

## Step 4 — Measured coverage and quality gate

**Target minimum: 95% line coverage AND 95% branch coverage for the agreed measured scope.** Run pytest with pytest-cov; explicitly state the configured scope (changed app vs full project), measurement type (line/branch), exclusions and exact evidence. Use a validated `--cov-fail-under=95` gate for the agreed scope, enable branch measurement with `--cov-branch`, validate the effective coverage configuration and enforce both thresholds without accidentally replacing one with the other. Do not fabricate coverage or game measurement with blanket omissions, trivial assertions, or unmeaningful tests. If 95% cannot be reached in this run, report the actual number, uncovered lines/branches, reasons and next steps; do not claim completion.

**Mandatory external isolation:** Mock every outbound third-party request, SMS send, and Celery enqueue/dispatch for all default automated tests. Verify calls, failures and transaction-on-commit boundaries. Never send real SMS, issue external HTTP requests or enqueue real jobs; read `references/documentation-and-isolation.md` for approved isolated opt-in exceptions. Use isolated and disposable test databases; keep pytest fixtures independent and deterministic. Test migrations using dedicated migration tests if needed; don't assume test settings run migrations. Keep production data and credentials out of fixtures and reports.

In normal `test` mode, reuse existing initialized pytest infrastructure without re-creating seeds. Run a narrow test class first, then affected app suite and agreed wider suite:

```bash
pytest path/to/test_module.py::TestFeature -q
pytest path/to/tests -q --cov=apps.target --cov-branch --cov-report=term-missing --cov-report=xml --cov-fail-under=95
```

Replace sample paths/modules with verified repository paths. Run Ruff on changed Python files and any existing repository checks. Report test result, coverage, seed verification, mocked external/Celery/SMS boundaries, documentation alignment, commands and remaining gaps. Missing docs must be announced when discovered **and reiterated after tests in final chat**, with paths searched and evidence used.

## Scope and change-control

- Only change code necessary for the approved enum/seed/test work. Plan schema/data migrations first and assess old records and external consumers.
- Incrementally preserve existing tests and conventions, but convert newly written tests to pytest class-based style.
- The eight enhancements in `references/approved-enhancements.md` have been approved, including Hypothesis property-based tests. Do not adopt other proposals (e.g. mutation testing, contract snapshots, parallelization) without separate approval.
- If source and docs disagree, cite the exact sources in the work report, document ambiguity and ask for clarification before codifying uncertain business behavior.

## Step 5 — Approved advanced test architecture

Implement **all eight approved policies** following `references/approved-enhancements.md`: reusable factory fixtures, both line and branch coverage, migration and legacy-data compatibility, query-count/performance regression, domain test-data builders, security and contract isolation, mandatory CI pull-request quality gates, and focused Hypothesis property-based tests. Evaluate applicability and document any skipped check with evidence. Do not introduce real credentials or run potentially destructive migration tests on non-disposable databases.

Separate *instructions to implement CI* from *repository settings required to actually block merging*: add a required workflow check and document administrator configuration necessary to mark it as a required status check. Never assert merging is blocked until repository protection rules have been verified.
