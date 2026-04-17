# Architecture Decisions

## System Diagrams

### High-Level Structure

```mermaid
flowchart LR
    User[HR Manager]

    subgraph Frontend[Next.js 15 Frontend]
        Pages[App Router pages<br/>employees · analytics]
        Hooks[hooks<br/>useEmployees · useEmployee<br/>useSalaryInsights]
        Services[services<br/>employeesApi · analyticsApi]
    end

    subgraph Backend[Rails 8 API]
        EmpCtrl[EmployeesController]
        AnCtrl[SalaryAnalyticsController]
        AppCtrl[ApplicationController<br/>render_resource · render_error<br/>pagination · error rescue]
        Model[Employee model<br/>validations + normalize_email]
        Svc[SalaryAnalyticsService<br/>pick + group aggregations]
    end

    Cache[(Rails.cache<br/>10 min TTL)]
    DB[(PostgreSQL<br/>employees<br/>indexes: country, job_title)]

    User --> Pages
    Pages --> Hooks
    Hooks --> Services
    Services -->|HTTP/JSON| EmpCtrl
    Services -->|HTTP/JSON| AnCtrl
    EmpCtrl --- AppCtrl
    AnCtrl --- AppCtrl
    EmpCtrl --> Model
    AnCtrl --> Svc
    AnCtrl <--> Cache
    Model --> DB
    Svc --> DB
```

### Salary Analytics Request Flow

```mermaid
sequenceDiagram
    participant FE as Frontend (analytics page)
    participant Ctrl as SalaryAnalyticsController
    participant Cache as Rails.cache
    participant Svc as SalaryAnalyticsService
    participant DB as PostgreSQL

    Note over FE,Ctrl: Step 1 — Validate request
    FE->>Ctrl: GET /api/v1/analytics/salary_stats?country=India
    Ctrl->>Ctrl: before_action require_param!(:country)

    Note over Ctrl,Cache: Step 2 — Cache lookup (10 min TTL)
    Ctrl->>Cache: fetch("salary_stats/India")

    alt cache hit
        Cache-->>Ctrl: cached payload
    else cache miss
        Note over Ctrl,DB: Step 3 — Compute aggregates
        Ctrl->>Svc: stats_by_country("India")
        Svc->>DB: SELECT MIN, MAX, AVG, COUNT (single query via pick)
        DB-->>Svc: aggregated row
        Svc-->>Ctrl: { min, max, average, count }
        Ctrl->>Cache: write payload
    end

    Ctrl-->>FE: render_resource(result)
```

### Employee Create Flow

```mermaid
sequenceDiagram
    participant FE as Frontend (EmployeeForm)
    participant Ctrl as EmployeesController
    participant App as ApplicationController
    participant Model as Employee
    participant DB as PostgreSQL

    FE->>Ctrl: POST /api/v1/employees
    Ctrl->>Ctrl: employee_params (strong params)
    Ctrl->>Model: Employee.new(params)
    Model->>Model: before_validation normalize_email
    Model->>Model: validate presence, uniqueness, format, salary > 0

    alt valid
        Model->>DB: INSERT
        DB-->>Model: ok
        Ctrl->>App: render_resource(employee, key: :employee, status: :created)
        App-->>FE: 201 { employee: {...} }
    else invalid
        Ctrl->>App: render_validation_errors(errors)
        App-->>FE: 422 { errors: [...] }
    end
```

### Employee Listing (paginated)

```mermaid
sequenceDiagram
    participant FE as Frontend (EmployeeTable)
    participant Ctrl as EmployeesController
    participant App as ApplicationController
    participant DB as PostgreSQL

    FE->>Ctrl: GET /api/v1/employees?page=2&per_page=25
    Ctrl->>App: render_resource(Employee.order(:id), key: :employees, paginate: true)
    App->>App: clamp_per_page (1..100)
    App->>DB: SELECT … LIMIT 25 OFFSET 25 (lazy via Kaminari)
    DB-->>App: 25 rows + total count
    App-->>FE: { employees: [...], meta: { total_count, total_pages, current_page, per_page } }
```

## Backend Architecture

### Why Rails API-only
- The doc requires a backend with a relational database. Rails provides convention-over-configuration which accelerates development while maintaining structure.
- API-only mode strips unnecessary middleware (sessions, cookies, views) keeping the stack lean.

### Why PostgreSQL
- Required salary aggregations (MIN, MAX, AVG, COUNT) are handled efficiently at the database level.
- `LOWER(email)` unique index ensures case-insensitive email uniqueness at the DB level, not just Rails validation.
- CHECK constraints (`salary > 0`) provide defense-in-depth beyond application-layer validation.

