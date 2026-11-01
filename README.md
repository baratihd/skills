# Treatment Agent Skills — English Usage Documentation

This repository contains **seven independent agent skills** with English Markdown usage documentation.

## Guides

- [django-product-documentation](./backend/django-product-documentation-multi-agent/django-product-documentation/README.md)
- [treatment-backend-planner](./backend/treatment-backend-planner/README.md)
- [treatment-backend-release-note](./backend/treatment-backend-release-note-multi-agent/README.md)
- [treatment-backend-testing](./backend/treatment-backend-testing-multi-agent/treatment-backend-testing/README.md)
- [treatment-django-engineer](./backend/treatment-django-engineer/README.md)
- [git-daily-word-report](./common/git-daily-word-report-multi-agent/git-daily-word-report/README.md)
- [test-scenario-tracker](./common/test-scenario-tracker-multi-agent/test-scenario-tracker/README.md) — Document new and modified Django/pytest test scenarios from Git changes in Persian Markdown.

## Test scenario tracker

`test-scenario-tracker` analyzes Git history, test assertions, fixtures/mocks, and existing documentation to produce an evidence-based report with two required sections: `تست‌های ایجادشده` and `تست‌های تغییر داده‌شده`. Each scenario includes Given/When/Then, expected results, code references, and verification status. By default, it performs static analysis without modifying application/test code or running tests; reading assertions does not establish that tests passed.

```text
Use $test-scenario-tracker.
source_branch: feature/project-testing
target_branch: development
Document new and modified pytest test scenarios in Persian Markdown.
```

Reports must be saved in `docs/product/test-scenarios/` as `<branch_slug>_<YYYY_MM_DD>.md`, using the actual source branch and report-generation date in the configured local timezone (UTC fallback). Replace `/` and `-` in branch names with `_`; for example, `feature/ticket-model` on November 1, 2026 produces `feature_ticket_model_2026_11_01.md`. Keep the target branch and commit hashes in report metadata. An explicit `output_path` must follow the same directory and filename rules. Update an existing report for the same source branch and day incrementally, preserving stable test IDs and unrelated manual content; older reports are not migrated or deleted automatically. Git refs and scope can be specified; `development` above is only an example, not a default. The skill works independently of `treatment-backend-testing` and `django-product-documentation` and has no special execution modes. See the [usage guide](./common/test-scenario-tracker-multi-agent/test-scenario-tracker/USAGE.md) for agent-specific invocation and optional parameters.

## Quick start

1. Install each skill's `SKILL.md` under `.agents/skills/<skill-name>/`.
2. Configure `.claude/skills/` and `.opencode/skills/` if your agent requires those discovery paths; verify symlinks.
3. Start a new agent session and invoke the skill using the corresponding guide.
4. Run `treatment-backend-testing` in `bootstrap` mode **once**, then use `test` routinely; use `maintain-bootstrap` only when required.

## Skill documentation vs. output language

These usage guides are English, but the skills' established **output language policies do not change**:

| Skill | Output policy |
|---|---|
| django-product-documentation | Product/Business: Persian RTL; Technical/Quality: English LTR |
| treatment-backend-release-note | Release notes in English; brief Persian business summary in chat only |
| git-daily-word-report | Daily work reports in Persian |
| test-scenario-tracker | Test scenario change reports in Persian Markdown; exact code identifiers and paths remain English/LTR |
| Other skills | Follow their own SKILL.md |

## Verify skill paths on Linux

```bash
find .agents/skills .claude/skills .opencode/skills -maxdepth 2 \( -name SKILL.md -o -type l \)
```

A valid path does not guarantee skill discovery by every agent. Check the active agent version/configuration. These usage guides do not replace the actual skills. All prompt paths, branches, and settings are examples to adapt to the repository.
