# Trade-offs and Decisions

## What we chose and why

### No authentication
The doc doesn't mention user login or access control. Adding auth (JWT/Devise) would add complexity without satisfying a stated requirement. In production, this would be the first addition.

### No service layer for CRUD
Employee create/update/delete logic is 3-5 lines each. Extracting to services would be premature abstraction — the controller is already thin with `render_resource` and `set_employee`. The analytics service exists because it has real logic (SQL aggregations, dual-purpose methods).

### Currency stored per employee, not derived
Each employee record stores its own `currency` field. An alternative would be a `countries` table with a currency column. We chose the simpler approach because:
- No need for a join on every query
- The seeder assigns currency from `countries.json` based on country
- The doc doesn't mention managing countries as a separate entity

### `insert_all` for seeding (skips validations)
The doc says "performance of the script matters." `insert_all` is ~10x faster than `create!` loops because it generates a single INSERT statement per batch. The tradeoff is no model validations — acceptable because seed data is generated programmatically from known-good sources.

### Hard delete, not soft delete
The doc says "delete employees." We use `destroy` which permanently removes the record. In production, we'd add a `deleted_at` column with `paranoia` gem for audit trails.

### Single `average_by_job_title` endpoint instead of separate "top paying titles"
Originally we had a separate endpoint. We refactored to make `job_title` optional:
- With `job_title` param: returns single average (doc requirement 2b)
- Without `job_title` param: returns all titles ranked by average (doc requirement 2c)

This reduces API surface area and code duplication while serving both use cases.

### CORS allows all origins in development
Set to `*` by default for local development. In production, this should be restricted via the `CORS_ORIGINS` environment variable.

## Performance Considerations

### Query optimization
- `stats_by_country` fetches MIN, MAX, AVG, COUNT in one SQL query using `pick()` — verified with a test that asserts exactly 1 database query.
- `average_by_job_title` (all titles mode) uses `GROUP BY` with `ORDER BY` and `LIMIT` in SQL, not Ruby-side sorting.
- Database indexes on `country`, `job_title`, and the composite `[country, job_title]` cover all analytics query patterns.
- Bullet gem used during development to verify zero N+1 queries across all endpoints.

### Pagination
- Backend caps `per_page` at 100 to prevent memory issues.
- Frontend offers 10/25/50/100 page sizes.
- `render_resource` in ApplicationController handles pagination logic once, reused by all list endpoints.
- **Lazy evaluation** — Kaminari's `.page().per()` chains `LIMIT` and `OFFSET` onto the ActiveRecord::Relation. The full collection is never materialized. Controller passes a Relation (e.g., `Employee.order(:id)`) to `render_resource`, which adds pagination. Only when Rails serializes the response does SQL execute: one `SELECT ... LIMIT 25 OFFSET 0` for the records and one `COUNT(*)` for meta. At most 25 records are loaded, never all 10,000.

### Seeding performance
- 10,000 employees in batches of 1,000 using `insert_all` within a transaction.
- Names and job titles assigned via index-based modulo for deterministic distribution.
- Completes in under 10 seconds (verified by RSpec performance test).
