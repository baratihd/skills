# django-product-documentation — multi-agent edition

One portable skill for **Codex, OpenCode, and Claude Code**. The canonical copy is installed at `.agents/skills/django-product-documentation/`, with symlinks from `.claude/skills/` and `.opencode/skills/`. The source skill remains a standalone directory suitable for a skills repository.

## Install

From the extracted bundle:

```bash
./install-skill.sh /absolute/path/to/django-project
```

The installer does **not** overwrite existing skill installations or replace the site's documentation. If an earlier skill exists, back it up and replace it intentionally. The symlinks assume a filesystem that supports symbolic links; on systems without symlink support, copy the same skill directory to the native path, noting that updates then need to be copied again.

## Invocation

- **Codex:** `Use $django-product-documentation to document the expense app.`
- **OpenCode:** `Use the django-product-documentation skill to document the expense app.`
- **Claude Code:** `/django-product-documentation Document the expense app.` (or ask Claude to use the named skill).

Do not hardcode agent-specific commands into `SKILL.md`: each agent should read the same `SKILL.md` and local references. Verify recognition in the chosen agent; installer checks only paths and file content.

## Site scaffold

The portable `site/` scaffold can be copied to a separate documentation repository. Run `python -m mkdocs build --strict` in that directory after installing requirements. Site generation doesn't require Django to run. Product and Business pages are Persian/RTL; Technical and Quality pages are English/LTR; shared Operations and reporting pages are Persian/RTL.

**Fonts:** Font binaries are not distributed in this package. To retain the self-hosted typography of the original site, supply the properly licensed font assets separately according to `site/THEME.md` and `references/design-system.md`. The site can use system fallback fonts until then; validate the resulting appearance.

## Boundaries

Do not invent business rules, overwrite existing documentation, expose secrets, claim tests or builds ran when they did not, or automatically call external APIs. The standalone site folder contains scaffolding, not authoritative documentation for a real Django project.
