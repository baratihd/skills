# Evidence and classification rules

## Determine what changed
- Confirm the current repository, refs, merge base, commit IDs and optionally uncommitted state.
- Use `git diff --name-status -M BASE...HEAD -- '**/test_*.py' '**/*_test.py' 'tests/**'` as a first pass, but inspect project-specific test patterns and nonstandard paths too.
- New pytest test functions/methods added to **existing** files count as *created tests*.
- An existing test whose assertions, parametrization, setup, fixtures, mock expectations or verified scenario changed counts as *modified tests*.
- Changing only formatting/imports is not a changed **test scenario**; mention as structural only if relevant.
- If a test was moved/renamed, track continuity by old path/class/method and body. Do not inflate created count.
- Parametrized changes: identify newly added parameter rows as newly added scenario variants when behavior differs, and revised rows as modified variants; avoid double counting parent test and variants.
- Deletions and obsolete tests belong in a brief out-of-scope note, not invented as modifications.

## Evidence ranking
1. Test method/parameter assertions and fixtures at compared revisions.
2. Runtime test output when actually run.
3. Current application implementation and documented API/behavior.
4. Historical implementation and documentation at base revision.
Separate incompatible sources and flag contradictions. Tests can assert buggy behavior; never call the assertion a verified product requirement without documentary support.

## Traceability
Prefer repository-relative file paths and `ClassName.test_name`, optional line ranges only when computed reliably. For modifications include old and new identifiers and precise assertion/setup differences. Docs references should be concrete paths or links, and missing ones must be declared.

## Third-party / Celery / SMS
This skill is read-only by default. When describing tests, identify mocked external calls and expected invocations. Do not invent use of mocks when tests don't contain them; highlight the unmocked dependency as a review risk rather than silently changing code.

## Safety and release
Do not run destructive Git commands, edit tests, introduce fixtures, commit, push or change deployment resources. Redact secrets, real credentials, personal identifiers and customer data from illustrative values. Optional test execution uses isolated configured test database and no outbound side effects.

## Comparisons
`target...source` uses merge base; `target..source` uses two tips. In the report state the chosen comparison and exact SHAs. If source and target refs are the same or no tests changed, produce empty required sections rather than fabricated entries.
