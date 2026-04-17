# PaySight Frontend

Salary management UI for HR managers. Built with Next.js 15, Ant Design, and Recharts.

## Setup

```bash
cp .env.example .env.local
npm install
```

## Running

```bash
npm run dev    # starts on http://localhost:3001
```

Backend must be running on `http://localhost:3000`.

## Pages

- `/employees` — Employee table with pagination, add/edit/delete
- `/employees/:id` — Employee detail view
- `/analytics` — Salary insights dashboard

## Tech Stack

- Next.js 15.5 (App Router)
- React 19
- TypeScript
- Ant Design 5
- Recharts
- Axios
