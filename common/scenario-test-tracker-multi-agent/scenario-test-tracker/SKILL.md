---
name: scenario-test-tracker
description: Analyze Django/pytest test changes from Git and generate evidence-based Persian Markdown documentation separating newly added test scenarios from modified existing tests, with code traceability, expected behavior and change details. Use when asked to document test additions or updates, compare branches, or publish test scenario changes.
---

# Scenario Test Tracker

## Objective and scope
Produce publication-ready **Persian** Markdown documenting tests **actually implemented in source code**. The output MUST have two top-level sections: **تست‌های ایجادشده** and **تست‌های تغییر داده‌شده**. The skill documents tests; it does not create, refactor, revert, run, or modify application/test code unless the user separately requests that action. Do not claim an unexecuted test passed.

Read `references/analysis-policy.md` and `templates/scenario-report.md` before producing the report. `USAGE.md` is a human-facing usage guide, not the source of execution rules.

## Inputs and Git baseline
1. Accept optional `source_branch`, `target_branch`, `base_ref`, explicit files/feature, and `output_path`. If not given, use HEAD as the source and ask for the comparison target only when no safe and unambiguous base exists; otherwise use the repository's configured default branch and disclose it. Never assume the target is `development` without evidence.
2. Verify refs and capture full commit SHAs. Use `git diff --name-status -M <target>...<source> --` plus content diffs. For working-tree requests include staged/unstaged changes explicitly, distinguishing these from committed changes. For exact-tip comparison when explicitly requested, use `target..source` and explain semantics.
3. Include added, modified, renamed and relocated tests; detect renamed files with `-M`. Classify **new test case** vs **modified existing test case** by test identity and history, not merely file status. A new method inside an existing test file belongs under newly created; a changed existing method belongs under modified. Rename/move with unchanged behavior is a structural change, not automatically a changed scenario.
4. Inspect actual class-based pytest tests, parametrization, fixtures, factories, builders, mock setup, assertions, expected errors, permissions, API results and database effects. Interpret `pytest.mark.parametrize` as multiple variations when meaningful. Inspect nearby code and available docs to validate expectations. Evidence beats guesses; when evidence is insufficient, mark **نیازمند تأیید** and state what is missing.
5. If a dependency on `treatment-backend-testing` or `django-product-documentation` exists, use their conventions where relevant, but do not require either to be installed. This skill remains standalone.

## Non-negotiable report contract
- Write **all narrative text, headings, tables, explanations, and change summaries in Persian**. Preserve exact identifiers, code paths, API names and code snippets in English/LTR. Use Persian `RTL` wrapper where supported; keep fenced code blocks LTR and avoid broken mixed-direction text.
- Begin with metadata: source/target refs and SHAs, date, scope, evidence provenance, and whether test execution was performed.
- The report MUST contain the two major sections in this order, even when one is empty:
  1. `## تست‌های ایجادشده`
  2. `## تست‌های تغییر داده‌شده`
- **For every test case** document: stable ID (e.g. `TS-NEW-001` / `TS-MOD-001`), feature, test file + class + method (where available), test type, scenario description, Given/When/Then, relevant inputs/fixtures/mocks, business/technical assertions and expected results, relevant change (for modified tests: before vs after with grounded evidence), source/test/doc references, and verification/uncertainty status.
- Clearly distinguish **expected by the test assertion**, **documented business contract**, and **observed runtime result**. Only report run outcomes if supported by real command output. Never infer that tests passed from reading them.
- Do not invent scenarios, requirement IDs, APIs, roles, validation behavior, missing old assertions, or coverage numbers.
- If source docs for a changed feature are missing, report the missing docs in chat during analysis (if interactive) and again in the final chat summary, including inspected locations and evidence from code. Do not block writing an evidence-based report unless ambiguity prevents faithful description.
- If tests were deleted (rather than created/modified), do not silently mislabel them. Mention them in a brief separate `یادداشت‌های خارج از دامنه` note, never a third main scenario section; report count and references. If no additions/changes, state none in the required section.

## Output and preservation
1. Default repo-local destination: `docs/quality/test-scenarios/changes/<source-slug>--vs--<target-slug>.md`. Sanitize ref strings to safe filenames. If already present, update by stable test IDs and preserve unrelated manual material; do not blindly overwrite. Allow explicit output path from user.
2. Do not write to production systems, use network or send SMS/Celery calls. Default is static Git/code analysis. Running pytest is optional only when explicitly requested or already supported by task context, and must follow the repository's testing safety policies.
3. Save only the Persian publication-ready report. In the final chat, summarize counts, output file, compared refs, missing documentation, unresolved ambiguities, and which verification commands really ran.
4. Final validation: both sections exist, all test identities are traceable, before/after changes are substantiated, links resolve where possible, RTL wrapper is balanced, no secrets or personal data leaked, no execution claims unsupported by logs.

## Execution flow
- Read repository and relevant docs -> establish baseline -> identify changed test definitions -> inspect before/after test bodies -> extract assertions and expected behavior -> assemble two-section Persian report -> validate evidence and links -> report findings.
- If no repository access is available, ask for a Git diff or repository files rather than fabricate an analysis.
