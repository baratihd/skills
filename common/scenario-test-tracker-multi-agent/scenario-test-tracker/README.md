# scenario-test-tracker

Cross-agent, read-only skill to document test scenario additions and modifications in Persian Markdown, grounded in Git history, pytest assertions and existing documentation.

## Files
- `SKILL.md`: mandatory agent instructions
- `USAGE.md`: invocation guide for Codex/OpenCode/Claude Code
- `references/analysis-policy.md`: diff classification and evidence standards
- `templates/scenario-report.md`: two-section Markdown report template

## Modes
No special modes. One reusable workflow with optional Git refs and paths.

## Install
Use the included `install-skill.sh` from the extracted distribution or place the skill at `.agents/skills/scenario-test-tracker` and link `.claude/skills/scenario-test-tracker` to it. OpenCode recognizes `.agents/skills` as well.

## Output
By default `docs/quality/test-scenarios/changes/<source>--vs--<target>.md`. The report contains the required Persian sections, traceable scenario details and honest uncertainty/verification statuses.

## Safety
No code changes, destructive Git commands, external requests or test runs by default.
