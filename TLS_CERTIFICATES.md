# Kyqra TLS / Certificate Mission

Codex must treat certificate management as a production requirement for all enabled public Kyqra services.

## Public services

Use free Let's Encrypt certificates (ACME) for every public HTTPS/TLS hostname that is actually enabled, including as applicable:

- kyqra.com
- www.kyqra.com
- app.kyqra.com
- crawler.kyqra.com
- api.kyqra.com
- status.kyqra.com

## Requirements

- Obtain valid publicly trusted certificates only after DNS resolves correctly.
- Use Certbot, Traefik ACME, Caddy ACME, or another maintainable ACME client integrated with the chosen reverse proxy.
- Configure automatic renewal.
- Test renewal with the platform's dry-run/staging method where supported.
- Persist ACME account/certificate state across Docker restarts and server reboots.
- Reload/restart affected proxy/application services automatically after successful renewal where required.
- Force HTTPS for public dashboard/API endpoints.
- Use secure TLS defaults and HSTS where appropriate.
- Monitor certificate expiry and surface renewal failures in logs/monitoring.
- Do not commit private keys, ACME account keys, or secrets to Git.
- Back up certificate configuration and document recovery/reissuance procedures.

## Crawler-specific TLS

- Protect crawler dashboard, API, customer login, admin login, webhooks, exports, and any public control endpoints with HTTPS.
- Keep Playwright debugging ports, Redis, PostgreSQL, worker control ports, Docker socket, and internal queue services private.
- Middleware traffic over the private vSwitch may use the existing private mTLS/HTTPS design where present; do not weaken or replace existing private certificate controls without inspection and backup.

## Validation

Codex must verify:

1. DNS resolution matches the intended server.
2. HTTPS presents the correct certificate for each hostname.
3. Certificate chain is valid.
4. Automatic renewal is enabled.
5. Renewal dry-run/test succeeds where possible.
6. Proxy/app reload occurs after renewal where needed.
7. Certificate state survives container/server restart.
8. Expiry monitoring is active.

SSH is separate from TLS. Continue using SSH public-key authentication for administration; do not replace SSH keys with Let's Encrypt certificates.
