# Codex Mission — Deploy Crawlee + Playwright Scraper for Kyqra

You have full autonomy to prepare, install, configure, secure, test, and deploy a production-grade crawling/scraping platform for **kyqra.com**.

## Environment

**Middleware / Odoo / vSwitch server**

- Domain: `kyqra.com`
- IP: `65.109.65.169`
- Existing services:
  - Middleware
  - Odoo
  - vSwitch / existing internal networking
  - Business logic and downstream processing

**Dedicated scraper/crawler server**

- IP: `37.27.128.39`
- This is the server where Crawlee, Playwright, crawler workers, queues, storage, monitoring, crawler APIs, dashboard, and reverse proxy must run.

Do not move Odoo, middleware, or unrelated production services from `65.109.65.169`.

The crawler must be deployed primarily on `37.27.128.39`.

## Primary Objective

Build and deploy an autonomous, scalable, **Dockerized** web crawling and scraping platform using:

- Crawlee
- Playwright
- Node.js / TypeScript
- Redis
- PostgreSQL where appropriate
- Docker
- Docker Compose
- Nginx or Traefik
- HTTPS
- authenticated REST API
- background worker queues
- monitoring
- persistent storage
- structured logging

The crawler must integrate with the middleware at `65.109.65.169`.

The crawler must receive crawl jobs from middleware, process them, extract and normalize structured data, and securely send results back to middleware.

## Required Architecture

Odoo / n8n / applications
→ middleware on `65.109.65.169`
→ authenticated crawler API
→ scraper server `37.27.128.39`
→ Redis-backed queue
→ Crawlee workers
→ HTTP crawler and/or Playwright browser workers
→ extraction / normalization
→ duplicate detection
→ result storage
→ signed webhook/API callback
→ middleware
→ Odoo / n8n

The scraper must never directly modify Odoo databases.

## Domain and DNS

Prepare the crawler for:

- `crawler.kyqra.com`
- optionally `scraper.kyqra.com`
- optionally `crawl-api.kyqra.com`

Preferred endpoint: `https://crawler.kyqra.com`

Expected DNS target:

`crawler.kyqra.com → 37.27.128.39`

Do not assume DNS exists. Verify before certificate issuance. If DNS cannot be changed automatically, report the exact record required.

## Docker Requirements

Dockerize the deployment. Do not install application components directly on the host unless a host-level dependency is required.

Use separate containers/services where practical for:

- crawler API
- HTTP crawler workers
- Playwright workers
- Redis
- PostgreSQL if used
- dashboard
- reverse proxy

Use:

- restart policies
- health checks
- persistent named volumes
- CPU and RAM limits
- isolated Docker networks
- non-root containers where practical
- `.env` for runtime configuration

Never commit `.env` or credentials.

## Required Crawler Modes

Implement:

1. Single URL crawl
2. Domain crawl
3. URL list crawl
4. Discovery mode using explicitly supplied/approved seed URLs

Support maximum pages, maximum depth, include/exclude patterns, same-domain limits, timeouts, retries, deduplication, and configurable extraction schemas.

Do not implement uncontrolled internet-wide crawling.

## Extraction

Build reusable extraction for public business information such as:

- business name
- website
- description
- public phone number
- public business email
- address
- city
- region/state
- postal code
- country
- social links
- contact/about URLs
- category
- industry
- page title
- metadata
- schema.org structured data
- source URL
- crawl timestamp

Normalize phone numbers, emails, URLs, whitespace, casing, country names, and addresses where practical.

Keep source provenance for extracted data.

## API

Build an authenticated API with endpoints such as:

- `POST /api/v1/jobs`
- `GET /api/v1/jobs/:id`
- `GET /api/v1/jobs/:id/results`
- `POST /api/v1/jobs/:id/cancel`
- `GET /api/v1/health`
- `GET /api/v1/stats`
- `POST /api/v1/webhooks/test`

Use API keys or signed JWTs. Never leave job submission publicly unauthenticated.

## Middleware Integration

Integrate securely with middleware on `65.109.65.169`.

Use authenticated and signed callbacks with:

- API key or token authentication
- HMAC signature
- timestamp
- replay protection
- job ID

Support job creation, progress updates, completion, partial results, failure notifications, and bounded callback retries.

Prefer an allowlist of approved callback destinations.

## Resource Management

The scraper server is `37.27.128.39`.

Start conservatively:

- HTTP workers: 10–20 concurrent requests
- Playwright browser/page workers: 3–5 concurrent workers

Benchmark before increasing concurrency.

Use Docker limits so Playwright cannot consume all RAM or CPU. Maintain at least 20–25% RAM headroom under normal operation.

## Crawling Conduct

Implement per-domain rate limiting, bounded retries, delays, and exponential backoff.

Respect site stability and default to conservative crawling.

Support robots.txt awareness.

Do not intentionally bypass CAPTCHAs, paywalls, login restrictions, authentication boundaries, anti-abuse controls, or other technical access controls.

Do not implement stealth features intended to defeat site protections.

Use the platform for authorized or publicly accessible data collection.

