# Verification checklist and report requirements

Before executing anything, classify actions as read-only code/schema inspection, code edits, local isolated test DB actions, or live DB mutation. Require explicit verified DB target before the latter. Never infer production is safe.

Final report in English (technical/quality):

1. Source revision / commit SHA, relevant documentation paths and analyzed models.
2. Choice/Enum candidates implemented vs deferred, with exact stable values and migration/API risks.
3. Seed inventory per profile and commands to dry-run, apply to explicit development target, and initialize test DB through pytest.
4. Pytest architecture, named fixture layers and class/method documentation quality.
5. Tests run (exact commands), pass/fail/skip counts, coverage scope, measured line/branch percentages and failed coverage gate if any.
6. Validation findings: schema/migrations, idempotency, no accidental dev data in test, network isolation, lint, doc/source mismatch.
7. Missing area-specific documentation: report in chat when discovered **and after tests**. Record searched paths, affected classes/files, code fallback, doc/code conflicts and unresolved product expectations.
8. Mock verification: third-party, SMS and Celery dispatch boundaries; assert no real outbound delivery/enqueue and note any isolated opt-in test exceptions.
9. Open questions and blocked items with no invented assumption.

Never report a passing 95% threshold without the measured coverage artifact. Treat `pytest --reuse-db` carefully, because stale test data may invalidate seed guarantees; prove clean DB setup in a fresh isolated test run.
