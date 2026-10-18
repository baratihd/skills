# Mandatory scalable test package architecture

This policy applies in `bootstrap`, default `test`, and `maintain-bootstrap` modes. Do not require the user to repeat it. Favor the repository's existing well-organized package if it already meets these invariants; do not relocate thousands of tests merely for aesthetics.

## Hierarchical layout

Tests MUST be organized into importable `tests` Python packages following Django app and domain boundaries, then behavior/test level. Example (adapt to actual apps):

```text
tests/
├── __init__.py
├── conftest.py                     # only global, safe infrastructure fixtures
├── factories/                      # reusable low-level model factories
│   ├── __init__.py
│   ├── users.py
│   └── contracts.py
├── builders/                       # reusable domain aggregates
│   ├── __init__.py
│   └── contracts.py
├── support/                        # dependency fakes, network guards, helpers
│   ├── __init__.py
│   └── mocks.py
├── contract/
│   ├── __init__.py
│   ├── conftest.py                  # scoped contract fixtures
│   ├── unit/
│   │   ├── __init__.py
│   │   └── test_validation.py
│   ├── integration/
│   │   ├── __init__.py
│   │   └── test_repository.py
│   ├── api/
│   │   ├── __init__.py
│   │   └── test_contract_endpoints.py
│   ├── security/
│   │   ├── __init__.py
│   │   └── test_contract_isolation.py
│   └── properties/
│       ├── __init__.py
│       └── test_contract_invariants.py
├── expense/
│   ├── __init__.py
│   ├── conftest.py
│   ├── unit/
│   ├── integration/
│   ├── api/
│   ├── security/
│   └── properties/
├── migrations/
│   ├── __init__.py
│   └── test_data_compatibility.py
└── smoke/
    ├── __init__.py
    └── test_critical_paths.py
```

App-local `apps/<app>/tests/` structures are acceptable if they follow the same hierarchy and pytest discovery conventions. The structure is illustrative, not permission to create irrelevant empty directories. Place E2E and FireTest/smoke suites in well-named packages with explicit isolation boundaries and settings. Use predictable module names `test_*.py`, class names `Test*`, and test methods `test_*`.

## Mandatory placement and fixture rules

- Before adding a test, find its existing app/domain package and the right test layer; extend nearby modules when appropriate instead of dumping cases into a giant test file.
- Keep shared factories/builders in reusable packages; module- or app-specific fixtures belong in the nearest `conftest.py`; global `conftest.py` must remain small and avoid hidden autouse DB state.
- Prefer one behavioral responsibility per test class, descriptive names, and small cohesive modules; split sprawling test modules along domain responsibilities.
- Use `pytest` markers/configuration for unit, integration, API, migration, security, properties, E2E and FireTest/smoke where meaningful; ensure collection does not run live dependencies.
- Always preserve class-based test cases and English Given/When/Then docstrings; fixture/helper functions may be standalone functions.
- Test database business objects come from fixtures/factories/builders rather than development seeds.
- Do not recursively reorganize unrelated suites in normal `test` mode. Incrementally migrate disorganized existing tests only if in scope and safe.
- During bootstrap, create only needed package skeletons and verify `pytest --collect-only` from project root. During normal use, place newly written tests correctly and verify collection of their module.
- Docs-first and outbound mocking apply to **all** packages including integration, E2E and smoke/FireTest. Report missing docs during work and in the final chat report.

## Ongoing compliance checklist (always active)

- Documentation located and read, or absence announced during work and reported at end; verified source used for fallback.
- Third-party HTTP, SMS and Celery dispatch mocked in default suites; no live network/broker.
- Tests use pytest classes, detailed English scenarios, layered fixtures, factories/builders where suitable.
- Tests placed in domain/layer package; no new monolithic catch-all files.
- Test-specific business data created by fixtures, not demo seeds; bootstrap not repeated in test mode.
- Branch and line coverage separately measured toward >=95%; no fabricated results.
- Migration compatibility, N+1/query budget, security isolation, property-based invariants and CI gates assessed where applicable; exclusions explained.
- Final report records changed files, tests run, actual coverage, missing docs, mocked boundaries, skipped validation and risks.
