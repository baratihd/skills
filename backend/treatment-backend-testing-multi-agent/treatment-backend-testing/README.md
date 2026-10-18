# Treatment Backend Testing Skill

Updated to audit Django Choices/Enums and environment seeds before writing class-based pytest tests. Source and verified documentation drive behavior; seed profiles isolate reference, development and test data. Test databases never receive demo contracts or users. Test scenario data comes from pytest fixtures. English documentation and detailed class/method docstrings are required, with a measured 95% coverage target. Read SKILL.md and references for safety gates and implementation contract.

Install folder under `.agents/skills/treatment-backend-testing/`, then start a new Codex session or request that Codex reread the latest `SKILL.md` and references. The repo source and documentation are not included in this skill zip; Codex must inspect your actual repository.

## Approved vNext enhancements

The skill now requires factory fixtures (`factory_boy` or `model_bakery`), isolated domain aggregate builders, separate >=95% line and branch coverage, safe migration compatibility tests, DB query budgets/N+1 regression tests, authorization and cross-contract isolation checks, pull-request CI quality gates, and Hypothesis property-based testing. See `references/approved-enhancements.md`. No changes to the Django project are made by installing this skill.

## Mandatory documentation and mocking update

Tests must be derived from feature-level documentation when available and checked against source. Missing documentation must be disclosed in chat immediately when found and once more in the final chat work report after tests are written. All default automated tests must mock outbound third-party requests, SMS delivery, and Celery dispatch; no live providers, messages, brokers, or workers. See `references/documentation-and-isolation.md`.

## Lifecycle: run setup once

- **`bootstrap`**: one-time audit of Choices/Enums, creation of safe development/reference/test seed infrastructure, fixture foundation, and repository-owned `.testing/bootstrap-manifest.json` (or existing equivalent).
- **`test` (default)**: read feature docs and relevant code, reuse setup, build/run class-based pytest tests. **Never repeat a full DB audit or seed generation automatically.**
- **`maintain-bootstrap`**: only for a verified schema/reference-data drift or an explicit request.

See `references/bootstrap-lifecycle.md`.

## Default workflow and standing rules

Run `$treatment-backend-testing` with a feature target to reuse existing one-time bootstrap artifacts. No need to re-paste testing policies: all previous approved requirements and the hierarchical `tests` package policy are embedded in `SKILL.md` and `references/`. Use explicit `bootstrap` once; use `maintain-bootstrap` only for demonstrated drift. In default `test` mode, read feature docs, announce missing docs during work and in the final chat, mock third-party/SMS/Celery dispatch, and use class-based English pytest test suites with layered fixtures, factories, builders and separate line/branch targets.


## Codex / OpenCode / Claude Code

This SKILL.md is shared across all three agents. Refer to `references/cross-agent-compatibility.md` and `AGENT_PROMPT.md` for portable mode invocation and installation. The package root includes an installer that maintains one canonical copy and project-local symlinks.
