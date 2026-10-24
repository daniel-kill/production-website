<?php
/**
 * BloodByte — Gothic Vampire Arcade Maze Runner
 * Maintainer: Daniel Kill <daniel@danielkill.online>
 */
require_once __DIR__ . '/config.php';
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#120614">
  <meta name="description" content="Play BloodByte in your browser. A gothic vampire retro arcade maze runner created by Daniel Kill. Collect gold coins, seize blood packets, and charm pursuing maidens.">
  <meta property="og:title" content="BloodByte — Gothic Vampire Arcade Maze Runner | Daniel Kill">
  <meta property="og:description" content="Stride through the castle labyrinth, evade pursuing maidens, trigger blood frenzy, and gather gothic relics in this fast-paced retro maze runner.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://danielkill.online/bloodbyte.php">
  <meta property="og:image" content="images/daniel%40danielkill.online_AVATAR.png">
  
  <title>BloodByte — Gothic Vampire Arcade Maze Runner | Daniel Kill</title>
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
  <link rel="stylesheet" href="games.css">
</head>
<body>
  <div class="wrap">
    <header class="nav">
      <a class="wordmark" href="index.php" aria-label="Daniel Kill home">DK<span>.</span></a>
      <nav class="nav-links">
        <a href="index.php#projects">Projects</a>
        <a href="games.php" class="nav-highlight">Games <span class="badge-tag">Playable</span></a>
        <a href="index.php#discord">Discord</a>
        <a href="index.php#contact">Contact</a>
      </nav>
      <div class="nav-note">
        <span class="dot" aria-hidden="true"></span>
        <span>danielkill.online · Active</span>
      </div>
    </header>

    <main>
      <section class="arcade-hero">
        <p class="eyebrow" style="color: #f43f5e;">Gothic Arcade Maze Runner · 1980s Retro Engine</p>
        <h1>BloodByte</h1>
        <p class="lead">A fast-paced gothic vampire arcade maze runner built by Daniel Kill. Stride through the dark castle labyrinth as Vlad the Vampire, collecting ancient gold coins while evading the four pursuing maidens. Consume blood packets to unleash Blood Frenzy, turn the tables on your pursuers, and hoard rare gothic relics.</p>

        <!-- Arcade Navigation Switcher Tabs -->
        <nav class="arcade-nav-tabs" aria-label="Arcade Game Selector">
          <a href="games.php" class="arcade-tab">
            <span aria-hidden="true">🧙‍♂️</span> The Wizard's Castle (1980 RPG)
          </a>
          <a href="draculaland.php" class="arcade-tab tab-dracula">
            <span aria-hidden="true">🧛</span> Draculaland (1777 Adventure)
          </a>
          <a href="bloodbyte.php" class="arcade-tab tab-bloodbyte active" aria-current="page">
            <span aria-hidden="true">🩸</span> BloodByte (Arcade Maze)
          </a>
          <a href="https://github.com/daniel-kill/bloodbyte" target="_blank" rel="noopener noreferrer" class="arcade-tab">
            <span aria-hidden="true">📦</span> BloodByte Repo ↗
          </a>
        </nav>
      </section>

      <!-- Featured Interactive Game: BloodByte -->
      <section id="play" aria-labelledby="bloodbyte-title">
        <div class="section-head">
          <div>
            <p class="section-kicker" style="color: #f43f5e;">Playable In Browser</p>
            <h2 id="bloodbyte-title">BloodByte: The Crypt Labyrinth</h2>
          </div>
          <p class="section-intro">Use arrow keys or WASD to navigate. Clear every coin, consume blood packets to charm your pursuers, and escape through the side warp tunnels!</p>
        </div>

        <!-- Arcade Cabinet Box -->
        <div id="bloodbyte-cabinet" class="arcade-cabinet" role="region" aria-label="BloodByte Arcade Cabinet">
          <!-- Cabinet Bar -->
          <div class="cabinet-bar">
            <span style="font-weight: 600; color: #fca5a5;">🦇 Castle Crypt Labyrinth</span>
            <div class="cabinet-actions">
              <button type="button" id="btn-bb-sound" class="btn-arcade active" title="Toggle Sound">🔊 Sound: ON</button>
              <button type="button" id="btn-bb-pause" class="btn-arcade" title="Pause Game">⏸️ Pause</button>
              <button type="button" id="btn-bb-restart" class="btn-arcade" title="Restart Game">🔄 Restart</button>
            </div>
          </div>

          <!-- HUD Bar -->
          <div class="arcade-hud" aria-live="polite">
            <div class="hud-stat">
              <span class="hud-label">Score</span>
              <span id="bb-score" class="hud-value">0</span>
            </div>
            <div class="hud-stat">
              <span class="hud-label">High Score</span>
              <span id="bb-high" class="hud-value hud-value-rose">0</span>
            </div>
            <div class="hud-stat">
              <span class="hud-label">Level</span>
              <span id="bb-level" class="hud-value">1</span>
            </div>
            <div class="hud-stat">
              <span class="hud-label">Vampire Lives</span>
              <span id="bb-lives" class="hud-value" style="font-size: 0.85rem;">🦇 🦇 🦇</span>
            </div>
          </div>

          <!-- Canvas Viewport -->
          <div class="canvas-holder">
            <canvas id="bloodbyte-canvas" width="560" height="620" aria-label="BloodByte Game Screen"></canvas>
            <div class="scanlines-overlay" aria-hidden="true"></div>
          </div>

          <!-- Cabinet Footer -->
          <div class="cabinet-footer">
            <span style="color: var(--muted); font-size: 0.78rem;">Gothic Relics:</span>
            <div id="bb-relics" class="relics-shelf">🕶️</div>
          </div>
        </div>

        <!-- Mobile Touch Controls -->
        <div class="mobile-touch-panel">
          <div class="touch-dpad" aria-label="Mobile D-Pad">
            <button type="button" id="btn-bb-up" class="t-btn t-btn-up" aria-label="Move Up">▲</button>
            <button type="button" id="btn-bb-left" class="t-btn t-btn-left" aria-label="Move Left">◀</button>
            <div class="t-btn-center" aria-hidden="true">☩</div>
            <button type="button" id="btn-bb-right" class="t-btn t-btn-right" aria-label="Move Right">▶</button>
            <button type="button" id="btn-bb-down" class="t-btn t-btn-down" aria-label="Move Down">▼</button>
          </div>
        </div>

        <!-- Strategy Guide & Lore Accordion -->
        <details class="guide-accordion" style="border-color: rgba(244, 63, 94, 0.35);">
          <summary class="guide-summary" style="color: #fda4af;">
            <span>📖 Vampire Survival Manual: BloodByte Mechanics</span>
            <span class="accordion-icon" aria-hidden="true">+</span>
          </summary>
          <div class="guide-content">
            <h4>Nocturnal Objectives</h4>
            <p>You control Vlad the Vampire, stalking through the subterranean castle labyrinth. Your nocturnal mission is to claim every gold coin scattered in the stone corridors while avoiding the four pursuing maidens.</p>

            <h4>Collectibles &amp; Power Dynamics</h4>
            <ul>
              <li><strong>Ancient Gold Coins (10 Points):</strong> 240+ gold pieces line the corridors. Clear them all to complete the level.</li>
              <li><strong>Blood Packets (50 Points):</strong> Four pulsating crimson vials positioned in the corners of the maze. Consuming one triggers <strong>Blood Frenzy</strong> for 9 seconds.</li>
              <li><strong>Blood Frenzy Mode:</strong> During frenzy, the pursuing women turn ghostly pale blue and flee in terror. Catching a mesmerized maiden charms her for escalating combo points: <strong>200 → 400 → 800 → 1,600 points</strong>!</li>
              <li><strong>Gothic Relics:</strong> Instead of ordinary items, rare vampire artifacts spawn at the center of the labyrinth at 70 and 170 coins collected:
                <ul>
                  <li>Level 1: <strong>Dark Sunglasses</strong> (100 pts)</li>
                  <li>Level 2: <strong>Velvet Cloak</strong> (300 pts)</li>
                  <li>Level 3: <strong>Leather Gloves</strong> (500 pts)</li>
                  <li>Level 4: <strong>Antique Pocket Watch</strong> (700 pts)</li>
                  <li>Level 5: <strong>Obsidian Chalice</strong> (1,000 pts)</li>
                  <li>Level 6: <strong>Vampire Signet Ring</strong> (2,000 pts)</li>
                  <li>Level 7: <strong>Silver Candelabra</strong> (3,000 pts)</li>
                  <li>Level 8+: <strong>Jeweled Master Key</strong> (5,000 pts)</li>
                </ul>
              </li>
            </ul>

            <h4>The 4 Pursuing Maidens</h4>
            <ul>
              <li><strong style="color: #ef4444;">Carmilla (Crimson Gown):</strong> The Direct Shadow. Aggressively follows your exact tile coordinates.</li>
              <li><strong style="color: #f472b6;">Mina (Rose Gown):</strong> The Ambush Scout. Anticipates where you are heading by targeting 4 tiles ahead of your current direction.</li>
              <li><strong style="color: #22d3ee;">Lucy (Cyan Gown):</strong> The Flanker. Calculates a dynamic pincer intercept vector based on Carmilla's location.</li>
              <li><strong style="color: #fbbf24;">Lenore (Amber Gown):</strong> The Timid Stalker. Approaches when you are far away, but retreats to her corner if you get within 8 tiles.</li>
            </ul>

            <div style="margin-top: 16px; display: flex; gap: 10px; flex-wrap: wrap;">
              <a class="btn" href="https://github.com/daniel-kill/bloodbyte" target="_blank" rel="noopener noreferrer">View BloodByte Repository on GitHub ↗</a>
              <a class="btn" href="games.php">Return to Arcade Hub →</a>
            </div>
          </div>
        </details>
      </section>

      <!-- Complete Suite Catalog of Terminal & Arcade Games -->
      <section class="section" aria-labelledby="catalog-title">
        <div class="section-head">
          <div>
            <p class="section-kicker">Interactive Games Suite</p>
            <h2 id="catalog-title">Terminal &amp; Arcade Collection</h2>
          </div>
          <p class="section-intro">Explore Daniel Kill's complete catalog of standalone games, simulations, and text adventures.</p>
        </div>

        <div class="games-catalog-grid">
          <!-- Game 1: BloodByte -->
          <article class="game-catalog-card" style="border-color: rgba(244, 63, 94, 0.45);">
            <div>
              <div class="card-header-badge">
                <span class="game-icon-large" aria-hidden="true">🩸</span>
                <span class="badge-status badge-playable">Playable Online</span>
              </div>
              <h3>BloodByte</h3>
              <p>Gothic vampire arcade maze runner. Stride through the subterranean corridors, collect ancient coins, seize blood packets, and charm pursuing maidens.</p>
              <div class="game-card-meta">JavaScript · HTML5 Canvas · Web Audio API</div>
            </div>
            <div class="game-card-actions">
              <a class="btn btn-primary btn-sm" href="#play" style="background: #f43f5e; border-color: #f43f5e; color: #fff;">🎮 Play Online</a>
              <a class="btn btn-sm" href="https://github.com/daniel-kill/bloodbyte" target="_blank" rel="noopener noreferrer">View Repo ↗</a>
            </div>
          </article>

          <!-- Game 2: The Wizard's Castle -->
          <article class="game-catalog-card">
            <div>
              <div class="card-header-badge">
                <span class="game-icon-large" aria-hidden="true">🧙‍♂️</span>
                <span class="badge-status badge-playable">Playable Online</span>
              </div>
              <h3>The Wizard's Castle</h3>
              <p>Recreation of the legendary 1980 dungeon-crawling classic. Explore 512 rooms across 8 subterranean levels, battle monsters, discover relics, and recover the Orb of Zot.</p>
              <div class="game-card-meta">PowerShell 7 · Web Terminal · Turn-Based RPG</div>
            </div>
            <div class="game-card-actions">
              <a class="btn btn-primary btn-sm" href="games.php">🎮 Play Online</a>
              <a class="btn btn-sm" href="https://github.com/daniel-kill/games/blob/main/The-Wizards-Castle.ps1" target="_blank" rel="noopener noreferrer">View .ps1 Source ↗</a>
            </div>
          </article>

          <!-- Game 3: Draculaland 1777 -->
          <article class="game-catalog-card">
            <div>
              <div class="card-header-badge">
                <span class="game-icon-large" aria-hidden="true">🧛</span>
                <span class="badge-status badge-playable">Playable Online</span>
              </div>
              <h3>Draculaland: Castle Dracula</h3>
              <p>Scott Adams-style text adventure set in the Carpathians, 1777. Solve inventory puzzles, manage lantern oil, and stake Dracula before the 300-move sunset clock expires.</p>
              <div class="game-card-meta">PowerShell 7 · Web Terminal · Interactive Fiction</div>
            </div>
            <div class="game-card-actions">
              <a class="btn btn-primary btn-sm" href="draculaland.php">🎮 Play Online</a>
              <a class="btn btn-sm" href="https://github.com/daniel-kill/games/blob/main/draculaland.ps1" target="_blank" rel="noopener noreferrer">View .ps1 Source ↗</a>
            </div>
          </article>

          <!-- Game 4: Terminal Monopoly -->
          <article class="game-catalog-card">
            <div>
              <div class="card-header-badge">
                <span class="game-icon-large" aria-hidden="true">🎩</span>
                <span class="badge-status badge-in-port">Port in Progress</span>
              </div>
              <h3>Terminal Monopoly</h3>
              <p>Single-player Monopoly simulation running in PowerShell against 1 to 3 autonomous CPU opponents. Strict rule compliance, property auctions, and housing supply limits.</p>
              <div class="game-card-meta">PowerShell 7 · Board Simulation · AI Opponents</div>
            </div>
            <div class="game-card-actions">
              <a class="btn btn-sm" href="https://github.com/daniel-kill/games/blob/main/monopoly.ps1" target="_blank" rel="noopener noreferrer">View .ps1 Source ↗</a>
            </div>
          </article>

          <!-- Game 5: Hunt the Wumpus -->
          <article class="game-catalog-card">
            <div>
              <div class="card-header-badge">
                <span class="game-icon-large" aria-hidden="true">🏹</span>
                <span class="badge-status badge-in-port">Port in Progress</span>
              </div>
              <h3>Hunt the Wumpus</h3>
              <p>Iconic 1973 cave deduction game across an interconnected 20-room dodecahedron. Track the beast by its stench, avoid bottomless pits, and fire crooked arrows.</p>
              <div class="game-card-meta">PowerShell 7 · 1973 Classic · Deduction</div>
            </div>
            <div class="game-card-actions">
              <a class="btn btn-sm" href="https://github.com/daniel-kill/games/blob/main/hunt-the-wumpus.ps1" target="_blank" rel="noopener noreferrer">View .ps1 Source ↗</a>
            </div>
          </article>

          <!-- Game 6: The Oregon Trail: 1848 -->
          <article class="game-catalog-card">
            <div>
              <div class="card-header-badge">
                <span class="game-icon-large" aria-hidden="true">🐂</span>
                <span class="badge-status badge-in-port">Port in Progress</span>
              </div>
              <h3>The Oregon Trail: 1848</h3>
              <p>Pioneer survival and resource management simulation spanning 2,040 miles from Missouri to Oregon. Manage cash, oxen, rations, river crossings, and diseases.</p>
              <div class="game-card-meta">PowerShell 7 · Survival Simulation · Historical</div>
            </div>
            <div class="game-card-actions">
              <a class="btn btn-sm" href="https://github.com/daniel-kill/games/blob/main/oregon-trail.ps1" target="_blank" rel="noopener noreferrer">View .ps1 Source ↗</a>
            </div>
          </article>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="footer-meta">
        <p class="tagline">Built by Daniel Kill · Interactive games and retro arcade ports.</p>
        <p class="crypto-note">Commits signed with GPG key <code>0x9B542AA270F867E5</code>.</p>
      </div>
      <div class="footer-links">
        <a href="index.php">Home</a>
        <a href="index.php#projects">Projects</a>
        <a href="games.php">The Wizard's Castle</a>
        <a href="draculaland.php">Draculaland</a>
        <a href="bloodbyte.php">BloodByte</a>
        <a href="https://github.com/daniel-kill/bloodbyte" target="_blank" rel="noopener noreferrer">BloodByte Repo ↗</a>
        <a href="index.php#contact">Contact</a>
      </div>
    </footer>
  </div>

  <script src="bloodbyte.js"></script>
</body>
</html>
