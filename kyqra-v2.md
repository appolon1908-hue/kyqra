# Kyqra Crawler V2 — Autonomous Codex Mission

You have full autonomy to continue development of the `appolon1908-hue/kyqra` repository and turn it into a production-grade, Dockerized crawling and scraping platform for **kyqra.com**.

## Environment

- Crawler/scraper server: `37.27.128.39`
- Middleware/Odoo server: `65.109.65.169`
- Primary domain: `kyqra.com`
- Preferred crawler endpoint: `crawler.kyqra.com`
- Repository: `appolon1908-hue/kyqra`

Do not move or rewrite unrelated services on the middleware/Odoo server.
Do not write directly into the Odoo database. All business writes must go through the middleware or approved Odoo APIs.

## Primary objective

Build, test, harden, deploy, and document one of the strongest practical self-hosted Crawlee + Playwright crawler platforms possible on the current infrastructure.

The system must be fully Dockerized and production-oriented, with secure APIs, dashboard, durable queues, horizontal scaling capability, monitoring, retries, normalization, deduplication, middleware integration, and complete operational documentation.

Proceed continuously until the system is production-ready. Do not stop after every command to ask permission.

---

# Track 1 — Adaptive crawling engine

Implement a hybrid crawler architecture that chooses the lightest appropriate crawling method automatically.

Use:

- Crawlee HTTP-based crawling for ordinary HTML pages
- Cheerio or equivalent HTML parsing where appropriate
- Playwright only when JavaScript rendering, interaction, scrolling, dynamic loading, or browser behavior is required
- Chromium as the default Playwright browser

Implement automatic escalation logic such as:

1. attempt lightweight HTTP crawl
2. inspect response/content
3. if required content is absent or page is app-rendered, escalate to Playwright
4. record which engine was used

Do not launch Playwright for every request by default.

Use Crawlee autoscaling or equivalent resource-aware concurrency controls.

Support:

- per-domain concurrency
- global concurrency
- requests per second
- delay between requests
- timeouts
- bounded retries
- exponential backoff
- memory-pressure reduction
- CPU-pressure reduction

Maintain safe server headroom and never allow browser workers to consume all RAM.

---

# Track 2 — Durable job and queue orchestration

Build a production job system.

Every crawl must be a durable job with:

- UUID job ID
- tenant/customer ID where applicable
- creator
- creation time
- priority
- seed URLs
- mode
- max depth
- max pages
- status
- progress
- processed count
- success count
- failed count
- retry count
- start time
- end time
- cancellation support
- pause/resume support where practical
- dead-letter state
- callback status

Use Redis-backed queues or another durable queue appropriate for the architecture.

Separate services/processes for:

- API intake
- scheduler
- lightweight HTTP workers
- Playwright workers
- extraction workers
- normalization/dedup workers
- callback/webhook workers

Jobs should survive container restarts and server reboots where practical.

Do not run all responsibilities in a single Node process.

---

# Track 3 — Site-aware adapters and extraction framework

Build a reusable extraction framework rather than hard-coded selectors.

Create:

- generic extractor
- reusable field extractors
- schema.org/JSON-LD extractor
- metadata extractor
- contact-page detector
- about-page detector
- social-link detector
- business-information extractor
- optional domain-specific adapters

Target fields include:

- business name
- legal/business name if publicly available
- description
- website
- domain
- public phone
- public business email
- address
- city
- state/region
- postal code
- country
- industry/category
- social profiles
- contact URL
- about URL
- title
- meta description
- schema.org data
- source URL
- crawl timestamp

Adapters must be versioned and testable.

A change to one adapter must not break generic crawling.

---

# Track 4 — Data quality and normalization engine

Build a normalization and validation service for extracted data.

Normalize:

- phone numbers
- emails
- URLs
- domains
- whitespace
- Unicode text
- country names/codes
- states/regions
- business names
- social URLs
- addresses where practical

Validate obvious malformed values.

Store source provenance for extracted fields where practical.

Add confidence scores to extracted values based on factors such as:

- structured data source
- contact/about page source
- repeated agreement across pages
- page context
- validation quality

Do not silently replace conflicting data.

Preserve conflicting candidates and source information when useful.

---

