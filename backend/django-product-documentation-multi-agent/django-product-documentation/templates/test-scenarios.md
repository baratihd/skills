# Test Scenarios: [Feature Name]

**Feature:** `FEAT-001`  
**Related business rules:** `BR-001`  
**Status:** Proposed scenarios; execution is not verified.  
**Evidence:** `[relative/source/path.py::symbol]`  
**Source revision:** `[commit SHA]`

| ID | Level | Scenario | Test data | Expected result | Evidence |
| --- | --- | --- | --- | --- | --- |
| `TEST-001` | Unit | Valid input | Synthetic valid payload | Exact output matches the verified rule | `[path]` |
| `TEST-002` | Integration | Downstream service failure | Controlled error response | Verified error mapping and state transition | `[path]` |
| `TEST-003` | E2E | Verified user workflow | Authorized user and synthetic data | Exact observable API / UI outcome | `[path]` |
| `TEST-004` | FireTest | Safe environment smoke check | Read-only health or status call | Expected response and no mutations | `[path]` |

## Scenario specification — TEST-001
- **Given:** [Exact preconditions, fixtures, feature flags, and permission state]
- **When:** [Concrete request, event, or action]
- **Then:** [Exact expected status, response body, persisted changes, and side effects]
- **Boundary / negative cases:** [Relevant invalid and edge values]
- **Isolation:** [Mocked dependencies, database fixtures, transaction boundaries]
- **Existing implementation:** [Actual test path, or `Not implemented / not verified`]

## FireTest safety
Never run data-mutating FireTests or call real third-party services in production without explicit authorization. Prefer read-only or isolated substitutes. FireTest means smoke/sanity checks against a running environment, not load testing.

## Uncertain behavior
This section is documented based on the details available in the source code.
**Needs confirmation:** [Specific unresolved expected behavior and missing evidence]
