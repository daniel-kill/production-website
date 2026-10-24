<?php
/**
 * Draculaland 1777 — Playable Browser Port
 * Maintainer: Daniel Kill <daniel@danielkill.online>
 */
require_once __DIR__ . '/config.php';
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#120509">
  <meta name="description" content="Play Draculaland (Castle Dracula, 1777) in your browser. A Scott Adams-style text adventure ported from PowerShell 7 by Daniel Kill.">
  <meta property="og:title" content="Draculaland 1777 — Scott Adams-Style Text Adventure | Daniel Kill">
  <meta property="og:description" content="Transylvania, 1777. Slay Count Dracula before sunset in an authentic retro browser terminal.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://danielkill.online/draculaland.php">
  <meta property="og:image" content="images/daniel%40danielkill.online_AVATAR.png">
  
  <title>Draculaland (1777) — Playable Text Adventure | Daniel Kill</title>
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
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
        <p class="eyebrow" style="color: #ff6b81;">Gothic Interactive Fiction · 1777</p>
        <h1>Draculaland: Castle Dracula</h1>
        <p class="lead">A standalone Scott Adams <em>Adventureland</em>-style text adventure originally built for PowerShell 7 by Daniel Kill. Explore 16 eerie castle chambers, manage lantern fuel, break unholy wards, and drive an oak stake through Dracula's heart before the sunset clock runs out.</p>

        <!-- Arcade Navigation Switcher Tabs -->
        <nav class="arcade-nav-tabs" aria-label="Arcade Game Selector">
          <a href="games.php" class="arcade-tab">
            <span aria-hidden="true">🧙‍♂️</span> The Wizard's Castle (1980 RPG)
          </a>
          <a href="draculaland.php" class="arcade-tab tab-dracula active" aria-current="page">
            <span aria-hidden="true">🧛</span> Draculaland (1777 Adventure)
          </a>
          <a href="https://github.com/daniel-kill/games" target="_blank" rel="noopener noreferrer" class="arcade-tab">
            <span aria-hidden="true">📦</span> All 6 Games on GitHub ↗
          </a>
        </nav>
      </section>

      <!-- Featured Interactive Game: Draculaland -->
      <section id="play" aria-labelledby="dracula-title">
        <div class="section-head">
          <div>
            <p class="section-kicker" style="color: #f87171;">Playable In Browser</p>
            <h2 id="dracula-title">Draculaland (Carpathians, 1777)</h2>
          </div>
          <p class="section-intro">Two-word parser engine (first 3 letters rule). Solve inventory puzzles, survive the dark, hoard treasures on consecrated ground, and stake the sleeping Count!</p>
        </div>

        <!-- Retro Terminal CRT Shell -->
        <div id="dracula-terminal-box" class="crt-terminal-box theme-dracula scanlines-enabled" role="region" aria-label="Interactive Game Terminal">
          <!-- Title Bar -->
          <div class="terminal-titlebar">
            <div class="titlebar-left">
              <div class="window-dots" aria-hidden="true">
                <span class="dot-red"></span>
                <span class="dot-yellow"></span>
                <span class="dot-green"></span>
              </div>
              <span class="titlebar-title">draculaland.ps1 — 1777 Carpathian Adventure (PowerShell Web Port)</span>
            </div>
            <div class="titlebar-actions">
              <button type="button" id="btn-dracula-sound" class="btn-term-action active" title="Toggle Sound Synthesizer">🔊 Sound: ON</button>
              <button type="button" id="btn-dracula-scanlines" class="btn-term-action active" title="Toggle CRT Scanline Filter">📺 CRT FX: ON</button>
              <button type="button" id="btn-dracula-demo" class="btn-term-action" title="Run automated winning walkthrough">⚡ Walkthrough Demo</button>
              <button type="button" id="btn-dracula-new" class="btn-term-action" title="Start a fresh game">🔄 New Game</button>
            </div>
          </div>

          <!-- Real-Time HUD Status Bar -->
          <div class="terminal-hud" aria-live="polite">
            <div class="hud-item">
              <span class="hud-label">Current Chamber</span>
              <span id="dracula-hud-room" class="hud-value">Borgo Pass</span>
            </div>
            <div class="hud-item">
              <span class="hud-label">Moves / Sunset Clock</span>
              <span id="dracula-hud-turns" class="hud-value">0 / 300 (300 to sunset)</span>
            </div>
            <div class="hud-item">
              <span class="hud-label">Brass Lantern</span>
              <span id="dracula-hud-oil" class="hud-value">220 oil [UNLIT]</span>
            </div>
            <div class="hud-item">
              <span class="hud-label">Inventory Pack</span>
              <span id="dracula-hud-inv" class="hud-value">0 / 8 carried</span>
            </div>
            <div class="hud-item">
              <span class="hud-label">Chapel Treasures</span>
              <span id="dracula-hud-score" class="hud-value">0 / 5 stored</span>
            </div>
          </div>

          <!-- Terminal Screen -->
          <div id="dracula-screen" class="terminal-screen" tabindex="0" role="log" aria-label="Terminal Output Screen"></div>

          <!-- Command Input Box -->
          <form id="dracula-form" class="terminal-prompt-box" autocomplete="off">
            <label for="dracula-input" class="prompt-sym" aria-hidden="true">DRA:1777\&gt;</label>
            <input 
              type="text" 
              id="dracula-input" 
              class="terminal-input" 
              placeholder="Tell me what to do (e.g. TAKE LANTERN, GO NORTH, EXAMINE WAGON)..." 
              aria-label="Terminal Command Input"
              autofocus 
              spellcheck="false"
            >
            <button type="submit" class="btn-term-send">Execute ↵</button>
          </form>

          <!-- Virtual D-Pad & Quick Actions -->
          <div class="arcade-controls-panel">
            <!-- 8-way Compass D-Pad -->
            <div class="dpad-container" aria-label="Directional Controls">
              <button type="button" id="dracula-dir-u" class="dpad-btn" title="Go Up (Stairs)">▲ U</button>
              <button type="button" id="dracula-dir-n" class="dpad-btn dpad-n" title="Go North">N</button>
              <button type="button" id="dracula-dir-d" class="dpad-btn" title="Go Down (Cellar)">▼ D</button>
              <button type="button" id="dracula-dir-w" class="dpad-btn dpad-w" title="Go West">W</button>
              <div class="dpad-center" aria-hidden="true">☩</div>
              <button type="button" id="dracula-dir-e" class="dpad-btn dpad-e" title="Go East">E</button>
              <div></div>
              <button type="button" id="dracula-dir-s" class="dpad-btn dpad-s" title="Go South">S</button>
              <div></div>
            </div>

            <!-- Quick Action Command Chips -->
            <div class="action-buttons-group" aria-label="Quick Action Buttons">
              <button type="button" id="btn-qa-look" class="quick-action-btn">👁️ LOOK</button>
              <button type="button" id="btn-qa-inv" class="quick-action-btn">🎒 INVENTORY</button>
              <button type="button" id="btn-qa-light" class="quick-action-btn">🕯️ LIGHT LANTERN</button>
              <button type="button" id="btn-qa-douse" class="quick-action-btn">💨 DOUSE</button>
              <button type="button" id="btn-qa-pray" class="quick-action-btn">🙏 PRAY</button>
              <button type="button" id="btn-qa-score" class="quick-action-btn">🏆 SCORE</button>
              <button type="button" id="btn-qa-help" class="quick-action-btn">❓ HELP</button>
              <button type="button" id="btn-qa-save" class="quick-action-btn">💾 SAVE</button>
              <button type="button" id="btn-qa-load" class="quick-action-btn">📂 LOAD</button>
            </div>
          </div>
        </div>

        <!-- Strategy Guide & Lore Accordion -->
        <details class="guide-accordion" style="border-color: rgba(239, 68, 68, 0.3);">
          <summary class="guide-summary" style="color: #fca5a5;">
            <span>📖 Lore &amp; Survival Field Guide: Castle Dracula (1777)</span>
            <span class="accordion-icon" aria-hidden="true">+</span>
          </summary>
          <div class="guide-content">
            <h4>The Legend &amp; Setting</h4>
            <p>Year of Our Lord 1777. The Count preys upon the mountain valleys of Wallachia and Transylvania. By day, he rests powerless in his subterranean crypt. You arrive on the Borgo Pass as the autumn sun begins its descent. You have exactly <strong>300 turns</strong> before sunset. Once the sun sinks below the peaks, Dracula rises and will hunt you down.</p>

            <h4>Scott Adams Two-Word Parser</h4>
            <p>In true 1978 Scott Adams tradition, the parser accepts two-word instructions: <code>VERB NOUN</code>. Crucially, the engine only evaluates the <strong>first 3 letters</strong> of each word! For instance:</p>
            <ul>
              <li><code>TAKE LANTERN</code> = <code>TAK LAN</code></li>
              <li><code>EXAMINE PORTRAIT</code> = <code>EXA POR</code></li>
              <li><code>SPRINKLE WATER</code> = <code>SPR WAT</code></li>
              <li><code>GO NORTH</code> = <code>N</code> or <code>GO NOR</code></li>
            </ul>

            <h4>The Core Mysteries &amp; Puzzles</h4>
            <ul>
              <li><strong>The Starving Wolves (Courtyard):</strong> Lean wolves bar entry to the castle. Search the abandoned wagon for fresh food.</li>
              <li><strong>The Vampire Bride (Great Hall):</strong> A pale vampiress guards the staircases. Only the holy power of the silver crucifix can drive her away.</li>
              <li><strong>The Black Sigil Ward (Cellar):</strong> An unholy black glyph crackles on the crypt door. Touching it burns you—splash sanctified holy water from the ruined chapel to dissolve the ward.</li>
              <li><strong>The Wallachian Voivode (Gallery):</strong> A stern oil painting hangs on the upper gallery. The frame feels loose; try moving it to discover the hidden iron key.</li>
              <li><strong>The Vampire Hunter's Weapon:</strong> You need an oak stake and a mallet. Break a chair leg in the dining room and sharpen it with a dagger from the armory. Retrieve the blacksmith's mallet from the forge.</li>
              <li><strong>The Final Slaying (Crypt):</strong> Ensure your lantern is lit. Open the heavy stone coffin lid. With both the oak stake and iron mallet in your inventory, strike Dracula through the heart!</li>
            </ul>

            <h4>The 5 Holy Treasures</h4>
            <p>Five ancient relics are scattered through the castle: the <strong>Gold Goblet</strong>, <strong>Ruby Ring</strong>, <strong>Emerald Necklace</strong>, <strong>Silver Tiara</strong>, and <strong>Bottle of Ancient Tokaji</strong>. Dropping them in the sanctified <strong>Ruined Chapel</strong> stores them safely and grants the highest hunter ranking: <em>GRAND VAMPIRE SLAYER</em>.</p>

            <div style="margin-top: 16px;">
              <a class="btn" href="https://github.com/daniel-kill/games/blob/main/draculaland.ps1" target="_blank" rel="noopener noreferrer">View Original draculaland.ps1 on GitHub ↗</a>
            </div>
          </div>
        </details>
      </section>

      <!-- Complete Suite Catalog of PowerShell Games -->
      <section class="section" aria-labelledby="catalog-title">
        <div class="section-head">
          <div>
            <p class="section-kicker">PowerShell 7 Games Suite</p>
            <h2 id="catalog-title">Terminal Games Collection</h2>
          </div>
          <p class="section-intro">Explore Daniel Kill's complete catalog of standalone terminal games, simulations, and text adventures in the <a href="https://github.com/daniel-kill/games" target="_blank" rel="noopener noreferrer">daniel-kill/games</a> repository.</p>
        </div>

        <div class="games-catalog-grid">
          <!-- Game 1: Draculaland 1777 -->
          <article class="game-catalog-card" style="border-color: rgba(239, 68, 68, 0.4);">
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
              <a class="btn btn-primary btn-sm" href="#play" style="background: #ef4444; border-color: #ef4444; color: #fff;">🎮 Play Online</a>
              <a class="btn btn-sm" href="https://github.com/daniel-kill/games/blob/main/draculaland.ps1" target="_blank" rel="noopener noreferrer">View .ps1 Source ↗</a>
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

          <!-- Game 3: Terminal Monopoly -->
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

          <!-- Game 4: Hunt the Wumpus -->
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

          <!-- Game 5: The Oregon Trail: 1848 -->
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

          <!-- Game 6: Terminal Battleship -->
          <article class="game-catalog-card">
            <div>
              <div class="card-header-badge">
                <span class="game-icon-large" aria-hidden="true">⚓</span>
                <span class="badge-status badge-in-port">Port in Progress</span>
              </div>
              <h3>Terminal Battleship</h3>
              <p>Dual-grid 10x10 tactical naval warfare against Ensign, Captain, and Admiral tier AI opponents with intelligent hunt-and-target search vectors.</p>
              <div class="game-card-meta">PowerShell 7 · Tactical Combat · AI Search Vectors</div>
            </div>
            <div class="game-card-actions">
              <a class="btn btn-sm" href="https://github.com/daniel-kill/games/blob/main/battleship.ps1" target="_blank" rel="noopener noreferrer">View .ps1 Source ↗</a>
            </div>
          </article>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="footer-meta">
        <p class="tagline">Built by Daniel Kill · All terminal games written in PowerShell 7 &amp; ported to the web.</p>
        <p class="crypto-note">Commits signed with GPG key <code>0x9B542AA270F867E5</code>.</p>
      </div>
      <div class="footer-links">
        <a href="index.php">Home</a>
        <a href="index.php#projects">Projects</a>
        <a href="games.php">The Wizard's Castle</a>
        <a href="draculaland.php">Draculaland</a>
        <a href="https://github.com/daniel-kill/games" target="_blank" rel="noopener noreferrer">Games Repo ↗</a>
        <a href="index.php#contact">Contact</a>
      </div>
    </footer>
  </div>

  <script src="draculaland.js"></script>
</body>
</html>
