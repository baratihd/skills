# Pytest class-based testing contract

- Framework: pytest, pytest-django, pytest-cov. Detect existing versions/configuration, add dependencies without disruptive upgrades.
- Every test case is a method of a `Test*` class; function-based `@pytest.fixture` and pure helpers are allowed. Organize test modules by app/layer, e.g. `tests/unit`, `tests/integration`, `tests/api`, `tests/e2e`, `tests/fire` as compatible with repository layout.
- Fixture layering: basic values/settings -> DB reference rows (only when needed) -> factories/models -> domain aggregates -> authenticated clients/service doubles -> scenario fixtures. Use minimal fixture autouse usage; prioritize visibility, deterministic names/data, and function scope for mutable DB rows.
- For test DB, *do not load development/demo seed*. A test that needs Contract, User, Insured or Policy obtains it in an explicitly named fixture. Prefer local factory libraries if installed, otherwise small maintainable factories; no new library unless necessary.
- Docstrings in English for classes, methods and fixtures: **Scenario**, **Given**, **When**, **Then**, and any known constraints. Tests assert stable public behavior, DB effects and errors, not implementation details.
- Database access requires `django_db` marking, with transactions when relevant. For API tests, cover access control; for integration tests, verify real DB behavior; for Celery, model commit/retry semantics; for FireTest, implement safe smoke/sanity checks only against explicitly selected environments and with no destructive operations.
- For external integrations, isolate HTTP, Elasticsearch and other I/O using explicitly configured test doubles; no network calls or test secrets.

Example (illustrative only; adapt names and models to actual project):

```python
import pytest


@pytest.fixture
def contract_factory(db):
    """Provide a callable that creates explicit, isolated contract records."""
    def create(**overrides):
        # Use the project's verified model factory; never rely on a demo seed.
        return verified_contract_factory(**overrides)
    return create


@pytest.mark.django_db
class TestContractValidation:
    """Verify contract validation boundaries and stable error behavior."""

    def test_rejects_invalid_date_range(self, contract_factory):
        """Scenario: invalid date range.

        Given a new contract whose end date precedes its start date,
        When validation executes,
        Then the documented validation error is returned and no record persists.
        """
        # Insert real implementation after verifying model/service contracts.
        ...
```

Never copy illustrative pseudocode as executable tests without completing and verifying it.
