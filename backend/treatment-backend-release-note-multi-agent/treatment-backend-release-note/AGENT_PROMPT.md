# Portable invocation examples

## Codex

```text
Use $treatment-backend-release-note.
source_branch: feature/my-feature
target_branch: development
Follow SKILL.md and its references; write English release note under docs/releases/ and provide Persian business summary only in chat.
```

## OpenCode

```text
Use the treatment-backend-release-note skill.
source_branch: feature/my-feature
target_branch: development
Follow the skill instructions and provide the chat-only Persian business summary.
```

## Claude Code

```text
/treatment-backend-release-note
source_branch: feature/my-feature
target_branch: development
```

Alternatively say: `Use the treatment-backend-release-note skill to document feature/my-feature into development.`

All platforms must resolve the exact source/target refs, inspect Git evidence, save an **English** note to `docs/releases/`, and output a **Persian** headline summary in chat only. If a given platform does not expose a slash command, use explicit natural language invocation. No platform should switch branches, fetch, merge or deploy without authorization.
