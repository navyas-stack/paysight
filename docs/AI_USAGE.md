# AI Tools Usage

## Tool Used
Claude Code (Anthropic CLI) — used as a pair programming assistant throughout the project.

## How AI Was Used

### Code Generation
- Initial project scaffolding and configuration
- Model, controller, and service boilerplate
- RSpec test structure and assertions
- Frontend components (Ant Design table, forms, charts)
- Seeder logic with batch insert optimization

### Architecture Decisions
- AI suggested service layer separation for analytics (accepted — real business logic)
- AI suggested service layer for CRUD (rejected — too thin, kept in controller)
- AI suggested model scopes for filtering (rejected — not in requirements, used inline queries)
- Dual-purpose `average_by_job_title` endpoint was an AI suggestion to reduce API surface area (accepted)

### Code Review & Bug Detection
- AI identified N+1 query risk in analytics — verified with Bullet gem (zero warnings)
- AI caught inconsistent salary types (BigDecimal vs Float) in API responses — fixed to return numbers consistently
- AI detected seeder data distribution bug where modulo alignment caused one job title per country — fixed with offset-based assignment
- AI identified CORS misconfiguration (`credentials: true` without `withCredentials` on client) — fixed

### Testing
- AI generated comprehensive test scenarios including edge cases (empty country, nil values, duplicate emails, SQL wildcard injection)
- Performance test for seeder (<10 seconds) was AI-suggested
- Single-query assertion test for analytics was AI-suggested

## What AI Did NOT Do
- All architectural decisions were reviewed and approved by the developer
- Commit structure and TDD discipline were developer-directed
- Requirements interpretation and scope decisions were developer-driven
- Every AI suggestion was tested before acceptance — several were rejected (service layer for CRUD, model scopes, department field)

## Approach
The AI was used as an accelerator, not a replacement. Every generated piece of code was reviewed, tested, and often modified before committing. The developer maintained control over architecture, scope, and quality decisions throughout.
