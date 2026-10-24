<?php
require_once __DIR__ . '/config.php';
recordTelemetry($_SERVER['REQUEST_URI'] ?? '/');
$csrfToken = getCsrfToken();
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#0b1020">
  <meta name="description" content="Official website of Daniel Kill. Software developer, open-source maintainer, Discord bot engineer, and developer tooling architect.">
  <meta property="og:title" content="Daniel Kill — Software Developer & Open Source Tools">
  <meta property="og:description" content="Personal site, open source repositories, and tools by Daniel Kill.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://danielkill.online/">
  <meta property="og:image" content="images/daniel%40danielkill.online_AVATAR.png">
  
  <title>Daniel Kill — Software & Open Source Tools</title>
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="wrap">
    <header class="nav">
      <a class="wordmark" href="#" aria-label="Daniel Kill home">DK<span>.</span></a>
      <nav class="nav-links">
        <a href="#projects">Projects</a>
        <a href="games.php" class="nav-highlight">Games <span class="badge-tag">Playable</span></a>
        <a href="#discord">Discord</a>
        <a href="#contact">Contact</a>
      </nav>
      <div class="nav-note">
        <span class="dot" aria-hidden="true"></span>
        <span>danielkill.online · Active</span>
      </div>
    </header>

    <main>
      <!-- Hero Section -->
      <section class="hero" aria-labelledby="intro-title">
        <div>
          <p class="eyebrow">Hello, I'm Daniel</p>
          <h1 id="intro-title">I build software<br><span class="surname">and useful tools.</span></h1>
          <p class="lead">Software developer, automation enthusiast, and open-source creator. I build developer CLIs, Discord community bots, security tools, and interactive terminal simulations.</p>
          <div class="actions">
            <a class="btn btn-primary" href="#contact">Get in touch <span aria-hidden="true">↓</span></a>
            <a class="btn" href="games.php">🎮 Play Games Arcade <span aria-hidden="true">→</span></a>
            <a class="btn" href="https://github.com/daniel-kill?tab=repositories" target="_blank" rel="noopener noreferrer">GitHub Repositories <span aria-hidden="true">↗</span></a>
            <a class="btn" href="assets/Resume_Daniel-Kill.pdf" target="_blank" rel="noopener noreferrer">Resume <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div class="portrait-frame">
          <img class="portrait" src="images/daniel%40danielkill.online_AVATAR.webp" alt="Portrait of Daniel Kill" loading="eager" decoding="async">
        </div>
      </section>

      <!-- Focus / Philosophy Section -->
      <section class="section" aria-labelledby="about-title">
        <div class="section-head">
          <div>
            <p class="section-kicker">Core Philosophy</p>
            <h2 id="about-title">How I Build</h2>
          </div>
          <p class="section-intro">Principles guiding development across tools, APIs, and infrastructure.</p>
        </div>
        <div class="grid">
          <article class="card">
            <div class="card-icon" aria-hidden="true">⚡</div>
            <h3>High Efficiency</h3>
            <p>I build lightweight, high-performance CLI utilities and services designed to minimize overhead and maximize execution speed.</p>
          </article>
          <article class="card">
            <div class="card-icon" aria-hidden="true">🔒</div>
            <h3>Security & Integrity</h3>
            <p>Every commit is verified with cryptographic GPG signing. Entropy checks and posture scans ensure secrets stay safe.</p>
          </article>
          <article class="card">
            <div class="card-icon" aria-hidden="true">⚙️</div>
            <h3>End-to-End Automation</h3>
            <p>From automated container deployments to GitHub Actions CI/CD and self-healing bots, systems run predictably and smoothly.</p>
          </article>
        </div>
      </section>

      <!-- Repositories Section -->
      <section class="section" id="projects" aria-labelledby="projects-title">
        <div class="section-head">
          <div>
            <p class="section-kicker">Open Source & Tools</p>
            <h2 id="projects-title">Featured Repositories</h2>
          </div>
          <p class="section-intro">Explore open-source developer telemetry, bot platforms, entropy scanners, and retro simulations.</p>
        </div>
        <div class="grid">
          <article class="card">
            <div class="card-icon" aria-hidden="true">⚡</div>
            <h3>DevPulse</h3>
            <p>A high-performance Python CLI utility designed to audit workspace git repositories, track working tree cleanliness, and verify GPG security posture.</p>
            <p class="card-link"><a href="https://github.com/daniel-kill/devpulse" target="_blank" rel="noopener noreferrer">Explore DevPulse ↗</a></p>
          </article>

          <article class="card">
            <div class="card-icon" aria-hidden="true">🛡️</div>
            <h3>Secret Sentinel</h3>
            <p>A high-throughput secret, token, and credential scanner using Shannon entropy analysis, CLI TUI, and automated pre-commit security verification.</p>
            <p class="card-link"><a href="https://github.com/daniel-kill/secret-sentinel" target="_blank" rel="noopener noreferrer">Explore Secret Sentinel ↗</a></p>
          </article>

          <article class="card">
            <div class="card-icon" aria-hidden="true">🤖</div>
            <h3>Curio.Byte Discord Bot</h3>
            <p>A modular discord.js bot featuring AI provider routing, persistent SQLite storage, server telemetry, automated backups, and moderation commands.</p>
            <p class="card-link"><a href="https://github.com/daniel-kill/curio-byte" target="_blank" rel="noopener noreferrer">Explore Curio.Byte ↗</a></p>
          </article>

          <article class="card card-featured">
            <div class="card-badge">Playable in Browser</div>
            <div class="card-icon" aria-hidden="true">🎮</div>
            <h3>PowerShell Games Arcade</h3>
            <p>Interactive PowerShell 7 terminal games and classic dungeon crawlers—now playable directly in your browser, starting with <strong>The Wizard's Castle (1980)</strong>.</p>
            <div class="card-links">
              <a class="btn btn-primary btn-sm" href="games.php">🎮 Play Online</a>
              <a class="card-link" href="https://github.com/daniel-kill/games" target="_blank" rel="noopener noreferrer">Explore Repo ↗</a>
            </div>
          </article>

          <article class="card">
            <div class="card-icon" aria-hidden="true">⚙️</div>
            <h3>Developer Utilities Suite</h3>
            <p>Multi-language system tools: C# File Organizer, Node.js Log Analyzer, PowerShell System Health Reporter, and POSIX Safe Backup script.</p>
            <p class="card-link"><a href="https://github.com/daniel-kill/portfolio-projects" target="_blank" rel="noopener noreferrer">Explore Utilities Suite ↗</a></p>
          </article>

          <article class="card">
            <div class="card-icon" aria-hidden="true">🌐</div>
            <h3>Production Website</h3>
            <p>The source code powering danielkill.online. Built with semantic HTML5, modern CSS3 custom properties, PHP 8.3 backend, and MySQL telemetry.</p>
            <p class="card-link"><a href="https://github.com/daniel-kill/production-website" target="_blank" rel="noopener noreferrer">View Site Source ↗</a></p>
          </article>
        </div>
      </section>

      <!-- Community & Discord Section -->
      <section class="section" id="discord" aria-labelledby="discord-title">
        <div class="section-head">
          <div>
            <p class="section-kicker">Community & Bot</p>
            <h2 id="discord-title">Code, Build, Repeat</h2>
          </div>
          <p class="section-intro">A developer Discord server for building tools, discussing automation, and testing bot features.</p>
        </div>
        <div class="discord-panel">
          <div class="discord-copy">
            <div class="discord-mark" aria-hidden="true">⌁</div>
            <h3>Meet Curio.Byte</h3>
            <p>I built Curio.Byte to automate server infrastructure. It features interactive polls, project searches, AI assistance with provider fallbacks, automated server backup state, and rich administration commands.</p>
            <div class="actions">
              <a class="btn btn-primary" href="https://discord.com/oauth2/authorize?client_id=1557933718193315940&amp;permissions=8&amp;integration_type=0&amp;scope=bot" target="_blank" rel="noopener noreferrer">Invite Curio.Byte <span aria-hidden="true">↗</span></a>
              <a class="btn" href="https://github.com/daniel-kill/curio-byte" target="_blank" rel="noopener noreferrer">View Bot Repo <span aria-hidden="true">↗</span></a>
              <a class="btn" href="https://discord.gg/muPYhD7MEM" target="_blank" rel="noopener noreferrer">Join Server <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div class="discord-widget">
            <iframe
              src="https://discord.com/widget?id=1557930395868209162&amp;theme=dark"
              title="Code, Build, Repeat Discord server widget"
              width="350"
              height="500"
              allowtransparency="true"
              frameborder="0"
              sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
              loading="lazy">
            </iframe>
          </div>
        </div>
      </section>

      <!-- Interactive Contact & Inquiry Section -->
      <section class="section" id="contact" aria-labelledby="contact-title">
        <div class="section-head">
          <div>
            <p class="section-kicker">Get In Touch</p>
            <h2 id="contact-title">Contact & Inquiries</h2>
          </div>
          <p class="section-intro">Send a message directly through the site or connect across verified channels.</p>
        </div>

        <div class="contact-container">
          <!-- Contact Form -->
          <div class="contact-card">
            <form id="contact-form" action="api/contact.php" method="POST" novalidate>
              <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken, ENT_QUOTES, 'UTF-8') ?>">
              
              <!-- Honeypots for Bot Detection -->
              <div class="hp-field" aria-hidden="true">
                <input type="text" name="hp_field" tabindex="-1" autocomplete="off">
                <input type="text" name="website_url" tabindex="-1" autocomplete="off">
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="form-name">Name <span class="required">*</span></label>
                  <input type="text" id="form-name" name="name" placeholder="Your name" required maxlength="100">
                </div>
                <div class="form-group">
                  <label for="form-email">Email <span class="required">*</span></label>
                  <input type="email" id="form-email" name="email" placeholder="name@domain.com" required maxlength="180">
                </div>
              </div>

              <div class="form-group">
                <label for="form-subject">Subject</label>
                <input type="text" id="form-subject" name="subject" placeholder="Project inquiry, question, or collaboration" maxlength="200">
              </div>

              <div class="form-group">
                <label for="form-message">Message <span class="required">*</span></label>
                <textarea id="form-message" name="message" rows="5" placeholder="Write your message here..." required maxlength="5000"></textarea>
              </div>

              <div id="form-alert" class="form-alert" role="alert" style="display:none;"></div>

              <button type="submit" id="submit-btn" class="btn btn-primary btn-submit">
                <span class="btn-text">Send Message <span aria-hidden="true">→</span></span>
                <span class="btn-spinner" style="display:none;" aria-hidden="true"></span>
              </button>
            </form>
          </div>

          <!-- Direct Channels & Security Verification -->
          <div class="channels-card">
            <h3>Direct Channels</h3>
            <p class="muted">Reach out directly via email or verified community platforms:</p>
            <ul class="channel-list">
              <li>
                <span class="channel-label">Email:</span>
                <a href="mailto:daniel@danielkill.online">daniel@danielkill.online</a>
              </li>
              <li>
                <span class="channel-label">Discord:</span>
                <a href="https://discord.gg/muPYhD7MEM" target="_blank" rel="noopener noreferrer">discord.gg/muPYhD7MEM ↗</a>
              </li>
              <li>
                <span class="channel-label">Linktree:</span>
                <a href="https://linktr.ee/daniel_kill" target="_blank" rel="noopener noreferrer">linktr.ee/daniel_kill ↗</a>
              </li>
              <li>
                <span class="channel-label">GitHub:</span>
                <a href="https://github.com/daniel-kill" target="_blank" rel="noopener noreferrer">github.com/daniel-kill ↗</a>
              </li>
            </ul>

            <hr class="divider">

            <h3>GPG Cryptographic Key</h3>
            <p class="muted">Verify signed commits and encrypt sensitive correspondence:</p>
            <div class="key-box">
              <span class="key-id">Key ID: <code>0x9B542AA270F867E5</code></span>
              <code class="fingerprint">E453 F9AE C380 D33E 4BA7<br>FAC6 9B54 2AA2 70F8 67E5</code>
              <div style="margin-top:12px;">
                <a class="btn btn-sm" href="assets/Daniel_Kill_(Daniel_Kill's_GPG_Key)_0x9B542AA270F867E5_public.asc" download>Download Public Key (.asc) ↗</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="footer-copy">
        <span>© <span id="year"><?= date('Y') ?></span> Daniel Kill. All rights reserved.</span>
        <span class="footer-domain">danielkill.online</span>
      </div>
      <div class="actions" style="gap:14px;justify-content:flex-end;flex-wrap:wrap;">
        <a href="https://github.com/daniel-kill?tab=repositories" target="_blank" rel="noopener noreferrer">Repositories ↗</a>
        <a href="https://linktr.ee/daniel_kill" target="_blank" rel="noopener noreferrer">Linktree ↗</a>
        <a href="https://discord.gg/muPYhD7MEM" target="_blank" rel="noopener noreferrer">Discord ↗</a>
        <a href="assets/Resume_Daniel-Kill.pdf" target="_blank" rel="noopener noreferrer">Resume ↗</a>
      </div>
    </footer>
  </div>

  <script src="script.js" defer></script>
</body>
</html>
