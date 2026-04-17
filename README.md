# PaySight — Salary Management Tool

A minimal yet usable salary management system for an organization with 10,000 employees, built for HR Managers.

## Monorepo Structure

```
paysight/
├── paysight-backend/    Ruby 3.3 + Rails 8.0 API with PostgreSQL
├── paysight-frontend/   Next.js 15 + React 19 + Ant Design + Recharts
└── docs/                Architecture decisions and planning artifacts
```

## Quick Start

### Backend
```bash
cd paysight-backend
cp .env.example .env
bundle install
rails db:create db:migrate db:seed
rails server                    # http://localhost:3000
```

### Frontend
```bash
cd paysight-frontend
cp .env.example .env.local
npm install
npm run dev                     # http://localhost:3001
```

### Tests
```bash
cd paysight-backend
bundle exec rspec               # 55 specs, all passing
```

## Features

### Employee Management
- Add, view, update, delete employees via UI
- Paginated employee listing with configurable page size
- Employee detail view page

### Salary Insights
- Min, max, average salary by country
- Average salary by job title in a country (with/without filter)
- Salary summary across all countries with local currency
- Interactive bar chart for salary comparison

### Seeding
- 10,000 employees generated from first_names.txt and last_names.txt
- Country-specific currency assignment
- Bulk insert in batches of 1,000 within a transaction
- Completes in under 10 seconds
