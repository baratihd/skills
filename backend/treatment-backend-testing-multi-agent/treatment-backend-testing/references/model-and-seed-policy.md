# Model/Choice/Enum audit and environment seed policy

## Inventory and evidence

Create a table: app, model/field, current Python type, raw states, source references, DB-backed vs in-code choice, consumer locations, existing stored values, external API representation, proposed refactor, migration risk, decision status. Examine serializers, filters, queries, celery tasks, history and tests; flag values that must remain exactly stable. Do not force Choice/Enum on unbounded free text, admin-configured catalogs or third-party codes with unknown exhaustive sets.

Keep Django `TextChoices` / `IntegerChoices` in code. A model field with `choices=` does not need seed records. DB-backed lookup tables that genuinely require rows can be seeded as reference data. Verify schema migrations and data preservation; do not change existing persisted codes, expose a label instead of a code, or create an unexpected FK.

## Profiles and target matrix

| Content | reference | development | test |
|---|---|---|---|
| Mandatory DB-backed reference rows | Yes | Yes | Yes |
| Python Choice/Enum definitions | Loaded through code | Loaded through code | Loaded through code |
| Synthetic Contract / policy / insured graph | No | Yes if applicable | No |
| Three synthetic users per actual role | No | Yes if applicable | No |
| Test-specific business records | No | No | Created by isolated pytest fixtures |

The test schema naturally includes migrated Django/system tables; "test only Choice/Enum" means *no demo/business seed records*, not that only enum tables can exist. Reference inserts must be minimal and justified by an actual database requirement. Avoid rigid assumptions about role naming, contractual requirements, foreign keys and statuses: derive them from code and documented rules.

## Command and safety contract

Implement a documented management command aligned with existing project naming, supporting explicit profile and database target (for example `python manage.py seed_data --profile test --database test_alias --dry-run`). Verify settings/alias and refuse ambiguous production targets. Avoid trying to target pytest's transient DB from an unrelated shell command without correct setup; use pytest-django's managed DB setup and a fixture/setup hook if reference rows are required. If migrations already populate required reference rows, don't duplicate them.

Seed scripts must be idempotent, ordered by FK dependency, deterministic, atomic per logical batch, non-destructive and auditable. Use natural unique keys not unstable integer IDs; no production snapshots or genuine personal information. Show how to seed a selected development DB, how the test runner initializes its test DB, and how to check results with a dry run/read-only verification. Document rollback limitations clearly; never promise reversible seeding if updates affect existing rows.

Before changing a schema or applying seeds: inspect existing rows (read-only), review migration operations, verify environment alias and confirm high-risk changes with user. Do not run against production automatically.
