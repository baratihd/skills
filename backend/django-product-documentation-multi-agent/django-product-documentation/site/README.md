# Documentation scaffold

Copy this folder, preserve the language matrix, and replace placeholders with evidence-backed content. Read THEME.md for design tokens, fonts, components, native appearance modes and browser checks. No application imports are needed.

```bash
make setup  # Only with authorized package access; skip when dependencies exist.
make serve
make check
make check-theme  # Optional: already installed Node 22+ and Chrome.
```

Structure: `docs/` contains published Markdown, `docs/stylesheets/` the theme/direction CSS, `docs/assets/fonts/` licensed local fonts; `mkdocs.yml` owns navigation/extensions; `hooks.py` owns per-page language; `tools/check-theme.mjs` runs offline browser checks. `.venv/`, `_site/`, `.automation/` are disposable and ignored. Keep user-maintained PRDs/releases intact when adapting to an existing repository.

For a real project expand this README with its actual tree, edit map, evidence/registry schemas, metadata and language rules, glossary approval flow, scoped progress and validation results. The glossary is the single editable terminology authority; retain technical identifiers and distinguish user-approved terms from proposals. Do not propagate proposed translations without the user's requested review flow.

Run strict builds after changes, add each new page to navigation once, preserve IDs, and update dependent rules/API/scenarios only when behavior changes. Record what was checked and what remains unverified. Do not claim application tests or full accessibility conformance from documentation checks.

Readers can change Persian and English fonts independently from the header font control. Maintain options/defaults in `extra.documentation_fonts`; use licensed local assets or document installed-font fallbacks. `overrides/` and `docs/javascripts/fonts.js` provide the control and persistence without replacing the Material header.

The scaffold now bundles OFL-licensed Vazirmatn, Inter and Amiri in addition to JetBrains Mono. See evidence/font-assets.json for sources/hashes. B Nazanin and Times New Roman are local-only; an unavailable font produces a per-language warning. Font tests inspect actual rendered glyph families, not just the requested CSS stack.
