# django-product-documentation — Usage Guide

> English usage documentation for Codex, OpenCode and Claude Code.

## Purpose

Generate evidence-based Django documentation for a repository, app or feature. Product/Business documentation remains Persian RTL, Technical/Quality remains English LTR. Publish via an independent MkDocs site.

## Installation and discovery

Keep the canonical skill at `.agents/skills/django-product-documentation/SKILL.md`. If required, link `.claude/skills/django-product-documentation` and `.opencode/skills/django-product-documentation` to that directory. Agent support for symlinks and discovery paths can vary; verify that the agent has loaded the skill. If discovery fails, ask it to read the canonical `SKILL.md` explicitly.

## Codex

```text
Use $django-product-documentation.
Document apps/expense and update the MkDocs site. Preserve source traceability, language policy, and report missing evidence.
```

## OpenCode

```text
Use the django-product-documentation skill.
Document apps/expense and update the MkDocs site. Preserve source traceability, language policy, and report missing evidence.
```

## Claude Code

```text
/django-product-documentation
Document apps/expense and update the MkDocs site. Preserve source traceability, language policy, and report missing evidence.
```

The Claude slash command requires the skill to be exposed as a command. Otherwise use the explicit text prompt and verify skill loading.

## Usage scenarios

The following scenarios are **prompt variations, not formal execution modes**.

### Whole repository

```text
Use the django-product-documentation skill.
Scope: entire Django repository. Generate complete independently publishable MkDocs documentation.
```

### Feature

```text
Use the django-product-documentation skill.
Scope: Expense Coverage Service. Update only related business, technical, API and QA documentation.
```

### Incremental Git changes

```text
Use the django-product-documentation skill.
Compare feature/coverage-refactor against development and update only impacted pages.
```

## Validation and reporting

- Inspect actual repository paths, settings and branch references; example values are placeholders.
- Report only checks that actually ran, including failures and remaining risks.
- Never claim that unavailable tools or missing companion skills were used.
- Report changed pages, traceability, gaps and link/build results. Ask for frontend docs when needed. Test RTL/LTR and Light/Dark/System rendering before claiming visual verification.

```bash
mkdocs serve
mkdocs build --strict
```
