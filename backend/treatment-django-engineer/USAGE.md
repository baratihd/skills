# treatment-django-engineer — Usage Guide

> English usage documentation for Codex, OpenCode and Claude Code.

## Purpose

Implement and refactor Django backend code. Coordinate architecture using treatment-backend-planner, update documentation via django-product-documentation and create tests via treatment-backend-testing. Preserve frontend/PWA and API compatibility.

## Installation and discovery

Keep the canonical skill at `.agents/skills/treatment-django-engineer/SKILL.md`. If required, link `.claude/skills/treatment-django-engineer` and `.opencode/skills/treatment-django-engineer` to that directory. Agent support for symlinks and discovery paths can vary; verify that the agent has loaded the skill. If discovery fails, ask it to read the canonical `SKILL.md` explicitly.

## Codex

```text
Use $treatment-django-engineer.
Implement the Expense Coverage Service refactor. Use companion skills for architecture, affected docs and testing. Report validation results.
```

## OpenCode

```text
Use the treatment-django-engineer skill.
Implement the Expense Coverage Service refactor. Use companion skills for architecture, affected docs and testing. Report validation results.
```

## Claude Code

```text
/treatment-django-engineer
Implement the Expense Coverage Service refactor. Use companion skills for architecture, affected docs and testing. Report validation results.
```

The Claude slash command requires the skill to be exposed as a command. Otherwise use the explicit text prompt and verify skill loading.

## Usage scenarios

The following scenarios are **prompt variations, not formal execution modes**.

### New feature

```text
Use the treatment-django-engineer skill.
Implement claim validation according to existing business rules, with relevant planning, docs and tests.
```

### Refactoring

```text
Use the treatment-django-engineer skill.
Refactor apps/expense/services/coverage.py with minimal behavior change and regression tests.
```

### Bug fix

```text
Use the treatment-django-engineer skill.
Fix duplicate callback processing and add a regression test.
```

### Seed/enum change

```text
Use the treatment-django-engineer skill.
Add a status safely; use testing maintain-bootstrap only if reference seeds or factories are affected.
```

## Validation and reporting

- Inspect actual repository paths, settings and branch references; example values are placeholders.
- Report only checks that actually ran, including failures and remaining risks.
- Never claim that unavailable tools or missing companion skills were used.
- Companion skills: treatment-backend-planner, django-product-documentation, treatment-backend-testing. Do not claim unavailable skills ran. Avoid unrelated changes, destructive migrations, commits, and deployment without approval.
