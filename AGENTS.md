# Repository Agent Guidelines: production-website

Read [HANDOFF.md](HANDOFF.md) first, then [ROADMAP.md](ROADMAP.md), before starting work.
Before finishing any turn or session, record completed work, immediate next steps, and any blockers or gotchas in [HANDOFF.md](HANDOFF.md).

---

## 1. Mandatory Cryptographic Commit Signing
Every commit created for this repository must have a valid cryptographic signature (GPG).
- **Key ID / Email:** `daniel@danielkill.online` (`E453F9AEC380D33E4BA7FAC69B542AA270F867E5`).
- **WSL2 Execution Requirement:** Always execute git commit commands inside WSL2 (`daniel-kill` distro) bash where `gpg-agent` has cached credentials to prevent Windows GUI pinentry hangs.
- **Branch Target:** The primary development and production branch is `main` (not `master`).
- **Never create an unsigned commit** or bypass signing checks. If signing fails or is unavailable, stop and notify the user immediately.
- **Verification:** Verify each created commit using `git verify-commit HEAD` or `git log --show-signature -1`.
- **Push Policy:** Never push commits to remote repositories (`origin/main`) unless explicitly instructed by the user ("push it").
- Do not rewrite existing historical commits just to add signatures unless explicitly authorized.

---

## 2. Production Architecture & Hosting Target
`production-website` is Daniel Kill's flagship public web platform and portfolio monorepo:
- **Production Domain:** `https://danielkill.online` & `https://www.danielkill.online`
- **Hostinger Server Root:** `/home/u922787661/domains/danielkill.online/public_html`
- **CI/CD Deployment:** Fully automated via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). Any push to `main` triggers remote SSH deployment:
  ```bash
  cd /home/u922787661/domains/danielkill.online/public_html
  git fetch origin main && git reset --hard origin/main
  find . -type f -exec chmod 644 {} + && find . -type d -exec chmod 755 {} +
  mkdir -p data && chmod 750 data
  ```

---

## 3. Core Web Stack & Arcade Hub
- **Frontend:** Semantic HTML5, modern CSS3 (responsive grid/flexbox, dark palette, glassmorphism design system), vanilla ES6+ JavaScript.
- **Backend:** PHP 8.3 with PDO MySQL integration and offline fallback logging.
- **Arcade & Retro Gaming Suite:**
  - `games.php` / `games.css`: Retro CRT terminal hub and game selector.
  - `draculaland.php` / `draculaland.js`: Playable *Draculaland: Castle Dracula* text adventure (1777 Scott Adams IF tribute).
  - `bloodbyte.php` / `bloodbyte.js`: *BloodByte* gothic arcade maze runner with particle engine and local storage save states.
  - `wizards-castle.js`: *The Wizard's Castle* (1980 classic dungeon crawl RPG).
- **Contact & Persistence Layer:**
  - `api/contact.php`: AJAX contact form endpoint with session CSRF token validation and honeypot anti-spam verification.
  - Dual storage: Saves inquiries to MySQL (`contact_inquiries` table) or falls back seamlessly to `data/inquiries.jsonl` if the database is offline.
  - `api/telemetry.php`: Anonymized, privacy-respecting request telemetry (`sha256($ip . 'salt_telemetry')`).

---

## 4. Consolidated Monorepo Modules
This repository consolidates several core developer suites and tools:
- [`LLMForge/`](LLMForge/): Python CLI for OpenRouter and Groq LLM streaming.
- [`cloudflare-api-lab/`](cloudflare-api-lab/): Cloudflare Workers AI testing suite.
- [`devpulse/`](devpulse/): Python CLI for Git repository audits and GPG verification.
- [`secret-sentinel/`](secret-sentinel/): Shannon entropy secrets scanner.
- [`portfolio-projects/`](portfolio-projects/): C#, Node.js, PowerShell, and POSIX developer utilities.
- [`primary-website/`](primary-website/): Historical documentation and static archive.

---

## 5. Strict Secrets & Privacy Boundaries
- **Database Credentials:** Stored strictly in `config.local.php` (gitignored). Never commit database passwords or copy them into tracked files.
- **Fallback Inquiries:** `data/` directory (holding `inquiries.jsonl`) is gitignored and restricted to `chmod 750`.
- **Environment & Keys:** `.env`, `*.key`, `*.pem`, and `.private/` are strictly gitignored.

---

## 6. Pre-flight Verification Workflow
Before committing or creating releases, run this automated check in WSL2:

```bash
cd /home/daniel/Repos/production-website

# 1. Python compilation check
python3 -m py_compile scripts/rss_aggregator.py

# 2. Git staging sanity check
git status --short
```

---

## 7. Central Documentation & System Telemetry
- **Central Shared Documentation:** `/home/daniel/Repos/shared/docs/` (`C:\Users\danie\Repos\shared\docs\`)
- **Machine Snapshots & Inventory:** `/home/daniel/Repos/shared/data/snapshots/danielpredpc/`
