# Treatment Agent Skills — English Usage Documentation

This folder contains **six independent English Markdown guides** to add under `docs/agent-skills/` of the Treatment repository.

## Guides

- [django-product-documentation](./django-product-documentation.md)
- [treatment-backend-planner](./treatment-backend-planner.md)
- [treatment-backend-release-note](./treatment-backend-release-note.md)
- [treatment-backend-testing](./treatment-backend-testing.md)
- [treatment-django-engineer](./treatment-django-engineer.md)
- [git-daily-word-report](./git-daily-word-report.md)

## Quick start

1. Install each skill's `SKILL.md` under `.agents/skills/<skill-name>/`.
2. Configure `.claude/skills/` and `.opencode/skills/` if your agent requires those discovery paths; verify symlinks.
3. Start a new agent session and invoke the skill using the corresponding guide.
4. Run `treatment-backend-testing` in `bootstrap` mode **once**, then use `test` routinely; use `maintain-bootstrap` only when required.

## Skill documentation vs. output language

These usage guides are English, but the skills' established **output language policies do not change**:

| Skill | Output policy |
|---|---|
| django-product-documentation | Product/Business: Persian RTL; Technical/Quality: English LTR |
| treatment-backend-release-note | Release notes in English; brief Persian business summary in chat only |
| git-daily-word-report | Daily work reports in Persian |
| Other skills | Follow their own SKILL.md |

## Verify skill paths on Linux

```bash
find .agents/skills .claude/skills .opencode/skills -maxdepth 2 \( -name SKILL.md -o -type l \)
```

A valid path does not guarantee skill discovery by every agent. Check the active agent version/configuration. These usage guides do not replace the actual skills. All prompt paths, branches, and settings are examples to adapt to the repository.
