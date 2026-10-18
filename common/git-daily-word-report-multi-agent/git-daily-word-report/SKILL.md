---
name: git-daily-word-report
description: Generate a truthful, manager- and Scrum-Master-ready daily work report from today's Git activity, including delivered work, progress, blockers, and next steps. Use when asked for a daily standup report, end-of-day status, or Git-based summary of today's work.
---

# Git Daily Word Report

## Agent compatibility and invocation
This is an agent-neutral SKILL.md. Codex, OpenCode, and Claude Code must follow the same workflow and references. Do not assume proprietary tools or commands; use available local shell/Git interfaces. If shell or repository access is unavailable, report the limitation rather than inventing evidence.

Invoke by name (`git-daily-word-report`) or with `$git-daily-word-report` where the agent supports skill references. For Claude Code, `/git-daily-word-report` may be available when the skill is discovered. The user’s request takes precedence for date, timezone, format, and repository scope.

## Purpose
Produce a concise, business-readable report of work performed **today**, grounded in repository evidence. Default language: **Persian (fa-IR)**, with technical identifiers in English. Never confuse Git activity with completed or deployed functionality.

## Inputs and defaults
- Repository: current Git worktree.
- Date: today in `Asia/Tehran` unless the user specifies a different date or timezone. Do not infer timezone from the agent tool or operating system when the user explicitly sets it. Determine the actual date/time from a reliable environment clock; do not hardcode it.
- Git identity: identify the current contributor via `git config user.email` / `git config user.name`, and verify with the user if the identity is absent or ambiguous. Allow explicit author overrides.
- Scope: local current repository, **all local branches and tags** as evidence where appropriate, including committed changes, plus staged/unstaged/untracked work in the current worktree. Do not assume the current branch captures all contributions.
- Audience: manager or Scrum Master, default to a concise standup-style summary.
- Output: conversational response by default; save a Markdown report only when explicitly requested. Never commit or push the report automatically.

## Workflow
1. Verify repository and collect context without changing it: `git rev-parse --show-toplevel`, `git status --short --branch`, `git branch --show-current`, `git config user.email`, `git config user.name`, `git remote -v`. If not in a Git repository, explain the limitation; do not invent a report.
2. Resolve today's calendar-day window in the chosen timezone: `[00:00:00, tomorrow 00:00:00)`; use Git's `--since` and `--until` as preliminary filters, then verify exact author dates against timezone-aware boundaries. Distinguish **author date** vs **commit date**; prefer author date for “work done today”, but identify rebases/cherry-picks that may distort timing. Do not present dates outside the selected window as today's work.
3. Inspect matching authored commits across local refs with `git log --all --author=<verified identity> --format=fuller --stat --since=... --until=...` and `git show --format=fuller --name-status <sha>`. Check relevant patches with `git show <sha>` to understand business effects. Be cautious with merges, duplicate commits, rebases, and cherry-picks; group related work and de-duplicate equivalent patches when possible.
4. Inspect current worktree: `git diff --stat`, `git diff --cached --stat`, `git status --porcelain=v1`. Inspect selected diffs carefully. **Worktree modifications cannot reliably be dated by Git**. Mark them as *currently uncommitted*, not confirmed as done today, unless other reliable evidence establishes that fact. Untracked file content may be sensitive; do not expose secrets.
5. Optionally gather linked PRs, issues, CI checks, test results, and deployment facts **only if accessible and authorized**. Local Git alone generally cannot prove PR approval, ticket completion, successful tests, or deployment. Mark unverified data as unknown.
6. Translate technical diffs into meaningful outcomes: user-facing changes, fixes, reliability/performance, migrations, API/contract changes, tests/refactoring/infra. Identify paths/modules and evidence but avoid overwhelming the audience with code details.
7. Classify each item using evidence: **Completed in code** (clearly implemented and committed), **In progress** (partial/uncommitted), **Blocked** (only if substantiated), **Next** (verified plan or explicitly labeled suggestion), **Not verifiable** (CI, review, deploy, business effect). Do not infer task completion just from a commit title; don't claim an outcome or successful test solely because test files were changed.
8. Draft a short report using `references/report-template.md`. Merge repeated commits into coherent activities; use 3–7 bullets by default. For each major accomplishment, convey what changed, why it matters, status, and optionally a short SHA. Prefer accessible, non-technical Persian fit for standup, while keeping names of components unchanged.
9. Review against `references/quality-checklist.md`. Avoid credentials, customer information, personal identifiers, raw production data, and overly detailed diff excerpts. Respect repo privacy; don't send data externally without authorization.
10. Present the report in chat. If user requests a saved file, use `reports/daily/YYYY-MM-DD-<author-slug>.md` unless another path is specified. Don't commit it automatically.

## Presentation rules
- Start with report date, timezone, repository, contributor, and scope.
- Include **Done**, **In progress**, **Blockers**, **Next**, and **Verification / caveats**; omit empty optional sections or explicitly say no blockers were evident from Git, **not** that none exist.
- Keep direct manager summary short (about 100–220 Persian words unless asked for more).
- Separate *committed today* from *uncommitted now*.
- Link each substantial claim to a short SHA and/or file path where practical; use full SHA in saved reports when helpful.
- If no matching commits exist, say so clearly; summarize visible worktree activity as undated, and avoid fabricating productivity.
- Do not use commit message summaries as the only proof of product behavior.
- Never run `git add`, `commit`, `push`, `checkout`, `reset`, `rebase`, or deploy as part of reporting.

## Optional variants
If the user wants a Slack/standup message, generate a copy-ready compact paragraph or bullets. If the user requests English, change report language; if they specify a date, use that date in their chosen timezone. If they want a multi-repository overview, run the workflow separately for each accessible repository, then synthesize without double-counting.
