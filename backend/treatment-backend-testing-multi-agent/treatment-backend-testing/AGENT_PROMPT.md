# Universal Agent Prompts — Codex / OpenCode / Claude Code

The skills in all three agents follow the same `SKILL.md`. Use natural language in any supported agent; if the agent has native skill invocation, use it first.

## First-time repository setup

Use the `treatment-backend-testing` skill in **bootstrap** mode. Read `SKILL.md` and applicable references. Perform the one-time Django Choices/Enums, isolated reference/development/test seed profiles, layered fixtures, factories and domain builders, and hierarchical tests package setup. Validate and persist the project-owned bootstrap manifest. Do not alter production data or re-bootstrap in future routine test sessions.

## Routine feature testing

Use the `treatment-backend-testing` skill in **test** mode for **[APP_OR_FEATURE]**. Reuse existing bootstrap artifacts. Apply ALL permanent skill requirements (documentation-first and missing-docs reports, mandatory third-party/SMS/Celery dispatch mocks, class-based pytest with English Given/When/Then docstrings, layered fixtures, 95% line AND branch coverage, and applicable approved security/migration/performance/Hypothesis/CI checks). Organize tests in the existing hierarchical tests package. Report verified commands, results, uncovered risks and missing documentation.

## Prerequisite maintenance

Use the `treatment-backend-testing` skill in **maintain-bootstrap** mode. Identify the changed models/Choices/Enums or required reference-data dependencies. Update only affected infrastructure, safely validate, and refresh the bootstrap manifest. Do not perform a full bootstrap.

## Agent-specific optional shorthand

- Codex: `$treatment-backend-testing` plus the desired mode.
- Claude Code: `/treatment-backend-testing` if listed as an invocable skill; otherwise use the natural-language prompt above.
- OpenCode: ask it to load `treatment-backend-testing` using its skills capability (and mode); its slash exposure depends on OpenCode version/configuration.

If a skill is not discovered, verify install path, permissions, and start a new session. Do not respond by manually pasting permanent rules into every feature prompt.
