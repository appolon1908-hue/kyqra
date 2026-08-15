# Middleware integration

Default destination is `https://10.40.0.1:443/api/v1/events/kyqra`. Deployment must confirm the existing private ingress and change only `MIDDLEWARE_BASE_URL`; no listener is created by this repository.

The canonical request is JSON plus `Authorization: Bearer <KYQRA_MIDDLEWARE_API_KEY>`, `Idempotency-Key`, `X-Event-Id`, `X-Timestamp`, and `X-Signature`. The HMAC-SHA256 input is `timestamp + "\\n" + event_id + "\\nkyqra\\n" + exact_body`; signatures are hex with `sha256=` prefix. Kyqra aliases are also sent in `X-Kyqra-*`. Middleware performs constant-time API-key/signature checks, a 300-second freshness window, event/idempotency replay protection, and returns the original successful disposition for an identical replay.

mTLS files may be mounted at `/run/secrets`; enable them only after confirming the production ingress trust chain. Secrets live in the host runtime env/secret store, never Git.

Compatibility note: the inspected middleware branch currently permits only `kyqra.*`, while the required contract uses `crawler.*`. Middleware must add `crawler.` to Kyqra's allowed prefixes before activation. Do not rename these events locally or route around middleware.
