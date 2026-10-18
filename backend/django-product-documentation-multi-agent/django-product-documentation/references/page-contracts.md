# Page contracts and language matrix

| Documentation location | Required narrative language | Text direction |
| --- | --- | --- |
| `docs/product/**` | Persian | RTL |
| `docs/business/**` | Persian | RTL |
| `docs/technical/**` | English | LTR |
| `docs/quality/**` | English | LTR |
| `docs/operations/**` | Persian | RTL |
| `docs/index.md`, `docs/glossary.md`, `docs/traceability.md`, `docs/coverage.md`, `docs/changes.md` | Persian | RTL |

The direction and language of **individual pages** must be correct even though the MkDocs theme uses a Persian navigation shell. Source identifiers and code/payload snippets remain LTR.

# Contracts for each documentation category

## Product pages — write all narrative in Persian (RTL)
Purpose/value, actors/personas, prerequisites, user journey, outcomes, capabilities, acceptance criteria, limitations, examples, links to BR IDs; **no class-level implementation**.

## Business pages — write all narrative in Persian (RTL)
Rule ID, purpose, scope/conditions, decision tables/priority, input concept/meaning, eligibility, calculations/rounding/precision/currency/timezone, exceptions, edge conditions, examples, conflicts, business questions, evidence status.

## Technical pages — write all narrative in English (LTR)
Architecture context; public endpoints with method/path, authentication/authorization, request/response field tables, HTTP statuses, error envelope and explicit examples verified against actual code; models/constraints/migrations; transactions/concurrency/idempotency; Celery queues/retries; external integrations; caches and invalidations; observability and security; links to BR IDs. Mark environment-dependent values unknown rather than assume.

## Quality pages — write all narrative in English (LTR)
Scenario ID, requirement links, kind (Unit/Integration/E2E/FireTest), preconditions, setup fixtures, request/event, Given/When/Then, Expected Result including status/body/state/side effects, negative cases, boundary data, isolation and environment constraints, whether already implemented in tests. Do not write test code.

## Operations pages — write all narrative in Persian (RTL)
Evidence-backed env/config dependencies (names only, never values), deploy prerequisites, migrations, rollback precautions, monitoring/alerts, known failure modes and read-only validation. Distinguish confirmed deployment topology from examples.

## Required page metadata
Title, audience, feature/rule IDs, analysis date, source commit, scope, evidence list, confidence, related docs, outstanding questions. Record 'not verified' where needed.

## Documentation quality checklist
- Reader can reproduce a success and failure using sanitized examples.
- Cross references connect requirements -> rules -> API/service -> scenarios.
- Persian product/business/operations pages are RTL, technical and quality pages are English LTR, and code examples remain LTR.
- Unverified claims have the required **language-specific** uncertainty sentence and a concrete question.
- Technical payloads and expected results match inspected schema, or marked provisional.
