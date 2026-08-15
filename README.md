# Kyqra

Dockerized crawler/scraper repository for **kyqra.com**.

Deployment target: `37.27.128.39`
Middleware/Odoo target: `65.109.65.169`

Planned services:
- Crawlee
- Playwright / Chromium
- Redis queue
- API
- Dashboard
- Reverse proxy / TLS

Do not commit secrets. Copy `.env.example` to `.env` on the server and fill real credentials there.

## Start
```bash
docker compose up -d --build
```
