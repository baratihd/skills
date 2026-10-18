# One-time Django testing bootstrap lifecycle

## Modes and trigger rules

| Mode | Trigger | Allowed actions | Forbidden implicit actions |
| --- | --- | --- | --- |
| `test` (default) | Normal request to implement/update/run tests | Inspect feature docs/source; reuse established enums, seed loaders, factories/builders; create fixture-isolated scenarios; run tests and report gaps | Full model/DB inventory, enum refactor, seed generation, loading development fixtures, database migration outside isolated test DB |
| `bootstrap` | Explicit initial setup request | One-time whole-project audit; safe enum extraction; seed commands/profiles; pytest foundation; tests; persistent bootstrap manifest | Unapproved real-DB mutations, guessing mappings, production/demo seed |
| `maintain-bootstrap` | Explicit maintenance or demonstrated drift | Analyze and update only affected enum/reference/seed/manifest, verify focused compatibility | Repeat full bootstrap without necessity |

## Durable state

After successful bootstrap write a **repository-owned** manifest, suggested `.testing/bootstrap-manifest.json` (choose existing project convention if present). Manifest is **metadata, not authority**: verify referenced files and command help. Suggested keys:

```json
{
  "schema_version": 1,
  "state": "ready",
  "created_at": "<ISO-8601 timestamp>",
  "validated_commit": "<git SHA>",
  "enum_modules": ["<path>"],
  "seed_command": "<management command name>",
  "seed_profiles": ["reference", "development", "test"],
  "factory_paths": ["<path>"],
  "builder_paths": ["<path>"],
  "validation": {"checks": ["<executed check>"]}
}
```

Do not mark state `ready` until artifacts are present and applicable non-destructive validation passes; otherwise record `incomplete` and blockers. A changed git revision alone is **not** a reason to redo setup. Do not put secrets, DB credentials, sample-user passwords, or environment-specific connection strings in the manifest.

## Seed invariants

- Django Python Choices/Enums need no persisted rows. Only required database-backed reference rows may be seeded in an isolated test DB.
- `development`: required references + synthetic development demo objects (e.g. contracts and role users) only on an explicitly confirmed development alias.
- `test`: reference rows ONLY, and only those necessary; no demo contracts, users, expenses, insureds or policies. Business scenario records are created per test using pytest fixtures/factories/builders.
- Production: NEVER load development/test seed profiles.
- Seed commands are idempotent and manually runnable on a **verified** selected database. No repeated reseeding on every Skill invocation. In pytest, install essential reference rows in the isolated test database only when required, using the project's established setup mechanism; once per test DB lifetime where safe, without hidden shared business records. Test DB reconstruction may naturally reapply required reference setup; that is **not** a new bootstrap audit.
- Migration-owned reference data and runtime seed data must not be duplicated blindly; inspect existing migration ownership and choose one stable owner.

## How to recover missing or stale setup

1. In `test` mode, check manifest and referenced artifacts with bounded, read-only checks, not a repository-wide re-audit.
2. If infrastructure exists but manifest is missing, propose reconstructing the metadata from verified artifacts rather than rebuilding seeds.
3. If essential commands/assets are missing or incompatible, name the issue during work; ask for approval to enter `bootstrap` or `maintain-bootstrap` when nontrivial schema or persistent data changes are needed.
4. Continue independent tests using fixture-local data wherever safe; never fabricate enum definitions or assume preexisting contracts.
5. Report whether bootstrap was reused, maintenance was needed, or setup remained incomplete.

## Normal-run behavior

Each invocation: read feature documentation, inspect feature-specific code and existing fixtures; mock third-party/SMS/Celery boundaries; implement class-based pytest and run quality checks. DO NOT call the seed management command by default. No obligation to re-review unrelated models or create three users per role again.
