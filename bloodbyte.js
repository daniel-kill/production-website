/**
 * BloodByte — Gothic Vampire Arcade Maze Runner
 * Embedded Web Terminal Engine for danielkill.online
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
  // 5: Crypt Interior (Ghost House)
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
    NONE:  { x: 0,  y: 0,  name: 'NONE' },
    UP:    { x: 0,  y: -1, name: 'UP',    opp: 'DOWN' },
    DOWN:  { x: 0,  y: 1,  name: 'DOWN',  opp: 'UP' },
    LEFT:  { x: -1, y: 0,  name: 'LEFT',  opp: 'RIGHT' },
    RIGHT: { x: 1,  y: 0,  name: 'RIGHT', opp: 'LEFT' }
  };

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
    } catch (e) {
      // Audio policy safe
    }
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
        playTone(coinAlternator ? 880 : 1100, 0.04, 'square', 0.04);
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
  const FRENZY_DURATION = 9.0;
  let womenCharmedChain = 0;

  // Active Relic State
  let activeRelic = null;
  let relicTimer = 0;
  const RELIC_SPAWN_1 = 70;
  const RELIC_SPAWN_2 = 170;
  let relicSpawned1 = false;
  let relicSpawned2 = false;

  let scorePopups = [];
  let deathAnimationTimer = 0;
  let levelClearTimer = 0;

  // --------------------------------------------------------------------------
  // Player & Pursuers
  // --------------------------------------------------------------------------
  const vampire = {
    x: 0,
    y: 0,
    dir: DIRS.NONE,
    nextDir: DIRS.NONE,
    speed: 2.4,
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

  const PURSUERS_CONFIG = [
    {
      id: 'carmilla',
      name: 'Carmilla',
      color: '#ef4444',
      homeX: 25 * TILE_SIZE,
      homeY: 0,
      startX: 13.5 * TILE_SIZE,
      startY: 11 * TILE_SIZE + TILE_SIZE / 2,
      initialInHouse: false
    },
    {
      id: 'mina',
      name: 'Mina',
      color: '#f472b6',
      homeX: 2 * TILE_SIZE,
      homeY: 0,
      startX: 13.5 * TILE_SIZE,
      startY: 14 * TILE_SIZE + TILE_SIZE / 2,
      initialInHouse: true
    },
    {
      id: 'lucy',
      name: 'Lucy',
      color: '#22d3ee',
      homeX: 27 * TILE_SIZE,
      homeY: 31 * TILE_SIZE,
      startX: 12 * TILE_SIZE,
      startY: 14 * TILE_SIZE + TILE_SIZE / 2,
      initialInHouse: true
    },
    {
      id: 'lenore',
      name: 'Lenore',
      color: '#fbbf24',
      homeX: 0,
      homeY: 31 * TILE_SIZE,
      startX: 15 * TILE_SIZE,
      startY: 14 * TILE_SIZE + TILE_SIZE / 2,
      initialInHouse: true
    }
  ];

  let pursuers = [];

  function createPursuer(config) {
    return {
      id: config.id,
      name: config.name,
      color: config.color,
      x: config.startX,
      y: config.startY,
      startX: config.startX,
      startY: config.startY,
      homeX: config.homeX,
      homeY: config.homeY,
      dir: DIRS.UP,
      speed: 2.1,
      state: config.initialInHouse ? 'IN_HOUSE' : 'CHASE',
      houseTimer: config.id === 'carmilla' ? 0 : config.id === 'mina' ? 2.5 : config.id === 'lucy' ? 5.0 : 8.0,
      animTimer: 0,

      reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.dir = DIRS.UP;
        this.state = config.initialInHouse ? 'IN_HOUSE' : 'CHASE';
        this.houseTimer = config.id === 'carmilla' ? 0 : config.id === 'mina' ? 2.5 : config.id === 'lucy' ? 5.0 : 8.0;
        this.animTimer = 0;
      }
    };
  }

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

  function isWall(col, row, isPursuer = false, isEaten = false) {
    if (row < 0 || row >= ROWS) return true;
    if (col < 0 || col >= COLS) {
      if (row === 14) return false;
      return true;
    }
    const tile = maze[row][col];
    if (tile === 1) return true;
    if (tile === 4) {
      if (isEaten) return false;
      if (isPursuer) return false;
      return true;
    }
    if (tile === 5 && !isPursuer) return true;
    return false;
  }

  function canMoveInDir(x, y, dir, isPursuer = false, isEaten = false) {
    const nextX = x + dir.x * 2;
    const nextY = y + dir.y * 2;

    const r = TILE_SIZE / 2 - 2;
    const points = [
      { x: nextX - r, y: nextY - r },
      { x: nextX + r, y: nextY - r },
      { x: nextX - r, y: nextY + r },
      { x: nextX + r, y: nextY + r }
    ];

    for (let p of points) {
      let col = Math.floor(p.x / TILE_SIZE);
      let row = Math.floor(p.y / TILE_SIZE);
      if (isWall(col, row, isPursuer, isEaten)) {
        return false;
      }
    }
    return true;
  }

  function isAtIntersection(x, y) {
    const modX = x % TILE_SIZE;
    const modY = y % TILE_SIZE;
    return Math.abs(modX - TILE_SIZE / 2) < 2.5 && Math.abs(modY - TILE_SIZE / 2) < 2.5;
  }

  function centerOnTile(entity) {
    const col = Math.floor(entity.x / TILE_SIZE);
    const row = Math.floor(entity.y / TILE_SIZE);
    entity.x = col * TILE_SIZE + TILE_SIZE / 2;
    entity.y = row * TILE_SIZE + TILE_SIZE / 2;
  }

  function getDistanceSq(x1, y1, x2, y2) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return dx * dx + dy * dy;
  }

  function getPursuerTarget(p) {
    if (p.state === 'EATEN') {
      return { x: 13.5 * TILE_SIZE, y: 12 * TILE_SIZE };
    }
    if (p.state === 'SCATTER') {
      return { x: p.homeX, y: p.homeY };
    }
    if (p.state === 'FRIGHTENED') {
      return null;
    }

    const vX = vampire.x;
    const vY = vampire.y;
    const vDir = vampire.dir;

    if (p.id === 'carmilla') {
      return { x: vX, y: vY };
    } else if (p.id === 'mina') {
      return {
        x: vX + vDir.x * 4 * TILE_SIZE,
        y: vY + vDir.y * 4 * TILE_SIZE
      };
    } else if (p.id === 'lucy') {
      const carmilla = pursuers.find(g => g.id === 'carmilla') || p;
      const pivotX = vX + vDir.x * 2 * TILE_SIZE;
      const pivotY = vY + vDir.y * 2 * TILE_SIZE;
      return {
        x: pivotX + (pivotX - carmilla.x),
        y: pivotY + (pivotY - carmilla.y)
      };
    } else if (p.id === 'lenore') {
      const dist = Math.sqrt(getDistanceSq(p.x, p.y, vX, vY));
      if (dist > 8 * TILE_SIZE) {
        return { x: vX, y: vY };
      } else {
        return { x: p.homeX, y: p.homeY };
      }
    }
    return { x: vX, y: vY };
  }

  function updatePursuerAI(p, dt) {
    if (p.state === 'IN_HOUSE') {
      p.houseTimer -= dt;
      p.y += (p.dir === DIRS.UP ? -1 : 1) * p.speed * 0.4;
      if (p.y < 13.5 * TILE_SIZE) p.dir = DIRS.DOWN;
      if (p.y > 15 * TILE_SIZE) p.dir = DIRS.UP;

      if (p.houseTimer <= 0) {
        if (Math.abs(p.x - 13.5 * TILE_SIZE) > 2) {
          p.x += (p.x < 13.5 * TILE_SIZE ? 1 : -1) * p.speed;
        } else {
          p.x = 13.5 * TILE_SIZE;
          p.y -= p.speed;
          if (p.y <= 11 * TILE_SIZE + TILE_SIZE / 2) {
            p.state = frenzyTimer > 0 ? 'FRIGHTENED' : 'CHASE';
            p.dir = DIRS.LEFT;
          }
        }
      }
      return;
    }

    if (p.state === 'EATEN') {
      if (Math.abs(p.x - 13.5 * TILE_SIZE) < 6 && Math.abs(p.y - 14 * TILE_SIZE) < 6) {
        p.state = 'IN_HOUSE';
        p.houseTimer = 1.5;
        p.dir = DIRS.UP;
        return;
      }
    }

    if (p.x < -TILE_SIZE / 2) p.x = COLS * TILE_SIZE;
    if (p.x > COLS * TILE_SIZE + TILE_SIZE / 2) p.x = -TILE_SIZE / 2;

    let curSpeed = p.speed;
    if (p.state === 'EATEN') {
      curSpeed = p.speed * 2.2;
    } else if (p.state === 'FRIGHTENED') {
      curSpeed = p.speed * 0.55;
    } else {
      const col = Math.floor(p.x / TILE_SIZE);
      const row = Math.floor(p.y / TILE_SIZE);
      if (row === 14 && (col <= 5 || col >= 22)) {
        curSpeed = p.speed * 0.5;
      }
    }

    if (isAtIntersection(p.x, p.y)) {
      centerOnTile(p);

      const possibleDirs = [DIRS.UP, DIRS.DOWN, DIRS.LEFT, DIRS.RIGHT].filter(d => {
        if (d.name === p.dir.opp) return false;
        return canMoveInDir(p.x, p.y, d, true, p.state === 'EATEN');
      });

      if (possibleDirs.length > 0) {
        if (p.state === 'FRIGHTENED') {
          p.dir = possibleDirs[Math.floor(Math.random() * possibleDirs.length)];
        } else {
          const target = getPursuerTarget(p);
          let bestDir = possibleDirs[0];
          let bestDist = Infinity;

          possibleDirs.forEach(d => {
            const testX = p.x + d.x * TILE_SIZE;
            const testY = p.y + d.y * TILE_SIZE;
            const dist = getDistanceSq(testX, testY, target.x, target.y);
            if (dist < bestDist) {
              bestDist = dist;
              bestDir = d;
            }
          });
          p.dir = bestDir;
        }
      }
    }

    p.x += p.dir.x * curSpeed;
    p.y += p.dir.y * curSpeed;
  }

  // --------------------------------------------------------------------------
  // Game Loop Update
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
        }
      }
      return;
    }

    if (levelClearTimer > 0) {
      levelClearTimer -= dt;
      if (levelClearTimer <= 0) {
        level++;
        vampire.speed = Math.min(3.2, 2.4 + level * 0.1);
        pursuers.forEach(p => {
          p.speed = Math.min(3.0, 2.1 + level * 0.1);
        });
        resetMap();
        vampire.reset();
        pursuers.forEach(p => p.reset());
        updateHUD();
        playSound('start');
      }
      return;
    }

    if (frenzyTimer > 0) {
      frenzyTimer -= dt;
      if (frenzyTimer <= 0) {
        frenzyTimer = 0;
        pursuers.forEach(p => {
          if (p.state === 'FRIGHTENED') p.state = 'CHASE';
        });
        updateFrenzyUI(false);
      }
    }

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

    if (vampire.nextDir !== DIRS.NONE) {
      if (isAtIntersection(vampire.x, vampire.y)) {
        if (canMoveInDir(vampire.x, vampire.y, vampire.nextDir)) {
          centerOnTile(vampire);
          vampire.dir = vampire.nextDir;
          vampire.nextDir = DIRS.NONE;
        }
      } else if (vampire.nextDir.name === vampire.dir.opp) {
        vampire.dir = vampire.nextDir;
        vampire.nextDir = DIRS.NONE;
      }
    }

    if (vampire.dir !== DIRS.NONE) {
      if (canMoveInDir(vampire.x, vampire.y, vampire.dir)) {
        vampire.x += vampire.dir.x * vampire.speed;
        vampire.y += vampire.dir.y * vampire.speed;
        vampire.animTimer += dt;
        if (vampire.animTimer > 0.08) {
          vampire.animFrame = (vampire.animFrame + 1) % 4;
          vampire.animTimer = 0;
        }
      } else {
        centerOnTile(vampire);
      }
    }

    if (vampire.x < -TILE_SIZE / 2) vampire.x = COLS * TILE_SIZE;
    if (vampire.x > COLS * TILE_SIZE + TILE_SIZE / 2) vampire.x = -TILE_SIZE / 2;

    const col = Math.floor(vampire.x / TILE_SIZE);
    const row = Math.floor(vampire.y / TILE_SIZE);
    if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
      const tile = maze[row][col];
      if (tile === 2) {
        maze[row][col] = 0;
        coinsCollected++;
        score += 10;
        playSound('coin');
        checkHighScore();
        updateHUD();
      } else if (tile === 3) {
        maze[row][col] = 0;
        coinsCollected++;
        score += 50;
        playSound('blood');
        frenzyTimer = FRENZY_DURATION;
        womenCharmedChain = 0;
        pursuers.forEach(p => {
          if (p.state !== 'EATEN' && p.state !== 'IN_HOUSE') {
            p.state = 'FRIGHTENED';
            p.dir = { x: -p.dir.x, y: -p.dir.y, name: p.dir.opp, opp: p.dir.name };
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

    pursuers.forEach(p => {
      updatePursuerAI(p, dt);

      const dist = Math.sqrt(getDistanceSq(vampire.x, vampire.y, p.x, p.y));
      if (dist < 13) {
        if (p.state === 'FRIGHTENED') {
          p.state = 'EATEN';
          womenCharmedChain++;
          const pts = 200 * Math.pow(2, womenCharmedChain - 1);
          score += pts;
          playSound('charm');
          addScorePopup(`+${pts}`, p.x, p.y, '#f43f5e');
          checkHighScore();
          updateHUD();
        } else if (p.state === 'CHASE' || p.state === 'SCATTER') {
          deathAnimationTimer = 1.8;
          playSound('death');
        }
      }
    });

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
  // Canvas Rendering
  // --------------------------------------------------------------------------
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const tile = maze[r][c];
        const x = c * TILE_SIZE;
        const y = r * TILE_SIZE;

        if (tile === 1) {
          ctx.fillStyle = '#1e112a';
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

          ctx.strokeStyle = '#4c1d95';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x + 1, y + 1, TILE_SIZE - 2, TILE_SIZE - 2);

          ctx.fillStyle = '#2e1065';
          ctx.fillRect(x + 3, y + 3, TILE_SIZE - 6, TILE_SIZE - 6);
        } else if (tile === 4) {
          ctx.fillStyle = '#e11d48';
          ctx.fillRect(x, y + 7, TILE_SIZE, 6);
        } else if (tile === 2) {
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, 3, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(x + TILE_SIZE / 2 - 1, y + TILE_SIZE / 2 - 1, 1, 0, Math.PI * 2);
          ctx.fill();
        } else if (tile === 3) {
          const pulse = 1 + Math.sin(Date.now() * 0.008) * 0.15;
          const cx = x + TILE_SIZE / 2;
          const cy = y + TILE_SIZE / 2;

          ctx.save();
          ctx.translate(cx, cy);
          ctx.scale(pulse, pulse);

          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.arc(0, 0, 6.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#fca5a5';
          ctx.beginPath();
          ctx.arc(-2, -2, 2, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }
      }
    }

    if (activeRelic) {
      const rx = 13.5 * TILE_SIZE;
      const ry = 17 * TILE_SIZE + TILE_SIZE / 2;
      ctx.font = '16px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(activeRelic.icon, rx, ry);
    }

    if (deathAnimationTimer > 0) {
      drawBatScatter(vampire.x, vampire.y, 1 - deathAnimationTimer / 1.8);
    } else {
      drawVampire(vampire.x, vampire.y, vampire.dir, vampire.animFrame, frenzyTimer > 0);
    }

    pursuers.forEach(p => {
      drawPursuer(p);
    });

    scorePopups.forEach(pop => {
      ctx.save();
      ctx.globalAlpha = pop.alpha;
      ctx.fillStyle = pop.color;
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(pop.text, pop.x, pop.y);
      ctx.restore();
    });

    if (isGameOver) {
      drawBanner('GAME OVER', 'The Count has fallen. Press Restart to rise again.', '#ef4444');
    } else if (isPaused) {
      drawBanner('PAUSED', 'Press Space or Pause to resume', '#38bdf8');
    } else if (levelClearTimer > 0) {
      drawBanner('MAZE CLEARED!', `Advancing to Level ${level + 1}...`, '#10b981');
    }
  }

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

    const capeOffset = Math.sin(frame * Math.PI / 2) * 2;
    ctx.fillStyle = '#0f051d';
    ctx.beginPath();
    ctx.moveTo(-7, -4);
    ctx.lineTo(7, -4);
    ctx.lineTo(9 + capeOffset, 8);
    ctx.lineTo(-9 - capeOffset, 8);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.moveTo(-5, -3);
    ctx.lineTo(5, -3);
    ctx.lineTo(7, 7);
    ctx.lineTo(-7, 7);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    ctx.arc(0, -2, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#09090b';
    ctx.beginPath();
    ctx.arc(0, -4, 6, Math.PI, 0, false);
    ctx.lineTo(0, -3);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = isFrenzy ? '#ff0033' : '#ef4444';
    let eyeX = 0;
    let eyeY = 0;
    if (dir === DIRS.LEFT)  { eyeX = -2; }
    if (dir === DIRS.RIGHT) { eyeX = 2; }
    if (dir === DIRS.UP)    { eyeY = -2; }
    if (dir === DIRS.DOWN)  { eyeY = 1; }

    ctx.fillRect(-3 + eyeX, -3 + eyeY, 2, 2);
    ctx.fillRect(1 + eyeX, -3 + eyeY, 2, 2);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-2, 1, 1, 2);
    ctx.fillRect(1, 1, 1, 2);

    ctx.restore();
  }

  function drawPursuer(p) {
    ctx.save();
    ctx.translate(p.x, p.y);

    if (p.state === 'EATEN') {
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

    const isFrightened = p.state === 'FRIGHTENED';
    let dressColor = p.color;

    if (isFrightened) {
      if (frenzyTimer < 2.5 && Math.floor(frenzyTimer * 8) % 2 === 0) {
        dressColor = '#f8fafc';
      } else {
        dressColor = '#38bdf8';
      }
    }

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

    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(0, -4, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = p.id === 'carmilla' ? '#18181b' : p.id === 'mina' ? '#451a03' : p.id === 'lucy' ? '#fde047' : '#9a3412';
    ctx.beginPath();
    ctx.arc(0, -6, 5.5, Math.PI, 0, false);
    ctx.fill();

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

  let lastTime = 0;
  function gameLoop(time) {
    if (!lastTime) lastTime = time;
    const dt = Math.min(0.1, (time - lastTime) / 1000);
    lastTime = time;

    update(dt);
    render();

    requestAnimationFrame(gameLoop);
  }

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
