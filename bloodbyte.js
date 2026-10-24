/**
 * BloodByte — Gothic Vampire Arcade Maze Runner
 * Maintainer: Daniel Kill <daniel@danielkill.online>
 * License: MIT
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // Map Dimensions & Tile Constants
  // --------------------------------------------------------------------------
  const COLS = 28;
  const ROWS = 31;
  const TILE_SIZE = 20; // 560 x 620 logical resolution

  // Tile Types:
  // 0: Empty / Hallway without coin
  // 1: Wall
  // 2: Coin (10 pts)
  // 3: Blood Packet (50 pts, triggers Blood Frenzy)
  // 4: Crypt Gate
  // 5: Crypt Interior (Central Vault)
  // 6: Warp Tunnel Corridor
  const ORIGINAL_MAP = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,3,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,3,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
    [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
    [0,0,0,0,0,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,0,0,0,0,0],
    [0,0,0,0,0,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,0,0,0,0,0],
    [0,0,0,0,0,1,2,1,1,0,1,1,1,4,4,1,1,1,0,1,1,2,1,0,0,0,0,0],
    [1,1,1,1,1,1,2,1,1,0,1,5,5,5,5,5,5,1,0,1,1,2,1,1,1,1,1,1],
    [6,6,6,6,6,0,2,0,0,0,1,5,5,5,5,5,5,1,0,0,0,2,0,6,6,6,6,6],
    [1,1,1,1,1,1,2,1,1,0,1,5,5,5,5,5,5,1,0,1,1,2,1,1,1,1,1,1],
    [0,0,0,0,0,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,0,0,0,0,0],
    [0,0,0,0,0,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,0,0,0,0,0],
    [0,0,0,0,0,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,0,0,0,0,0],
    [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,3,2,2,1,1,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,1,1,2,2,3,1],
    [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
    [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
    [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
    [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ];

  // --------------------------------------------------------------------------
  // Directions & Movement Vectors
  // --------------------------------------------------------------------------
  const DIRS = {
    NONE:  { x: 0,  y: 0,  name: 'NONE',  opp: 'NONE' },
    UP:    { x: 0,  y: -1, name: 'UP',    opp: 'DOWN' },
    DOWN:  { x: 0,  y: 1,  name: 'DOWN',  opp: 'UP' },
    LEFT:  { x: -1, y: 0,  name: 'LEFT',  opp: 'RIGHT' },
    RIGHT: { x: 1,  y: 0,  name: 'RIGHT', opp: 'LEFT' }
  };

  // Authentic 1980 arcade priority tie-breaker order: UP > LEFT > DOWN > RIGHT
  const CANDIDATE_DIRS = [DIRS.UP, DIRS.LEFT, DIRS.DOWN, DIRS.RIGHT];

  function getOppositeDir(dir) {
    if (dir === DIRS.UP) return DIRS.DOWN;
    if (dir === DIRS.DOWN) return DIRS.UP;
    if (dir === DIRS.LEFT) return DIRS.RIGHT;
    if (dir === DIRS.RIGHT) return DIRS.LEFT;
    return DIRS.NONE;
  }

  // --------------------------------------------------------------------------
  // Wave Schedules (Scatter / Chase Alternation State Machine)
  // --------------------------------------------------------------------------
  const WAVE_SCHEDULES = {
    1: [
      { mode: 'SCATTER', duration: 7 },
      { mode: 'CHASE',   duration: 20 },
      { mode: 'SCATTER', duration: 7 },
      { mode: 'CHASE',   duration: 20 },
      { mode: 'SCATTER', duration: 5 },
      { mode: 'CHASE',   duration: 20 },
      { mode: 'SCATTER', duration: 5 },
      { mode: 'CHASE',   duration: Infinity }
    ],
    2: [
      { mode: 'SCATTER', duration: 7 },
      { mode: 'CHASE',   duration: 20 },
      { mode: 'SCATTER', duration: 7 },
      { mode: 'CHASE',   duration: 20 },
      { mode: 'SCATTER', duration: 5 },
      { mode: 'CHASE',   duration: 1033 },
      { mode: 'SCATTER', duration: 0.1 },
      { mode: 'CHASE',   duration: Infinity }
    ],
    5: [
      { mode: 'SCATTER', duration: 5 },
      { mode: 'CHASE',   duration: 20 },
      { mode: 'SCATTER', duration: 5 },
      { mode: 'CHASE',   duration: 20 },
      { mode: 'SCATTER', duration: 5 },
      { mode: 'CHASE',   duration: 1037 },
      { mode: 'SCATTER', duration: 0.1 },
      { mode: 'CHASE',   duration: Infinity }
    ]
  };

  let waveIndex = 0;
  let waveTimer = 7.0;
  let globalMode = 'SCATTER';

  // --------------------------------------------------------------------------
  // Gothic Relics (Bonus Items in Place of Fruit)
  // --------------------------------------------------------------------------
  const RELICS = [
    { name: 'Dark Sunglasses',      pts: 100,  color: '#94a3b8', icon: '🕶️' },
    { name: 'Velvet Cloak',          pts: 300,  color: '#a855f7', icon: '🧥' },
    { name: 'Leather Gloves',        pts: 500,  color: '#ca8a04', icon: '🧤' },
    { name: 'Antique Pocket Watch',  pts: 700,  color: '#f59e0b', icon: '⏱️' },
    { name: 'Obsidian Chalice',      pts: 1000, color: '#ec4899', icon: '🍷' },
    { name: 'Vampire Signet Ring',   pts: 2000, color: '#ef4444', icon: '💍' },
    { name: 'Silver Candelabra',     pts: 3000, color: '#38bdf8', icon: '🕯️' },
    { name: 'Jeweled Master Key',    pts: 5000, color: '#10b981', icon: '🗝️' }
  ];

  // --------------------------------------------------------------------------
  // Audio Synthesizer (Chiptune Web Audio API)
  // --------------------------------------------------------------------------
  let audioCtx = null;
  let soundEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) audioCtx = new AudioCtx();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, duration, type = 'square', vol = 0.08) {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(vol, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  let coinAlternator = false;
  function playSound(name) {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    const t = audioCtx.currentTime;
    try {
      if (name === 'coin') {
        coinAlternator = !coinAlternator;
        playTone(coinAlternator ? 880 : 1100, 0.035, 'square', 0.04);
      } else if (name === 'blood') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.exponentialRampToValueAtTime(880, t + 0.35);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.35);
      } else if (name === 'charm') {
        [350, 520, 700, 1050].forEach((f, i) => {
          setTimeout(() => playTone(f, 0.08, 'triangle', 0.1), i * 40);
        });
      } else if (name === 'relic') {
        [523, 659, 784, 1046].forEach((f, i) => {
          setTimeout(() => playTone(f, 0.12, 'square', 0.09), i * 70);
        });
      } else if (name === 'start') {
        const notes = [220, 261, 330, 440, 415, 330, 261, 220, 330, 440, 523, 659];
        notes.forEach((f, i) => {
          setTimeout(() => playTone(f, 0.14, 'triangle', 0.09), i * 110);
        });
      } else if (name === 'death') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(600, t);
        osc.frequency.exponentialRampToValueAtTime(90, t + 0.6);
        gain.gain.setValueAtTime(0.14, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.6);
      } else if (name === 'levelclear') {
        [440, 554, 659, 880, 1108].forEach((f, i) => {
          setTimeout(() => playTone(f, 0.18, 'triangle', 0.1), i * 100);
        });
      }
    } catch (e) {}
  }

  // --------------------------------------------------------------------------
  // Game State Variables
  // --------------------------------------------------------------------------
  let canvas, ctx;
  let maze = [];
  let totalCoins = 0;
  let coinsCollected = 0;
  let score = 0;
  let highScore = 0;
  let lives = 3;
  let level = 1;
  let isGameOver = false;
  let isGameWon = false;
  let isPaused = false;

  let frenzyTimer = 0;
  let womenCharmedChain = 0;

  // Active Relic State
  let activeRelic = null;
  let relicTimer = 0;
  const RELIC_SPAWN_1 = 70;
  const RELIC_SPAWN_2 = 170;
  let relicSpawned1 = false;
  let relicSpawned2 = false;

  // Floating score popups
  let scorePopups = [];

  // Death / Clear animations
  let deathAnimationTimer = 0;
  let levelClearTimer = 0;

  // --------------------------------------------------------------------------
  // The Vampire (Player)
  // --------------------------------------------------------------------------
  const vampire = {
    x: 13.5 * TILE_SIZE,
    y: 23 * TILE_SIZE + TILE_SIZE / 2,
    dir: DIRS.NONE,
    nextDir: DIRS.NONE,
    speed: 2.15,
    animFrame: 0,
    animTimer: 0,

    reset() {
      this.x = 13.5 * TILE_SIZE;
      this.y = 23 * TILE_SIZE + TILE_SIZE / 2;
      this.dir = DIRS.NONE;
      this.nextDir = DIRS.NONE;
      this.animFrame = 0;
      this.animTimer = 0;
    }
  };

  // --------------------------------------------------------------------------
  // The Four Pursuers (The Maidens)
  // --------------------------------------------------------------------------
  // 1. Carmilla (Red)   — Targets player directly. Cruise Elroy speed scaling.
  // 2. Mina (Pink)      — Ambush: 4 tiles ahead (+4 UP / +4 LEFT authentic quirk).
  // 3. Lucy (Cyan)      — Flanker: Vector reflection from Carmilla through 2 tiles ahead of player.
  // 4. Lenore (Amber)   — Stalker: Chases directly if >= 8 tiles; retreats to corner if < 8 tiles.
  const PURSUERS_CONFIG = [
    {
      id: 'carmilla',
      name: 'Carmilla',
      color: '#ef4444',
      scatterCol: 25,
      scatterRow: -3,
      startX: 13.5 * TILE_SIZE,
      startY: 11 * TILE_SIZE + TILE_SIZE / 2, // Outside crypt gate in hallway
      startDir: DIRS.LEFT,
      houseState: 'OUTSIDE',
      dotLimit: 0,
      houseTimer: 0
    },
    {
      id: 'mina',
      name: 'Mina',
      color: '#f472b6',
      scatterCol: 2,
      scatterRow: -3,
      startX: 13.5 * TILE_SIZE,
      startY: 14 * TILE_SIZE + TILE_SIZE / 2, // Inside crypt center
      startDir: DIRS.UP,
      houseState: 'IN_HOUSE',
      dotLimit: 0,
      houseTimer: 0.8
    },
    {
      id: 'lucy',
      name: 'Lucy',
      color: '#22d3ee',
      scatterCol: 27,
      scatterRow: 31,
      startX: 11.5 * TILE_SIZE,
      startY: 14 * TILE_SIZE + TILE_SIZE / 2, // Inside crypt left
      startDir: DIRS.UP,
      houseState: 'IN_HOUSE',
      dotLimit: 30,
      houseTimer: 4.0
    },
    {
      id: 'lenore',
      name: 'Lenore',
      color: '#fbbf24',
      scatterCol: 0,
      scatterRow: 31,
      startX: 15.5 * TILE_SIZE,
      startY: 14 * TILE_SIZE + TILE_SIZE / 2, // Inside crypt right
      startDir: DIRS.UP,
      houseState: 'IN_HOUSE',
      dotLimit: 60,
      houseTimer: 7.5
    }
  ];

  let pursuers = [];

  function createPursuer(config) {
    return {
      id: config.id,
      name: config.name,
      color: config.color,
      scatterCol: config.scatterCol,
      scatterRow: config.scatterRow,
      startX: config.startX,
      startY: config.startY,
      startDir: config.startDir,
      x: config.startX,
      y: config.startY,
      dir: config.startDir,
      state: globalMode, // 'CHASE', 'SCATTER', 'FRIGHTENED', 'EATEN'
      houseState: config.houseState, // 'OUTSIDE', 'IN_HOUSE', 'LEAVING_HOUSE'
      houseTimer: config.houseTimer,
      dotLimit: config.dotLimit,
      baseSpeed: 1.95,
      reverseDesired: false,
      lastTileCol: -1,
      lastTileRow: -1,
      animTimer: 0,

      reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.dir = this.startDir;
        this.state = globalMode;
        this.houseState = config.houseState;
        this.houseTimer = config.houseTimer;
        this.reverseDesired = false;
        this.lastTileCol = -1;
        this.lastTileRow = -1;
        this.animTimer = 0;
      }
    };
  }

  // --------------------------------------------------------------------------
  // Map Setup & Copying
  // --------------------------------------------------------------------------
  function resetMap() {
    maze = [];
    totalCoins = 0;
    coinsCollected = 0;
    for (let r = 0; r < ROWS; r++) {
      maze[r] = [];
      for (let c = 0; c < COLS; c++) {
        const val = ORIGINAL_MAP[r][c];
        maze[r][c] = val;
        if (val === 2 || val === 3) {
          totalCoins++;
        }
      }
    }
    relicSpawned1 = false;
    relicSpawned2 = false;
    activeRelic = null;
    relicTimer = 0;
  }

  // --------------------------------------------------------------------------
  // Tile Navigation & Pathing Rules
  // --------------------------------------------------------------------------
  function isRestrictedUpTile(col, row) {
    // Authentic 1980 arcade maze rule: ghosts cannot turn UP at these 4 T-junctions
    return (
      (col === 12 && row === 11) ||
      (col === 15 && row === 11) ||
      (col === 12 && row === 23) ||
      (col === 15 && row === 23)
    );
  }

  function isTilePassable(col, row, isPursuer = false, isEaten = false, isLeaving = false) {
    if (row < 0 || row >= ROWS) return false;
    // Warp tunnel corridor in row 14
    if (col < 0 || col >= COLS) {
      return (row === 14);
    }

    const tile = maze[row][col];
    if (tile === 1) return false; // Wall
    if (tile === 4) {
      // Crypt gate: only passable if returning eaten eyes or leaving house
      return (isEaten || isLeaving);
    }
    if (tile === 5) {
      // Crypt interior: only accessible when returning eaten or inside house
      return (isEaten || isLeaving);
    }
    return true;
  }

  function getDistanceSq(x1, y1, x2, y2) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return dx * dx + dy * dy;
  }

  // --------------------------------------------------------------------------
  // Target Tile Selection (1980 Arcade Algorithms)
  // --------------------------------------------------------------------------
  function getTargetTile(p) {
    // 1. Returning eyes target the crypt entrance directly above the gate
    if (p.state === 'EATEN') {
      return { col: 13, row: 11 };
    }

    // 2. Frightened / Mesmerized mode: pseudo-random turn
    if (p.state === 'FRIGHTENED') {
      return null;
    }

    // 3. Scatter Mode: fixed home corners outside maze perimeter
    const coinsLeft = totalCoins - coinsCollected;
    const isCarmillaElroy2 = (p.id === 'carmilla' && coinsLeft <= 10);

    if (p.state === 'SCATTER' && !isCarmillaElroy2) {
      return { col: p.scatterCol, row: p.scatterRow };
    }

    // 4. Chase Mode: authentic targeting personalities
    const vCol = Math.floor(vampire.x / TILE_SIZE);
    const vRow = Math.floor(vampire.y / TILE_SIZE);
    const vDir = vampire.dir;

    if (p.id === 'carmilla') {
      // The Shadow: pursues Vampire's exact tile
      return { col: vCol, row: vRow };
    }

    if (p.id === 'mina') {
      // The Ambush: 4 tiles ahead in player's current direction
      // Authentic 1980 arcade overflow quirk: UP also shifts 4 tiles LEFT
      if (vDir === DIRS.UP) {
        return { col: vCol - 4, row: vRow - 4 };
      }
      return {
        col: vCol + vDir.x * 4,
        row: vRow + vDir.y * 4
      };
    }

    if (p.id === 'lucy') {
      // The Flanker: vector reflection through 2 tiles ahead of player from Carmilla
      let pCol = vCol;
      let pRow = vRow;
      if (vDir === DIRS.UP) {
        pCol -= 2;
        pRow -= 2;
      } else {
        pCol += vDir.x * 2;
        pRow += vDir.y * 2;
      }

      const carmilla = pursuers.find(g => g.id === 'carmilla') || p;
      const cCol = Math.floor(carmilla.x / TILE_SIZE);
      const cRow = Math.floor(carmilla.y / TILE_SIZE);

      const vecX = pCol - cCol;
      const vecY = pRow - cRow;

      return {
        col: pCol + vecX,
        row: pRow + vecY
      };
    }

    if (p.id === 'lenore') {
      // The Stalker: Chases directly when >= 8 tiles; retreats to corner when < 8 tiles
      const pCol = Math.floor(vampire.x / TILE_SIZE);
      const pRow = Math.floor(vampire.y / TILE_SIZE);
      const myCol = Math.floor(p.x / TILE_SIZE);
      const myRow = Math.floor(p.y / TILE_SIZE);
      const distSq = (myCol - pCol) * (myCol - pCol) + (myRow - pRow) * (myRow - pRow);

      if (distSq >= 64) {
        return { col: pCol, row: pRow };
      } else {
        return { col: p.scatterCol, row: p.scatterRow };
      }
    }

    return { col: vCol, row: vRow };
  }

  // --------------------------------------------------------------------------
  // Pursuer Intersection Decision
  // --------------------------------------------------------------------------
  function getNextPursuerDir(p, col, row) {
    // Mode switch forced 180 reverse
    if (p.reverseDesired) {
      p.reverseDesired = false;
      const opp = getOppositeDir(p.dir);
      const nc = col + opp.x;
      const nr = row + opp.y;
      if (isTilePassable(nc, nr, true, p.state === 'EATEN')) {
        return opp;
      }
    }

    const validDirs = [];
    for (const d of CANDIDATE_DIRS) {
      // Rule 1: Cannot reverse 180 during normal corridor traversal
      if (d.name === p.dir.opp) continue;

      const nc = col + d.x;
      const nr = row + d.y;

      // Rule 2: Restricted "No-Up" tiles in arcade labyrinth
      if (d === DIRS.UP && p.state !== 'EATEN' && isRestrictedUpTile(col, row)) {
        continue;
      }

      // Rule 3: Wall & obstacle collision check
      if (isTilePassable(nc, nr, true, p.state === 'EATEN')) {
        validDirs.push(d);
      }
    }

    if (validDirs.length === 0) {
      return getOppositeDir(p.dir);
    }

    // Frightened / Mesmerized mode: pseudo-random turn
    if (p.state === 'FRIGHTENED') {
      const idx = Math.floor(Math.random() * validDirs.length);
      return validDirs[idx];
    }

    // Target-directed navigation: minimize Euclidean distance
    const target = getTargetTile(p);
    let bestDir = validDirs[0];
    let minDistanceSq = Infinity;

    for (const d of validDirs) {
      const nc = col + d.x;
      const nr = row + d.y;
      const dist = (nc - target.col) * (nc - target.col) + (nr - target.row) * (nr - target.row);

      // Strictly '<' preserves CANDIDATE_DIRS tie-breaker order: UP > LEFT > DOWN > RIGHT
      if (dist < minDistanceSq) {
        minDistanceSq = dist;
        bestDir = d;
      }
    }

    return bestDir;
  }

  // --------------------------------------------------------------------------
  // Crypt House State Updates
  // --------------------------------------------------------------------------
  function updateHouseBobbing(p, dt) {
    p.animTimer += dt;
    p.y = p.startY + Math.sin(p.animTimer * 5) * 4;

    p.houseTimer -= dt;
    if (p.houseTimer <= 0 || (p.dotLimit > 0 && coinsCollected >= p.dotLimit)) {
      p.houseState = 'LEAVING_HOUSE';
    }
  }

  function updateLeavingHouse(p, dt) {
    const targetX = 13.5 * TILE_SIZE;
    const exitY = 11 * TILE_SIZE + TILE_SIZE / 2;

    const diffX = targetX - p.x;
    if (Math.abs(diffX) > 1) {
      p.x += Math.sign(diffX) * 1.5;
      return;
    }
    p.x = targetX;

    if (p.y > exitY) {
      p.y -= 1.5;
      p.dir = DIRS.UP;
      if (p.y <= exitY) {
        p.y = exitY;
        p.houseState = 'OUTSIDE';
        p.dir = DIRS.LEFT;
        p.state = (frenzyTimer > 0) ? 'FRIGHTENED' : globalMode;
        p.lastTileCol = 13;
        p.lastTileRow = 11;
      }
    }
  }

  function getPursuerSpeed(p) {
    if (p.state === 'EATEN') return 4.0;
    if (p.state === 'FRIGHTENED') return 1.15;

    const c = Math.floor(p.x / TILE_SIZE);
    const r = Math.floor(p.y / TILE_SIZE);
    // Warp tunnel slowdown (50%)
    if (r === 14 && (c <= 5 || c >= 22)) {
      return 1.0;
    }

    let spd = p.baseSpeed;
    const coinsLeft = totalCoins - coinsCollected;
    if (p.id === 'carmilla') {
      if (coinsLeft <= 10) spd *= 1.15; // Cruise Elroy 2
      else if (coinsLeft <= 20) spd *= 1.08; // Cruise Elroy 1
    }
    return spd;
  }

  function updatePursuerAI(p, dt) {
    if (p.houseState === 'IN_HOUSE') {
      updateHouseBobbing(p, dt);
      return;
    }
    if (p.houseState === 'LEAVING_HOUSE') {
      updateLeavingHouse(p, dt);
      return;
    }

    const curSpeed = getPursuerSpeed(p);
    let moveDist = curSpeed * 60 * dt;
    moveDist = Math.min(moveDist, TILE_SIZE * 0.45);

    // Tunnel wrap-around
    if (p.x < -TILE_SIZE / 2) {
      p.x = COLS * TILE_SIZE + TILE_SIZE / 2;
    } else if (p.x > COLS * TILE_SIZE + TILE_SIZE / 2) {
      p.x = -TILE_SIZE / 2;
    }

    // Discrete sub-pixel tile center navigation
    while (moveDist > 0.001) {
      const curCol = Math.floor(p.x / TILE_SIZE);
      const curRow = Math.floor(p.y / TILE_SIZE);
      const centerX = curCol * TILE_SIZE + TILE_SIZE / 2;
      const centerY = curRow * TILE_SIZE + TILE_SIZE / 2;

      let distToCenter = 0;
      if (p.dir === DIRS.RIGHT) distToCenter = centerX - p.x;
      else if (p.dir === DIRS.LEFT) distToCenter = p.x - centerX;
      else if (p.dir === DIRS.DOWN) distToCenter = centerY - p.y;
      else if (p.dir === DIRS.UP) distToCenter = p.y - centerY;

      if (distToCenter > 0 && distToCenter <= moveDist) {
        // Step exactly onto tile center
        p.x = centerX;
        p.y = centerY;
        moveDist -= distToCenter;

        // Check if returning eaten eyes reached crypt doorway
        if (p.state === 'EATEN' && (curCol === 13 || curCol === 14) && curRow === 11) {
          p.x = 13.5 * TILE_SIZE;
          p.y = 14 * TILE_SIZE + TILE_SIZE / 2;
          p.state = globalMode;
          p.houseState = 'LEAVING_HOUSE';
          break;
        }

        // Evaluate next turn at intersection center
        p.dir = getNextPursuerDir(p, curCol, curRow);
        p.lastTileCol = curCol;
        p.lastTileRow = curRow;
      } else {
        const step = (distToCenter > 0) ? Math.min(moveDist, distToCenter) : moveDist;
        p.x += p.dir.x * step;
        p.y += p.dir.y * step;

        if (p.dir === DIRS.LEFT || p.dir === DIRS.RIGHT) {
          p.y = centerY;
        } else if (p.dir === DIRS.UP || p.dir === DIRS.DOWN) {
          p.x = centerX;
        }
        moveDist -= step;
      }
    }
  }

  // --------------------------------------------------------------------------
  // Vampire Movement (Responsive Player Controls with Corner Buffering)
  // --------------------------------------------------------------------------
  function updateVampire(dt) {
    if (vampire.dir === DIRS.NONE && vampire.nextDir === DIRS.NONE) return;

    // Immediate 180 reversal
    if (vampire.nextDir !== DIRS.NONE && vampire.dir !== DIRS.NONE && vampire.nextDir.name === vampire.dir.opp) {
      vampire.dir = vampire.nextDir;
      vampire.nextDir = DIRS.NONE;
    }

    let moveDist = vampire.speed * 60 * dt;
    moveDist = Math.min(moveDist, TILE_SIZE * 0.45);

    // Tunnel wrap-around
    if (vampire.x < -TILE_SIZE / 2) {
      vampire.x = COLS * TILE_SIZE + TILE_SIZE / 2;
    } else if (vampire.x > COLS * TILE_SIZE + TILE_SIZE / 2) {
      vampire.x = -TILE_SIZE / 2;
    }

    while (moveDist > 0.001) {
      const curCol = Math.floor(vampire.x / TILE_SIZE);
      const curRow = Math.floor(vampire.y / TILE_SIZE);
      const centerX = curCol * TILE_SIZE + TILE_SIZE / 2;
      const centerY = curRow * TILE_SIZE + TILE_SIZE / 2;

      let distToCenter = 0;
      if (vampire.dir === DIRS.RIGHT) distToCenter = centerX - vampire.x;
      else if (vampire.dir === DIRS.LEFT) distToCenter = vampire.x - centerX;
      else if (vampire.dir === DIRS.DOWN) distToCenter = centerY - vampire.y;
      else if (vampire.dir === DIRS.UP) distToCenter = vampire.y - centerY;
      else distToCenter = 0;

      if (distToCenter > 0 && distToCenter <= moveDist) {
        vampire.x = centerX;
        vampire.y = centerY;
        moveDist -= distToCenter;

        // Try turn into queued nextDir
        if (vampire.nextDir !== DIRS.NONE) {
          const nc = curCol + vampire.nextDir.x;
          const nr = curRow + vampire.nextDir.y;
          if (isTilePassable(nc, nr, false)) {
            vampire.dir = vampire.nextDir;
            vampire.nextDir = DIRS.NONE;
          }
        }

        // Verify forward path is open
        const forwardC = curCol + vampire.dir.x;
        const forwardR = curRow + vampire.dir.y;
        if (!isTilePassable(forwardC, forwardR, false)) {
          vampire.dir = DIRS.NONE;
          break;
        }
      } else {
        // Corner buffering within 5px of tile center
        if (vampire.nextDir !== DIRS.NONE && vampire.dir !== DIRS.NONE) {
          const offX = Math.abs(vampire.x - centerX);
          const offY = Math.abs(vampire.y - centerY);
          if (offX <= 5 && offY <= 5) {
            const nc = curCol + vampire.nextDir.x;
            const nr = curRow + vampire.nextDir.y;
            if (isTilePassable(nc, nr, false)) {
              vampire.x = centerX;
              vampire.y = centerY;
              vampire.dir = vampire.nextDir;
              vampire.nextDir = DIRS.NONE;
              continue;
            }
          }
        }

        if (vampire.dir === DIRS.NONE) {
          if (vampire.nextDir !== DIRS.NONE) {
            const nc = curCol + vampire.nextDir.x;
            const nr = curRow + vampire.nextDir.y;
            if (isTilePassable(nc, nr, false)) {
              vampire.x = centerX;
              vampire.y = centerY;
              vampire.dir = vampire.nextDir;
              vampire.nextDir = DIRS.NONE;
              continue;
            }
          }
          break;
        }

        const step = (distToCenter > 0) ? Math.min(moveDist, distToCenter) : moveDist;
        vampire.x += vampire.dir.x * step;
        vampire.y += vampire.dir.y * step;

        if (vampire.dir === DIRS.LEFT || vampire.dir === DIRS.RIGHT) {
          vampire.y = centerY;
        } else if (vampire.dir === DIRS.UP || vampire.dir === DIRS.DOWN) {
          vampire.x = centerX;
        }
        moveDist -= step;

        vampire.animTimer += dt;
        if (vampire.animTimer > 0.08) {
          vampire.animFrame = (vampire.animFrame + 1) % 4;
          vampire.animTimer = 0;
        }
      }
    }
  }

  // --------------------------------------------------------------------------
  // Wave Schedule Updates
  // --------------------------------------------------------------------------
  function updateWaveTimers(dt) {
    if (frenzyTimer > 0) return; // Waves pause during Frenzy

    const schedule = (level === 1) ? WAVE_SCHEDULES[1] : (level < 5) ? WAVE_SCHEDULES[2] : WAVE_SCHEDULES[5];
    if (waveIndex >= schedule.length) return;

    waveTimer -= dt;
    if (waveTimer <= 0) {
      waveIndex++;
      if (waveIndex < schedule.length) {
        const nextPhase = schedule[waveIndex];
        const prevMode = globalMode;
        globalMode = nextPhase.mode;
        waveTimer = nextPhase.duration;

        // Wave change reverse event: all active maidens reverse direction
        if (globalMode !== prevMode) {
          pursuers.forEach(p => {
            if (p.houseState === 'OUTSIDE' && (p.state === 'CHASE' || p.state === 'SCATTER')) {
              p.state = globalMode;
              p.reverseDesired = true;
            }
          });
        }
      }
    }
  }

  // --------------------------------------------------------------------------
  // Update Loop & Collision Checks
  // --------------------------------------------------------------------------
  function update(dt) {
    if (isGameOver || isGameWon || isPaused) return;

    if (deathAnimationTimer > 0) {
      deathAnimationTimer -= dt;
      if (deathAnimationTimer <= 0) {
        lives--;
        updateHUD();
        if (lives <= 0) {
          isGameOver = true;
          playSound('death');
        } else {
          vampire.reset();
          pursuers.forEach(p => p.reset());
          waveIndex = 0;
          waveTimer = 7.0;
          globalMode = 'SCATTER';
        }
      }
      return;
    }

    if (levelClearTimer > 0) {
      levelClearTimer -= dt;
      if (levelClearTimer <= 0) {
        level++;
        vampire.speed = Math.min(2.7, 2.15 + level * 0.05);
        pursuers.forEach(p => {
          p.baseSpeed = Math.min(2.5, 1.95 + level * 0.05);
        });
        resetMap();
        vampire.reset();
        waveIndex = 0;
        waveTimer = (level < 5) ? 7.0 : 5.0;
        globalMode = 'SCATTER';
        pursuers.forEach(p => p.reset());
        updateHUD();
        playSound('start');
      }
      return;
    }

    // 1. Advance Wave Schedule
    updateWaveTimers(dt);

    // 2. Update Blood Frenzy Timer
    if (frenzyTimer > 0) {
      frenzyTimer -= dt;
      if (frenzyTimer <= 0) {
        frenzyTimer = 0;
        pursuers.forEach(p => {
          if (p.state === 'FRIGHTENED') p.state = globalMode;
        });
        updateFrenzyUI(false);
      }
    }

    // 3. Update Relic Spawn & Timer
    if (!relicSpawned1 && coinsCollected >= RELIC_SPAWN_1) {
      spawnRelic();
      relicSpawned1 = true;
    } else if (!relicSpawned2 && coinsCollected >= RELIC_SPAWN_2) {
      spawnRelic();
      relicSpawned2 = true;
    }

    if (activeRelic) {
      relicTimer -= dt;
      if (relicTimer <= 0) {
        activeRelic = null;
      }
    }

    // 4. Update Vampire Position
    updateVampire(dt);

    // 5. Collect Coins & Blood Packets
    const col = Math.floor(vampire.x / TILE_SIZE);
    const row = Math.floor(vampire.y / TILE_SIZE);
    if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
      const tile = maze[row][col];
      if (tile === 2) {
        // Ancient Coin
        maze[row][col] = 0;
        coinsCollected++;
        score += 10;
        playSound('coin');
        checkHighScore();
        updateHUD();
      } else if (tile === 3) {
        // Blood Packet
        maze[row][col] = 0;
        coinsCollected++;
        score += 50;
        playSound('blood');
        frenzyTimer = Math.max(3.0, 9.0 - (level - 1) * 1.0);
        womenCharmedChain = 0;
        pursuers.forEach(p => {
          if (p.houseState === 'OUTSIDE' && p.state !== 'EATEN') {
            p.state = 'FRIGHTENED';
            p.reverseDesired = true;
          }
        });
        updateFrenzyUI(true);
        checkHighScore();
        updateHUD();
      }

      if (coinsCollected >= totalCoins && levelClearTimer <= 0) {
        levelClearTimer = 2.2;
        playSound('levelclear');
      }
    }

    // 6. Check Relic Collection
    if (activeRelic) {
      const rX = 13.5 * TILE_SIZE;
      const rY = 17 * TILE_SIZE + TILE_SIZE / 2;
      if (Math.abs(vampire.x - rX) < 14 && Math.abs(vampire.y - rY) < 14) {
        score += activeRelic.pts;
        playSound('relic');
        addScorePopup(`+${activeRelic.pts}`, rX, rY, '#ffd166');
        activeRelic = null;
        checkHighScore();
        updateHUD();
      }
    }

    // 7. Update Pursuers & Check Collisions
    pursuers.forEach(p => {
      updatePursuerAI(p, dt);

      // Collision check with Vampire
      const dist = Math.sqrt(getDistanceSq(vampire.x, vampire.y, p.x, p.y));
      if (dist < 13) {
        if (p.state === 'FRIGHTENED') {
          // Vampire charms the maiden!
          p.state = 'EATEN';
          womenCharmedChain++;
          const pts = 200 * Math.pow(2, womenCharmedChain - 1);
          score += pts;
          playSound('charm');
          addScorePopup(`+${pts}`, p.x, p.y, '#f43f5e');
          checkHighScore();
          updateHUD();
        } else if (p.state === 'CHASE' || p.state === 'SCATTER') {
          if (p.houseState === 'OUTSIDE') {
            deathAnimationTimer = 1.8;
            playSound('death');
          }
        }
      }
    });

    // 8. Update Floating Score Popups
    scorePopups = scorePopups.filter(pop => {
      pop.y -= 18 * dt;
      pop.alpha -= dt * 0.8;
      return pop.alpha > 0;
    });
  }

  function spawnRelic() {
    const relicIndex = Math.min(level - 1, RELICS.length - 1);
    activeRelic = RELICS[relicIndex];
    relicTimer = 10.0;
  }

  function addScorePopup(text, x, y, color) {
    scorePopups.push({ text, x, y, color, alpha: 1.0 });
  }

  function checkHighScore() {
    if (score > highScore) {
      highScore = score;
      try {
        localStorage.setItem('bloodbyte_high_score', highScore);
      } catch (e) {}
    }
  }

  function updateFrenzyUI(isActive) {
    const box = document.getElementById('bloodbyte-cabinet');
    if (box) {
      if (isActive) box.classList.add('frenzy-active');
      else box.classList.remove('frenzy-active');
    }
  }

  // --------------------------------------------------------------------------
  // Rendering System
  // --------------------------------------------------------------------------
  function render() {
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#0a040e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Maze Tiles
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const tile = maze[r][c];
        const x = c * TILE_SIZE;
        const y = r * TILE_SIZE;

        if (tile === 1) {
          // Crypt Stone Walls
          ctx.fillStyle = '#1e112a';
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          ctx.strokeStyle = '#6b21a8';
          ctx.lineWidth = 1;
          ctx.strokeRect(x + 1, y + 1, TILE_SIZE - 2, TILE_SIZE - 2);
        } else if (tile === 2) {
          // Ancient Gold Coin
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (tile === 3) {
          // Blood Packet (Pulsating)
          const pulse = Math.sin(Date.now() / 150) * 1.5;
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, 6 + pulse, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(x + TILE_SIZE / 2 - 2, y + TILE_SIZE / 2 - 2, 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (tile === 4) {
          // Crypt Iron Gate
          ctx.strokeStyle = '#ec4899';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x, y + TILE_SIZE / 2);
          ctx.lineTo(x + TILE_SIZE, y + TILE_SIZE / 2);
          ctx.stroke();
        }
      }
    }

    // 2. Draw Active Gothic Relic
    if (activeRelic) {
      const rx = 13.5 * TILE_SIZE;
      const ry = 17 * TILE_SIZE + TILE_SIZE / 2;
      ctx.font = '16px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(activeRelic.icon, rx, ry);
    }

    // 3. Draw Vampire (Player)
    if (deathAnimationTimer > 0) {
      drawBatScatter(vampire.x, vampire.y, 1 - deathAnimationTimer / 1.8);
    } else {
      drawVampire(vampire.x, vampire.y, vampire.dir, vampire.animFrame, frenzyTimer > 0);
    }

    // 4. Draw Pursuers
    pursuers.forEach(p => {
      drawPursuer(p);
    });

    // 5. Draw Floating Score Popups
    scorePopups.forEach(pop => {
      ctx.save();
      ctx.globalAlpha = pop.alpha;
      ctx.fillStyle = pop.color;
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(pop.text, pop.x, pop.y);
      ctx.restore();
    });

    // 6. Overlay Banners
    if (isGameOver) {
      drawBanner('GAME OVER', 'The Count has fallen. Press Restart to rise again.', '#ef4444');
    } else if (isPaused) {
      drawBanner('PAUSED', 'Press Space or Pause to resume', '#38bdf8');
    } else if (levelClearTimer > 0) {
      drawBanner('MAZE CLEARED!', `Advancing to Level ${level + 1}...`, '#10b981');
    }
  }

  // --------------------------------------------------------------------------
  // Vector Sprite Drawing Functions
  // --------------------------------------------------------------------------
  function drawVampire(x, y, dir, frame, isFrenzy) {
    ctx.save();
    ctx.translate(x, y);

    const r = TILE_SIZE / 2;

    if (isFrenzy) {
      ctx.beginPath();
      ctx.arc(0, 0, r + 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
      ctx.fill();
    }

    // Flowing Cape
    const capeOffset = Math.sin(frame * Math.PI / 2) * 2;
    ctx.fillStyle = '#0f051d';
    ctx.beginPath();
    ctx.moveTo(-7, -4);
    ctx.lineTo(7, -4);
    ctx.lineTo(9 + capeOffset, 8);
    ctx.lineTo(-9 - capeOffset, 8);
    ctx.closePath();
    ctx.fill();

    // Red Cape Lining
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.moveTo(-5, -3);
    ctx.lineTo(5, -3);
    ctx.lineTo(7, 7);
    ctx.lineTo(-7, 7);
    ctx.closePath();
    ctx.fill();

    // Head / Face
    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    ctx.arc(0, -2, 6, 0, Math.PI * 2);
    ctx.fill();

    // Widow's Peak Hair
    ctx.fillStyle = '#09090b';
    ctx.beginPath();
    ctx.arc(0, -4, 6, Math.PI, 0, false);
    ctx.lineTo(0, -3);
    ctx.closePath();
    ctx.fill();

    // Crimson Eyes
    ctx.fillStyle = isFrenzy ? '#ff0033' : '#ef4444';
    let eyeX = 0;
    let eyeY = 0;
    if (dir === DIRS.LEFT)  { eyeX = -2; }
    if (dir === DIRS.RIGHT) { eyeX = 2; }
    if (dir === DIRS.UP)    { eyeY = -2; }
    if (dir === DIRS.DOWN)  { eyeY = 1; }

    ctx.fillRect(-3 + eyeX, -3 + eyeY, 2, 2);
    ctx.fillRect(1 + eyeX, -3 + eyeY, 2, 2);

    // Fangs
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-2, 1, 1, 2);
    ctx.fillRect(1, 1, 1, 2);

    ctx.restore();
  }

  function drawPursuer(p) {
    ctx.save();
    ctx.translate(p.x, p.y);

    if (p.state === 'EATEN') {
      // Ethereal Mist Eyes
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-3, -1, 3, 0, Math.PI * 2);
      ctx.arc(3, -1, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-4 + p.dir.x * 2, -2 + p.dir.y * 2, 2, 2);
      ctx.fillRect(2 + p.dir.x * 2, -2 + p.dir.y * 2, 2, 2);
      ctx.restore();
      return;
    }

    const isFrightened = (p.state === 'FRIGHTENED');
    let dressColor = p.color;

    if (isFrightened) {
      if (frenzyTimer < 2.5 && Math.floor(frenzyTimer * 8) % 2 === 0) {
        dressColor = '#f8fafc'; // Flashing white
      } else {
        dressColor = '#38bdf8'; // Mesmerized azure
      }
    }

    // Victorian Gown
    ctx.fillStyle = dressColor;
    ctx.beginPath();
    ctx.moveTo(-6, -2);
    ctx.lineTo(6, -2);
    ctx.lineTo(8, 7);
    ctx.lineTo(4, 5);
    ctx.lineTo(0, 7);
    ctx.lineTo(-4, 5);
    ctx.lineTo(-8, 7);
    ctx.closePath();
    ctx.fill();

    // Head
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(0, -4, 5, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = (p.id === 'carmilla') ? '#18181b' : (p.id === 'mina') ? '#451a03' : (p.id === 'lucy') ? '#fde047' : '#9a3412';
    ctx.beginPath();
    ctx.arc(0, -6, 5.5, Math.PI, 0, false);
    ctx.fill();

    // Eyes
    if (isFrightened) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-3, -4, 2, 2);
      ctx.fillRect(1, -4, 2, 2);
    } else {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-3 + p.dir.x, -5 + p.dir.y, 2, 2);
      ctx.fillRect(1 + p.dir.x, -5 + p.dir.y, 2, 2);
    }

    ctx.restore();
  }

  function drawBatScatter(x, y, progress) {
    ctx.save();
    ctx.translate(x, y);

    const batCount = 8;
    for (let i = 0; i < batCount; i++) {
      const angle = (i / batCount) * Math.PI * 2;
      const dist = progress * 40;
      const bx = Math.cos(angle) * dist;
      const by = Math.sin(angle) * dist - progress * 15;

      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.arc(bx, by, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(bx - 6, by - 4);
      ctx.lineTo(bx, by + 1);
      ctx.lineTo(bx + 6, by - 4);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  function drawBanner(title, subtitle, color) {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    ctx.save();
    ctx.fillStyle = 'rgba(10, 4, 14, 0.88)';
    ctx.fillRect(40, cy - 45, canvas.width - 80, 90);

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(40, cy - 45, canvas.width - 80, 90);

    ctx.fillStyle = color;
    ctx.font = 'bold 22px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, cx, cy - 10);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '13px "DM Sans", sans-serif';
    ctx.fillText(subtitle, cx, cy + 18);
    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // HUD Status Display
  // --------------------------------------------------------------------------
  function updateHUD() {
    const scoreEl = document.getElementById('bb-score');
    const highEl = document.getElementById('bb-high');
    const livesEl = document.getElementById('bb-lives');
    const levelEl = document.getElementById('bb-level');
    const relicsEl = document.getElementById('bb-relics');

    if (scoreEl) scoreEl.textContent = score;
    if (highEl) highEl.textContent = highScore;
    if (levelEl) levelEl.textContent = level;
    if (livesEl) {
      livesEl.textContent = '🦇 '.repeat(Math.max(0, lives));
    }
    if (relicsEl) {
      const shown = RELICS.slice(0, Math.min(level, RELICS.length)).map(r => r.icon).join(' ');
      relicsEl.textContent = shown;
    }
  }

  // --------------------------------------------------------------------------
  // Main Game Loop
  // --------------------------------------------------------------------------
  let lastTime = 0;
  function gameLoop(time) {
    if (!lastTime) lastTime = time;
    const dt = Math.min(0.1, (time - lastTime) / 1000);
    lastTime = time;

    update(dt);
    render();

    requestAnimationFrame(gameLoop);
  }

  // --------------------------------------------------------------------------
  // Initialization & Controls
  // --------------------------------------------------------------------------
  function startNewGame() {
    score = 0;
    lives = 3;
    level = 1;
    isGameOver = false;
    isGameWon = false;
    isPaused = false;
    frenzyTimer = 0;
    deathAnimationTimer = 0;
    levelClearTimer = 0;

    waveIndex = 0;
    waveTimer = 7.0;
    globalMode = 'SCATTER';

    resetMap();
    vampire.reset();
    pursuers = PURSUERS_CONFIG.map(c => createPursuer(c));
    updateHUD();
    updateFrenzyUI(false);
    playSound('start');
  }

  function handleDirectionInput(dir) {
    initAudio();
    if (isGameOver) {
      startNewGame();
      return;
    }
    if (isPaused) {
      isPaused = false;
      return;
    }
    vampire.nextDir = dir;
  }

  document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('bloodbyte-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    try {
      const savedHigh = localStorage.getItem('bloodbyte_high_score');
      if (savedHigh) highScore = parseInt(savedHigh, 10) || 0;
    } catch (e) {}

    // Keyboard bindings
    window.addEventListener('keydown', e => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          handleDirectionInput(DIRS.UP);
          e.preventDefault();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          handleDirectionInput(DIRS.DOWN);
          e.preventDefault();
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          handleDirectionInput(DIRS.LEFT);
          e.preventDefault();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          handleDirectionInput(DIRS.RIGHT);
          e.preventDefault();
          break;
        case ' ':
          isPaused = !isPaused;
          e.preventDefault();
          break;
      }
    });

    // Mobile Virtual Touch D-pad
    const dpadMap = {
      'btn-bb-up': DIRS.UP,
      'btn-bb-down': DIRS.DOWN,
      'btn-bb-left': DIRS.LEFT,
      'btn-bb-right': DIRS.RIGHT
    };
    Object.keys(dpadMap).forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', e => {
          e.preventDefault();
          handleDirectionInput(dpadMap[id]);
        });
        btn.addEventListener('touchstart', e => {
          e.preventDefault();
          handleDirectionInput(dpadMap[id]);
        }, { passive: false });
      }
    });

    // Touch Swipe on Canvas
    let touchStartX = 0;
    let touchStartY = 0;
    canvas.addEventListener('touchstart', e => {
      initAudio();
      const t = e.touches[0];
      touchStartX = t.clientX;
      touchStartY = t.clientY;
    }, { passive: true });

    canvas.addEventListener('touchend', e => {
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStartX;
      const dy = t.clientY - touchStartY;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (Math.max(absDx, absDy) > 20) {
        if (absDx > absDy) {
          handleDirectionInput(dx > 0 ? DIRS.RIGHT : DIRS.LEFT);
        } else {
          handleDirectionInput(dy > 0 ? DIRS.DOWN : DIRS.UP);
        }
      }
    }, { passive: true });

    // Header buttons
    const btnNew = document.getElementById('btn-bb-restart');
    const btnSound = document.getElementById('btn-bb-sound');
    const btnPause = document.getElementById('btn-bb-pause');

    if (btnNew) {
      btnNew.addEventListener('click', () => startNewGame());
    }

    if (btnSound) {
      btnSound.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        btnSound.textContent = soundEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF';
        btnSound.classList.toggle('active', soundEnabled);
        if (soundEnabled) playTone(440, 0.1);
      });
    }

    if (btnPause) {
      btnPause.addEventListener('click', () => {
        isPaused = !isPaused;
        btnPause.textContent = isPaused ? '▶️ Resume' : '⏸️ Pause';
      });
    }

    startNewGame();
    requestAnimationFrame(gameLoop);
  });
})();
