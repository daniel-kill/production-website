# Production Website — danielkill.online 🌐

Source repository for the official production website of [Daniel Kill](https://github.com/daniel-kill), serving [**danielkill.online**](https://danielkill.online) and [**www.danielkill.online**](https://www.danielkill.online).

---

## 🛠️ Overview & Architecture

High-performance, secure portfolio and service platform designed for reliability, minimal dependencies, and automated deployment.

- **Frontend:** Semantic HTML5, modern CSS3 (responsive grid/flexbox, custom design system, dark palette, glassmorphism), vanilla ES6+ JavaScript.
- **Backend:** PHP 8.3 with PDO MySQL integration and offline fallback logging.
- **Database:** MySQL relational storage (`contact_inquiries` and `site_telemetry`).
- **Hosting:** Hostinger Premium Web Hosting (CloudLinux/CageFS, Apache 2.4, PHP 8.3).
- **CI/CD:** Automated GitHub Actions pipeline deploying to Hostinger on push to `main` via SSH.
- **Domain:** [danielkill.online](https://danielkill.online) / [www.danielkill.online](https://www.danielkill.online)
- **Maintainer:** [Daniel Kill](https://github.com/daniel-kill) (<daniel@danielkill.online>)

---

## ✨ Features

- **Interactive Retro Games &amp; Arcade Hub (`games.php`, `draculaland.php`, `bloodbyte.php`):** Playable in-browser retro CRT terminals running Daniel Kill's complete ports of *The Wizard's Castle (1980 RPG)*, *Draculaland: Castle Dracula (1777 Scott Adams IF)*, and *BloodByte* (Gothic Vampire Arcade Maze Runner) with full audio synthesis, virtual D-pad controls, particle effects, and local state saving.
- **Portfolio & Open-Source Showcase:** Direct interactive cards linking all public repositories (`Sunfire`, `LLMForge`, `cloudflare-api-lab`, `devpulse`, `secret-sentinel`, `curio-byte`, `games`, `bloodbyte`, `portfolio-projects`, and `production-website`).
- **Discord Community Integration:** Live server status panel and Curio.Byte bot invite widget.
- **Interactive Contact Endpoint:** AJAX-powered contact form with CSRF token protection, honeypot anti-spam verification, and asynchronous JSON response.
- **Dual-Storage Persistence:** Saves inquiries to MySQL database when available, with automatic file logging fallback to `data/inquiries.jsonl` if database is offline.
- **Telemetry & Analytics:** Lightweight, privacy-respecting request logging for uptime and visitor metrics.
- **GPG Identity Verification:** Embedded public GPG key fingerprint and download link.

---

## 🚀 Deployment Pipeline

Deployments are fully automated via GitHub Actions:
1. Pushes to `main` trigger `.github/workflows/deploy.yml`.
2. The workflow connects securely to Hostinger via SSH.
3. The server synchronizes `domains/danielkill.online/public_html` against `origin/main` and applies proper directory (`755`) and file (`644`) permissions.

---

## 🗄️ Database Setup

1. In Hostinger hPanel, create a MySQL database and user.
2. Open phpMyAdmin and import [`database/schema.sql`](database/schema.sql).
3. Copy [`config.example.php`](config.example.php) to `config.local.php` in the web root and configure your database credentials:
   ```php
   <?php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'your_database_name');
   define('DB_USER', 'your_database_user');
   define('DB_PASS', 'your_secure_password');
   ```
   *(Note: `config.local.php` is ignored by Git and will never be committed or overwritten).*

---

## 🔒 Security & Commit Verification

All commits to this repository are cryptographically signed using Daniel Kill's verified GPG key:
- **Key ID:** `E453F9AEC380D33E4BA7FAC69B542AA270F867E5` (`9B542AA270F867E5`)
- **Signer:** Daniel Kill <daniel@danielkill.online>

---

## 📜 License

[MIT License](LICENSE) © Daniel Kill
