# Cross-agent use

Supported: Codex, OpenCode and Claude Code. Canonical location: `.agents/skills/<name>/SKILL.md`. Claude Code sees a relative symlink at `.claude/skills/<name>`. OpenCode can discover `.agents/skills/<name>` directly; an optional `.opencode/skills/<name>` relative symlink is installed as well. The installer must never overwrite existing directories or symlinks. Companion skills must be installed separately. Refresh the agent session after installation or updates.

The instruction files are product-neutral and avoid agent-specific undocumented tool names. Use native skill loading when available; otherwise read installed `SKILL.md` explicitly.
