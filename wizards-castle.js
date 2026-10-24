/**
 * The Wizard's Castle (1980 Classic RPG) — Web Terminal Edition
 * Original: Copyright (C) 1980 by Joseph R. Power
 * PowerShell Version: Daniel Kill
 * Web Port for danielkill.online
 */

(function () {
  'use strict';

  // Audio synthesizer for retro PC speaker sound effects
  class RetroAudio {
    constructor() {
      this.ctx = null;
      this.muted = true;
    }

    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    beep(freq = 440, type = 'square', duration = 0.08, volume = 0.05) {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // Audio error ignored
      }
    }

    step() { this.beep(320, 'square', 0.04, 0.03); }
    bump() { this.beep(120, 'sawtooth', 0.1, 0.06); }
    gold() { 
      this.beep(587, 'triangle', 0.06, 0.05);
      setTimeout(() => this.beep(880, 'triangle', 0.12, 0.05), 60);
    }
    combatHit() { this.beep(160, 'sawtooth', 0.1, 0.08); }
    spell() {
      this.beep(400, 'sine', 0.05, 0.04);
      setTimeout(() => this.beep(600, 'sine', 0.05, 0.04), 50);
      setTimeout(() => this.beep(900, 'sine', 0.1, 0.04), 100);
    }
    victory() {
      const notes = [440, 554, 659, 880];
      notes.forEach((n, i) => setTimeout(() => this.beep(n, 'triangle', 0.18, 0.06), i * 140));
    }
    death() {
      const notes = [300, 240, 180, 120];
      notes.forEach((n, i) => setTimeout(() => this.beep(n, 'sawtooth', 0.22, 0.08), i * 160));
    }
  }

  const audio = new RetroAudio();

  // Constants & Static Game Definitions
  const RACES = [
    { name: 'Dwarf', dx: 6, iq: 8, st: 10, extra: 8 },
    { name: 'Elf', dx: 10, iq: 8, st: 6, extra: 8 },
    { name: 'Hobbit', dx: 12, iq: 8, st: 4, extra: 4 },
    { name: 'Homo-Sapien', dx: 8, iq: 8, st: 8, extra: 8 }
  ];

  const TREASURES = [
    'The Blue Flame',
    'The Green Gem',
    'The Norn Stone',
    'The Opal Eye',
    'The Palantir',
    'The Pale Pearl',
    'The Ruby Red',
    'The Silmaril'
  ];

  const MONSTERS = [
    { name: 'Kobold', st: 5, dx: 6, iq: 4, gold: 50 },
    { name: 'Orc', st: 8, dx: 7, iq: 6, gold: 90 },
    { name: 'Wolf', st: 7, dx: 10, iq: 5, gold: 40 },
    { name: 'Goblin', st: 6, dx: 8, iq: 7, gold: 75 },
    { name: 'Ogre', st: 12, dx: 6, iq: 5, gold: 150 },
    { name: 'Troll', st: 14, dx: 8, iq: 6, gold: 220 },
    { name: 'Gargoyle', st: 15, dx: 9, iq: 8, gold: 300 },
    { name: 'Chimera', st: 16, dx: 11, iq: 9, gold: 420 },
    { name: 'Dragon', st: 18, dx: 12, iq: 12, gold: 750 }
  ];

  const ARMOR_TYPES = {
    '': { name: 'None', cost: 0, absorb: [0, 0] },
    'Leather': { name: 'Leather', cost: 10, absorb: [1, 2] },
    'ChainMail': { name: 'ChainMail', cost: 20, absorb: [2, 4] },
    'Plate': { name: 'Plate', cost: 30, absorb: [3, 6] }
  };

  const WEAPON_TYPES = {
    '': { name: 'Bare Hands', cost: 0, damage: [1, 2] },
    'Dagger': { name: 'Dagger', cost: 10, damage: [1, 4] },
    'Mace': { name: 'Mace', cost: 20, damage: [2, 7] },
    'Sword': { name: 'Sword', cost: 30, damage: [3, 10] }
  };

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Game Engine Class
  class WizardsCastleEngine {
    constructor(terminalEl, hudEls) {
      this.term = terminalEl;
      this.hud = hudEls;
      this.state = null;
      this.creationStep = null;
      this.creationData = {};
      this.activeBattle = null;
      this.activeVendor = null;
      this.waitingForPrompt = null;
    }

    print(text, type = 'normal') {
      const line = document.createElement('div');
      line.className = `term-line line-${type}`;
      line.textContent = text;
      this.term.appendChild(line);
      this.term.scrollTop = this.term.scrollHeight;
    }

    printRaw(html, type = 'normal') {
      const line = document.createElement('div');
      line.className = `term-line line-${type}`;
      line.innerHTML = html;
      this.term.appendChild(line);
      this.term.scrollTop = this.term.scrollHeight;
    }

    clear() {
      this.term.innerHTML = '';
    }

    updateHUD() {
      if (!this.hud || !this.state || !this.state.player) return;
      const p = this.state.player;
      if (this.hud.level) this.hud.level.textContent = `L${p.loc.level + 1} (${p.loc.row + 1}, ${p.loc.col + 1})`;
      if (this.hud.hp) this.hud.hp.textContent = `${p.st}/18`;
      if (this.hud.iq) this.hud.iq.textContent = `${p.iq}/18`;
      if (this.hud.dx) this.hud.dx.textContent = `${p.dx}/18`;
      if (this.hud.gold) this.hud.gold.textContent = `${p.gold} GP`;
      if (this.hud.armor) this.hud.armor.textContent = p.armor || 'None';
      if (this.hud.weapon) this.hud.weapon.textContent = p.weapon || 'Bare Hands';
      if (this.hud.lamp) this.hud.lamp.textContent = p.lamp ? `${p.lampBurn} Burns` : 'No';
      if (this.hud.flares) this.hud.flares.textContent = p.flares;
      if (this.hud.treasures) this.hud.treasures.textContent = `${p.treasures.length}/8`;
      if (this.hud.runestaff) this.hud.runestaff.textContent = p.runestaff ? '⚡ Held' : 'None';
      if (this.hud.orb) this.hud.orb.textContent = p.orbOfZot ? '🔮 FOUND' : 'Not Found';
    }

    initDungeon() {
      const levels = 8;
      const rows = 8;
      const cols = 8;
      const map = [];
      const known = [];

      for (let l = 0; l < levels; l++) {
        map[l] = [];
        known[l] = [];
        for (let r = 0; r < rows; r++) {
          map[l][r] = [];
          known[l][r] = [];
          for (let c = 0; c < cols; c++) {
            map[l][r][c] = 'X';
            known[l][r][c] = 'X';
          }
        }
      }

      // Entrance at Level 1, Row 1, Col 4 (0-indexed: 0, 0, 3)
      map[0][0][3] = 'E';
      known[0][0][3] = 'E';

      // Place 8 Treasures
      const placedTreasures = {};
      TREASURES.forEach(tName => {
        let placed = false;
        while (!placed) {
          const l = randInt(0, 7);
          const r = randInt(0, 7);
          const c = randInt(0, 7);
          if (map[l][r][c] === 'X') {
            map[l][r][c] = 'T';
            placedTreasures[`${l},${r},${c}`] = tName;
            placed = true;
          }
        }
      });

      // Place Orb of Zot ('Z') on levels 4-8
      let zPlaced = false;
      let zotLoc = null;
      while (!zPlaced) {
        const l = randInt(3, 7);
        const r = randInt(0, 7);
        const c = randInt(0, 7);
        if (map[l][r][c] === 'X') {
          map[l][r][c] = 'Z';
          zotLoc = { level: l, row: r, col: c };
          zPlaced = true;
        }
      }

      // Place Stairs Up & Down
      for (let l = 0; l < levels - 1; l++) {
        let stairsCount = 2;
        while (stairsCount > 0) {
          const r = randInt(0, 7);
          const c = randInt(0, 7);
          if (map[l][r][c] === 'X' && map[l + 1][r][c] === 'X') {
            map[l][r][c] = 'D';
            map[l + 1][r][c] = 'U';
            stairsCount--;
          }
        }
      }

      // Place remaining room contents
      const pool = ['-', '-', '-', 'P', 'C', 'B', 'G', 'O', 'S', 'F', 'W', 'M', 'V'];
      const monstersWithRunestaff = [];

      for (let l = 0; l < levels; l++) {
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (map[l][r][c] === 'X') {
              const item = pool[randInt(0, pool.length - 1)];
              if (item === 'S' && l === 7) {
                map[l][r][c] = '-'; // no sinkhole on bottom floor
              } else {
                map[l][r][c] = item;
              }
              if (item === 'M') {
                monstersWithRunestaff.push({ l, r, c });
              }
            }
          }
        }
      }

      // Pick one monster to hold the Runestaff
      let runestaffMonster = null;
      if (monstersWithRunestaff.length > 0) {
        const pick = monstersWithRunestaff[randInt(0, monstersWithRunestaff.length - 1)];
        runestaffMonster = `${pick.l},${pick.r},${pick.c}`;
      }

      return {
        map,
        known,
        placedTreasures,
        zotLoc,
        runestaffMonster
      };
    }

    quickStart() {
      this.clear();
      this.print("=== QUICK START ACTIVATED ===", "highlight");
      this.print("Picking optimal adventurer loadout: Homo-Sapien Warrior");
      this.print("Race: Homo-Sapien (Strength 14, Intelligence 8, Dexterity 10)");
      this.print("Starting Gear: ChainMail Armor, Mace, Lamp (10 Burns)");
      this.print("Starting Gold: 0 GP (Fully outfitted for the quest)");
      
      const dungeon = this.initDungeon();

      this.state = {
        player: {
          race: 'Homo-Sapien',
          sex: 'Male',
          st: 14,
          iq: 8,
          dx: 10,
          maxAttrib: 18,
          gold: 0,
          turns: 0,
          armor: 'ChainMail',
          weapon: 'Mace',
          lamp: true,
          lampBurn: 10,
          flares: 0,
          blind: false,
          bookStuck: false,
          lethargy: false,
          leech: false,
          forgetfulness: false,
          runestaff: false,
          orbOfZot: false,
          treasures: [],
          loc: { level: 0, row: 0, col: 3 }
        },
        dungeon,
        vendorHostile: false
      };

      this.saveState();
      this.updateHUD();
      this.enterRoom();
    }

    startCreation() {
      this.clear();
      this.print("*************************************************", "highlight");
      this.print("*      WELCOME TO THE WIZARD'S CASTLE           *", "highlight");
      this.print("*    PowerShell 7 Port by Daniel Kill           *", "highlight");
      this.print("*************************************************", "highlight");
      this.print("\nMany years ago, the gnomic wizard Zot forged the Orb of Power.");
      this.print("Soon after, Zot vanished, leaving behind an 8-level subterranean");
      this.print("castle filled with esurient monsters, fabulous treasures, and the Orb.");
      this.print("\nTo win, you must find the Orb of Zot and exit through the entrance!\n");

      this.creationStep = 'race';
      this.print("Choose your character race:");
      this.print("  [1] Dwarf        (DX: 6,  IQ: 8, ST: 10 | +8 Extra Points)");
      this.print("  [2] Elf          (DX: 10, IQ: 8, ST: 6  | +8 Extra Points)");
      this.print("  [3] Hobbit       (DX: 12, IQ: 8, ST: 4  | +4 Extra Points)");
      this.print("  [4] Homo-Sapien  (DX: 8,  IQ: 8, ST: 8  | +8 Extra Points)");
      this.print("\nEnter choice 1-4, or type 'quick' for instant character setup:", "prompt");
    }

    handleInput(raw) {
      const input = (raw || '').trim();
      audio.step();

      if (this.waitingForPrompt) {
        const handler = this.waitingForPrompt;
        this.waitingForPrompt = null;
        handler(input);
        return;
      }

      if (this.creationStep) {
        this.handleCreation(input);
        return;
      }

      if (!this.state || !this.state.player) {
        if (input.toLowerCase() === 'quick') {
          this.quickStart();
        } else {
          this.startCreation();
        }
        return;
      }

      if (this.activeBattle) {
        this.handleBattle(input);
        return;
      }

      if (this.activeVendor) {
        this.handleVendor(input);
        return;
      }

      this.handleCommand(input.toUpperCase());
    }

    handleCreation(input) {
      const val = input.toLowerCase();
      if (val === 'quick') {
        this.quickStart();
        return;
      }

      switch (this.creationStep) {
        case 'race': {
          let chosen = null;
          if (val === '1' || val === 'dwarf') chosen = RACES[0];
          else if (val === '2' || val === 'elf') chosen = RACES[1];
          else if (val === '3' || val === 'hobbit') chosen = RACES[2];
          else if (val === '4' || val === 'homo-sapien' || val === 'human') chosen = RACES[3];

          if (!chosen) {
            this.print("You bumbling buffoon! That is not a choice. Enter 1-4:", "warning");
            return;
          }
          this.creationData.race = chosen;
          this.creationData.st = chosen.st;
          this.creationData.iq = chosen.iq;
          this.creationData.dx = chosen.dx;
          this.creationData.extra = chosen.extra;

          this.creationStep = 'sex';
          this.print(`\nGreetings, ${chosen.name}. What is your gender?`);
          this.print("  [1] Male  [2] Female  [3] Other");
          this.print("Enter choice (1-3):", "prompt");
          break;
        }

        case 'sex': {
          let sex = 'Male';
          if (val === '2' || val === 'female') sex = 'Female';
          else if (val === '3' || val === 'other') sex = 'Other';
          this.creationData.sex = sex;

          this.creationStep = 'points';
          this.promptExtraPoints();
          break;
        }

        case 'points': {
          // Format: e.g. "4 2 2" for ST IQ DX
          const parts = input.split(/\s+/).map(Number);
          if (parts.length === 3 && parts.every(n => !isNaN(n) && n >= 0)) {
            const sum = parts[0] + parts[1] + parts[2];
            if (sum === this.creationData.extra) {
              if (this.creationData.st + parts[0] > 18 || this.creationData.iq + parts[1] > 18 || this.creationData.dx + parts[2] > 18) {
                this.print("No attribute can exceed 18! Try again:", "warning");
                return;
              }
              this.creationData.st += parts[0];
              this.creationData.iq += parts[1];
              this.creationData.dx += parts[2];
              this.creationStep = 'shop';
              this.creationData.gold = 60;
              this.creationData.armor = '';
              this.creationData.weapon = '';
              this.creationData.lamp = false;
              this.creationData.lampBurn = 0;
              this.creationData.flares = 0;
              this.promptShop();
              return;
            }
          }
          this.print(`You must allocate exactly ${this.creationData.extra} total points across ST, IQ, and DX!`, "warning");
          this.print("Format: <ST> <IQ> <DX> (e.g. '4 2 2'):", "prompt");
          break;
        }

        case 'shop': {
          const opt = val;
          if (opt === '1' && this.creationData.gold >= 30) {
            this.creationData.armor = 'Plate';
            this.creationData.gold -= 30;
            this.print("Purchased Plate Armor (-30 GP).", "success");
          } else if (opt === '2' && this.creationData.gold >= 20) {
            this.creationData.armor = 'ChainMail';
            this.creationData.gold -= 20;
            this.print("Purchased ChainMail Armor (-20 GP).", "success");
          } else if (opt === '3' && this.creationData.gold >= 10) {
            this.creationData.armor = 'Leather';
            this.creationData.gold -= 10;
            this.print("Purchased Leather Armor (-10 GP).", "success");
          } else if (opt === '4' && this.creationData.gold >= 30) {
            this.creationData.weapon = 'Sword';
            this.creationData.gold -= 30;
            this.print("Purchased Broadsword (-30 GP).", "success");
          } else if (opt === '5' && this.creationData.gold >= 20) {
            this.creationData.weapon = 'Mace';
            this.creationData.gold -= 20;
            this.print("Purchased Spiked Mace (-20 GP).", "success");
          } else if (opt === '6' && this.creationData.gold >= 10) {
            this.creationData.weapon = 'Dagger';
            this.creationData.gold -= 10;
            this.print("Purchased Hunting Dagger (-10 GP).", "success");
          } else if (opt === '7' && this.creationData.gold >= 20 && !this.creationData.lamp) {
            this.creationData.lamp = true;
            this.creationData.lampBurn = 10;
            this.creationData.gold -= 20;
            this.print("Purchased Brass Lantern with 10 oil charges (-20 GP).", "success");
          } else if (opt === '8' && this.creationData.gold >= 5) {
            this.creationData.flares += 5;
            this.creationData.gold -= 5;
            this.print("Purchased 5 Flares (-5 GP).", "success");
          } else if (opt === '0' || opt === 'enter' || opt === 'done') {
            this.finalizeCreation();
            return;
          } else {
            this.print("Not enough gold or invalid option! Select 0 to finish.", "warning");
          }
          this.promptShop();
          break;
        }
      }
    }

    promptExtraPoints() {
      this.print(`\nYou have ${this.creationData.extra} extra attribute points to distribute.`);
      this.print(`Current: Strength (ST)=${this.creationData.st}, Intelligence (IQ)=${this.creationData.iq}, Dexterity (DX)=${this.creationData.dx}`);
      this.print(`Enter how many points to add to ST, IQ, and DX separated by spaces (e.g. '4 2 2' or '5 0 3'):`, "prompt");
    }

    promptShop() {
      this.print(`\n--- OUTPOST ARMORY --- Gold remaining: ${this.creationData.gold} GP`);
      this.print(`Current Armor: ${this.creationData.armor || 'None'} | Weapon: ${this.creationData.weapon || 'None'} | Lamp: ${this.creationData.lamp ? 'Yes' : 'No'} | Flares: ${this.creationData.flares}`);
      this.print("  [1] Plate Armor (30 GP)     [4] Sword (30 GP)");
      this.print("  [2] ChainMail (20 GP)       [5] Mace (20 GP)");
      this.print("  [3] Leather (10 GP)         [6] Dagger (10 GP)");
      this.print("  [7] Brass Lamp (20 GP)      [8] 5 Flares (5 GP)");
      this.print("  [0] ENTER THE DUNGEON");
      this.print("Enter choice (0-8):", "prompt");
    }

    finalizeCreation() {
      this.creationStep = null;
      const dungeon = this.initDungeon();
      this.state = {
        player: {
          race: this.creationData.race.name,
          sex: this.creationData.sex,
          st: this.creationData.st,
          iq: this.creationData.iq,
          dx: this.creationData.dx,
          maxAttrib: 18,
          gold: this.creationData.gold,
          turns: 0,
          armor: this.creationData.armor,
          weapon: this.creationData.weapon,
          lamp: this.creationData.lamp,
          lampBurn: this.creationData.lampBurn,
          flares: this.creationData.flares,
          blind: false,
          bookStuck: false,
          lethargy: false,
          leech: false,
          forgetfulness: false,
          runestaff: false,
          orbOfZot: false,
          treasures: [],
          loc: { level: 0, row: 0, col: 3 }
        },
        dungeon,
        vendorHostile: false
      };

      this.clear();
      this.print(`Welcome, brave ${this.state.player.race}! You descend into the depths of Zot's Castle...`, "highlight");
      this.saveState();
      this.updateHUD();
      this.enterRoom();
    }

    saveState() {
      try {
        localStorage.setItem('dk_wizards_castle_save', JSON.stringify(this.state));
      } catch (e) {
        // LocalStorage not available or quota exceeded
      }
    }

    loadState() {
      try {
        const raw = localStorage.getItem('dk_wizards_castle_save');
        if (raw) {
          this.state = JSON.parse(raw);
          this.clear();
          this.print("=== RESUMED SAVED ADVENTURE ===", "success");
          this.updateHUD();
          this.enterRoom();
          return true;
        }
      } catch (e) {
        // ignore
      }
      return false;
    }

    enterRoom() {
      const p = this.state.player;
      const d = this.state.dungeon;
      const loc = p.loc;

      // Uncover room on known map
      const roomType = d.map[loc.level][loc.row][loc.col];
      d.known[loc.level][loc.row][loc.col] = roomType === 'X' ? '-' : roomType;

      // Handle curses
      if (p.leech && !p.treasures.includes('The Pale Pearl')) {
        const leechLoss = randInt(1, 2);
        p.st -= leechLoss;
        this.print(`🩸 The curse of the Leech drains ${leechLoss} Strength!`, "danger");
      }
      if (p.forgetfulness && !p.treasures.includes('The Green Gem')) {
        this.print(`🌫️ The curse of Forgetfulness clouds your mind...`, "warning");
        const forgetCount = randInt(1, 4);
        for (let i = 0; i < forgetCount; i++) {
          const fr = randInt(0, 7);
          const fc = randInt(0, 7);
          if (d.known[loc.level][fr][fc] !== 'E') {
            d.known[loc.level][fr][fc] = 'X';
          }
        }
      }

      this.checkPlayerDeath();
      if (p.st <= 0) return;

      this.print(`\nYou are in chamber (${loc.row + 1}, ${loc.col + 1}) on Level ${loc.level + 1}.`, "normal");

      // Handle Room Features
      switch (roomType) {
        case 'E':
          this.print("You stand before the ARCHED ENTRANCE of the Castle.", "highlight");
          this.print("Exit North if you dare return to the realm of sunlight!");
          break;

        case 'U':
          this.print("Carved stone STAIRS lead UP to the floor above. (Use 'U' to ascend)", "highlight");
          break;

        case 'D':
          this.print("Dark winding STAIRS lead DOWN deeper into the labyrinth. (Use 'D' to descend)", "highlight");
          break;

        case 'S':
          this.print("⚠️ WHOOSH! The floor collapses beneath your boots! You fall down a SINKHOLE!", "danger");
          audio.bump();
          p.loc.level++;
          p.st -= randInt(1, 3);
          this.print(`You crash onto floor Level ${p.loc.level + 1} with bruised bones!`, "warning");
          this.enterRoom();
          return;

        case 'W':
          this.print("🌀 A crackling arcane WARP PORTAL spins wildly! You are teleported!", "highlight");
          audio.spell();
          p.loc.level = randInt(0, 7);
          p.loc.row = randInt(0, 7);
          p.loc.col = randInt(0, 7);
          this.enterRoom();
          return;

        case 'G': {
          const goldFound = randInt(10, 250);
          p.gold += goldFound;
          audio.gold();
          this.print(`💰 You discover a cache of ${goldFound} shimmering gold pieces! (Total: ${p.gold} GP)`, "success");
          d.map[loc.level][loc.row][loc.col] = '-';
          d.known[loc.level][loc.row][loc.col] = '-';
          break;
        }

        case 'F': {
          const flaresFound = randInt(1, 5);
          p.flares += flaresFound;
          this.print(`🔥 You found ${flaresFound} flares in an iron wall bracket! (Total: ${p.flares})`, "success");
          d.map[loc.level][loc.row][loc.col] = '-';
          d.known[loc.level][loc.row][loc.col] = '-';
          break;
        }

        case 'T': {
          const tKey = `${loc.level},${loc.row},${loc.col}`;
          const tName = d.placedTreasures[tKey] || 'Ancient Relic';
          if (!p.treasures.includes(tName)) {
            p.treasures.push(tName);
            audio.victory();
            this.print(`✨ YOU HAVE FOUND ${tName.toUpperCase()}!`, "highlight");
            this.checkTreasureWard(tName);
          }
          d.map[loc.level][loc.row][loc.col] = '-';
          d.known[loc.level][loc.row][loc.col] = '-';
          break;
        }

        case 'Z':
          if (!p.orbOfZot) {
            audio.victory();
            this.print("🔮 *************************************************", "highlight");
            this.print("🔮 THE FABULOUS ORB OF ZOT RESTS UPON AN ARCANE PEDESTAL!", "highlight");
            this.print("🔮 You grasp the Orb! Its raw power courses through your veins!", "highlight");
            this.print("🔮 NOW RACE BACK TO THE LEVEL 1 ENTRANCE TO WIN!", "highlight");
            this.print("🔮 *************************************************", "highlight");
            p.orbOfZot = true;
          }
          break;

        case 'C':
          this.print("A heavy iron-banded CHEST sits in the corner. (Use 'O' to open)", "normal");
          break;

        case 'B':
          this.print("An ancient leather-bound BOOK rests upon a stone lectern. (Use 'O' to open)", "normal");
          break;

        case 'P':
          this.print("A shimmering, bubbling MAGIC POOL glows in the center. (Use 'P' to drink)", "normal");
          break;

        case 'O':
          this.print("A glowing CRYSTAL ORB rests on a bronze tripod. (Use 'G' to gaze)", "normal");
          break;

        case 'V':
          this.print("An armored dungeon VENDOR stands here with his trading wares.", "highlight");
          this.handleVendorEncounter();
          return;

        case 'M':
          this.handleMonsterEncounter();
          return;

        case '-':
        default:
          this.print("This room is silent and empty.", "muted");
          break;
      }

      this.updateHUD();
      this.saveState();
      this.promptCommand();
    }

    checkTreasureWard(tName) {
      const p = this.state.player;
      if (tName === 'The Ruby Red' && p.lethargy) {
        p.lethargy = false;
        this.print("💎 The Ruby Red pulses with warmth and cures your Lethargy!", "success");
      }
      if (tName === 'The Pale Pearl' && p.leech) {
        p.leech = false;
        this.print("💎 The Pale Pearl heals the insidious curse of the Leech!", "success");
      }
      if (tName === 'The Opal Eye' && p.blind) {
        p.blind = false;
        this.print("💎 The Opal Eye restores your radiant sight!", "success");
      }
      if (tName === 'The Green Gem' && p.forgetfulness) {
        p.forgetfulness = false;
        this.print("💎 The Green Gem shields your mind from Forgetfulness!", "success");
      }
      if (tName === 'The Blue Flame' && p.bookStuck) {
        p.bookStuck = false;
        this.print("💎 The Blue Flame dissolves the sticky book from your hands!", "success");
      }
    }

    promptCommand() {
      this.print("Commands: (N)orth (S)outh (E)ast (W)est | (M)ap (O)pen (P)ool (G)aze (L)amp (F)lare (T)eleport | (?)Help", "prompt");
    }

    handleCommand(cmd) {
      const p = this.state.player;
      const d = this.state.dungeon;
      const loc = p.loc;
      p.turns++;

      switch (cmd) {
        case 'N':
        case 'NORTH':
          if (loc.level === 0 && loc.row === 0 && loc.col === 3) {
            this.handleExitCastle();
            return;
          }
          loc.row = loc.row === 0 ? 7 : loc.row - 1;
          this.enterRoom();
          break;

        case 'S':
        case 'SOUTH':
          loc.row = loc.row === 7 ? 0 : loc.row + 1;
          this.enterRoom();
          break;

        case 'E':
        case 'EAST':
          loc.col = loc.col === 7 ? 0 : loc.col + 1;
          this.enterRoom();
          break;

        case 'W':
        case 'WEST':
          loc.col = loc.col === 0 ? 7 : loc.col - 1;
          this.enterRoom();
          break;

        case 'U':
        case 'UP':
          if (d.map[loc.level][loc.row][loc.col] === 'U') {
            loc.level--;
            this.print("You ascend the stone stairs to the upper floor.", "success");
            this.enterRoom();
          } else {
            this.print("There are no stairs going UP here!", "warning");
            this.promptCommand();
          }
          break;

        case 'D':
        case 'DOWN':
          if (d.map[loc.level][loc.row][loc.col] === 'D') {
            loc.level++;
            this.print("You descend the dark stairs into deeper peril...", "warning");
            this.enterRoom();
          } else {
            this.print("There are no stairs going DOWN here!", "warning");
            this.promptCommand();
          }
          break;

        case 'M':
        case 'MAP':
          this.showMap();
          this.promptCommand();
          break;

        case 'O':
        case 'OPEN': {
          const cur = d.map[loc.level][loc.row][loc.col];
          if (cur === 'C') {
            this.openChest();
          } else if (cur === 'B') {
            this.readBook();
          } else {
            this.print("There is no chest or book to open here!", "warning");
            this.promptCommand();
          }
          break;
        }

        case 'P':
        case 'POOL':
          if (d.map[loc.level][loc.row][loc.col] === 'P') {
            this.drinkPool();
          } else {
            this.print("There is no magic pool here to drink from!", "warning");
            this.promptCommand();
          }
          break;

        case 'G':
        case 'GAZE':
          if (d.map[loc.level][loc.row][loc.col] === 'O') {
            this.gazeOrb();
          } else {
            this.print("There is no crystal orb here to gaze into!", "warning");
            this.promptCommand();
          }
          break;

        case 'F':
        case 'FLARE':
          this.useFlare();
          break;

        case 'L':
        case 'LAMP':
          this.useLamp();
          break;

        case 'T':
        case 'TELEPORT':
          this.useTeleport();
          break;

        case '?':
        case 'HELP':
          this.showHelp();
          this.promptCommand();
          break;

        case 'Q':
        case 'QUIT':
          this.print("You drop your weapons and give up your quest in despair.", "danger");
          this.state = null;
          localStorage.removeItem('dk_wizards_castle_save');
          this.print("Type 'new' to start a new game.", "prompt");
          break;

        default:
          this.print(`Unknown command: '${cmd}'. Type '?' for help.`, "warning");
          this.promptCommand();
          break;
      }
    }

    showMap() {
      const p = this.state.player;
      const d = this.state.dungeon;
      const l = p.loc.level;

      if (p.blind) {
        this.print("👁️ You are blind! You cannot see your map!", "danger");
        return;
      }

      this.print(`\n=== AUTOMAP: LEVEL ${l + 1} ===`, "highlight");
      this.print("      1   2   3   4   5   6   7   8");
      this.print("    +---+---+---+---+---+---+---+---+");

      for (let r = 0; r < 8; r++) {
        let rowStr = `  ${r + 1} |`;
        for (let c = 0; c < 8; c++) {
          let symbol = d.known[l][r][c];
          if (p.loc.row === r && p.loc.col === c) {
            rowStr += `<${symbol}>|`;
          } else {
            rowStr += ` ${symbol} |`;
          }
        }
        this.print(rowStr, "term-map-row");
        this.print("    +---+---+---+---+---+---+---+---+");
      }
      this.print("Legend: <>=You  E=Exit  U=StairsUp  D=StairsDown  P=Pool  C=Chest  B=Book  O=Orb  M=Monster  V=Vendor  X=Unknown", "muted");
    }

    openChest() {
      const p = this.state.player;
      const d = this.state.dungeon;
      const loc = p.loc;
      const roll = randInt(1, 4);

      if (roll === 1) {
        audio.bump();
        const dmg = randInt(1, 4);
        p.st -= dmg;
        this.print(`💥 BOOM! An explosive trap detonates in your face! You lose ${dmg} Strength!`, "danger");
      } else if (roll === 2) {
        audio.bump();
        p.st -= randInt(1, 3);
        this.print("☠️ HISS! Poisonous gas billows from the lid! You choke and lose 2 Strength!", "danger");
      } else {
        const goldAmt = randInt(40, 500);
        p.gold += goldAmt;
        audio.gold();
        this.print(`💰 SUCCESS! You pry open the chest and loot ${goldAmt} gold pieces!`, "success");
      }

      d.map[loc.level][loc.row][loc.col] = '-';
      d.known[loc.level][loc.row][loc.col] = '-';
      this.checkPlayerDeath();
      this.updateHUD();
      this.promptCommand();
    }

    readBook() {
      const p = this.state.player;
      const d = this.state.dungeon;
      const loc = p.loc;
      const roll = randInt(1, 6);

      if (roll === 1) {
        if (p.iq < 18) p.iq++;
        audio.spell();
        this.print("📖 The ancient tome imparts forgotten eldritch secrets! Your Intelligence increases by 1!", "success");
      } else if (roll === 2) {
        audio.bump();
        p.blind = true;
        this.print("⚡ A blinding flash of radiant light erupts from the runes! YOU ARE BLIND!", "danger");
      } else if (roll === 3) {
        audio.bump();
        p.bookStuck = true;
        this.print("🖐️ The covers are coated in demon glue! The book is STUCK TO YOUR HANDS!", "danger");
        this.print("You cannot wield weapons or cast spells until healed by The Blue Flame!", "warning");
      } else if (roll === 4) {
        p.forgetfulness = true;
        this.print("🌫️ The runes scramble your memories! You are cursed with FORGETFULNESS!", "warning");
      } else if (roll === 5) {
        p.st = Math.max(1, p.st - 2);
        this.print("💨 Noxious mold spores puff out! You lose 2 Strength!", "danger");
      } else {
        this.print(`📖 It's an old copy of 'Play-${p.race}'! Ha! Ha! I peed myself with laughter!`, "highlight");
      }

      d.map[loc.level][loc.row][loc.col] = '-';
      d.known[loc.level][loc.row][loc.col] = '-';
      this.checkPlayerDeath();
      this.updateHUD();
      this.promptCommand();
    }

    drinkPool() {
      const p = this.state.player;
      const roll = randInt(1, 6);

      if (roll === 1) {
        if (p.st < 18) p.st = Math.min(18, p.st + randInt(1, 3));
        this.print("💧 The sweet spring water invigorates your muscles! Strength increases!", "success");
      } else if (roll === 2) {
        if (p.iq < 18) p.iq = Math.min(18, p.iq + randInt(1, 3));
        this.print("💧 The glowing water sharpens your mind! Intelligence increases!", "success");
      } else if (roll === 3) {
        if (p.dx < 18) p.dx = Math.min(18, p.dx + randInt(1, 3));
        this.print("💧 The brisk water lightens your step! Dexterity increases!", "success");
      } else if (roll === 4) {
        p.st = Math.max(1, p.st - randInt(1, 3));
        audio.bump();
        this.print("🤢 Ugh! The stagnant water is tainted! You lose Strength!", "danger");
      } else if (roll === 5) {
        p.sex = p.sex === 'Male' ? 'Female' : 'Male';
        this.print(`✨ Mystical vapors transform your body! You are now ${p.sex}!`, "highlight");
      } else {
        const otherRaces = RACES.filter(r => r.name !== p.race);
        const newRace = otherRaces[randInt(0, otherRaces.length - 1)].name;
        p.race = newRace;
        this.print(`✨ Arcane forces twist your bones! You transform into a ${newRace}!`, "highlight");
      }

      this.checkPlayerDeath();
      this.updateHUD();
      this.promptCommand();
    }

    gazeOrb() {
      const d = this.state.dungeon;
      const visions = [
        "yourself in a bloody heap at the claws of a Dragon.",
        "yourself playing The Wizard's Castle on danielkill.online.",
        `the dreaded Orb of Zot shimmering on floor Level ${d.zotLoc.level + 1} at (${d.zotLoc.row + 1}, ${d.zotLoc.col + 1})!`,
        `a false illusion of the Orb of Zot on floor Level ${randInt(1, 8)} at (${randInt(1, 8)}, ${randInt(1, 8)})!`,
        "a monstrous Chimera feasting upon an unfortunate adventurer.",
        "yourself surrounded by heaps of rubies, pearls, and gold."
      ];
      const vision = visions[randInt(0, visions.length - 1)];
      audio.spell();
      this.print(`🔮 You gaze deeply into the swirling mists of the crystal orb...`, "highlight");
      this.print(`You see ${vision}`, "normal");
      this.promptCommand();
    }

    useFlare() {
      const p = this.state.player;
      const d = this.state.dungeon;
      if (p.flares <= 0) {
        this.print("You have no flares to light!", "warning");
        this.promptCommand();
        return;
      }
      p.flares--;
      audio.spell();
      this.print("🔥 The flare ignites with a blazing hiss, illuminating the surrounding chambers!", "highlight");
      
      const l = p.loc.level;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = (p.loc.row + dr + 8) % 8;
          const nc = (p.loc.col + dc + 8) % 8;
          d.known[l][nr][nc] = d.map[l][nr][nc] === 'X' ? '-' : d.map[l][nr][nc];
        }
      }
      this.showMap();
      this.promptCommand();
    }

    useLamp() {
      const p = this.state.player;
      const d = this.state.dungeon;
      if (!p.lamp || p.lampBurn <= 0) {
        this.print("Your lantern has run out of oil! Buy more oil from a Vendor.", "warning");
        this.promptCommand();
        return;
      }
      this.print("Which direction do you want to shine the lantern? (N/S/E/W):", "prompt");
      this.waitingForPrompt = (dir) => {
        const dNorm = (dir || '').toUpperCase();
        let targetR = p.loc.row;
        let targetC = p.loc.col;
        if (dNorm === 'N') targetR = (targetR - 1 + 8) % 8;
        else if (dNorm === 'S') targetR = (targetR + 1) % 8;
        else if (dNorm === 'E') targetC = (targetC + 1) % 8;
        else if (dNorm === 'W') targetC = (targetC - 1 + 8) % 8;
        else {
          this.print("Invalid direction. Lantern lowered.", "warning");
          this.promptCommand();
          return;
        }

        p.lampBurn--;
        const content = d.map[p.loc.level][targetR][targetC];
        d.known[p.loc.level][targetR][targetC] = content === 'X' ? '-' : content;
        this.print(`💡 The golden lantern beam reveals: Room (${targetR + 1}, ${targetC + 1}) contains: [${content}]`, "highlight");
        this.updateHUD();
        this.promptCommand();
      };
    }

    useTeleport() {
      const p = this.state.player;
      if (!p.runestaff) {
        this.print("⚡ You cannot teleport! You need the legendary RUNESTAFF!", "warning");
        this.print("(One of the lethal monsters in the castle holds the Runestaff. Defeat it to claim it!)", "muted");
        this.promptCommand();
        return;
      }

      this.print("⚡ THE RUNESTAFF HUMS WITH ANCIENT POWER!", "highlight");
      this.print("Enter destination Level, Row, and Column separated by spaces (e.g. '5 3 7'):", "prompt");
      this.waitingForPrompt = (coords) => {
        const parts = coords.split(/\s+/).map(Number);
        if (parts.length === 3 && parts.every(n => !isNaN(n) && n >= 1 && n <= 8)) {
          audio.spell();
          p.loc.level = parts[0] - 1;
          p.loc.row = parts[1] - 1;
          p.loc.col = parts[2] - 1;
          this.print(`⚡ BZZZZT! Reality folds and you materialize in room (${parts[1]}, ${parts[2]}) Level ${parts[0]}!`, "highlight");
          this.enterRoom();
        } else {
          this.print("Invalid coordinates. Levels, Rows, and Columns must be between 1 and 8.", "warning");
          this.promptCommand();
        }
      };
    }

    handleMonsterEncounter() {
      const p = this.state.player;
      const d = this.state.dungeon;
      const loc = p.loc;

      // Pick monster appropriate for depth
      const mIdx = Math.min(MONSTERS.length - 1, randInt(Math.floor(loc.level / 2), MONSTERS.length - 1));
      const mTemplate = MONSTERS[mIdx];
      const monsterKey = `${loc.level},${loc.row},${loc.col}`;
      const hasRunestaff = d.runestaffMonster === monsterKey;

      this.activeBattle = {
        name: mTemplate.name,
        st: mTemplate.st + randInt(0, loc.level * 2),
        dx: mTemplate.dx,
        iq: mTemplate.iq,
        gold: mTemplate.gold + randInt(10, 100),
        hasRunestaff,
        webbedTurns: 0
      };

      audio.combatHit();
      this.print(`⚠️ DANGER! A ferocious ${this.activeBattle.name} lunges from the darkness!`, "danger");
      this.print(`The beast has ${this.activeBattle.st} Strength!`, "warning");

      if (p.lethargy) {
        this.print("You suffer from Lethargy! The monster strikes first!", "danger");
        this.monsterAttack();
      } else {
        this.promptBattleActions();
      }
    }

    promptBattleActions() {
      const p = this.state.player;
      const options = ["(A)ttack", "(R)etreat", "(B)ribe"];
      if (p.iq >= 15 && !p.bookStuck) {
        options.push("(C)ast Spell");
      }
      this.print(`Battle Options: ${options.join(' | ')}`, "prompt");
    }

    handleBattle(cmd) {
      const b = this.activeBattle;
      const p = this.state.player;
      const act = (cmd || '').toUpperCase();

      if (b.webbedTurns > 0) {
        b.webbedTurns--;
        this.print(`🕸️ The ${b.name} struggles violently in the magical web!`, "muted");
      }

      if (act === 'A' || act === 'ATTACK') {
        if (p.bookStuck) {
          this.print("Your hands are stuck to the book! You cannot attack!", "warning");
        } else {
          this.playerAttack();
        }
      } else if (act === 'R' || act === 'RETREAT') {
        this.print("You attempt to retreat to an adjacent chamber!", "warning");
        if (randInt(1, 100) + p.dx > 60) {
          this.print("You successfully break away and scramble to safety!", "success");
          this.activeBattle = null;
          p.loc.col = (p.loc.col - 1 + 8) % 8;
          this.enterRoom();
          return;
        } else {
          this.print(`The ${b.name} blocks your escape route!`, "danger");
        }
      } else if (act === 'B' || act === 'BRIBE') {
        const bribeCost = Math.min(p.gold, randInt(20, 100));
        if (p.gold >= bribeCost && bribeCost > 0) {
          p.gold -= bribeCost;
          this.print(`You toss ${bribeCost} gold pieces onto the stone floor!`, "highlight");
          if (randInt(1, 100) > 40) {
            this.print(`The greedy ${b.name} snatches the coins and scurries off into the dark!`, "success");
            this.endMonsterBattle(false);
            return;
          } else {
            this.print(`The ${b.name} kicks the gold aside with a roar! Bribe failed!`, "danger");
          }
        } else {
          this.print("You don't have enough gold to bribe the beast!", "warning");
        }
      } else if ((act === 'C' || act === 'CAST') && p.iq >= 15 && !p.bookStuck) {
        this.promptSpellCast();
        return;
      } else {
        this.print("Invalid combat command. (A)ttack, (R)etreat, (B)ribe", "warning");
        this.promptBattleActions();
        return;
      }

      if (b && b.st > 0 && b.webbedTurns <= 0) {
        this.monsterAttack();
      } else if (b && b.st > 0) {
        this.promptBattleActions();
      }
    }

    promptSpellCast() {
      this.print("Select Spell to cast:");
      this.print("  [1] WEB        (Costs 1 ST - Traps monster for 2-9 rounds)");
      this.print("  [2] FIREBALL   (Costs 1 ST, 1 IQ - Deals 2-14 damage)");
      this.print("  [3] DEATHSPELL (Contest of wills! Loser dies instantly!)");
      this.waitingForPrompt = (spellChoice) => {
        const p = this.state.player;
        const b = this.activeBattle;
        audio.spell();

        if (spellChoice === '1' || spellChoice.toLowerCase() === 'web') {
          p.st--;
          b.webbedTurns = randInt(2, 9);
          this.print(`🕸️ You weave sticky mystical strands! The ${b.name} is TRAPPED for ${b.webbedTurns} turns!`, "success");
        } else if (spellChoice === '2' || spellChoice.toLowerCase() === 'fireball') {
          p.st--;
          p.iq--;
          const fbDmg = randInt(2, 14);
          b.st -= fbDmg;
          this.print(`🔥 A scorching orb of crimson fire explodes for ${fbDmg} damage!`, "highlight");
          if (b.st <= 0) {
            this.endMonsterBattle(true);
            return;
          }
        } else if (spellChoice === '3' || spellChoice.toLowerCase() === 'deathspell') {
          this.print("⚡ You unleash the forbidden DEATHSPELL! A psychic duel ensues!", "danger");
          if (p.iq >= b.iq && randInt(1, 100) > 25) {
            b.st = 0;
            this.print(`⚡ The ${b.name}'s skull collapses with magical backfire! VICTORY!`, "success");
            this.endMonsterBattle(true);
            return;
          } else {
            p.st = 0;
            this.print("⚡ The psychic rebound fractures your consciousness! YOU DIE!", "danger");
            this.checkPlayerDeath();
            return;
          }
        } else {
          this.print("Casting aborted.", "warning");
        }

        this.checkPlayerDeath();
        this.updateHUD();
        if (b && b.st > 0 && b.webbedTurns <= 0) {
          this.monsterAttack();
        } else if (b && b.st > 0) {
          this.promptBattleActions();
        }
      };
    }

    playerAttack() {
      const p = this.state.player;
      const b = this.activeBattle;
      const hitChance = randInt(1, 100) + p.dx;

      if (hitChance > 45) {
        const wep = WEAPON_TYPES[p.weapon] || WEAPON_TYPES[''];
        const dmg = randInt(wep.damage[0], wep.damage[1]) + Math.floor(p.st / 4);
        b.st -= dmg;
        audio.combatHit();
        this.print(`🗡️ You strike the ${b.name} with your ${wep.name} for ${dmg} damage! (Monster ST: ${Math.max(0, b.st)})`, "success");
        if (b.st <= 0) {
          this.endMonsterBattle(true);
        }
      } else {
        this.print(`You swing your ${p.weapon || 'fists'} wildly, but miss the ${b.name}!`, "muted");
      }
    }

    monsterAttack() {
      const p = this.state.player;
      const b = this.activeBattle;
      const mHit = randInt(1, 100) + b.dx;

      if (mHit > 50) {
        audio.bump();
        const arm = ARMOR_TYPES[p.armor] || ARMOR_TYPES[''];
        const rawDmg = randInt(1, 6) + Math.floor(b.st / 5);
        const absorb = randInt(arm.absorb[0], arm.absorb[1]);
        const finalDmg = Math.max(1, rawDmg - absorb);
        p.st -= finalDmg;
        this.print(`💥 The ${b.name} claws you for ${finalDmg} damage! (Armor absorbed ${absorb}) (Your ST: ${Math.max(0, p.st)})`, "danger");
        this.checkPlayerDeath();
      } else {
        this.print(`The ${b.name} lunges at you, but you deftly sidestep the blow!`, "muted");
      }

      this.updateHUD();
      if (p.st > 0) {
        this.promptBattleActions();
      }
    }

    endMonsterBattle(killed) {
      const p = this.state.player;
      const b = this.activeBattle;
      const d = this.state.dungeon;
      const loc = p.loc;

      if (killed) {
        audio.victory();
        this.print(`🎉 VICTORY! The mighty ${b.name} crashes dead to the floor!`, "highlight");
        p.gold += b.gold;
        this.print(`💰 You claim the monster's hoard: ${b.gold} GP! (Total: ${p.gold} GP)`, "success");

        if (b.hasRunestaff) {
          p.runestaff = true;
          this.print("⚡ *************************************************", "highlight");
          this.print("⚡ YOU PRY THE LEGENDARY RUNESTAFF FROM THE MONSTER'S CLAWS!", "highlight");
          this.print("⚡ You can now use the '(T)ELEPORT' command to cross the castle!", "highlight");
          this.print("⚡ *************************************************", "highlight");
        }
      }

      d.map[loc.level][loc.row][loc.col] = '-';
      d.known[loc.level][loc.row][loc.col] = '-';
      this.activeBattle = null;
      this.updateHUD();
      this.saveState();
      this.promptCommand();
    }

    handleVendorEncounter() {
      const p = this.state.player;
      if (this.state.vendorHostile) {
        this.print("⚠️ The Vendor remembers your crimes against his guild and attacks in fury!", "danger");
        this.activeBattle = {
          name: 'Angry Vendor',
          st: 18,
          dx: 14,
          iq: 14,
          gold: 400,
          hasRunestaff: false,
          webbedTurns: 0
        };
        this.monsterAttack();
        return;
      }

      this.print("Vendor: 'Welcome traveler! Would you like to Trade, Attack, or Ignore me?'");
      this.print("Vendor Actions: (T)rade | (A)ttack | (I)gnore", "prompt");
      this.activeVendor = true;
    }

    handleVendor(cmd) {
      const act = (cmd || '').toUpperCase();
      const p = this.state.player;

      if (act === 'T' || act === 'TRADE') {
        this.promptVendorShop();
      } else if (act === 'A' || act === 'ATTACK') {
        this.state.vendorHostile = true;
        this.activeVendor = null;
        this.print("⚔️ You draw steel against the Vendor! Every vendor in Zot's castle is now your mortal enemy!", "danger");
        this.activeBattle = {
          name: 'Angry Vendor',
          st: 18,
          dx: 14,
          iq: 14,
          gold: 500,
          hasRunestaff: false,
          webbedTurns: 0
        };
        this.playerAttack();
      } else if (act === 'I' || act === 'IGNORE') {
        this.print("You nod cordially at the vendor and step past.", "normal");
        this.activeVendor = null;
        this.promptCommand();
      } else {
        this.print("Choose (T)rade, (A)ttack, or (I)gnore:", "warning");
      }
    }

    promptVendorShop() {
      const p = this.state.player;
      this.print("\n=== VENDOR'S BAZAAR ===");
      this.print(`Your Purse: ${p.gold} GP | Armor: ${p.armor || 'None'} | Weapon: ${p.weapon || 'None'}`);
      this.print("  [1] Plate Armor (100 GP)    [4] Broadsword (100 GP)");
      this.print("  [2] ChainMail (60 GP)       [5] Spiked Mace (60 GP)");
      this.print("  [3] Leather Armor (30 GP)   [6] Dagger (30 GP)");
      this.print("  [7] Lamp Oil (+10 Burns / 25 GP)");
      this.print("  [8] Flares (2 GP each)");
      this.print("  [9] Sell a Treasure for 1,000 GP");
      this.print("  [0] Done Trading");
      this.print("Enter purchase (0-9):", "prompt");

      this.waitingForPrompt = (opt) => {
        const choice = (opt || '').trim();
        if (choice === '1' && p.gold >= 100) { p.armor = 'Plate'; p.gold -= 100; this.print("Equipped Plate Armor!", "success"); }
        else if (choice === '2' && p.gold >= 60) { p.armor = 'ChainMail'; p.gold -= 60; this.print("Equipped ChainMail Armor!", "success"); }
        else if (choice === '3' && p.gold >= 30) { p.armor = 'Leather'; p.gold -= 30; this.print("Equipped Leather Armor!", "success"); }
        else if (choice === '4' && p.gold >= 100) { p.weapon = 'Sword'; p.gold -= 100; this.print("Equipped Broadsword!", "success"); }
        else if (choice === '5' && p.gold >= 60) { p.weapon = 'Mace'; p.gold -= 60; this.print("Equipped Spiked Mace!", "success"); }
        else if (choice === '6' && p.gold >= 30) { p.weapon = 'Dagger'; p.gold -= 30; this.print("Equipped Dagger!", "success"); }
        else if (choice === '7' && p.gold >= 25) { p.lamp = true; p.lampBurn += 10; p.gold -= 25; this.print("Refilled lantern oil (+10 burns)!", "success"); }
        else if (choice === '8' && p.gold >= 10) { p.flares += 5; p.gold -= 10; this.print("Purchased 5 flares!", "success"); }
        else if (choice === '9') {
          if (p.treasures.length > 0) {
            const sold = p.treasures.pop();
            p.gold += 1000;
            audio.gold();
            this.print(`Sold ${sold} for 1,000 gold pieces!`, "highlight");
          } else {
            this.print("You have no treasures to sell!", "warning");
          }
        } else if (choice === '0' || choice === 'done') {
          this.activeVendor = null;
          this.promptCommand();
          return;
        } else {
          this.print("Not enough gold or invalid option.", "warning");
        }
        this.updateHUD();
        this.promptVendorShop();
      };
    }

    checkPlayerDeath() {
      const p = this.state.player;
      if (p.st <= 0 || p.iq <= 0 || p.dx <= 0) {
        audio.death();
        this.clear();
        this.print("*************************************************", "danger");
        this.print("*                  YOU HAVE DIED!               *", "danger");
        this.print("*************************************************", "danger");
        this.print(`The perils of Zot's Castle have claimed another soul.`);
        this.print(`Final Stats: ST: ${p.st}, IQ: ${p.iq}, DX: ${p.dx}`);
        this.print(`Gold Amassed: ${p.gold} GP | Turns Survived: ${p.turns}`);
        this.print(`Treasures Recovered: ${p.treasures.length > 0 ? p.treasures.join(', ') : 'None'}`);
        if (p.orbOfZot) {
          this.print("You perished while clutching the Orb of Zot in your dying hands...", "warning");
        }
        this.print("\nPress 'New Game' or type 'new' to challenge Zot again!", "highlight");
        this.state = null;
        this.activeBattle = null;
        this.activeVendor = null;
        localStorage.removeItem('dk_wizards_castle_save');
        this.updateHUD();
      }
    }

    handleExitCastle() {
      const p = this.state.player;
      audio.victory();
      this.clear();
      this.print("*************************************************", "highlight");
      this.print("*      YOU HAVE EMERGED FROM ZOT'S LABYRINTH!   *", "highlight");
      this.print("*************************************************", "highlight");

      if (p.orbOfZot) {
        this.print("\n👑👑👑 GLORIOUS TRIUMPH! 👑👑👑", "highlight");
        this.print("You hold the Orb of Zot aloft as sunlight washes over your face!");
        this.print("Bards across the kingdom of N'dic will sing of your legendary valor!");
      } else {
        this.print("\nYou escaped with your miserable life, but without the Orb of Zot.", "warning");
        this.print("The wizard Zot laughs mockingly from the subterranean shadows!");
      }

      this.print(`\nAdventurer Summary:`);
      this.print(`  Race & Gender:   ${p.sex} ${p.race}`);
      this.print(`  Turns in Castle: ${p.turns}`);
      this.print(`  Gold Plundered:  ${p.gold} GP`);
      this.print(`  Treasures:       ${p.treasures.length > 0 ? p.treasures.join(', ') : 'None'}`);
      this.print(`  Armor & Weapon:  ${p.armor || 'None'}, ${p.weapon || 'Bare Hands'}`);

      this.state = null;
      localStorage.removeItem('dk_wizards_castle_save');
      this.print("\nType 'new' to embark on another quest!", "prompt");
      this.updateHUD();
    }

    showHelp() {
      this.print("\n=== THE WIZARD'S CASTLE GUIDE ===", "highlight");
      this.print("Goal: Find the Orb of Zot ('Z') hidden deep in the castle and escape via Level 1 (1, 4)!");
      this.print("Movement: (N)orth (S)outh (E)ast (W)est — Toroidal donut map wraps edges!");
      this.print("Stairs:   (U)p (D)own — Must be in chamber with stone stairs.");
      this.print("Objects:  (O)pen chest/book, (P)ool drink, (G)aze orb, (F)lare, (L)amp.");
      this.print("Combat:   (A)ttack monster/vendor, (R)etreat, (B)ribe with gold.");
      this.print("Spells:   Cast Web, Fireball, Deathspell when Intelligence is 15 or higher.");
      this.print("Runestaff: Carried by 1 monster. Claim it to unlock (T)eleport to any room!");
      this.print("Treasures cure curses: Ruby Red=Lethargy, Pearl=Leech, Opal=Blindness, Green Gem=Forgetfulness, Blue Flame=Stuck book.");
    }
  }

  // Bind to DOM when loaded
  document.addEventListener('DOMContentLoaded', () => {
    const term = document.getElementById('castle-terminal');
    const inputEl = document.getElementById('castle-input');
    const formEl = document.getElementById('castle-form');
    if (!term || !inputEl || !formEl) return;

    const hudEls = {
      level: document.getElementById('hud-level'),
      hp: document.getElementById('hud-hp'),
      iq: document.getElementById('hud-iq'),
      dx: document.getElementById('hud-dx'),
      gold: document.getElementById('hud-gold'),
      armor: document.getElementById('hud-armor'),
      weapon: document.getElementById('hud-weapon'),
      lamp: document.getElementById('hud-lamp'),
      flares: document.getElementById('hud-flares'),
      treasures: document.getElementById('hud-treasures'),
      runestaff: document.getElementById('hud-runestaff'),
      orb: document.getElementById('hud-orb')
    };

    const engine = new WizardsCastleEngine(term, hudEls);

    // Form submission
    formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = inputEl.value;
      inputEl.value = '';
      if (val.trim()) {
        engine.print(`> ${val}`, 'user');
        engine.handleInput(val);
      }
    });

    // Virtual D-Pad & Action Buttons
    document.querySelectorAll('[data-castle-cmd]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const cmd = btn.getAttribute('data-castle-cmd');
        if (cmd) {
          engine.print(`> ${cmd}`, 'user');
          engine.handleInput(cmd);
          inputEl.focus();
        }
      });
    });

    // Window / Toolbar buttons
    const btnNewGame = document.getElementById('btn-new-game');
    if (btnNewGame) {
      btnNewGame.addEventListener('click', () => {
        engine.startCreation();
        inputEl.focus();
      });
    }

    const btnQuickStart = document.getElementById('btn-quick-start');
    if (btnQuickStart) {
      btnQuickStart.addEventListener('click', () => {
        engine.quickStart();
        inputEl.focus();
      });
    }

    const btnAudio = document.getElementById('btn-toggle-audio');
    if (btnAudio) {
      btnAudio.addEventListener('click', () => {
        audio.muted = !audio.muted;
        btnAudio.textContent = audio.muted ? '🔇 Sound: Off' : '🔊 Sound: On';
        btnAudio.classList.toggle('active', !audio.muted);
      });
    }

    const btnCrt = document.getElementById('btn-toggle-crt');
    const terminalBox = document.querySelector('.crt-terminal-box');
    if (btnCrt && terminalBox) {
      btnCrt.addEventListener('click', () => {
        terminalBox.classList.toggle('scanlines-enabled');
        btnCrt.classList.toggle('active');
      });
    }

    // Auto-resume or initial start
    if (!engine.loadState()) {
      engine.startCreation();
    }
    inputEl.focus();
  });
})();
