# Kyqra

Dockerized crawler/scraper repository for **kyqra.com**.

Deployment target: `37.27.128.39` (`10.40.0.2` private)
Middleware target: `10.40.0.1` over private HTTPS. Kyqra never connects to Odoo or n8n directly.

Services are separated into API intake, Redis scheduling, Crawlee/Playwright workers, and a durable SQLite outbox delivery worker. Existing crawling behavior remains available through `/api/v1/crawl`; new integrations should use `/api/v1/jobs`.

Do not commit secrets. Copy `.env.example` to `.env` on the server and fill real credentials there.

## Start
```bash
docker compose up -d --build
```

API requests require `X-API-Key`, `Idempotency-Key`, and optionally `X-Request-Id` / `X-Correlation-Id`. Tenant identities come from `TENANT_API_KEYS_JSON`. Prometheus metrics are at `/metrics`; crawler and middleware health are separated at `/api/v1/health`; admin operations are at `/admin/integration`.

See [middleware integration](docs/MIDDLEWARE_INTEGRATION.md), [event model](docs/EVENT_MODEL.md), [retry and DLQ](docs/RETRY_DLQ.md), [security](docs/SECURITY.md), and [operations](docs/OPERATIONS.md).