### Controller Design
- Controllers are thin — they handle request/response only.
- A shared `render_resource` helper in `ApplicationController` handles both single-record and paginated responses, reducing duplication across all CRUD actions.
- `before_action :set_employee` extracts record lookup for show/update/delete.
- `before_action :require_country` in the analytics controller centralizes param validation.

### Service Layer
- `SalaryAnalyticsService` encapsulates all salary aggregation logic with optimized SQL queries.
- `stats_by_country` uses `pick()` with raw SQL to fetch MIN, MAX, AVG, COUNT in a single query instead of 4 separate calls.
- `average_by_job_title` is dual-purpose: returns a single average when `job_title` is specified, or all titles ranked by average when omitted. This eliminates the need for a separate "top paying titles" endpoint.

### Seeding Strategy
- Seed logic lives in `db/seeders/employee_seeder.rb`, not in `app/services/` — it's a data loading concern, not business logic.
- Country and job title data stored as JSON files in `db/data/` for easy modification without code changes.
- Names assigned via index-based modulo (`i % size`) instead of random sampling for deterministic, reproducible data.
- Country and job title use different modulo bases to avoid alignment (every country gets all 10 job titles).
- `insert_all` in batches of 1,000 within a transaction for performance.
- Production guard prevents accidental execution in production.

## Frontend Architecture

### Why Next.js 15 + Ant Design
- Next.js provides App Router with file-based routing — maps cleanly to the two main pages (employees, analytics).
- Ant Design provides production-ready components (Table with pagination, Form with validation, Modal, Select, Statistic cards) out of the box.
- Recharts for salary visualizations — lightweight and composable.

### Project Structure
```
src/
├── types/          Shared TypeScript interfaces
├── lib/            API client (Axios wrapper)
├── hooks/          Data fetching hooks (useEmployees)
├── components/     Reusable UI components (AppShell, EmployeeTable, EmployeeForm)
└── app/            Pages (employees, employees/[id], analytics)
```

### Key Decisions
- Types extracted into `src/types/` — single source of truth for Employee, PaginationMeta, SalaryStats, etc.
- `useEmployees` hook encapsulates fetch logic with page + perPage support.
- `EmployeeTable` is a presentational component — receives data and callbacks, no internal state.
- `EmployeeForm` auto-maps country to currency using a shared `COUNTRY_CURRENCY` constant.
- Fixed sidebar with sticky page headers — only content area scrolls.
- Per-page size changer (10/25/50/100) wired end-to-end from UI to API.

## Database Design

```
employees
├── full_name        (string, NOT NULL)
├── email            (string, NOT NULL, LOWER unique index)
├── job_title        (string, NOT NULL, indexed)
├── country          (string, NOT NULL, indexed)
├── salary           (decimal 10,2, NOT NULL, CHECK > 0)
├── currency         (string, default "USD")
├── employment_status (string, NOT NULL, default "active", indexed)
├── date_of_joining  (date)

Indexes: country, job_title, [country + job_title], employment_status
```

### Why these indexes
- `country` — every analytics query filters by country.
- `job_title` — average salary by job title query.
- `[country, job_title]` — composite index covers the most common analytics pattern.
- `employment_status` — HR managers frequently filter by status.

## API Design

Three endpoint groups with consistent patterns:
- **Employees CRUD** — standard REST. Payload keyed by resource name (`employee` / `employees`) inside the envelope.
- **Analytics** — read-only endpoints returning aggregated data. `salary_by_job_title` serves dual purpose (single title or all titles) based on params.
- **Error handling** — centralized in `ApplicationController` with `StandardError → 500`, `RecordNotFound → 404`, `ParameterMissing → 400`.

### Response envelope

Every response follows the same shape so the frontend can parse uniformly.

Success (single / analytics):
```json
{ "success": true, "data": { "employee": { ... } } }
```

Success (paginated):
```json
{
  "success": true,
  "data": { "employees": [ ... ] },
  "meta": { "total_count": 128, "total_pages": 6, "current_page": 1, "per_page": 25 }
}
```

Validation errors (array):
```json
{ "success": false, "errors": ["Email has already been taken", "Salary must be greater than 0"] }
```

Single error (param missing, not found, server error):
```json
{ "success": false, "error": "country param is required" }
```

The frontend `lib/api.ts` installs an axios response interceptor that unwraps `{ success, data, meta }` so downstream services and hooks see the inner payload directly (plus a lifted `meta` for paginated responses).
