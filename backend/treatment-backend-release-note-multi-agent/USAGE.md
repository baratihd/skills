# treatment-backend-release-note — Usage Guide

> English usage documentation for Codex, OpenCode and Claude Code.

## Purpose

Write release notes in English from verified source/target Git comparisons, covering business/technical changes, compatibility, validation, traceability and rollback. Provide the Persian business summary only in chat.

## Installation and discovery

Keep the canonical skill at `.agents/skills/treatment-backend-release-note/SKILL.md`. If required, link `.claude/skills/treatment-backend-release-note` and `.opencode/skills/treatment-backend-release-note` to that directory. Agent support for symlinks and discovery paths can vary; verify that the agent has loaded the skill. If discovery fails, ask it to read the canonical `SKILL.md` explicitly.

## Codex

```text
Use $treatment-backend-release-note.
source_branch: feature/expense-coverage
target_branch: development
Write an English release note under docs/releases/ and summarize business changes in Persian in chat only.
```

## OpenCode

```text
Use the treatment-backend-release-note skill.
source_branch: feature/expense-coverage
target_branch: development
Write an English release note under docs/releases/ and summarize business changes in Persian in chat only.
```

## Claude Code

```text
/treatment-backend-release-note
source_branch: feature/expense-coverage
target_branch: development
Write an English release note under docs/releases/ and summarize business changes in Persian in chat only.
```

The Claude slash command requires the skill to be exposed as a command. Otherwise use the explicit text prompt and verify skill loading.

## Usage scenarios

The following scenarios are **prompt variations, not formal execution modes**.

### Feature to development

```text
Use the treatment-backend-release-note skill.
source_branch: feature/claim-validation
target_branch: development
```

### Development to production

```text
Use the treatment-backend-release-note skill.
source_branch: development
target_branch: production
```

### Versioned release

```text
Use the treatment-backend-release-note skill.
source_branch: release/v2.4
target_branch: production
version: 2.4.0
output_file: docs/releases/2.4.0.md
```

## Validation and reporting

- Inspect actual repository paths, settings and branch references; example values are placeholders.
- Report only checks that actually ran, including failures and remaining risks.
- Never claim that unavailable tools or missing companion skills were used.
- Record source/target refs and SHA. Source-only commits (`target..source`) differ from merge-base diff (`target...source`); neither always predicts a merge result. Do not merge, tag, deploy, commit or push.
