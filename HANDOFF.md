# Active Task Handoff: production-website

## Current State & Production Topology
`production-website` serves as the official production web platform and portfolio monorepo for Daniel Kill, live at **`https://danielkill.online`** and **`https://www.danielkill.online`**.

- **Production URL:** `https://danielkill.online`
- **Hosting Environment:** Hostinger Web Hosting (`/home/u922787661/domains/danielkill.online/public_html`) on PHP 8.3 + MySQL.
- **Automated CI/CD:** Any push to `main` immediately executes [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), pulling `origin/main` directly to the live server document root and setting permissions (`644` files, `755` dirs, `750` for `data/`).
- **Interactive Suite:** Features the live retro arcade hub (`games.php`), playable games (*The Wizard's Castle*, *Draculaland*, *BloodByte*), activity feed (`feed.php`), and dual-storage contact form (`api/contact.php`).
- **Monorepo Consolidations:** Integrates `LLMForge`, `cloudflare-api-lab`, `devpulse`, `secret-sentinel`, `portfolio-projects`, and `primary-website`.

---

## Completed
- [x] **Monorepo Module Consolidations:** Successfully incorporated `secret-sentinel`, `cloudflare-api-lab`, `LLMForge`, `devpulse`, and `portfolio-projects` into the root repository.
- [x] **Content Cleanup:** Cleaned legacy resume PDFs and links from the public landing page (commit `2676094`).
- [x] **RSS Feed Aggregation:** Built Python aggregator [`scripts/rss_aggregator.py`](scripts/rss_aggregator.py) and frontend reader [`feed.php`](feed.php).
- [x] **Script Validation:** Verified clean Python compilation of automation scripts.
- [x] **Documentation Modernization:** Overhauled [AGENTS.md](AGENTS.md), [HANDOFF.md](HANDOFF.md), [ROADMAP.md](ROADMAP.md), and [README.md](README.md) with GPG verification guidelines and deployment safety rules.

---

## In Progress & Immediate Next Steps
1. **Commit & GPG Sign:** Commit documentation files with mandatory key `daniel@danielkill.online` via WSL2 bash on branch `main`.
2. **RSS Feed Automation:** Configure an automated scheduled task or cron job to run `rss_aggregator.py` periodically and populate `feed.php`.
3. **Automated CI Linting:** Add a pre-deployment linting job in GitHub Actions to validate PHP, Python, and JavaScript syntax before triggering the remote SSH deployment.

---

## Blockers & Gotchas
- **Live Auto-Deployment Warning:** Pushing to `origin/main` automatically triggers remote production deployment to `danielkill.online`. Always verify syntax and test changes locally before pushing.
- **Config & Inquiries Isolation:** `config.local.php` (DB credentials) and `data/` (runtime inquiries fallback) are strictly gitignored and must never be tracked or overwritten.
- **Branch Target:** The production branch is `main`.
