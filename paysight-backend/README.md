# PaySight Backend

Salary management API for HR managers. Built with Ruby 3.3 + Rails 8.0 (API-only) + PostgreSQL.

## Prerequisites

- Ruby 3.3.0
- PostgreSQL 14+
- Bundler

## Setup

```bash
cp .env.example .env
bundle install
rails db:create db:migrate
rails db:seed              # seeds 10,000 employees
```

## Running

```bash
rails server               # starts on http://localhost:3000
```

## Tests

```bash
bundle exec rspec                                          # full suite (includes slow seeder test)
bundle exec rspec --exclude-pattern "**/employee_seeder*"  # fast tests (~2s)
bundle exec rspec spec/models/                             # model specs
bundle exec rspec spec/requests/                           # API specs
bundle exec rspec spec/services/                           # service specs
```

## API Endpoints

### Employees

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/employees` | List employees (paginated) |
| GET | `/api/v1/employees/:id` | Show employee |
| POST | `/api/v1/employees` | Create employee |
| PATCH | `/api/v1/employees/:id` | Update employee |
| DELETE | `/api/v1/employees/:id` | Delete employee |

### Analytics

| Method | Path | Params |
|--------|------|--------|
| GET | `/api/v1/analytics/salary_stats` | `country` (required) |
| GET | `/api/v1/analytics/salary_by_job_title` | `country`, `job_title` (required) |
| GET | `/api/v1/analytics/top_paying_titles` | `country` (required), `limit` (optional) |
| GET | `/api/v1/analytics/country_overview` | — |

## Architecture

```
app/
├── controllers/api/v1/
│   ├── employees_controller.rb
│   └── analytics/salary_controller.rb
├── models/
│   └── employee.rb
└── services/
    ├── salary_analytics_service.rb
    └── employee_seeder_service.rb
```

- Controllers handle request/response only
- Business logic lives in services
- Analytics use optimized single-query SQL aggregations
