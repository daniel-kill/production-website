<?php
/**
 * Terminal Games Arcade — danielkill.online
 * Maintainer: Daniel Kill <daniel@danielkill.online>
 */
require_once __DIR__ . '/config.php';
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#0b1020">
  <meta name="description" content="Play classic terminal and PowerShell games directly in your browser. Featuring The Wizard's Castle (1980 RPG) by Daniel Kill.">
  <meta property="og:title" content="Games Arcade — Playable PowerShell Classics | Daniel Kill">
  <meta property="og:description" content="Play turn-based retro dungeon crawlers and CLI board games in an authentic browser terminal.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://danielkill.online/games.php">
  <meta property="og:image" content="images/daniel%40danielkill.online_AVATAR.png">
  
  <title>Games Arcade — Playable PowerShell Classics | Daniel Kill</title>
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
        <p class="eyebrow">Interactive Terminal Arcade</p>
        <h1>PowerShell &amp; Retro Games</h1>
        <p class="lead">Original turn-based simulations and classic dungeon crawlers built by Daniel Kill for PowerShell 7, ported to run right in your browser with zero plugins or latency.</p>

        <!-- Arcade Navigation Switcher Tabs -->
        <nav class="arcade-nav-tabs" aria-label="Arcade Game Selector">
          <a href="games.php" class="arcade-tab active" aria-current="page">
            <span aria-hidden="true">🧙‍♂️</span> The Wizard's Castle (1980 RPG)
          </a>
          <a href="draculaland.php" class="arcade-tab tab-dracula">
            <span aria-hidden="true">🧛</span> Draculaland (1777 Adventure)
          </a>
          <a href="bloodbyte.php" class="arcade-tab tab-bloodbyte">
            <span aria-hidden="true">🩸</span> BloodByte (Arcade Maze)
          </a>
          <a href="https://github.com/daniel-kill/games" target="_blank" rel="noopener noreferrer" class="arcade-tab">
            <span aria-hidden="true">📦</span> All Games on GitHub ↗
          </a>
        </nav>
      </section>

      <!-- Featured Interactive Game: The Wizard's Castle -->
      <section id="play" aria-labelledby="castle-title">
        <div class="section-head">
          <div>
            <p class="section-kicker">Playable In Browser</p>
            <h2 id="castle-title">The Wizard's Castle (1980 Classic RPG)</h2>
          </div>
          <p class="section-intro">8 floors, 512 chambers, lethal beasts, ancient relics, and the elusive Orb of Zot. Explore the labyrinth, find the Runestaff, cast spells, and escape alive!</p>
        </div>

        <!-- Retro Terminal CRT Shell -->
        <div class="crt-terminal-box scanlines-enabled" role="region" aria-label="Interactive Game Terminal">
          <!-- Title Bar -->
          <div class="terminal-titlebar">
            <div class="titlebar-left">
              <div class="window-dots" aria-hidden="true">
                <span class="dot-red"></span>
                <span class="dot-yellow"></span>
                <span class="dot-green"></span>
              </div>
              <span class="titlebar-title">The-Wizards-Castle.ps1 — PowerShell 7 Terminal</span>
            </div>
            <div class="titlebar-actions">
              <button type="button" id="btn-quick-start" class="btn-term-action" title="Start immediately with optimal character">⚡ Quick Start</button>
              <button type="button" id="btn-new-game" class="btn-term-action" title="Start customized character creation">🔄 New Game</button>
              <button type="button" id="btn-toggle-audio" class="btn-term-action" title="Toggle retro PC speaker sound effects">🔇 Sound: Off</button>
              <button type="button" id="btn-toggle-crt" class="btn-term-action active" title="Toggle CRT scanline overlay">📺 Scanlines</button>
            </div>
          </div>

          <!-- Dynamic HUD Status Bar -->
          <div class="terminal-hud" aria-label="Player Attributes Status">
            <div class="hud-item">
              <span class="hud-label">Location</span>
              <span id="hud-level" class="hud-value">L1 (1, 4)</span>
            </div>
            <div class="hud-item">
              <span class="hud-label">Strength</span>
              <span id="hud-hp" class="hud-value">--/18</span>
            </div>
            <div class="hud-item">
              <span class="hud-label">Intelligence</span>
              <span id="hud-iq" class="hud-value">--/18</span>
            </div>
            <div class="hud-item">
              <span class="hud-label">Dexterity</span>
              <span id="hud-dx" class="hud-value">--/18</span>
            </div>
            <div class="hud-item">
              <span class="hud-label">Gold</span>
              <span id="hud-gold" class="hud-value">0 GP</span>
            </div>
            <div class="hud-item">
              <span class="hud-label">Armor / Weapon</span>
              <span class="hud-value"><span id="hud-armor">None</span> / <span id="hud-weapon">Bare Hands</span></span>
            </div>
            <div class="hud-item">
              <span class="hud-label">Lamp / Flares</span>
              <span class="hud-value"><span id="hud-lamp">No</span> | <span id="hud-flares">0</span> Fl</span>
            </div>
            <div class="hud-item">
              <span class="hud-label">Treasures</span>
              <span id="hud-treasures" class="hud-value">0/8</span>
            </div>
            <div class="hud-item">
              <span class="hud-label">Runestaff</span>
              <span id="hud-runestaff" class="hud-value">None</span>
            </div>
            <div class="hud-item">
              <span class="hud-label">Orb Of Zot</span>
              <span id="hud-orb" class="hud-value">Not Found</span>
            </div>
          </div>

          <!-- Terminal Output Screen -->
          <div id="castle-terminal" class="terminal-screen" tabindex="0" aria-live="polite"></div>

          <!-- Command Input Line -->
          <div class="terminal-prompt-box">
            <form id="castle-form" autocomplete="off">
              <span class="prompt-prefix">PS Zot:\Castle&gt;</span>
              <input type="text" id="castle-input" class="terminal-input" placeholder="Enter command (e.g. N, S, E, W, M, O, P, G, L, F, T, A, R, B, ?)" aria-label="Terminal Command Input">
            </form>
          </div>

          <!-- On-Screen Action Pad & Virtual D-Pad (Great for mobile & quick clicking) -->
          <div class="arcade-controls-panel">
            <div class="dpad-container" aria-label="Directional Controls">
              <button type="button" class="dpad-btn dpad-n" data-castle-cmd="N" title="Move North">▲ N</button>
              <button type="button" class="dpad-btn dpad-w" data-castle-cmd="W" title="Move West">◀ W</button>
              <div class="dpad-center" aria-hidden="true">•</div>
              <button type="button" class="dpad-btn dpad-e" data-castle-cmd="E" title="Move East">▶ E</button>
              <button type="button" class="dpad-btn dpad-s" data-castle-cmd="S" title="Move South">▼ S</button>
            </div>

            <div class="action-buttons-group">
              <button type="button" class="quick-action-btn" data-castle-cmd="M" title="Display Automap">🗺️ (M)ap</button>
              <button type="button" class="quick-action-btn" data-castle-cmd="U" title="Go Up Stairs">⬆ (U)p</button>
              <button type="button" class="quick-action-btn" data-castle-cmd="D" title="Go Down Stairs">⬇ (D)own</button>
              <button type="button" class="quick-action-btn" data-castle-cmd="O" title="Open Chest or Book">📦 (O)pen</button>
              <button type="button" class="quick-action-btn" data-castle-cmd="P" title="Drink from Pool">🧪 (P)ool</button>
              <button type="button" class="quick-action-btn" data-castle-cmd="G" title="Gaze into Crystal Orb">🔮 (G)aze</button>
              <button type="button" class="quick-action-btn" data-castle-cmd="L" title="Shine Lantern into room">💡 (L)amp</button>
              <button type="button" class="quick-action-btn" data-castle-cmd="F" title="Light a Flare">🔥 (F)lare</button>
              <button type="button" class="quick-action-btn" data-castle-cmd="T" title="Teleport with Runestaff">⚡ (T)eleport</button>
              <button type="button" class="quick-action-btn quick-action-combat" data-castle-cmd="A" title="Attack in Combat">⚔️ (A)ttack</button>
              <button type="button" class="quick-action-btn quick-action-combat" data-castle-cmd="R" title="Retreat from Combat">🏃 (R)etreat</button>
              <button type="button" class="quick-action-btn quick-action-combat" data-castle-cmd="B" title="Bribe Monster">🪙 (B)ribe</button>
              <button type="button" class="quick-action-btn" data-castle-cmd="?" title="Help & Instructions">❓ Help</button>
            </div>
          </div>
        </div>

        <!-- Instructions & Lore Accordion -->
        <details class="guide-accordion">
          <summary class="guide-summary">
            <span>📜 Adventurer's Manual &amp; Castle Rules</span>
            <span aria-hidden="true">▾</span>
          </summary>
          <div class="guide-content">
            <h4>The Quest for the Orb of Zot</h4>
            <p>Deep within the kingdom of N'dic, the gnomic wizard Zot forged his great Orb of power and vanished. You enter an 8-level subterranean castle arranged as a continuous toroidal donut where edges wrap smoothly around (North connects to South, East connects to West). The only exception is the Entrance at Level 1 (1, 4): exiting North through the Entrance brings you back to the sunlight to claim your victory!</p>

            <h4>Commands &amp; Exploration</h4>
            <ul>
              <li><strong>(M)ap:</strong> View the discovered automap of your current floor. Unexplored rooms are marked with <code>X</code>, your coordinates with <code>&lt;&gt;</code>.</li>
              <li><strong>(O)pen:</strong> Pry open chests (may contain gold or hazardous gas/explosives) or read mysterious runic books (may grant IQ, blind you, or glue itself to your hands!).</li>
              <li><strong>(P)ool:</strong> Drink from bubbling magic pools to alter attributes, change genders, or morph into another race.</li>
              <li><strong>(L)amp &amp; (F)lares:</strong> Shine your brass lantern into an adjacent room, or ignite a flare to reveal all 8 surrounding chambers.</li>
              <li><strong>(T)eleport:</strong> Once you locate and defeat the monster carrying the legendary <strong>Runestaff</strong>, you can instantly warp to any chamber across the 8 floors—essential for entering the Orb of Zot's sanctum.</li>
            </ul>

            <h4>Ancient Treasures &amp; Curses</h4>
            <p>Eight powerful treasures lie hidden in the labyrinth. Holding them permanently wards off lethal dungeon curses:</p>
            <ul>
              <li><strong>The Ruby Red:</strong> Wards off <em>Lethargy</em> (which grants monsters the first strike).</li>
              <li><strong>The Pale Pearl:</strong> Wards off the <em>Leech</em> curse (which drains your Strength every turn).</li>
              <li><strong>The Opal Eye:</strong> Instantly cures <em>Blindness</em>.</li>
              <li><strong>The Green Gem:</strong> Protects against <em>Forgetfulness</em> (which wipes your automap).</li>
              <li><strong>The Blue Flame:</strong> Dissolves demon-glued books stuck to your hands.</li>
            </ul>

            <h4>Magic Spells</h4>
            <p>When your Intelligence reaches <strong>15 or higher</strong>, you gain the ability to cast spells during battle:</p>
            <ul>
              <li><strong>Web (Costs 1 ST):</strong> Ensnnares the monster in sticky magical webs for 2 to 9 rounds.</li>
              <li><strong>Fireball (Costs 1 ST, 1 IQ):</strong> Blasts the beast with a ball of pure flame for 2 to 14 damage.</li>
              <li><strong>Deathspell (0 Cost):</strong> A lethal psychic duel of wills. The combatant with lower IQ dies instantly.</li>
            </ul>

            <div style="margin-top: 16px;">
              <a class="btn" href="https://github.com/daniel-kill/games/blob/main/The-Wizards-Castle.ps1" target="_blank" rel="noopener noreferrer">View Original PowerShell Source on GitHub ↗</a>
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
          <!-- Game: BloodByte -->
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
              <a class="btn btn-primary btn-sm" href="bloodbyte.php" style="background: #f43f5e; border-color: #f43f5e; color: #fff;">🎮 Play Online</a>
              <a class="btn btn-sm" href="https://github.com/daniel-kill/bloodbyte" target="_blank" rel="noopener noreferrer">View Repo ↗</a>
            </div>
          </article>

          <!-- Game 1: The Wizard's Castle -->
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
              <a class="btn btn-primary btn-sm" href="#play">🎮 Play Online</a>
              <a class="btn btn-sm" href="https://github.com/daniel-kill/games/blob/main/The-Wizards-Castle.ps1" target="_blank" rel="noopener noreferrer">View .ps1 Source ↗</a>
            </div>
          </article>

          <!-- Game 2: Terminal Monopoly -->
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

          <!-- Game 3: Hunt the Wumpus -->
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

          <!-- Game 4: The Oregon Trail: 1848 -->
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

          <!-- Game 5: Terminal Battleship -->
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

          <!-- Game 6: Draculaland 1777 -->
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
              <a class="btn btn-primary btn-sm" href="draculaland.php" style="background: #ef4444; border-color: #ef4444; color: #fff;">🎮 Play Online</a>
              <a class="btn btn-sm" href="https://github.com/daniel-kill/games/blob/main/draculaland.ps1" target="_blank" rel="noopener noreferrer">View .ps1 Source ↗</a>
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
        <a href="bloodbyte.php">BloodByte</a>
        <a href="https://github.com/daniel-kill/games" target="_blank" rel="noopener noreferrer">Games Repo ↗</a>
        <a href="index.php#contact">Contact</a>
      </div>
    </footer>
  </div>

  <script src="wizards-castle.js"></script>
</body>
</html>
