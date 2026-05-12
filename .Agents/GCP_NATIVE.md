# MADLABS Agent: GCP-Native Engineering Guidelines

All MADLABS SaaS products target **Google Cloud Platform (GCP)**. You MUST follow these practices for cloud-native software.

---

## 🚀 1. Compute: Cloud Run
- **Serverless:** Apps are stateless. Use memory and CPU efficiently.
- **Port:** Default is `8080` (unless configured otherwise). 
- **Graceful Shutdown:** Handle `SIGTERM` for active connection draining.

---

## 💂 2. Security: Secret Manager
- **Rule:** NEVER use `.env` files in production. 
- **Action:** Read secrets from **GCP Secret Manager**.
- **Local Dev:** Use `.env` or `.env.local`, but ensure `.gitignore` blocks them.

---

## 🗄️ 3. Data: Cloud SQL (Private Access)
- **Rule:** Always assume database access is via **Private IP (VPC Connector)**.
- **ORM:** Use Prisma or EF Core with multi-tenant global filters.
- **Seeding:** Use scripts (e.g., `migrate.js` or `cloudbuild-migrations.yaml`) for database schema updates.

---

## 📈 4. Observability: Cloud Logging & Trace
- **Logging:** Use `google-cloud/logging` for high-signal production logs.
- **Tracing:** Use OpenTelemetry or native GCP tracing for performance bottlenecks.
- **Alerting:** Suggest health check endpoints (e.g., `/health`, `/health/ready`) for Cloud Run probes.

---
*Last Updated: 2026-03-23*
*Reference: ../MADLABS_OPERATIONS.md*
