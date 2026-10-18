# treatment-backend-planner

Portable agent skill for Codex, OpenCode, and Claude Code.

## Install

Copy this directory to `.agents/skills/treatment-backend-planner/` in your project.

For Claude Code, create a symlink from `.claude/skills/treatment-backend-planner` to `../../.agents/skills/treatment-backend-planner`. OpenCode can read the `.agents/skills/` installation; optionally create the same symlink under `.opencode/skills/`.

This skill may refer to other skills; install those separately if needed.

## Use

Ask your agent: `Use the treatment-backend-planner skill.`

Read `SKILL.md` for mandatory rules.
