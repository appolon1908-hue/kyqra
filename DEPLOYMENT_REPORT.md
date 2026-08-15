# Control-plane alignment deployment report

Date: 2026-08-15

## Implemented in branch

Versioned event envelopes, correlation/request propagation, tenant-scoped job APIs, Redis scheduler separation, Crawlee/Playwright worker, normalized/provenance-preserving results, tenant-local deduplication, durable SQLite WAL outbox, HMAC authentication, bounded retries, DLQ/manual audited replay, middleware circuit breaker, split health, metrics, structured redacted logging, persistent Docker services, and operator UI.

## Production activation status

Not activated. Production SSH authentication was unavailable from this environment. The inspected middleware control-plane branch rejects required `crawler.*` events because it currently allows only `kyqra.*`; middleware must safely add the `crawler.` prefix. Private TLS listener, firewall path, CA/mTLS materials, runtime service secrets, restart persistence, and live middleware/n8n acceptance therefore remain unverified. No production host or unrelated container was changed.

## Required activation evidence

1. Confirm existing private HTTPS ingress and `/health`/`/ready` from `10.40.0.2`.
2. Provision dedicated Kyqra API/HMAC secrets and, if enabled, mTLS certificate/CA mounts.
3. Update middleware allowlist for the mandated event namespace and run valid/invalid/replay/idempotency tests.
4. Deploy only Kyqra compose services, run outage/circuit/recovery and container/server restart tests, validate tenant isolation and public port exposure.
5. Confirm middleware-triggered n8n synthetic workflow and Odoo service-layer idempotency; attach evidence here.
