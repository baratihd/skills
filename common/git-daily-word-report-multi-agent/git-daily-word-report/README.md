# git-daily-word-report

Portable Git-based daily work report skill for **Codex**, **OpenCode**, and **Claude Code**.

## Installation

Place this directory in your skills repository. Run the adjacent `install-skill.sh /path/to/repository` to install into `.agents/skills/` and link `.claude/skills/` and `.opencode/skills/` to the same SKILL.md source. Existing targets are never overwritten.

For manual installation:

- Codex: `.agents/skills/git-daily-word-report/`
- OpenCode: `.agents/skills/git-daily-word-report/` or `.opencode/skills/git-daily-word-report/`
- Claude Code: `.claude/skills/git-daily-word-report/`

If symlinks are unsupported, copy the directory into each provider's path and update copies together.

## Invoke

Codex / OpenCode: `Use the git-daily-word-report skill to summarize my Git work today.`

Claude Code: `/git-daily-word-report` or `Use the git-daily-word-report skill`.

Default output is a concise Persian report in chat. The skill is read-only and does not commit, push, or create files unless explicitly asked to save the report.