# Track 5 — Advanced deduplication and entity resolution

Implement robust duplicate detection for both URLs and business entities.

URL deduplication must use normalized URLs and canonical forms where appropriate.

Business/entity deduplication should consider:

- normalized domain
- public phone
- public email
- exact business name
- normalized business name
- name + city
- name + address
- social URLs
- fuzzy matching where appropriate

Create a canonical record model.

Do not repeatedly send the same business into middleware/Odoo without a configured recrawl/update policy.

Support recrawl policies such as:

- never
- 24 hours
- 7 days
- 30 days
- configurable custom interval

---

# Track 6 — Performance intelligence and autoscaling

Build performance visibility into the platform.

Track at minimum:

- jobs queued
- jobs active
- jobs completed
- jobs failed
- requests per minute
- pages per minute
- success rate
- failure rate
- average response latency
- average extraction latency
- HTTP worker utilization
- Playwright worker utilization
- browser crashes
- queue depth
- CPU
- RAM
- disk
- Redis health
- PostgreSQL health if used
- network errors
- HTTP status distribution
- extraction yield
- records produced per domain

Use Prometheus-compatible metrics where practical.

Add Grafana dashboards or equivalent operational dashboards.

Set conservative default worker limits based on benchmarking on `37.27.128.39`.

Do not optimize for the largest possible concurrency number. Optimize for sustained reliability and useful records per hour.

---

# Track 7 — Fault tolerance and recovery

The crawler must handle failures without collapsing the whole system.

Handle:

- DNS errors
- connection resets
- SSL/TLS errors
- timeouts
- HTTP 429
- HTTP 403
- HTTP 404
- HTTP 5xx
- malformed HTML
- redirect loops
- browser crashes
- Chromium process death
- extraction exceptions
- Redis reconnects
- PostgreSQL reconnects
- callback failures
- container restart
- server reboot

Use bounded retries and exponential backoff.

Never retry forever.

Move repeatedly failing work into an inspectable dead-letter/error state.

Implement idempotency so restarted workers do not create duplicate downstream records.

---

# Track 8 — Production operations dashboard and authentication

Build a polished protected web dashboard.

Implement secure authentication with:

- login
- logout
- password reset flow
- secure session management
- CSRF protection where applicable
- rate-limited login attempts
- password hashing using a modern algorithm
- admin bootstrap process that does not commit credentials
- role-based access control

Roles should include at least:

- super admin
- admin/operator
- client/customer
- read-only/auditor where useful

Admin dashboard should provide:

- active jobs
- queued jobs
- failed jobs
- completed jobs
- worker health
- CPU/RAM/disk
- queue depth
- browser worker health
- domain error trends
- extraction yield
- retry/dead-letter jobs
- API usage
- callback failures
- audit trail
- user management
- client management
- tenant limits

Client dashboard should provide, scoped only to that tenant:

- create crawl job
- paste one URL
- paste multiple URLs
- upload a URL list where appropriate
- select crawl mode
- max pages
- max depth
- extraction fields
- job progress
- job history
- result preview
- CSV export
- JSON export
- cancel job
- retry failed job where authorized
- webhook configuration
- API key management
- usage statistics

Implement strict tenant isolation.

One client must never see another client's jobs, API keys, results, webhooks, or usage.

---

# Track 9 — Secure middleware integration

Integrate with middleware on `65.109.65.169`.

Use secure authenticated HTTPS communication or private/vSwitch networking if already available and safe.

Implement signed webhooks with:

- HMAC signature
- timestamp
- request ID
- job ID
- idempotency key
- replay protection
- bounded retries

Middleware callbacks should support:

- job accepted
- job started
- progress update
- partial results where configured
- job completed
- job failed

Allowlist approved callback domains/IPs rather than accepting arbitrary callback destinations by default.

Never send secrets in query strings.

Never write directly into Odoo's database.

Document the complete middleware API contract and example payloads.

---

# Track 10 — Testing laboratory and quality gates

Create a serious automated test suite.

Build test fixtures and safe test targets covering:

- static HTML
- JavaScript-rendered page
- pagination
- redirects
- duplicate links
- duplicate business records
- structured JSON-LD
- missing fields
- malformed HTML
- slow responses
- HTTP 404
- HTTP 429
- HTTP 500
- timeout
- browser crash
- worker restart
- Redis restart
- API authentication failure
- tenant isolation
- webhook signing
- webhook replay rejection
- callback retry
- CSV export
- JSON export
- login/logout
- password reset flow
- admin permissions
- client permissions
- unauthorized cross-tenant access rejection

Add unit tests, integration tests, and end-to-end tests where appropriate.

Do not declare a feature complete if its critical tests are failing.

Create a CI-friendly test command.

---

# Horizontal scaling architecture

Design the platform so `37.27.128.39` can be the first node, not the only possible node.

Future worker nodes must be addable without redesigning the system.

Design for:

- central queue
- stateless API instances where practical
- multiple HTTP worker nodes
- multiple Playwright worker nodes
- centralized job state
- centralized results/database
- node health registration
- worker labels/capabilities
- graceful worker draining

Document how to add:

- worker-02
- worker-03
- additional API nodes

Do not require horizontal scaling to be active immediately, but make the architecture ready for it.

---

# Docker requirements

Everything practical must be Dockerized.

Use Docker Compose for the initial deployment.

Expected services may include:

- api
- scheduler
- http-worker
- playwright-worker
- extraction-worker
- callback-worker
- dashboard/frontend
- Redis
- PostgreSQL
- Nginx or Traefik
- Prometheus
- Grafana

Use:

- health checks
- restart policies
- persistent volumes
- isolated Docker networks
- resource limits
- log rotation
- non-root containers where practical
- pinned or controlled image versions

Do not expose:

- Redis
- PostgreSQL
- Docker socket
- browser debugging ports

publicly.

---

# API design

Build a versioned API under `/api/v1` or `/v1`.

Required endpoints should include equivalents of:

- `POST /api/v1/jobs`
- `GET /api/v1/jobs/:id`
- `GET /api/v1/jobs/:id/results`
- `POST /api/v1/jobs/:id/cancel`
- `POST /api/v1/jobs/:id/retry`
- `GET /api/v1/jobs`
- `GET /api/v1/health`
- `GET /api/v1/stats`
- `POST /api/v1/webhooks/test`

Use API keys and/or JWT/session authentication appropriate to endpoint type.

Implement:

- API versioning
- request validation
- rate limits
- idempotency keys
- standardized errors
- request IDs
- audit logging

Do not leave job submission unauthenticated.

---

# Crawler modes

Support at minimum:

## Single URL mode

Crawl and extract one target URL.

## Domain mode

Start from one domain and follow allowed internal links with configurable depth/page limits.

## URL list mode

Accept many approved seed URLs.

## Discovery mode

Start from approved seed URLs and discover related pages under configured rules.

Do not implement uncontrolled internet-wide crawling.

Do not intentionally bypass CAPTCHAs, login restrictions, paywalls, anti-abuse mechanisms, or other technical access controls.

Respect site stability and implement robots.txt awareness.

---

# Security hardening

Harden the production deployment on `37.27.128.39`.

Configure/document:

- SSH key authentication
- least-privilege users
- firewall
- Fail2ban
- unattended security updates
- TLS
- secret management
- internal-only Redis/PostgreSQL
- secure cookies
- secure headers
- rate limiting
- audit logs
- API key rotation
- admin role controls

Never commit `.env`, passwords, tokens, API keys, cookies, proxy credentials, or middleware secrets.

If DNS is not configured, document the exact DNS records required and continue all work that does not depend on DNS.

Preferred DNS:

`crawler.kyqra.com -> 37.27.128.39`

Use Let's Encrypt when DNS is ready.

---

# Storage and retention

Persist:

- user accounts
- tenants
- jobs
- job states
- extracted normalized records
- audit logs
- callback attempts
- API key metadata
- queue state where appropriate

Avoid uncontrolled storage growth.

Implement configurable retention for:

- raw HTML
- screenshots
- browser traces
- temporary artifacts
- completed jobs
- logs

Default to deleting unnecessary browser artifacts automatically.

---

# Proxy architecture

Add optional proxy configuration for legitimate operational needs.

Do not require proxies for normal deployment.

Support configurable proxy pools via secrets/environment configuration.

Never hard-code credentials.

