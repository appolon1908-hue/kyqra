# Kyqra — legacy crawler repository

> **Repository authority:** deprecated for new crawler development.
>
> The canonical Kyqra crawler implementation is now `appolon1908-hue/kyqra-crawler`.
> This repository is retained for history and migration reference only. Do not create a
> second production crawler API, queue, credential set, job ledger, Middleware contract,
> or deployment from this repository.

## Canonical architecture

```text
Client / n8n
    |
    v
Kong -> Middleware -> kyqra-crawler -> approved crawl targets
                         |
                         +-> signed/allowlisted result callback -> Middleware
```

Middleware remains the cross-system write/control boundary. The crawler must not write
directly to Odoo or other Codestra product databases.

## Migration status

The existing source in this repository described a Dockerized crawler/scraper for
`kyqra.com`, targeted at the provider host, with Crawlee, Playwright/Chromium, Redis,
an API, dashboard and reverse proxy. The newer `kyqra-crawler` repository contains the
substantive production-oriented implementation and is the authority for future fixes,
contracts, tests and releases.

No runtime traffic is moved by this documentation change. Any production cutover still
requires contract/source parity, backup/restore evidence, queue drain, callback cutover,
immutable deployment, read-back and rollback rehearsal.

## Historical quick start

The historical Compose source remains available for reference:

```bash
docker compose up -d --build
```

Do not commit secrets and do not treat this command as an approved production deployment
procedure.
