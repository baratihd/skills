# Release Notes — <Source> → <Target>

**Document date:** YYYY-MM-DD  
**Release status:** Proposed / Deployed (verified only)  
**Version / Release ID:** <version or Not assigned>  
**Environment:** <stage / production / other>  
**Source:** `<resolved source ref>` (`<full SHA>`)  
**Target (baseline):** `<resolved target ref>` (`<full SHA>`)  
**Merge base:** `<full SHA>`  
**Deployment date:** <verified date or Not scheduled / Unknown>

## 1. Executive Summary

One short paragraph describing the scope, business outcome and material risks. Never claim deployment before confirmation.

## 2. Business Changes

| Area / Workflow | Previous behavior | New behavior | Business impact | Evidence |
| --- | --- | --- | --- | --- |
| <area> | <observed or Unknown> | <verified change> | <impact or Requires confirmation> | <paths, commits, tests or PR> |

## 3. Features and Technical Changes

### Features and API behavior
- <feature / endpoint / processing change and evidence>

### Data, jobs and integrations
- <migrations, Celery, third parties, configuration, monitoring, performance or None identified>

## 4. Compatibility and Consumer Impact

**Breaking change:** Yes / No / Unknown  
**Affected consumers:** <frontend, mobile, internal services, third parties, workers, or Unknown>  
**API / contracts:** <endpoint, payload, statuses, permissions; None identified / Unknown>  
**Database / async compatibility:** <migration, event / task message, rollout order>  
**Required consumer actions:** <actions, None identified, or Requires confirmation>

## 5. Validation and Traceability

**Comparison method:** <source-exclusive commits and merge-base diff, or actual deployment comparison>  
**Compared commits:** `<target>..<source>`  
**Change summary:** <counts / key paths, evidence>  
**Tickets / PRs:** <verified identifiers / Not identified>  
**Tests run and results:** <exact commands and observed results, or Not run>  
**Checks not performed:** <missing verification>  
**Deployment verification:** <logs, smoke checks, metrics, or Not performed>  
**Outstanding risks / assumptions:** <known facts vs unresolved>

## 6. Deployment and Rollback Plan

**Prerequisites:** <backup / compatibility / migration plan / toggles / external coordination>  
**Deployment sequence:** <ordered, evidence-grounded steps; or Requires confirmation>  
**Rollback trigger:** <clear signal / Requires definition>  
**Application rollback:** <previous artifact/SHA restoration plan / Requires confirmation>  
**Git revert:** <revert relevant commits/merge commit after dependency analysis; not equivalent to deployment rollback>  
**Database rollback:** <migration reversibility and data preservation / Not verified>  
**Async jobs / integrations:** <queues, side effects, deduplication / Not verified>  
**Post-rollback validation:** <health checks, API smoke tests, jobs, metrics>

## 7. Release Decision / Open Items

- <go/no-go status or pending approvals, without inventing approval>
- <unresolved dependencies or actions>
