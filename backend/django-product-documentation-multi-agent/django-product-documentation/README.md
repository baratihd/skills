# Django Product Documentation Skill

An agent skill to create evidence-backed, bilingual (Persian/RTL product and business; English/LTR technical and quality), testable and separately published Django documentation.

## Installation
This standalone skill supports Codex, OpenCode, and Claude Code. The bundle-level `install-skill.sh` installs the canonical skill in `.agents/skills/` and links `.claude/skills/` and `.opencode/skills/` to that copy. See the bundle-level README for invocation and safe installation details.

Copy `site/` to your desired **independent documentation project** (e.g., `documentation/`). The agent should populate real docs after source inspection, not ship the placeholder pages as completed docs.

## Invocation example
> Use django-product-documentation to document the `expense` feature from the Django repository. Analyze Git changes against `origin/main`, identify business rules and test scenarios, and update only the affected documentation (Persian product/business and English technical/quality) under `documentation/`. Ask for frontend documentation path only if frontend inspection is necessary.

## Language rules
- `docs/product/`, `docs/business/`: Persian, RTL.
- `docs/technical/`, `docs/quality/`: English, LTR.
- Other published pages (operations, index, reports): Persian, RTL by default.
- The `site/hooks.py` page-content hook and scoped CSS implement mixed directions in a single MkDocs site.

## Publish locally
From the copied `site/` directory:

```bash
python -m venv .venv
. .venv/bin/activate
python -m pip install -r requirements.txt
python -m mkdocs serve
python -m mkdocs build --strict
```

`_site/` contains standalone static website output. Dependencies are deliberately unpinned in this starter; lock versions once the environment is validated. Commit/build/publish only when explicitly requested.

## Safety
Never expose credentials or real personal data in documentation. The initial MkDocs pages are scaffolding, not verified product documentation.
