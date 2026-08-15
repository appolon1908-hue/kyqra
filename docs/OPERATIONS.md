# Operations

Before deployment, validate `docker compose config`, run `npm test`, back up the persistent storage volume, and confirm `10.40.0.1` ingress/CA using a read-only `/health` and `/ready` probe. Deploy only Kyqra services; do not recreate unrelated shared-host containers.

Observe `/api/v1/health`, `/metrics`, Redis health, worker logs, and `/admin/integration`. The latter reports endpoint, circuit state, event throughput/backlog, attempts, last success/failure, errors, and manual replay. Normal clients use tenant-filtered job, result, status, and usage APIs and cannot access this page's data without the admin key.

Restart persistence test: submit a test job, stop API/outbox after an event becomes pending, restart the stack, and verify the same event ID delivers once. Recovery test: firewall the private endpoint in staging, wait for the circuit to open, restore it, and verify half-open then closed. Roll back by redeploying the prior image; retain the volume so queued events are not lost.

Prometheus currently exposes outbox states and circuit state. Job/result/duplicate and queue utilization metrics should be scraped from API stats/Redis until expanded collectors land; alerts should cover middleware availability, DLQ growth, retry backlog, job failure rate, and queue depth.
