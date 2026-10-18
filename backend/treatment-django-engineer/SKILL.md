---
name: treatment-django-engineer
description: Implement production-safe Treatment Django changes and orchestrate architecture planning, product/technical documentation updates and automated testing through companion skills. Use for Django APIs, serializers, models, ORM, services, permissions, Celery, cache, search, third-party integrations, bug fixes and refactors.
---

# Treatment Django Engineer

This skill is a cross-agent implementation coordinator for Codex, OpenCode and Claude Code. **One canonical set of instructions applies to all three.** Deliver the smallest correct end-to-end change, retaining API compatibility, tenant isolation, data integrity and operability.

## Mandatory companion-skill workflow

Before substantive feature changes, architectural changes or refactoring, **load/read and use** `treatment-backend-planner` to produce or revise the implementation architecture and change-impact plan. Apply a lightweight plan for narrow fixes; skip heavyweight planning for cosmetic-only changes, but record why.

Whenever code changes affect product workflows, business rules, APIs, technical behavior or operational behavior, **load/read and use** `django-product-documentation` to update the corresponding documentation as part of the change. Respect that skill's language policy: Product/Business in Persian (RTL), Technical/Quality in English (LTR), with other sections following the documentation skill. Do not silently invent behavior. Report missing documentation and uncertainties.

For any code change with testable behavior, **load/read and use** `treatment-backend-testing` in **`test` mode** to write/update/run affected automated tests. Reuse its existing bootstrap infrastructure: pytest, class-based tests, layered fixtures, factories/builders, reference-only test seeds, mocks for third parties/SMS/Celery, migration/security/performance/property testing as applicable, and separately measured >=95% line/branch coverage targets in the agreed scope. Do **not** rerun bootstrap automatically. For model/enum/reference-data infrastructure changes requiring upkeep, use that skill's `maintain-bootstrap` mode; perform `bootstrap` only when explicitly setting up an uninitialized test infrastructure. Follow actual skill files as source of truth rather than this summary.

**Dependencies are peer skills, not bundled copies.** Locate and read each installed skill's `SKILL.md` and relevant references using native skill loading if available, otherwise the canonical filesystem path. Do not pretend a skill was used if missing or unreadable. If a required companion is missing, explicitly report its name, what could not be performed, and a practical remedy; do not manufacture its instructions. Only proceed with a bounded safe fallback where justified.

## Orient and inspect

1. Confirm current branch, changes and task constraints; preserve uncommitted work. Compare exact requested branch refs where relevant rather than assuming `production...development`.
2. Read existing nearby implementations, impacted documentation, relevant migrations and tests. If Graphify and a fresh graph are available, use them optionally for navigation and verify findings in actual code; otherwise use targeted repository searches.
3. Confirm project Python/Django versions from currently checked-in configuration, not historical version assumptions. Resolve relevant setting/environment differences.
4. Map affected API consumers, frontend/PWA contracts, database state, roles/permissions and dependent async integrations before implementing.

## Implement safely

- Keep domain logic in the owning app; use shared packages only for genuinely reusable functionality. Keep validation at the boundary and invariants in the domain/model layer.
- Maintain API contracts (URLs, methods, status codes, schemas, filters, ordering, pagination, errors) unless explicitly authorized to change them; document and test intentional changes.
- Enforce authentication, authorization, per-object permissions and cross-contract/tenant isolation.
- Review ORM select/prefetch behavior, indexes, constraints, lock ordering, transaction boundaries and race conditions. Use `transaction.on_commit` for side effects that depend on committed data.
- Make Celery tasks idempotent, with bounded retries for transient failures and clear handling of duplicate messages. Handle HTTP errors/timeouts securely. Treat cache and Elasticsearch as derived state with invalidation/reconciliation strategies.
- Never leak credentials or private records into code, logs, fixtures, examples or documentation.
- Introduce migrations only when required; verify compatibility, deployment ordering and rollback before applying to live databases.
- Never alter production/staging data, merge, commit or deploy without explicit authorization.

## Verify and finish

1. Update affected tests via `treatment-backend-testing` and run the most relevant suites, Django checks and lint/format checks; expand scope based on risk. Use mocked outbound integrations in default tests.
2. Update changed documentation using `django-product-documentation`; cross-check behavior with source and test scenarios.
3. If Graphify is installed and actively used in this repository, update its graph when appropriate, without making Graphify a hard requirement.
4. Report in chat: architecture decisions and planner usage; implementation/files; documentation pages and missing docs; tests and actual coverage; migration/API compatibility; verification commands/results; unresolved risks; absent peer skills. Never claim validation passed without executing it.

## Invocation order

`planner (for substantive architecture/change impact) -> engineer implementation -> documentation + testing (iteratively as needed) -> verification -> final report`.

Documentation and tests may be written alongside implementation; the arrows are ownership boundaries, not a ban on iteration. If the user requests planning only, do not implement or mutate code.
