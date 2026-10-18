# treatment-backend-planner — Usage Guide

> English usage documentation for Codex, OpenCode and Claude Code.

## Purpose

Plan Django architecture and refactors using verified repository evidence. Analyze migrations, data/API compatibility, Celery, security, external integrations, frontend/PWA impact and rollback. Do not change application code in planning.

## Installation and discovery

Keep the canonical skill at `.agents/skills/treatment-backend-planner/SKILL.md`. If required, link `.claude/skills/treatment-backend-planner` and `.opencode/skills/treatment-backend-planner` to that directory. Agent support for symlinks and discovery paths can vary; verify that the agent has loaded the skill. If discovery fails, ask it to read the canonical `SKILL.md` explicitly.

## Codex

```text
Use $treatment-backend-planner.
Plan the refactor of apps/expense/services/coverage.py. Explain architecture, alternatives, risks, tests, migration and rollback. Planning only.
```

## OpenCode

```text
Use the treatment-backend-planner skill.
Plan the refactor of apps/expense/services/coverage.py. Explain architecture, alternatives, risks, tests, migration and rollback. Planning only.
```

## Claude Code

```text
/treatment-backend-planner
Plan the refactor of apps/expense/services/coverage.py. Explain architecture, alternatives, risks, tests, migration and rollback. Planning only.
```

The Claude slash command requires the skill to be exposed as a command. Otherwise use the explicit text prompt and verify skill loading.

## Usage scenarios

The following scenarios are **prompt variations, not formal execution modes**.

### New feature

```text
Use the treatment-backend-planner skill.
Plan a Contract eligibility API: permissions, schema, errors, test plan and rollout.
```

### Branch impact

```text
Use the treatment-backend-planner skill.
Source: feature/insured-refactor. Target: development. Review the Git diff and affected contracts.
```

### Refactoring

```text
Use the treatment-backend-planner skill.
Plan SOLID refactoring of apps/darman/services/insured.py without breaking existing consumers.
```

## Validation and reporting

- Inspect actual repository paths, settings and branch references; example values are placeholders.
- Report only checks that actually ran, including failures and remaining risks.
- Never claim that unavailable tools or missing companion skills were used.
- Differentiate verified facts from assumptions and proposals; obtain Django/Python versions from the repository. Graphify is optional.