Do not implement stealth or evasion functionality intended to defeat third-party access controls.

---

# Observability

Implement structured logs with at least:

- timestamp
- level
- service
- node
- job ID
- request ID
- URL/domain where appropriate
- worker type
- duration
- result count
- retry number
- status/error category

Never log authentication headers, passwords, tokens, private cookies, or secret values.

Create health endpoints and readiness checks.

---

# Backups and disaster recovery

Create automated or documented backup procedures for:

- PostgreSQL
- application configuration
- important queue/job state
- dashboard/user configuration

Do not back up disposable browser caches.

Create restore scripts and test the restore procedure where practical.

Document how to rebuild the service on a clean server from:

1. GitHub repository
2. `.env`/secrets
3. database backup
4. Docker volumes where required

---

# Deployment automation

Create operational scripts under `/scripts` such as:

- `install.sh`
- `deploy.sh`
- `update.sh`
- `start.sh`
- `stop.sh`
- `restart.sh`
- `health.sh`
- `logs.sh`
- `backup.sh`
- `restore.sh`
- `benchmark.sh`
- `smoke-test.sh`

Make scripts safe to rerun where practical.

---

# Benchmarking

Run controlled performance tests.

Test at minimum:

- 100 lightweight/static pages
- mixed static + JavaScript pages
- concurrent jobs
- worker restart during crawl

Measure:

- pages/minute
- records/minute
- CPU
- RAM
- queue latency
- average page latency
- success rate
- browser worker utilization
- HTTP worker utilization

Use the results to choose production concurrency defaults.

Do not choose unsafe concurrency just to maximize benchmark numbers.

---

# Documentation

Update `README.md` and create documentation covering:

- architecture
- Docker services
- installation
- deployment
- DNS
- TLS
- authentication
- user roles
- client dashboard
- admin dashboard
- API
- crawler modes
- extraction schemas
- queue architecture
- middleware integration
- webhook signing
- normalization
- deduplication
- horizontal scaling
- monitoring
- backups
- restore
- troubleshooting
- upgrades

Create/update:

`DEPLOYMENT_REPORT.md`

Include:

- production server
- running containers
- versions
- exposed ports
- internal ports
- DNS status
- TLS status
- API URL
- dashboard URL
- middleware connectivity status
- worker limits
- benchmark results
- tests passed
- tests failed
- security checks
- remaining manual actions

---

# Working rules

You have full autonomy over development and deployment of this crawler stack on `37.27.128.39`.

Proceed continuously.

Do not stop for routine implementation decisions.

Diagnose and repair ordinary failures yourself.

Create files, install dependencies, build images, migrate databases, restart crawler containers, run tests, and retest as necessary.

Before destructive actions affecting existing production data or unrelated configurations, create backups.

Do not wipe disks.

Do not alter unrelated services on `65.109.65.169`.

Do not invent credentials.

Do not commit secrets.

Do not weaken security simply to make tests pass.

Do not claim a test passed unless it actually passed.

Do not claim middleware integration works unless an authenticated real integration test succeeds.

---

# Definition of done

The mission is complete only when:

- the stack is fully Dockerized
- Crawlee works
- lightweight HTTP crawling works
- Playwright/Chromium works
- adaptive escalation works
- durable jobs/queues work
- pause/cancel/retry behavior is implemented where practical
- normalization works
- deduplication works
- middleware callbacks work or are precisely documented as blocked by missing credentials
- login works
- logout works
- admin account bootstrap works
- client account flow works
- RBAC works
- tenant isolation passes tests
- admin dashboard works
- client dashboard works
- API works
- exports work
- monitoring works
- Grafana/Prometheus or equivalent works
- health checks work
- restart recovery works
- backups are configured
- restore is documented/tested where practical
- horizontal scaling is documented and architecture-ready
- security checks pass
- automated tests pass
- benchmark is completed
- README is complete
- deployment report is complete

At completion, provide one concise final report with:

1. production URL
2. dashboard URL
3. API URL
4. crawler server IP
5. middleware connectivity status
6. Docker services running
7. worker limits
8. benchmark results
9. test summary
10. remaining manual actions

Proceed now and continue until the mission is complete or blocked by a credential/DNS/external action that cannot be safely completed from the server.
