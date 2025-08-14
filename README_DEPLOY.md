## Deployment Guide

- **1. Configure environment**
  - Copy `.env.example` to `.env` and fill all secrets and service URLs.

- **2. Set container images**
  - Edit `deploy/docker-compose.yml` and replace `ghcr.io/your-org/*` with your actual image names (or adjust to build locally).

- **3. Run locally / single host**
  - Start services (from repo root):
    ```bash
    docker compose -f deploy/docker-compose.yml up -d
    ```
  - Stop services:
    ```bash
    docker compose -f deploy/docker-compose.yml down
    ```

- **4. Networking and TLS**
  - Place services behind a reverse proxy (Nginx/Traefik) with TLS.
  - Suggested routes:
    - `https://your-domain/` → `web:3000`
    - `https://your-domain/api` → `api:8080`
    - `https://your-domain/webhook/whatsapp` → `bot:8081`

- **5. WhatsApp Cloud API**
  - Set `WHATSAPP_VERIFY_TOKEN` and `WHATSAPP_CLOUD_API_TOKEN` in `.env`.
  - Point the webhook to `https://your-domain/webhook/whatsapp`.

- **6. Payments**
  - Configure your provider (e.g., Stripe): `STRIPE_PUBLIC_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`.

- **7. CI/CD (GitHub Actions)**
  - Configure repository secrets if using SSH deploy: `SSH_HOST`, `SSH_USERNAME`, `SSH_PRIVATE_KEY`, `SSH_PORT`, `GHCR_USERNAME`, `GHCR_PAT`.
  - Prepare remote host once: install Docker + Compose v2, create `/opt/travel`, clone this repo there, and ensure your SSH user can run Docker.
  - On push to `main`, images are built and the remote host pulls the latest repo and updates using `deploy/docker-compose.yml`.

- **8. Backups (PostgreSQL)**
  - Nightly example:
    ```bash
    pg_dump --no-owner --clean --if-exists "$DATABASE_URL" | gzip > backup_$(date +%F).sql.gz
    ```

- **9. Hardening checklist**
  - Rotate strong secrets (`JWT_SECRET`, `POSTGRES_PASSWORD`, webhook tokens).
  - Restrict inbound ports; expose only 80/443 via the proxy.
  - Enable CORS allowlist (`CORS_ORIGINS`) and rate limiting at the proxy.
  - Enforce HTTPS and HSTS at the proxy.
  - Keep images patched; use minimal base images.

- **10. Observability**
  - Wire logs to your aggregator and set `OTEL_EXPORTER_OTLP_ENDPOINT` if using OpenTelemetry.