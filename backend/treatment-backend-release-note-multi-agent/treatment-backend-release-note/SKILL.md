---
name: treatment-backend-release-note
description: Analyze treatment-backend Git changes between source and target branches, create an evidence-based English release note covering business impact, implementation, compatibility, verification, traceability and rollback, then report a concise Persian business summary in the agent's chat response only. Use for release preparation, branch promotion to stage or production, and post-release documentation in Codex, OpenCode, or Claude Code.
---

# Treatment Backend Release Note

Generate an accurate, auditable English release note from actual repository evidence when promoting a source branch into a target branch, especially `stage` or `production`. After writing the release note, produce a **separate Persian headline summary in the conversation only**. Never append, embed, or write the Persian summary into the release note or any other project file.

## Cross-agent execution contract

- This skill is portable between Codex, OpenCode, and Claude Code; no vendor-specific tooling is required. Read this `SKILL.md` and the linked `references/` files when invoked.
- One canonical copy is stored at `.agents/skills/treatment-backend-release-note/`; `.claude/skills/` and `.opencode/skills/` point to the same copy when using the bundled installer. Do not maintain divergent copies.
- If tools or permissions are unavailable, report the limitation accurately; do not fabricate Git evidence or release status.
- Accept plain-language invocation, or `$treatment-backend-release-note` in Codex, `/treatment-backend-release-note` in Claude Code and supported OpenCode configurations. All invocations follow exactly the same workflow and output policy.

## Inputs and scope

- Required: `source_branch`, `target_branch` (default target only if the user explicitly establishes a project convention; otherwise ask for it when genuinely unavailable).
- Optional: release version, deployment window, ticket references, output filename (stored under `docs/releases/`), deployment method, owner.
- Detect remotes and validate refs, working-tree condition and repository root before collecting changes. Do not change branches, pull, fetch, commit, merge, tag, deploy, or modify application code without explicit authorization.
- If source/target not specified, attempt to infer them from clear context (e.g. user says "release develop to stage"); otherwise ask. Never silently assume the currently checked-out branch is the source.
- Both refs may be local branches or remote-tracking branches; spell out exactly which resolved refs and commit hashes were analyzed.
- Interpret the report as **changes introduced by source into target**, not everything ever committed on the source branch.

## Workflow

### 1. Preflight and Git evidence

From the repository root, inspect these commands (adapt ref names safely; do not interpolate untrusted shell arguments):

```bash
git status --short
git remote -v
git branch -a
git rev-parse --verify <source>^{commit}
git rev-parse --verify <target>^{commit}
git merge-base <target> <source>
git log --date=short --format='%h %ad %s' <target>..<source>
git diff --stat <target>...<source>
git diff --name-status <target>...<source>
git diff <target>...<source> -- <relevant-paths>
```

`target..source` identifies commits not reachable from target. `target...source` in `git diff` compares the merge-base to source, approximating changes proposed by the source branch. These may not equal the exact resulting merge diff for divergent branches, cherry-picks, or rebases. For a proposed release, inspect both commit and diff perspectives, identify anomalies, and, if necessary, use a disposable worktree/temporary merge **only with authorization**. Do not assert a definitive merged result from an unverified three-dot diff. For an already completed release, prefer the recorded merge commit, tag, deployed SHA, or actual before/after deployment refs, if available.

Review meaningful source files, migrations, configuration, API schemas, serializers, permissions, background tasks, integrations, tests and deployment manifests; avoid relying on commit subjects alone. Exclude generated/noise files from narrative where appropriate, but do not hide impactful generated migrations or lockfile changes. Check for changes with business effects that span multiple commits. Group by business capability rather than listing every changed file. Link code to tickets/PRs when demonstrable.

### 2. Classify changes and impact

Separate and describe:

1. **Business changes** — new or changed workflows, eligibility rules, coverage, expense/claim processing, reporting, notifications, and observable behavior. Write only when supported by code, tests or user-provided product context; clearly label inference or missing confirmation.
2. **Technical changes** — APIs, Django models/migrations, jobs/Celery, database/indexes, external integrations, settings, security/permissions, reliability, performance, observability, CI/CD and refactoring.
3. **Compatibility and consumers** — REST endpoints/methods, request/response fields, status codes, auth, web/mobile clients, internal callers, workers, third-party systems, DB and events. State `Breaking change: Yes / No / Unknown` with evidence. Distinguish API compatibility from deployment/data compatibility. Explain required consumer actions and rollout order when relevant.
4. **Validation and traceability** — exact source/target refs + SHAs, base SHA, noteworthy commits, ticket/PR links when found, tests and their actual observed status, migration plans, approvers/status if supplied. Do not claim a test passed without executing it or obtaining reliable test results.
5. **Revert / rollback** — describe target-appropriate steps and prerequisites, with distinct handling for application rollback, reversible schema migrations, irreversible data migrations, replayable jobs, messages, idempotency and third-party side effects. Always distinguish a Git revert from operational rollback. Never assert rollback is safe without checking migrations and side effects.

Review the full checklist in [references/review-checklist.md](references/review-checklist.md).

### 3. Compose and save the English release note

Follow [references/release-note-template.md](references/release-note-template.md). Use English for **all content saved to the release note**, including headings. Keep it concise but informative and appropriate for both engineering and business review. Use "Not verified", "Unknown", or "Requires confirmation" rather than making up details.

The canonical project output directory is `docs/releases/`. Save every release note there; do not create a root-level `release-notes/` directory. The default output is `docs/releases/YYYY-MM-DD-<source>-to-<target>.md`, with branch slashes replaced by hyphens. Honor an explicitly requested filename while keeping it under `docs/releases/`. Avoid overwriting an existing release note. If the destination exists, choose a unique filename or seek explicit approval for replacement. Use the date of generation only as documentation date, not a fabricated deployment date. The release note is a proposed release until deployment is verified.

After saving, read back the file and validate: branch direction and commit identities, business/technical changes, compatibility, verification, traceability, rollback, and absence of Persian summary. Do not auto-stage or commit the release note unless requested. Report the saved relative path.

### 4. Chat-only Persian summary (mandatory)

**Only after successful saving and validation**, present a brief headline-style summary in Persian in the final agent response. Focus on business-readable outcomes, meaningful risks, required consumer/deployment actions and readiness/unknowns. Typically 3–7 short bullets, without low-level implementation details unless necessary. Example format:

```text
خلاصه برای ارائه به بیزینس (فقط در پاسخ Agent، خارج از فایل):
- بهبود فرآیند ...
- تغییر در رفتار ...
- نیاز به هماهنگی با ...
- وضعیت اعتبارسنجی: ...
- ریسک و برنامه بازگشت: ...
```

Only include statements established during review. Do not save this summary in any file, log, commit message or release-note appendix. If writing fails, do not claim the release note was registered; explain the obstacle and, if helpful, provide a provisional summary clearly marked as provisional.

## Quality gates

- Base every change and claim on the inspected diff, tests, Git history, or explicitly provided release context; distinguish verified facts from inferences.
- Don't print secrets, tokens, passwords, private customer data or raw credentials found in diffs. Redact examples.
- Do not equate committed code with deployed functionality, and do not equate an unrun test with a passed test.
- When a branch includes unrelated changes, document the scope and risk rather than silently dropping important modifications.
- Use explicit `None identified` only after checking; otherwise use `Unknown / Not verified`.
- Never run migrations, manipulate production data or perform rollback as part of documenting them.
