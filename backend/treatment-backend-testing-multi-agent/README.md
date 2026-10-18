# Treatment Backend Testing — Cross-Agent Edition

One portable Agent Skill for **Codex, OpenCode and Claude Code**. The source is `treatment-backend-testing/SKILL.md`, with identical instructions in all three hosts. All previously approved rules, references and modes are retained.

## Install in a Django project

From this extracted package:

```bash
./install-skill.sh /path/to/treatment-backend
```

The script copies a canonical copy to `.agents/skills/treatment-backend-testing/` and links `.claude/skills/treatment-backend-testing` and `.opencode/skills/treatment-backend-testing` to it. The script refuses to overwrite an existing canonical skill and does not replace preexisting links/directories. This protects prior edits; merge any previous installation first.

**Manual alternative**: copy `treatment-backend-testing/` to one supported location in the table below. OpenCode discovers the `.agents` and `.claude` compatibility directories directly; for Claude Code you still need `.claude/skills/`. For shared install, prefer canonical plus symlinks to avoid drift.

| Agent | Project-local path |
|---|---|
| Codex | `.agents/skills/treatment-backend-testing/SKILL.md` |
| OpenCode | `.opencode/skills/treatment-backend-testing/SKILL.md` (also `.agents` or `.claude`) |
| Claude Code | `.claude/skills/treatment-backend-testing/SKILL.md` |

No three-way content duplication is necessary. The symlinks use a relative target and should survive moving the repository. On Windows or environments without symlinks, use copies and explicitly sync/check them after changes.

For the three modes and copy-paste prompts, see `treatment-backend-testing/AGENT_PROMPT.md`. `CODEX_PROMPT.md` is retained for backward compatibility but is not required for OpenCode/Claude Code.

## Important separation of concerns

The skill is instructions, not a completed Django bootstrap. Bootstrap manifest belongs in the **Django project** and is shared among all three agents. Each normal `test` run reuses its existing Choices/Enums, reference seed commands and factories, and it does not repeat project-wide audit/seed generation.

All requirements persist: documentation-first and missing-docs chat reporting, mocked third-party HTTP/SMS/Celery dispatch, class-based pytest with English docstrings, layered fixtures, >=95% line and branch coverage separately, migration compatibility, N+1/query budgets, security/isolation, CI checks, Hypothesis, tree-structured tests and approval-aware change control.
