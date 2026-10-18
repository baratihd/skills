# Treatment Backend Release Note — Multi-Agent Edition

One portable skill for **Codex**, **OpenCode**, and **Claude Code**, preserving the original release-note review workflow.

## Install

From the unpacked archive, in the folder containing `install-skill.sh`:

```bash
./install-skill.sh /absolute/path/to/treatment-backend
```

The script intentionally **refuses to overwrite** existing skill directories or symlinks. Back up your current installation and remove the old skill locations before running it. It never modifies application source, branches or Git history.

Result:

```text
repo/
  .agents/skills/treatment-backend-release-note/   # canonical files
  .claude/skills/treatment-backend-release-note -> ../../.agents/skills/treatment-backend-release-note
  .opencode/skills/treatment-backend-release-note -> ../../.agents/skills/treatment-backend-release-note
```

On systems without symlink support, manually copy the skill directory into `.claude/skills/` and `.opencode/skills/`, but keep all copies synchronized.

## Invoke

- **Codex:** `Use $treatment-backend-release-note. source_branch: feature/my-feature; target_branch: development.`
- **OpenCode:** `Use the treatment-backend-release-note skill. source_branch: feature/my-feature; target_branch: development.`
- **Claude Code:** `/treatment-backend-release-note` followed by source and target branches, or the same natural-language instruction.

See `treatment-backend-release-note/AGENT_PROMPT.md` for full examples.

## Preserved behavior

- Compare the source against target using verifiable Git refs, hashes, history and changed code.
- Compose an **English** release note at `docs/releases/` containing business, technical, compatibility, verification, traceability and rollback sections.
- Show a concise **Persian business summary only in the chat** after saving the note. Never save the Persian summary to the repository.
- No unauthorized checkout, merge, fetch, deploy, tag, commits or production mutations.

## Caveats

A user-provided source and destination branch are required unless the conversation makes them explicit. The release-note workflow itself does not modify either branch. Agent recognition depends on the installed application and repository permissions.
