# treatment-backend-testing — Usage Guide

> English usage documentation for Codex, OpenCode and Claude Code.

## Purpose

Write Django class-based pytest tests with layered fixtures, factories, builders, isolated seeds and hierarchical tests. Require at least 95% line and 95% branch coverage separately. Read feature docs first, report absent documentation during work and in the final report. Mock third-party requests, SMS and Celery dispatch.

## Installation and discovery

Keep the canonical skill at `.agents/skills/treatment-backend-testing/SKILL.md`. If required, link `.claude/skills/treatment-backend-testing` and `.opencode/skills/treatment-backend-testing` to that directory. Agent support for symlinks and discovery paths can vary; verify that the agent has loaded the skill. If discovery fails, ask it to read the canonical `SKILL.md` explicitly.

## Codex

```text
Use $treatment-backend-testing.
Mode: test
Write class-based pytest tests for the Expense Coverage Service. Reuse the existing infrastructure; report separate line and branch coverage.
```

## OpenCode

```text
Use the treatment-backend-testing skill.
Mode: test
Write class-based pytest tests for the Expense Coverage Service. Reuse the existing infrastructure; report separate line and branch coverage.
```

## Claude Code

```text
/treatment-backend-testing
Mode: test
Write class-based pytest tests for the Expense Coverage Service. Reuse the existing infrastructure; report separate line and branch coverage.
```

The Claude slash command requires the skill to be exposed as a command. Otherwise use the explicit text prompt and verify skill loading.

## Usage scenarios

This skill has **three formal modes**. `bootstrap` is one-time setup, `test` is the normal default, and `maintain-bootstrap` is targeted maintenance.


### `bootstrap`

One-time setup: audit Django models, Choices/Enums, mandatory reference data, development/test seed profiles, pytest, layered fixtures, factories, builders and the tests hierarchy. Validate on an isolated database and record a bootstrap manifest. Never touch an unverified database.

**Codex**

```text
Use $treatment-backend-testing in bootstrap mode.
Initialize the Django testing infrastructure once and validate it against an isolated database.
```

**OpenCode**

```text
Use the treatment-backend-testing skill in bootstrap mode.
Initialize the Django testing infrastructure once and validate it against an isolated database.
```

**Claude Code**

```text
/treatment-backend-testing
Mode: bootstrap
Initialize the Django testing infrastructure once and validate it against an isolated database.
```

### `test`

Routine testing: read targeted docs and code, reuse existing fixtures, factories and seeds; do not repeat repository-wide audit or bootstrap.

**Codex**

```text
Use $treatment-backend-testing in test mode.
Write tests for apps/expense/services/coverage.py without recreating seeds.
```

**OpenCode**

```text
Use the treatment-backend-testing skill in test mode.
Write tests for apps/expense/services/coverage.py without recreating seeds.
```

**Claude Code**

```text
/treatment-backend-testing
Mode: test
Write tests for apps/expense/services/coverage.py without recreating seeds.
```

### `maintain-bootstrap`

Update only infrastructure affected by new models, Choices/Enums, required reference data, fixtures or factories. Do not rerun the full bootstrap.

**Codex**

```text
Use $treatment-backend-testing in maintain-bootstrap mode.
Update only reference data/factories affected by a new ContractStatus choice.
```

**OpenCode**

```text
Use the treatment-backend-testing skill in maintain-bootstrap mode.
Update only reference data/factories affected by a new ContractStatus choice.
```

**Claude Code**

```text
/treatment-backend-testing
Mode: maintain-bootstrap
Update only reference data/factories affected by a new ContractStatus choice.
```

## Seed and mocking policy

| Data | Development | Test |
|---|---|---|
| Python Choices/Enums | Defined in code | Defined in code |
| Mandatory persisted reference records | Seeded | Only necessary reference records |
| Sample Contract/User/Insured | Synthetic seeds permitted | Created per test by fixtures |
| Third-party/SMS/Celery | Environment-specific | Mocked by default |

Real provider calls, SMS sends, and Celery broker dispatch are prohibited in the default automated test suite. Assert mock calls, payloads, errors and `transaction.on_commit` behavior. Live integration suites require explicit approval and isolation.

## Hierarchical test layout

```text
tests/
  conftest.py
  factories/
  builders/
  support/
  contract/{unit,integration,api,security,properties}/
  expense/{unit,integration,api,security,properties}/
  migrations/
  smoke/
```

If the repository already uses `apps/<app>/tests/`, preserve its conventions rather than creating an incompatible second tree.

## Example pytest invocation

```bash
pytest tests/expense/ -q --cov=apps.expense --cov-branch --cov-report=term-missing
```

`--cov-fail-under=95` does not independently enforce 95% line and branch coverage; validate both metrics separately.

## Validation and reporting

- Inspect actual repository paths, settings and branch references; example values are placeholders.
- Report only checks that actually ran, including failures and remaining risks.
- Never claim that unavailable tools or missing companion skills were used.
- Report missing feature docs during execution and again at completion. Report pass/fail/skip counts, mocks, coverage, migration/security/N+1/Hypothesis checks. CI merge blocking also requires branch protection.
