# git-daily-word-report — Usage Guide

> English usage documentation for Codex, OpenCode and Claude Code.

## Purpose

Generate a Persian daily work report for a manager or Scrum Master from verified Git activity. Separate committed changes from uncommitted changes and avoid assigning uncommitted edits to a specific day without evidence.

## Installation and discovery

Keep the canonical skill at `.agents/skills/git-daily-word-report/SKILL.md`. If required, link `.claude/skills/git-daily-word-report` and `.opencode/skills/git-daily-word-report` to that directory. Agent support for symlinks and discovery paths can vary; verify that the agent has loaded the skill. If discovery fails, ask it to read the canonical `SKILL.md` explicitly.

## Codex

```text
Use $git-daily-word-report.
Generate my daily Git work report in Persian for today, for my Scrum Master. Separate committed work from uncommitted changes.
```

## OpenCode

```text
Use the git-daily-word-report skill.
Generate my daily Git work report in Persian for today, for my Scrum Master. Separate committed work from uncommitted changes.
```

## Claude Code

```text
/git-daily-word-report
Generate my daily Git work report in Persian for today, for my Scrum Master. Separate committed work from uncommitted changes.
```

The Claude slash command requires the skill to be exposed as a command. Otherwise use the explicit text prompt and verify skill loading.

## Usage scenarios

The following scenarios are **prompt variations, not formal execution modes**.

### Specified date

```text
Use the git-daily-word-report skill.
Report date: 2026-10-17
Timezone: Asia/Tehran
```

### Specified author

```text
Use the git-daily-word-report skill.
Date: today
Git author email: developer@example.com
```

### Brief standup

```text
Use the git-daily-word-report skill.
Write a brief Persian standup report: Done / In progress / Blockers / Next steps.
```

### Save Markdown

```text
Use the git-daily-word-report skill.
Write the report for 2026-10-17 to docs/reports/daily-2026-10-17.md. Do not commit.
```

### Multiple repositories

```text
Use the git-daily-word-report skill.
Analyze backend/ and integration/ separately, then combine without double counting.
```

## Validation and reporting

- Inspect actual repository paths, settings and branch references; example values are placeholders.
- Report only checks that actually ran, including failures and remaining risks.
- Never claim that unavailable tools or missing companion skills were used.
- Preserve Persian as the daily report output language. Default timezone is Asia/Tehran unless overridden by the request. Never automatically commit/push; save files only when requested.
