# Cross-agent portability contract

The same `SKILL.md` and `references/` apply in **Codex**, **OpenCode**, and **Claude Code**. No agent is allowed to weaken the standing testing policies based on its toolchain.

## Activation and modes

- The default mode is `test` when a feature-testing request does not name a mode.
- `bootstrap` is an explicit, one-time repository setup; do not repeat it implicitly.
- `maintain-bootstrap` is for scoped changes to already-created prerequisites only.
- Read this `SKILL.md` and only applicable references from the **resolved skill directory**; references are relative to this file, not the repository root.
- On each invocation, check the repository-owned `.testing/bootstrap-manifest.json` (or the verified project-specific equivalent) instead of assuming the skill installation indicates bootstrap completion.
- Do not treat a new agent, session, or editor as a reason to recreate enum classes, refactor models, or generate seed profiles.

## Tool interoperability

- Use native code browsing, file editing, terminal, and test tools available in the current host.
- Graphify is optional. If not installed or unavailable in one host, fall back to local code search and inspection.
- All examples in skills and references are **behavioral instructions**, not host-specific tool invocations.
- Never claim tests, migrations, CI checks, or browser workflows ran unless the host actually ran them.
- If a configured agent denies shell/file permissions, report that blocker; do not bypass host safeguards.

## Project installs

- **Codex**: `.agents/skills/treatment-backend-testing/SKILL.md`
- **OpenCode**: `.opencode/skills/treatment-backend-testing/SKILL.md` (also discovers the `.agents/skills/` and `.claude/skills/` project compatibility paths).
- **Claude Code**: `.claude/skills/treatment-backend-testing/SKILL.md`

Prefer one physical directory under `.agents/skills/` and symlinks for `.claude/skills/` and optionally `.opencode/skills/`. Avoid distinct copied versions that drift. If symlinks are unavailable, copy once and sync ALL files after changes, verifying identical checksums. If the existing project already has one canonical directory, use that instead, updating the links appropriately; do not overwrite project-authored skills without consent.

Agent commands are *invocation hints*, not hard dependencies: any agent may be asked to "Use the treatment-backend-testing skill in test/bootstrap/maintain-bootstrap mode". Do not rely on Codex's `$` prefix, OpenCode's native `skill` call, or Claude's slash command being available in every interface.

## Compatibility checklist

Verify skill `name` matches its directory, YAML frontmatter parses, all relative references exist, any linked directories resolve, and no documentation or code hard-requires a particular agent. Keep class-based pytest, documentation-first, mock isolation, hierarchical tests, line + branch coverage, seed lifecycle and all approved enhancements unchanged.