## Browser Handling

Use Playwright Chromium as the primary browser engine.

Use browser contexts instead of launching a new browser process unnecessarily. Recycle workers safely and restart unhealthy browser workers automatically.

Prefer lightweight HTTP crawling whenever JavaScript rendering is not required.

## Security

Harden `37.27.128.39`.

Configure:

- SSH key authentication where practical
- firewall
- Fail2ban
- unattended security updates
- HTTPS
- API authentication
- secret management
- restricted Redis access
- restricted PostgreSQL access

Never expose Redis, PostgreSQL, Docker socket, or Playwright debugging ports publicly.

If practical, restrict sensitive crawler endpoints to `65.109.65.169` or the private/vSwitch network.

Do not break existing private networking.

## Dashboard

Build a protected web dashboard that can:

- submit one URL or URL lists
- choose crawl mode
- choose extraction fields
- set page/depth limits
- start/cancel jobs
- view progress
- see processed/failed URLs
- preview results
- download CSV
- download JSON
- resend results to middleware

Dashboard authentication is mandatory.

## Storage and Retention

Persist important job state, queue state, results, configuration, and logs.

Do not permanently retain raw page bodies unless required.

Use retention policies for raw HTML, browser artifacts, completed results, and logs so disk usage remains bounded.

## Health and Reliability

Provide health checks for:

- API
- Redis
- PostgreSQL if used
- worker queues
- Playwright
- CPU
- RAM
- disk

Use automatic restart policies and make the stack survive server reboot.

Configure structured logging and log rotation.

## Backups

Back up configuration, custom code, databases, and important crawler state. Document restore steps.

## Directory Structure

Keep production deployment organized under:

`/opt/kyqra-crawler/`

Suggested layout:

```text
/opt/kyqra-crawler/
├── app/
├── workers/
├── dashboard/
├── config/
├── docker/
├── scripts/
├── backups/
├── logs/
├── docs/
├── .env
├── docker-compose.yml
├── README.md
└── DEPLOYMENT_REPORT.md
```

## Testing

Do not declare success because containers merely started.

Test:

1. API authentication
2. job creation
3. queue processing
4. HTTP crawling
5. Playwright crawling
6. link discovery
7. max depth/pages
8. duplicate detection
9. extraction
10. CSV/JSON outputs
11. middleware callback
12. callback retries
13. browser crash recovery
14. worker restart
15. host reboot recovery
16. HTTPS
17. firewall
18. unauthorized API rejection
19. Redis isolation
20. database isolation
21. concurrency limits
22. retention controls
23. health monitoring

Do not claim middleware integration works unless an actual authenticated test succeeds.

## Performance Test

Run a controlled benchmark against safe public test/example pages and record:

- total crawl time
- CPU use
- RAM use
- average page time
- failure rate
- HTTP worker utilization
- Playwright utilization

Choose safe production defaults from measured results. Reliability is more important than maximum concurrency.

## Documentation

Create `/opt/kyqra-crawler/README.md` and `/opt/kyqra-crawler/DEPLOYMENT_REPORT.md`.

Document architecture, installation, containers, API, authentication, dashboard, crawler modes, extraction schemas, middleware callbacks, queues, worker settings, DNS, TLS, firewall, backups, restore, monitoring, troubleshooting, and upgrade procedures.

The deployment report must include:

- server used: `37.27.128.39`
- versions installed
- running services
- public and private endpoints
- required DNS records
- firewall configuration
- authentication mechanism
- middleware connectivity status
- worker counts and resource limits
- benchmark results
- tests performed
- issues encountered/fixes
- remaining manual actions

## Working Rules

You have full autonomy over crawler server `37.27.128.39`.

Proceed continuously until deployment is complete.

Do not stop after every command for approval. Diagnose and repair routine installation/configuration errors yourself, build containers, restart services, run tests, fix failures, and retest.

You may communicate with `65.109.65.169` only as needed for middleware integration.

Do not make broad or destructive changes to `65.109.65.169`.

Before any destructive action involving existing configuration or data, create a backup.

Do not wipe disks, overwrite unrelated applications, invent credentials, expose secrets, weaken authentication, or bypass third-party security controls.

## Definition of Done

Mission is complete when:

- Crawlee is installed and containerized
- Playwright/Chromium works in containers
- crawler API is operational
- queue/workers are operational
- dashboard is operational
- HTTPS is operational when DNS permits
- middleware connectivity is established or precisely documented if credentials/DNS are missing
- results can be returned securely to middleware
- resource limits are configured
- services survive reboot
- monitoring works
- backups are configured
- logs rotate
- security controls are active
- documentation and deployment report are complete

At completion, provide one concise report containing:

1. production URL
2. dashboard URL
3. API URL
4. running services
5. DNS status
6. middleware connectivity status
7. crawler worker limits
8. tests passed
9. anything still requiring my action

Proceed now and continue autonomously until the mission is complete.

Only interrupt if you require a credential that does not exist on the server, DNS changes you cannot perform, middleware authentication information, or a truly destructive operation affecting unrelated production data.
