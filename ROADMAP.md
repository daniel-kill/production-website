# Roadmap: production-website

## Goal & Constraints
- **Primary Objective:** Provide a blazingly fast, modern, and reliable production web platform and portfolio monorepo for Daniel Kill (`https://danielkill.online`), showcasing open-source projects, interactive games, activity feeds, and secure contact endpoints with automated CI/CD deployment.
- **Key Constraints:**
  - **Hosting Environment:** Hostinger Web Hosting (CloudLinux / Apache 2.4 / PHP 8.3 / MySQL).
  - **Minimal Dependencies:** Zero heavy frontend frameworks; vanilla ES6+ JS and custom CSS3 glassmorphism design system for sub-second page loads.
  - **Strict Secrets Isolation:** All database credentials restricted to gitignored `config.local.php`.
  - **Automated Deployment Safety:** Deployments trigger automatically on push to `main` via GitHub Actions SSH.

---

## Phase 1 — Monorepo Consolidation & Arcade Foundation (Current / Completed)
- [x] Consolidate core developer suites ([`LLMForge/`](LLMForge/), [`cloudflare-api-lab/`](cloudflare-api-lab/), [`devpulse/`](devpulse/), [`secret-sentinel/`](secret-sentinel/), [`portfolio-projects/`](portfolio-projects/)) into root monorepo.
- [x] Implement in-browser retro arcade CRT terminals for *The Wizard's Castle*, *Draculaland: Castle Dracula*, and *BloodByte*.
- [x] Dual-storage contact form endpoint ([`api/contact.php`](api/contact.php)) with session CSRF token validation, honeypot spam protection, MySQL storage, and JSONL fallback.
- [x] Privacy-respecting anonymized telemetry logging.
- [x] Modernize repository operational documentation ([AGENTS.md](AGENTS.md), [HANDOFF.md](HANDOFF.md), [ROADMAP.md](ROADMAP.md), [README.md](README.md)).
**Exit:** High-performance live platform with automated CI/CD deployment and complete monorepo project integration.

---

## Phase 2 — Feed Automation, Performance & Visual Refinements
- [ ] **RSS Aggregator Scheduling:** Automate [`scripts/rss_aggregator.py`](scripts/rss_aggregator.py) via cron or GitHub Actions schedule to dynamically update [`feed.php`](feed.php) with multi-repo commit feeds.
- [ ] **WebP Asset Optimization:** Leverage the `media-toolkit` skill (`magick`) to transcode showcase screenshots and banners to WebP for enhanced mobile performance.
- [ ] **Arcade Audio Synthesizer:** Add synthesized Web Audio sound effects and audio mute toggles across *BloodByte* and *Draculaland*.
- [ ] **Inquiry Webhook Notifications:** Add optional Discord / Telegram webhook dispatch when new contact inquiries are submitted.
**Exit:** Dynamic live feed updates, optimized mobile asset delivery, and real-time contact notifications.

---

## Phase 3 — CI/CD Hardening, Testing & Analytics
- [ ] **Pre-Deployment CI Quality Gate:** Add a pre-deploy check job in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) that validates PHP syntax (`php -l`), Python compilation, and script validity before executing the remote SSH pull.
- [ ] **DuckDB Telemetry & Inquiry Analytics:** Build a lightweight CLI analytical tool to parse `data/inquiries.jsonl` and database telemetry metrics using DuckDB.
- [ ] **Lighthouse 100/100 Web Vitals:** Fine-tune `.htaccess` cache headers, asset preloading, and font-display for perfect 100/100 Lighthouse performance scores.
**Exit:** Verified pre-deployment testing pipeline, automated telemetry analytics, and optimal Web Vitals scores.
