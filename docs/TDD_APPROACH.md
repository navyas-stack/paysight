# TDD Approach

## Development Cycle

Every feature follows strict **test → feat → refactor** cycle:

1. **test** — Write failing specs covering happy path and edge cases. Commit.
2. **feat** — Write minimum code to pass all tests. Commit.
3. **refactor** — Clean up duplication, extract helpers, improve structure. Commit. Only if genuinely needed.

## Commit Evolution

The commit history is designed to be read sequentially. Each commit builds on the previous one, showing how the system evolved.

### Backend (action-by-action)

```
Employee Creation:
  test → feat

Employee Listing:
  test → feat

Employee Show:
  test → feat

Employee Update:
  test → feat
  refactor: extract set_employee callback (duplication emerged after show + update)

Employee Delete:
  test → feat (uses set_employee from the start — refactor already paid off)

  refactor: extract render_resource helper (duplication across all CRUD actions)

Salary Stats:
  test → feat

Average by Job Title:
  test → feat

Salary Summary by Country:
  test → feat

Seed Script:
  test → feat

  refactor: add database indexes and extract param validation callback
```

### Frontend (feature-by-feature)

```
chore: scaffold Next.js project
feat: API client and app shell
feat: employee listing page
feat: create/edit modal
feat: delete with confirmation
feat: salary insights dashboard
refactor: extract types, hooks, and table component
feat: employee detail view page
chore: env example and README
```

## Testing Strategy

### What we test
- **Model specs** — validations, email normalization callback, format rules
- **Request specs** — full HTTP cycle for every endpoint (happy path, validation errors, 404s, missing params)
- **Service specs** — analytics logic with edge cases (single employee, empty country, decimal precision, single-query assertion)
- **Seeder specs** — correctness (count, name sources, currency mapping), idempotency, performance (<10s)

### What we don't test
- Controllers in isolation (request specs cover the full stack)
- Frontend components (would require Jest + Testing Library — deferred for scope)
- Authentication (not implemented)

### Test characteristics
- **Fast** — 49 specs in ~2 seconds (excluding slow seeder test)
- **Deterministic** — no random data in assertions, factory-generated test data
- **Independent** — each test creates its own data, no shared state between tests
