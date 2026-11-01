# Scenario Test Tracker — Usage Guide

## Purpose
Generate a Persian, documentation-ready Markdown report of new and modified test scenarios identified from Git changes. Output always separates `تست‌های ایجادشده` and `تست‌های تغییر داده‌شده`, with Given/When/Then, assertions, expectations, fixtures/mocks and traceability. No execution modes are defined for this skill.

## Agent usage

### Codex
```text
Use $test-scenario-tracker.
source_branch: feature/project-testing
target_branch: development
Document new and modified pytest test scenarios in Persian Markdown.
```

### OpenCode
```text
Use the test-scenario-tracker skill.
Compare feature/project-testing with development and document newly created
and modified test scenarios in Persian, including expected behavior and code references.
```

### Claude Code
```text
/test-scenario-tracker
Compare feature/project-testing against development and generate the Persian test scenario change report.
```

If slash invocation is unavailable in a given Claude session, use `Use the test-scenario-tracker skill` in natural language.

## Optional parameters
- `source_branch`: Git ref containing new tests (defaults to current HEAD)
- `target_branch`: comparison baseline (must be verified)
- `output_path`: output Markdown path
- `scope`: app, feature or test paths
- `include_worktree_changes`: include pending changes explicitly
- `comparison`: merge-base (`...`, default) or exact tips (`..`, when requested)

Example scope request:
```text
Use the test-scenario-tracker skill.
source_branch: feature/project-testing
target_branch: development
scope: apps/expense/tests/
output_path: docs/product/test-scenarios/feature_ticket_model_2026_11_01.md
Include only evidence-based additions and modifications; do not edit the tests.
```

## Repository integration
Store the skill in `.agents/skills/test-scenario-tracker/`. Link to it from `.claude/skills/` for Claude Code. OpenCode can discover `.agents/skills/` without an additional link; an optional `.opencode/skills/` link may be created for explicit symmetry.

The skill may reference `treatment-backend-testing` for testing conventions or `django-product-documentation` for existing documentation, but neither is required.

## Required output path and naming convention

Every run produces or updates a Persian Markdown report in `docs/product/test-scenarios/`.
The filename is calculated from the **source branch** and date of report creation:

```text
source_branch: feature/ticket-model
report_date: 2026-11-01
output: docs/product/test-scenarios/feature_ticket_model_2026_11_01.md
```

Replace `/` and `-` with `_`. Keep target branch, SHA and scope in the report metadata. Existing files for the same branch/day must be merged carefully, not overwritten blindly.

### Same request for any supported agent

```text
Use the test-scenario-tracker skill.
source_branch: feature/ticket-model
target_branch: development
Document created and modified tests in Persian.
Save to the mandatory report path based on source branch and today's date.
```
