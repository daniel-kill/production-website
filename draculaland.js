/**
 * DRACULALAND (Castle Dracula, 1777)
 * In-Browser Web Terminal Port of the Scott Adams-style text adventure by Daniel Kill
 * Maintainer: Daniel Kill <daniel@danielkill.online>
 * License: MIT
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // World Data & Room Graph
  // --------------------------------------------------------------------------
  const ROOMS = {
    pass: {
      name: "Borgo Pass",
      dark: false,
      exits: { N: 'gate', E: 'shrine' },
      desc: "I'm on the Borgo Pass in the Carpathian mountains, in the Year of Our Lord 1777. The afternoon sun is already low. An abandoned wagon sits in the road. To the north a black castle clings to the cliffs."
    },
    shrine: {
      name: "Roadside Shrine",
      dark: false,
      exits: { W: 'pass' },
      desc: "I'm at a weathered roadside shrine. Peasants have hung wreaths of garlic and dried flowers on the carved wooden saint."
    },
    gate: {
      name: "Castle Gates",
      dark: false,
      exits: { S: 'pass', N: 'courtyard' },
      desc: "I'm before the great iron gates of Castle Dracula. They stand rusted ajar. Carved bats crouch on the gateposts. A cold wind moans through the arch to the north."
    },
    courtyard: {
      name: "Castle Courtyard",
      dark: false,
      exits: { S: 'gate', N: 'hall', E: 'forge', W: 'chapel' },
      desc: "I'm in a snow-dusted castle courtyard. A forge stands to the east, a small ruined chapel to the west, and huge oak doors lead north into the castle."
    },
    forge: {
      name: "Blacksmith's Forge",
      dark: false,
      exits: { W: 'courtyard' },
      desc: "I'm in the castle blacksmith's forge. The hearth is cold. Rusted tongs and a great anvil sit among drifts of ash."
    },
    chapel: {
      name: "Ruined Chapel",
      dark: false,
      exits: { E: 'courtyard' },
      desc: "I'm in a ruined chapel. Though the roof is open to the sky, the air is calm and clean. The stone altar is bare. This is sanctified ground - a safe place to store treasure."
    },
    hall: {
      name: "Great Hall",
      dark: false,
      exits: { S: 'courtyard', N: 'dining', E: 'armory', W: 'library', U: 'gallery', D: 'cellar' },
      desc: "I'm in the Great Hall of Castle Dracula. Tattered banners hang from the rafters. Doorways lead north, east and west, a staircase climbs up to a gallery, and worn steps descend into a cellar."
    },
    dining: {
      name: "Grand Dining Room",
      dark: false,
      exits: { S: 'hall' },
      desc: "I'm in a grand dining room. A long table is laid for a feast no living guest will eat. Chairs are overturned and smashed."
    },
    armory: {
      name: "Castle Armory",
      dark: false,
      exits: { W: 'hall' },
      desc: "I'm in the castle armory. Rusted halberds and shields line the walls. Most of the racks are empty."
    },
    library: {
      name: "Dusty Library",
      dark: false,
      exits: { E: 'hall' },
      desc: "I'm in a dusty library. Shelves of mouldering books reach to the ceiling. Cobwebs hang like curtains."
    },
    gallery: {
      name: "Upper Gallery",
      dark: false,
      exits: { D: 'hall', E: 'bedchamber', N: 'tower' },
      desc: "I'm on an upper gallery overlooking the Great Hall. A huge portrait of a stern Wallachian Voivode hangs here. Doors lead east and north."
    },
    bedchamber: {
      name: "Lavish Bedchamber",
      dark: false,
      exits: { W: 'gallery' },
      desc: "I'm in a lavish bedchamber draped in faded crimson silk. The great canopied bed has not been slept in for centuries."
    },
    tower: {
      name: "Windswept Tower",
      dark: false,
      exits: { S: 'gallery' },
      desc: "I'm at the top of a windswept tower. Through the arrow slits I can see the whole pass and the sun sinking toward the peaks."
    },
    cellar: {
      name: "Cold Cellar",
      dark: true,
      exits: { U: 'hall', N: 'wine', E: 'crypt' },
      desc: "I'm in a cold, damp cellar. Rats scurry in the shadows. Passages lead north, and to the east is a massive iron-bound door set in the rock."
    },
    wine: {
      name: "Wine Cellar",
      dark: true,
      exits: { S: 'cellar' },
      desc: "I'm in a wine cellar. Rows of dust-covered barrels and bottles stretch into the gloom."
    },
    crypt: {
      name: "Count's Crypt",
      dark: true,
      exits: { W: 'cellar' },
      desc: "I'm in the crypt of Castle Dracula. The air is thick with the smell of old earth. A black coffin lies on a stone dais in the center of the room."
    }
  };

  // --------------------------------------------------------------------------
  // Item Database & Initial Locations
  // --------------------------------------------------------------------------
  const ITEMS = {
    lantern:  { name: 'brass lantern',            nouns: ['lantern', 'lamp'],               take: true, desc: 'A sturdy brass lantern. It needs oil and a light.' },
    mutton:   { name: 'joint of mutton',          nouns: ['mutton', 'meat', 'joint'],       take: true, desc: 'A joint of mutton left on the wagon. It still smells good - to a wolf.' },
    crucifix: { name: 'silver crucifix',          nouns: ['crucifix'],                      take: true, desc: 'A heavy silver crucifix, blessed by a village priest.' },
    mallet:   { name: 'heavy iron mallet',        nouns: ['mallet', 'hammer'],              take: true, desc: 'A blacksmith\'s mallet. It would drive a stake home.' },
    water:    { name: 'vial of holy water',       nouns: ['water', 'vial', 'holy'],         take: true, desc: 'A glass vial of holy water.' },
    dagger:   { name: 'steel dagger',             nouns: ['dagger', 'knife', 'blade'],      take: true, desc: 'A keen steel dagger. Good for carving wood.' },
    leg:      { name: 'oak chair leg',            nouns: ['leg', 'oak'],                    take: true, desc: 'A stout leg of seasoned oak, snapped from a chair. If only it had a point...' },
    stake:    { name: 'sharpened oak stake',      nouns: ['stake', 'point'],                take: true, desc: 'A sharpened oak stake. Exactly what a vampire hunter needs.' },
    key:      { name: 'iron key',                 nouns: ['key'],                           take: true, desc: 'A large, ancient iron key.' },
    journal:  { name: 'monk\'s journal',          nouns: ['journal', 'diary', 'notes'],     take: true, desc: "It reads: 'The Count sleeps in his crypt below the cellars by day. A black ward seals the door; holy water breaks it. The key hides behind the Voivode\'s portrait. Only a mallet and a stake of oak driven through his heart will end him - and he wakes at sunset.'" },
    oil:      { name: 'flask of lamp oil',        nouns: ['oil', 'flask'],                  take: true, desc: 'A flask of lamp oil. FILL the lantern with it.' },
    goblet:   { name: 'gold goblet',              nouns: ['goblet', 'chalice'],             take: true, desc: 'A jewelled gold goblet. A TREASURE!' },
    ring:     { name: 'ruby ring',                nouns: ['ring', 'ruby'],                  take: true, desc: 'A blood-red ruby ring. A TREASURE!' },
    necklace: { name: 'emerald necklace',         nouns: ['necklace', 'emerald'],           take: true, desc: 'A glittering emerald necklace. A TREASURE!' },
    tiara:    { name: 'silver tiara',             nouns: ['tiara'],                         take: true, desc: 'A delicate silver tiara. A TREASURE!' },
    bottle:   { name: 'bottle of ancient Tokaji', nouns: ['bottle', 'tokaji', 'wine'],     take: true, desc: 'A bottle of impossibly old Tokaji wine. A TREASURE!' }
  };

  const START_LOC = {
    lantern: 'pass',
    mutton: 'pass',
    crucifix: 'shrine',
    mallet: 'forge',
    water: 'chapel',
    dagger: 'armory',
    leg: 'dining',
    stake: 'gone',
    key: 'hidden',
    journal: 'library',
    oil: 'tower',
    goblet: 'dining',
    ring: 'hidden',
    necklace: 'bedchamber',
    tiara: 'tower',
    bottle: 'wine'
  };

  const TREASURES = ['goblet', 'ring', 'necklace', 'tiara', 'bottle'];
  const MAX_CARRY = 8;
  const SUNSET_TURN = 300;

  const DIR_NAMES = { N: 'North', S: 'South', E: 'East', W: 'West', U: 'Up', D: 'Down' };
  const DIR_MAP = {
    n: 'N', nor: 'N',
    s: 'S', sou: 'S',
    e: 'E', eas: 'E',
    w: 'W', wes: 'W',
    u: 'U', up: 'U',
    d: 'D', dow: 'D'
  };

  const STOP_WORDS = new Set([
    'the', 'a', 'an', 'to', 'at', 'on', 'with', 'in', 'into', 'onto',
    'of', 'from', 'my', 'some', 'it', 'using', 'and'
  ]);

  const DRACULA_WORDS = ['dracula', 'vampire', 'count', 'voivode', 'vlad', 'heart', 'him', 'master', 'dra'];

  // --------------------------------------------------------------------------
  // Parser Tables & Scott Adams 3-Letter Prefix Matcher
  // --------------------------------------------------------------------------
  function getPrefix(word) {
    if (!word) return '';
    const w = word.toLowerCase();
    return w.substring(0, Math.min(3, w.length));
  }

  const VERB_MAP = {};
  function addVerbs(canon, words) {
    words.forEach(w => {
      VERB_MAP[getPrefix(w)] = canon;
    });
  }

  addVerbs('go', ['go', 'walk', 'run', 'head']);
  addVerbs('take', ['take', 'get', 'grab', 'pick']);
  addVerbs('drop', ['drop', 'leave', 'put', 'discard']);
  addVerbs('look', ['look', 'l']);
  addVerbs('examine', ['examine', 'x', 'inspect', 'read', 'search', 'check']);
  addVerbs('inventory', ['inventory', 'inv', 'i']);
  addVerbs('open', ['open', 'unlock']);
  addVerbs('light', ['light', 'ignite', 'kindle']);
  addVerbs('douse', ['extinguish', 'douse', 'snuff']);
  addVerbs('throw', ['throw', 'toss', 'feed']);
  addVerbs('show', ['show', 'hold', 'brandish', 'raise']);
  addVerbs('carve', ['carve', 'whittle', 'sharpen', 'cut']);
  addVerbs('move', ['move', 'push', 'slide', 'shift', 'pull', 'lift']);
  addVerbs('sprinkle', ['sprinkle', 'pour', 'splash', 'bless']);
  addVerbs('fill', ['fill', 'refuel']);
  addVerbs('stake', ['stake', 'drive', 'hammer', 'impale', 'kill', 'slay', 'attack', 'hit', 'stab', 'strike']);
  addVerbs('score', ['score']);
  addVerbs('help', ['help', 'hint', '?']);
  addVerbs('save', ['save']);
  addVerbs('load', ['load', 'restore']);
  addVerbs('quit', ['quit', 'q', 'exit']);
  addVerbs('wait', ['wait', 'z']);
  addVerbs('pray', ['pray']);
  addVerbs('use', ['use']);

  function testNoun(word, aliases) {
    if (!word) return false;
    const p = getPrefix(word);
    for (let a of aliases) {
      if (getPrefix(a) === p) return true;
    }
    return false;
  }

  // --------------------------------------------------------------------------
  // Audio Synthesizer (Retro PC Sound & Gothic Atmosphere)
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

  function playTone(freq, duration, type = 'square', gainLevel = 0.08) {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainLevel, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  function playSound(type) {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    const t = audioCtx.currentTime;
    try {
      if (type === 'step') {
        playTone(180, 0.05, 'triangle', 0.04);
      } else if (type === 'take') {
        playTone(520, 0.07, 'square', 0.06);
        setTimeout(() => playTone(780, 0.09, 'square', 0.06), 40);
      } else if (type === 'drop') {
        playTone(320, 0.08, 'sawtooth', 0.05);
      } else if (type === 'light') {
        playTone(440, 0.06, 'triangle', 0.05);
        setTimeout(() => playTone(880, 0.12, 'sine', 0.08), 50);
      } else if (type === 'wolf') {
        // Snarl & Howl
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, t);
        osc.frequency.exponentialRampToValueAtTime(260, t + 0.3);
        osc.frequency.exponentialRampToValueAtTime(90, t + 0.8);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.8);
      } else if (type === 'shriek') {
        // Vampire screech
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1200, t);
        osc.frequency.exponentialRampToValueAtTime(400, t + 0.4);
        gain.gain.setValueAtTime(0.14, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.45);
      } else if (type === 'ward') {
        // Holy water sizzle & break
        playTone(700, 0.15, 'sawtooth', 0.08);
        setTimeout(() => playTone(300, 0.25, 'sine', 0.1), 100);
      } else if (type === 'door') {
        // Heavy iron door groan
        playTone(110, 0.35, 'sawtooth', 0.09);
      } else if (type === 'coffin') {
        // Grinding stone scrape
        playTone(85, 0.4, 'triangle', 0.1);
      } else if (type === 'stake') {
        // Heavy THUNK impact
        playTone(75, 0.2, 'square', 0.2);
        setTimeout(() => playTone(140, 0.4, 'sawtooth', 0.12), 120);
      } else if (type === 'victory') {
        // Gothic Organ Victory Fanfare
        const chords = [
          [220, 261, 330],
          [261, 330, 392],
          [293, 349, 440],
          [330, 415, 493, 659]
        ];
        chords.forEach((chord, i) => {
          setTimeout(() => {
            chord.forEach(f => playTone(f, 0.45, 'triangle', 0.08));
          }, i * 320);
        });
      } else if (type === 'death') {
        // Low doom chime
        [150, 130, 110, 80].forEach((f, i) => {
          setTimeout(() => playTone(f, 0.4, 'sawtooth', 0.09), i * 220);
        });
      }
    } catch (e) {
      // Ignore audio synthesis errors
    }
  }

  // --------------------------------------------------------------------------
  // Game State
  // --------------------------------------------------------------------------
  let state = {
    room: 'pass',
    turn: 0,
    oil: 220,
    lit: false,
    over: false,
    won: false,
    flags: {
      wolvesGone: false,
      brideGone: false,
      wardBroken: false,
      cryptOpen: false,
      coffinOpen: false
    },
    itemLoc: Object.assign({}, START_LOC)
  };

  let turnUsed = false;
  const commandHistory = [];
  let historyIndex = -1;

  function newGame() {
    state = {
      room: 'pass',
      turn: 0,
      oil: 220,
      lit: false,
      over: false,
      won: false,
      flags: {
        wolvesGone: false,
        brideGone: false,
        wardBroken: false,
        cryptOpen: false,
        coffinOpen: false
      },
      itemLoc: Object.assign({}, START_LOC)
    };
    turnUsed = false;
    clearScreen();
    showBanner();
    showRoom();
    updateHUD();
  }

  // --------------------------------------------------------------------------
  // Output & Screen Helpers
  // --------------------------------------------------------------------------
  const terminalScreen = document.getElementById('dracula-screen');

  function clearScreen() {
    if (terminalScreen) terminalScreen.innerHTML = '';
  }

  function say(text, colorClass = '') {
    if (!terminalScreen) return;
    const p = document.createElement('div');
    p.className = 'term-line ' + (colorClass ? 'term-' + colorClass : '');
    p.textContent = text;
    terminalScreen.appendChild(p);
    terminalScreen.scrollTop = terminalScreen.scrollHeight;
  }

  function sayRaw(html) {
    if (!terminalScreen) return;
    const div = document.createElement('div');
    div.innerHTML = html;
    terminalScreen.appendChild(div);
    terminalScreen.scrollTop = terminalScreen.scrollHeight;
  }

  // --------------------------------------------------------------------------
  // State Query Helpers
  // --------------------------------------------------------------------------
  function getItemsAt(loc) {
    return Object.keys(state.itemLoc).filter(k => state.itemLoc[k] === loc).sort();
  }

  function findItem(word, whereArray) {
    if (!word) return null;
    const keys = Object.keys(ITEMS).sort();
    for (let k of keys) {
      if (whereArray.includes(state.itemLoc[k]) && testNoun(word, ITEMS[k].nouns)) {
        return k;
      }
    }
    return null;
  }

  function getCarryCount() {
    return getItemsAt('inv').length;
  }

  function getStoredCount() {
    return TREASURES.filter(t => state.itemLoc[t] === 'chapel').length;
  }

  function testHasLight() {
    return state.lit && ['inv', state.room].includes(state.itemLoc.lantern);
  }

  function testDark() {
    return ROOMS[state.room].dark && !testHasLight();
  }

  // --------------------------------------------------------------------------
  // UI Display & Banner
  // --------------------------------------------------------------------------
  function showBanner() {
    say('==========================================================================', 'accent');
    say('                   D R A C U L A L A N D   (1 7 7 7)', 'red');
    say('        Scott Adams "Adventureland"-Style Classic Text Adventure', 'cyan');
    say('==========================================================================', 'accent');
    say('Transylvania, 1777. The Count preys upon the mountain valleys. By day he sleeps in his crypt. You have until sunset to find a stake and a mallet and drive the stake through his heart. Gather treasures if you dare, and store them on holy ground in the chapel.');
    say('Give me commands of two words: VERB NOUN (e.g. TAKE LANTERN, GO NORTH, EXAMINE WAGON). Type HELP for hints and vocabulary.', 'muted');
    say('');
  }

  function showRoom() {
    if (testDark()) {
      say("It's pitch dark. I can't see a thing! A light would help.", 'muted');
      return;
    }

    const room = ROOMS[state.room];
    say(room.desc, 'white');

    if (state.room === 'courtyard' && !state.flags.wolvesGone) {
      say('A pack of gaunt grey WOLVES circles me, snarling and starving!', 'red');
      playSound('wolf');
    }
    if (state.room === 'hall' && !state.flags.brideGone) {
      say('A pale VAMPIRE BRIDE in a tattered wedding gown stands at the foot of the stairs, smiling with long white fangs!', 'red');
      playSound('shriek');
    }
    if (state.room === 'crypt' && state.flags.coffinOpen) {
      say('The coffin lid is open. DRACULA lies sleeping inside, pale as wax!', 'red');
    }

    const here = getItemsAt(state.room);
    if (here.length > 0) {
      const names = here.map(k => ITEMS[k].name).join(', ');
      say('I can also see: ' + names + '.', 'yellow');
    }

    const exits = Object.keys(DIR_NAMES)
      .filter(d => room.exits && room.exits[d])
      .map(d => DIR_NAMES[d]);
    say('Obvious exits: ' + (exits.length > 0 ? exits.join(', ') : 'None') + '.', 'cyan');
  }

  function updateHUD() {
    const locElem = document.getElementById('dracula-hud-room');
    const turnsElem = document.getElementById('dracula-hud-turns');
    const oilElem = document.getElementById('dracula-hud-oil');
    const invElem = document.getElementById('dracula-hud-inv');
    const scoreElem = document.getElementById('dracula-hud-score');

    if (locElem) {
      const roomObj = ROOMS[state.room];
      locElem.textContent = roomObj ? roomObj.name : state.room;
    }
    if (turnsElem) {
      const left = Math.max(0, SUNSET_TURN - state.turn);
      turnsElem.textContent = `${state.turn} / ${SUNSET_TURN} (${left} to sunset)`;
    }
    if (oilElem) {
      const status = state.lit ? '🔥 LIT' : 'UNLIT';
      oilElem.textContent = `${state.oil} oil [${status}]`;
      if (state.oil <= 20 && state.lit) {
        oilElem.style.color = '#ef4444';
      } else {
        oilElem.style.color = '';
      }
    }
    if (invElem) {
      const carried = getCarryCount();
      invElem.textContent = `${carried} / ${MAX_CARRY} carried`;
    }
    if (scoreElem) {
      const stored = getStoredCount();
      scoreElem.textContent = `${stored} / ${TREASURES.length} treasures`;
    }

    // Update D-pad active exit highlights
    const currentRoom = ROOMS[state.room];
    ['N', 'S', 'E', 'W', 'U', 'D'].forEach(dir => {
      const btn = document.getElementById('dracula-dir-' + dir.toLowerCase());
      if (btn) {
        if (currentRoom && currentRoom.exits && currentRoom.exits[dir]) {
          btn.classList.add('dir-available');
          btn.removeAttribute('disabled');
        } else {
          btn.classList.remove('dir-available');
          btn.setAttribute('disabled', 'true');
        }
      }
    });
  }

  function endGame(message, won) {
    state.over = true;
    state.won = won;
    say('');
    say(message, won ? 'green' : 'red');
    say('');

    const stored = getStoredCount();
    say(`Treasures stored in the chapel: ${stored} of 5. Turns taken: ${state.turn}.`, 'cyan');

    if (won) {
      let rank = 'Brave Vampire Hunter';
      if (stored === 5) rank = 'GRAND VAMPIRE SLAYER - a perfect hunt!';
      else if (stored >= 3) rank = 'Master Vampire Hunter';
      say(`Rank: ${rank}`, 'yellow');
      playSound('victory');
    } else {
      say('The Count has claimed another soul. Better luck next time.', 'red');
      playSound('death');
    }
    updateHUD();
  }

  // --------------------------------------------------------------------------
  // Time & Sunset Clock
  // --------------------------------------------------------------------------
  function stepTime() {
    state.turn++;
    if (state.lit) {
      state.oil--;
      if (state.oil === 20) {
        say('My lantern is growing dim.', 'yellow');
      }
      if (state.oil <= 0) {
        state.lit = false;
        say('My lantern has run out of oil!', 'red');
      }
    }

    if (state.turn === 200) {
      say('The sun is sinking toward the mountain peaks.', 'yellow');
    } else if (state.turn === 250) {
      say('Twilight deepens. Somewhere a wolf howls.', 'yellow');
      playSound('wolf');
    } else if (state.turn === 280) {
      say('The last red light fades. Deep below, something stirs...', 'red');
    }

    if (state.turn >= SUNSET_TURN && !state.over) {
      endGame(
        'The sun sets! In the crypt a coffin lid grinds open. Dracula rises, finds me in his castle, and his cold fingers close around my throat. The world goes dark.',
        false
      );
    }
  }

  // --------------------------------------------------------------------------
  // Movement
  // --------------------------------------------------------------------------
  function movePlayer(dir) {
    const room = ROOMS[state.room];
    if (testDark()) {
      say('Dangerous to move in the dark!', 'yellow');
      if (Math.random() < 0.35) {
        endGame('I stumbled in the blackness, tumbled down worn stone steps, and broke my neck!', false);
        return;
      }
    }

    if (!room.exits || !room.exits[dir]) {
      say("I can't go in that direction.");
      return;
    }

    if (state.room === 'courtyard' && dir !== 'S' && !state.flags.wolvesGone) {
      say('The wolves snarl and snap at my heels. I dare not go that way - they would tear me apart!', 'red');
      playSound('wolf');
      turnUsed = true;
      return;
    }

    if (state.room === 'hall' && dir !== 'S' && !state.flags.brideGone) {
      say('The Vampire Bride glides in front of me, hissing. I cannot get past her! Something holy might drive her off.', 'red');
      playSound('shriek');
      turnUsed = true;
      return;
    }

    if (state.room === 'cellar' && dir === 'E' && !state.flags.cryptOpen) {
      say('The iron-bound crypt door is shut fast.');
      return;
    }

    state.room = room.exits[dir];
    turnUsed = true;
    playSound('step');
    showRoom();
  }

  // --------------------------------------------------------------------------
  // Scenery Inspection
  // --------------------------------------------------------------------------
  function getSceneryText(word) {
    switch (state.room) {
      case 'gallery':
        if (testNoun(word, ['portrait', 'painting', 'picture', 'voivode'])) {
          return "The Voivode's cruel eyes seem to follow me. The heavy frame is a little loose - perhaps I could MOVE it.";
        }
        break;

      case 'library':
        if (testNoun(word, ['books', 'shelves', 'shelf', 'book'])) {
          if (state.itemLoc.ring === 'hidden') {
            state.itemLoc.ring = 'library';
            playSound('take');
            return 'Most of the books crumble to dust. But a hollowed-out volume falls open and a RUBY RING tumbles out!';
          }
          return 'Mouldering books. Nothing more of interest.';
        }
        break;

      case 'chapel':
        if (testNoun(word, ['altar'])) {
          return 'A plain stone altar. Treasures dropped here are safe. I might PRAY here too.';
        }
        break;

      case 'courtyard':
        if (testNoun(word, ['wolves', 'wolf', 'pack'])) {
          return 'Lean, hungry wolves. They stare at me as if I were dinner. Perhaps I could feed them something.';
        }
        break;

      case 'hall':
        if (testNoun(word, ['bride', 'woman', 'vampiress']) && !state.flags.brideGone) {
          return 'A pale vampire bride, beautiful and terrible. She cringes from anything holy.';
        }
        break;

      case 'cellar':
        if (testNoun(word, ['door', 'sigil', 'ward'])) {
          if (state.flags.cryptOpen) return 'The crypt door stands open.';
          if (state.flags.wardBroken) return 'A heavy iron-bound door. The ward is gone, but it is locked.';
          return 'A heavy iron door. A black sigil glows on it - a ward I dare not touch. Something holy might break it.';
        }
        break;

      case 'crypt':
        if (testNoun(word, ['coffin', 'casket', 'lid'])) {
          if (state.flags.coffinOpen) return 'Dracula sleeps within. His chest does not rise.';
          return 'A black coffin with a heavy lid. I could OPEN it.';
        }
        break;

      case 'forge':
        if (testNoun(word, ['anvil', 'hearth', 'tongs'])) {
          return 'Cold iron and old ash. Nothing useful.';
        }
        break;

      case 'dining':
        if (testNoun(word, ['table', 'chairs', 'chair', 'feast'])) {
          return 'Rotting food crawls with worms. One chair is broken - its leg lies on the floor.';
        }
        break;

      case 'shrine':
        if (testNoun(word, ['saint', 'wreath', 'garlic', 'shrine'])) {
          return 'Garlic wreaths hang about the saint. A silver crucifix has been left at its feet by a pilgrim.';
        }
        break;

      case 'pass':
        if (testNoun(word, ['wagon', 'castle'])) {
          return 'The wagon has been abandoned in a hurry. Its driver is nowhere to be seen. The castle looms to the north.';
        }
        break;
    }
    return null;
  }

  // --------------------------------------------------------------------------
  // Verb Dispatcher
  // --------------------------------------------------------------------------
  function invokeVerb(canon, noun) {
    switch (canon) {
      case 'go': {
        if (!noun) { say('Go where?'); return; }
        const d = DIR_MAP[getPrefix(noun)];
        if (d) movePlayer(d);
        else say("I don't understand that direction.");
        break;
      }

      case 'look': {
        showRoom();
        break;
      }

      case 'inventory': {
        const inv = getItemsAt('inv');
        if (inv.length === 0) {
          say("I'm not carrying anything.");
        } else {
          const names = inv.map(k => ITEMS[k].name).join(', ');
          say('I am carrying: ' + names + '.', 'yellow');
          if (state.lit) say('My lantern is lit.', 'muted');
        }
        break;
      }

      case 'take': {
        if (!noun) { say('Take what?'); return; }
        if (testDark()) { say("It's too dark to find anything!"); return; }
        const k = findItem(noun, [state.room]);
        if (!k) {
          if (findItem(noun, ['inv'])) {
            say('I already have it.');
          } else if (getSceneryText(noun)) {
            say("I can't carry that.");
          } else {
            say("I don't see that here.");
          }
          return;
        }

        if (getCarryCount() >= MAX_CARRY) {
          say("I'm carrying too much. Drop something first.");
          return;
        }

        state.itemLoc[k] = 'inv';
        playSound('take');
        say('OK');
        turnUsed = true;
        break;
      }

      case 'drop': {
        if (!noun) { say('Drop what?'); return; }
        const k = findItem(noun, ['inv']);
        if (!k) { say("I'm not carrying that."); return; }
        state.itemLoc[k] = state.room;
        turnUsed = true;
        playSound('drop');

        if (state.room === 'chapel' && TREASURES.includes(k)) {
          say('OK. The treasure glows softly on holy ground and is safely stored! (' + getStoredCount() + ' of 5)', 'green');
        } else {
          say('OK');
        }
        break;
      }

      case 'examine': {
        if (!noun) { say('Examine what?'); return; }
        const searchScope = testDark() ? ['inv'] : ['inv', state.room];
        const k = findItem(noun, searchScope);
        if (k) {
          say(ITEMS[k].desc, 'white');
          return;
        }
        if (testDark()) {
          say("It's too dark to see!");
          return;
        }

        if (state.room === 'crypt' && (DRACULA_WORDS.includes(noun.toLowerCase()) || testNoun(noun, DRACULA_WORDS))) {
          if (state.flags.coffinOpen) {
            say('Dracula sleeps like the dead he is. His heart, I think, is the target.', 'red');
          } else {
            say('He must be inside the closed coffin.');
          }
          return;
        }

        const t = getSceneryText(noun);
        if (t) {
          say(t, 'white');
          turnUsed = true;
        } else {
          say('I see nothing special.');
        }
        break;
      }

      case 'open': {
        if (!noun) { say('Open what?'); return; }
        if (state.room === 'cellar' && testNoun(noun, ['door', 'iron'])) {
          if (state.flags.cryptOpen) { say('It is already open.'); return; }
          if (!state.flags.wardBroken) {
            say('A black ward on the door crackles at my touch and hurls me back. I need something holy!', 'red');
            playSound('ward');
            turnUsed = true;
            return;
          }
          if (state.itemLoc.key !== 'inv') {
            say('The door is locked. I need a key.');
            return;
          }
          state.flags.cryptOpen = true;
          playSound('door');
          say('The iron key turns with a groan. The crypt door swings open! A breath of grave-cold air rolls out.', 'green');
          turnUsed = true;
          return;
        }

        if (state.room === 'crypt' && testNoun(noun, ['coffin', 'casket', 'lid'])) {
          if (testDark()) { say("It's too dark to see what I'm doing!"); return; }
          if (state.flags.coffinOpen) { say('It is already open.'); return; }
          state.flags.coffinOpen = true;
          playSound('coffin');
          say('With a grinding scrape I heave the lid aside. DRACULA lies within, pale and motionless, the sleep of the undead upon him. His heart awaits a stake!', 'red');
          turnUsed = true;
          return;
        }

        if (state.room === 'gate' && testNoun(noun, ['gate', 'gates'])) {
          say('The gates are rusted open already.');
          return;
        }
        say("I can't open that.");
        break;
      }

      case 'light': {
        if (findItem('lantern', ['inv']) !== 'lantern') {
          say("I don't have a light.");
          return;
        }
        if (state.oil <= 0) {
          say('The lantern is out of oil.');
          return;
        }
        if (state.lit) {
          say('It is already lit.');
          return;
        }
        state.lit = true;
        playSound('light');
        say('The lantern flickers to life.', 'yellow');
        turnUsed = true;
        break;
      }

      case 'douse': {
        if (!state.lit) {
          say("It isn't lit.");
          return;
        }
        state.lit = false;
        say('The lantern is out.');
        turnUsed = true;
        break;
      }

      case 'fill': {
        if (findItem('oil', ['inv']) !== 'oil') {
          say("I don't have any oil.");
          return;
        }
        if (findItem('lantern', ['inv']) !== 'lantern') {
          say("I'm not holding the lantern.");
          return;
        }
        state.oil += 150;
        state.itemLoc.oil = 'gone';
        playSound('light');
        say('I pour the oil into the lantern. It burns bright again.', 'green');
        turnUsed = true;
        break;
      }

      case 'throw': {
        if (!noun) { say('Throw what?'); return; }
        const k = findItem(noun, ['inv']);
        if (!k) { say("I'm not carrying that."); return; }

        if (k === 'mutton' && state.room === 'courtyard' && !state.flags.wolvesGone) {
          state.flags.wolvesGone = true;
          state.itemLoc.mutton = 'gone';
          playSound('wolf');
          say('I hurl the mutton across the courtyard. The wolves fall upon it in a snarling heap, then drag it away into the shadows. The way is clear!', 'green');
        } else {
          state.itemLoc[k] = state.room;
          playSound('drop');
          say('It clatters to the floor.');
        }
        turnUsed = true;
        break;
      }

      case 'show': {
        if (findItem('crucifix', ['inv']) !== 'crucifix' || (noun && !testNoun(noun, ITEMS.crucifix.nouns))) {
          say("I don't have that to show.");
          return;
        }
        if (state.room === 'hall' && !state.flags.brideGone) {
          state.flags.brideGone = true;
          playSound('shriek');
          say('I thrust the crucifix before me. The Vampire Bride shrieks, shields her eyes, and flees up the stairs into the darkness. The way is clear!', 'green');
        } else {
          say('Nothing happens.');
        }
        turnUsed = true;
        break;
      }

      case 'sprinkle': {
        if (noun && testNoun(noun, ITEMS.oil.nouns)) {
          invokeVerb('fill', noun);
          return;
        }
        if (findItem('water', ['inv']) !== 'water') {
          say("I don't have anything to sprinkle.");
          return;
        }
        if (state.room === 'cellar' && !state.flags.wardBroken) {
          state.flags.wardBroken = true;
          state.itemLoc.water = 'gone';
          playSound('ward');
          say('I sprinkle holy water on the door. The black sigil sizzles, screams, and fades to ash. The ward is broken!', 'green');
        } else if (state.room === 'crypt') {
          say('The holy water hisses where it falls on the coffin, but it will not end him. Only a stake will.');
        } else {
          say('Nothing happens. I should not waste holy water.');
        }
        turnUsed = true;
        break;
      }

      case 'carve': {
        const leg = findItem('leg', ['inv']);
        if (!leg) { say('I have nothing to carve.'); return; }
        if (findItem('dagger', ['inv']) !== 'dagger') {
          say('I need a blade to carve with.');
          return;
        }
        state.itemLoc.leg = 'gone';
        state.itemLoc.stake = 'inv';
        playSound('take');
        say('I whittle the oak leg to a wicked point. I now have a sharpened oak STAKE!', 'green');
        turnUsed = true;
        break;
      }

      case 'move': {
        if (state.room === 'gallery' && testNoun(noun, ['portrait', 'painting', 'picture', 'frame'])) {
          if (state.itemLoc.key === 'hidden') {
            state.itemLoc.key = 'gallery';
            playSound('take');
            say('I swing the heavy portrait aside. Behind it is a small niche and an iron KEY!', 'green');
          } else {
            say('The portrait swings aside. The niche behind it is empty.');
          }
          turnUsed = true;
          return;
        }
        say("I can't move that.");
        break;
      }

      case 'stake': {
        const targetOk = !noun ||
          DRACULA_WORDS.includes(noun.toLowerCase()) ||
          testNoun(noun, DRACULA_WORDS) ||
          testNoun(noun, ITEMS.stake.nouns) ||
          testNoun(noun, ITEMS.mallet.nouns);

        if (state.room === 'hall' && !state.flags.brideGone && testNoun(noun, ['bride', 'woman'])) {
          say('She is only his servant - she would shrug off a mere blow. I need the Master himself!');
          return;
        }
        if (state.room !== 'crypt') {
          say('There is nothing here to stake.');
          return;
        }
        if (!targetOk) {
          say("I can't do that.");
          return;
        }
        if (testDark()) {
          say("It's too dark to see anything!");
          return;
        }
        if (!state.flags.coffinOpen) {
          say('Dracula is hidden inside the closed coffin.');
          return;
        }

        const hasStake = findItem('stake', ['inv']) === 'stake';
        const hasMallet = findItem('mallet', ['inv']) === 'mallet';

        if (!hasStake) {
          say("I have no stake! I can't pierce his heart with my bare hands.");
          return;
        }
        if (!hasMallet) {
          say("I have a stake, but nothing heavy enough to drive it through his chest.");
          return;
        }

        playSound('stake');
        endGame(
          "I set the point above his heart and swing the mallet with all my strength. THUNK! Dracula's eyes snap open and he SHRIEKS - a sound that shakes the stones - then his body withers, blackens, and crumbles to dust. The castle trembles and falls silent. The valleys are free of the Count at last. YOU WIN!",
          true
        );
        break;
      }

      case 'pray': {
        if (state.room === 'chapel') {
          const left = SUNSET_TURN - state.turn;
          say(`A deep calm settles over me. A quiet voice whispers that I have about ${left} moves before the sun sets.`, 'cyan');
          turnUsed = true;
        } else {
          say('Nothing happens.');
        }
        break;
      }

      case 'use': {
        if (!noun) { say('Use what?'); return; }
        const k = findItem(noun, ['inv']);
        if (!k) { say("I'm not carrying that."); return; }
        switch (k) {
          case 'key':      invokeVerb('open', 'door'); break;
          case 'water':    invokeVerb('sprinkle', 'water'); break;
          case 'crucifix': invokeVerb('show', 'crucifix'); break;
          case 'lantern':  invokeVerb('light', 'lantern'); break;
          case 'dagger':   invokeVerb('carve', 'leg'); break;
          case 'leg':      invokeVerb('carve', 'leg'); break;
          case 'mallet':   invokeVerb('stake', 'dracula'); break;
          case 'stake':    invokeVerb('stake', 'dracula'); break;
          case 'oil':      invokeVerb('fill', 'lantern'); break;
          case 'mutton':   invokeVerb('throw', 'mutton'); break;
          default:         say("I don't know how to use that."); break;
        }
        break;
      }

      case 'wait': {
        say('Time passes...');
        turnUsed = true;
        break;
      }

      case 'score': {
        const left = SUNSET_TURN - state.turn;
        say(`I've stored ${getStoredCount()} of 5 treasures. I have taken ${state.turn} turns; about ${left} remain before sunset.`, 'cyan');
        if (!state.won) {
          say('Dracula is not yet destroyed.', 'muted');
        }
        break;
      }

      case 'help': {
        say('I understand two-word commands: VERB NOUN. Only the first three letters of each word matter. Directions: N S E W U D (or GO NORTH).', 'cyan');
        say('Verbs: GO, TAKE, DROP, LOOK, EXAMINE, INVENTORY, OPEN, LIGHT, DOUSE, FILL, THROW, SHOW, CARVE, MOVE, SPRINKLE, STAKE, PRAY, USE, WAIT, SCORE, SAVE, LOAD, QUIT.', 'cyan');
        say('Hints: Dracula sleeps in his crypt below the cellar until sunset. You need a mallet and an oak stake. Wolves and a vampire bride bar the way. Examine everything. Store treasures in the chapel.', 'yellow');
        break;
      }

      case 'save': {
        try {
          localStorage.setItem('draculaland_saved_game', JSON.stringify(state));
          say('Game saved successfully to browser storage.', 'green');
        } catch (e) {
          say('Could not save game: ' + e.message, 'red');
        }
        break;
      }

      case 'load': {
        try {
          const raw = localStorage.getItem('draculaland_saved_game');
          if (!raw) {
            say('I have no saved game.', 'yellow');
            return;
          }
          state = JSON.parse(raw);
          say('Game restored successfully.', 'green');
          showRoom();
        } catch (e) {
          say('Could not load game: ' + e.message, 'red');
        }
        break;
      }

      case 'quit': {
        state.over = true;
        say('You flee the castle, a coward to the last. The Count laughs in the dark.', 'yellow');
        break;
      }

      default: {
        say("I don't understand.");
        break;
      }
    }
  }

  // --------------------------------------------------------------------------
  // Command Processing Engine
  // --------------------------------------------------------------------------
  function executeCommand(input) {
    if (!input || !input.trim()) return;
    const raw = input.trim();

    // Log prompt in terminal
    say(`> ${raw}`, 'prompt-echo');

    if (state.over) {
      say('The game is over. Click "New Game" or type "RESTART" to play again.', 'yellow');
      if (raw.toUpperCase() === 'RESTART') newGame();
      return;
    }

    turnUsed = false;
    let tokens = raw.toLowerCase().split(/\s+/).filter(Boolean);
    tokens = tokens.filter(w => !STOP_WORDS.has(w));

    if (tokens.length === 0) {
      say('Tell me what to do.');
      return;
    }

    // Scott Adams special case for "pick up", "get up", "take up", etc.
    if (tokens.length > 1 && ['pic', 'tak', 'get', 'gra'].includes(getPrefix(tokens[0]))) {
      tokens = tokens.filter(w => w !== 'up');
    }

    const verbWord = tokens[0];
    const noun = tokens.length > 1 ? tokens[1] : null;

    if (tokens.length === 1 && DIR_MAP[getPrefix(verbWord)]) {
      movePlayer(DIR_MAP[getPrefix(verbWord)]);
    } else {
      const canon = VERB_MAP[getPrefix(verbWord)];
      if (!canon) {
        say(`I don't know how to '${verbWord}'.`);
        return;
      }
      invokeVerb(canon, noun);
    }

    if (turnUsed && !state.over) {
      stepTime();
    }

    updateHUD();
  }

  // --------------------------------------------------------------------------
  // Scripted Smoke Test & Walkthrough Demo
  // --------------------------------------------------------------------------
  let walkthroughInterval = null;

  function runWalkthrough(stepByStep = true) {
    if (walkthroughInterval) {
      clearInterval(walkthroughInterval);
      walkthroughInterval = null;
    }

    newGame();
    say('');
    say('[AUTOMATED DEMO] Starting Dracula Slayer Walkthrough...', 'accent');

    const steps = [
      'take lantern', 'take mutton', 'e', 'take crucifix', 'w', 'n', 'n',
      'throw mutton', 'e', 'take mallet', 'w', 'w', 'take water', 'e',
      'n', 'show crucifix', 'e', 'take dagger', 'w', 'n', 'take leg', 'carve leg', 's',
      'u', 'move portrait', 'take key', 'd', 'light lantern', 'd',
      'sprinkle water', 'open door', 'e', 'open coffin', 'stake dracula'
    ];

    if (!stepByStep) {
      steps.forEach(cmd => executeCommand(cmd));
      return;
    }

    let i = 0;
    const inputField = document.getElementById('dracula-input');
    if (inputField) inputField.disabled = true;

    walkthroughInterval = setInterval(() => {
      if (i >= steps.length || state.over) {
        clearInterval(walkthroughInterval);
        walkthroughInterval = null;
        if (inputField) {
          inputField.disabled = false;
          inputField.focus();
        }
        return;
      }
      executeCommand(steps[i]);
      i++;
    }, 600);
  }

  // --------------------------------------------------------------------------
  // DOM Event Listeners & Terminal Controls
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('dracula-input');
    const form = document.getElementById('dracula-form');
    const btnNewGame = document.getElementById('btn-dracula-new');
    const btnWalkthrough = document.getElementById('btn-dracula-demo');
    const btnSoundToggle = document.getElementById('btn-dracula-sound');
    const btnScanlines = document.getElementById('btn-dracula-scanlines');
    const terminalBox = document.getElementById('dracula-terminal-box');

    if (form && input) {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const cmd = input.value.trim();
        if (!cmd) return;
        commandHistory.push(cmd);
        historyIndex = commandHistory.length;
        input.value = '';
        executeCommand(cmd);
      });

      input.addEventListener('keydown', e => {
        if (e.key === 'ArrowUp') {
          if (historyIndex > 0) {
            historyIndex--;
            input.value = commandHistory[historyIndex];
          }
          e.preventDefault();
        } else if (e.key === 'ArrowDown') {
          if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            input.value = commandHistory[historyIndex];
          } else {
            historyIndex = commandHistory.length;
            input.value = '';
          }
          e.preventDefault();
        }
      });
    }

    // Direction D-Pad Buttons
    ['n', 's', 'e', 'w', 'u', 'd'].forEach(d => {
      const btn = document.getElementById('dracula-dir-' + d);
      if (btn) {
        btn.addEventListener('click', () => {
          executeCommand(d.toUpperCase());
          if (input) input.focus();
        });
      }
    });

    // Quick Action Chips
    const quickActions = {
      'btn-qa-look': 'LOOK',
      'btn-qa-inv': 'INVENTORY',
      'btn-qa-light': 'LIGHT LANTERN',
      'btn-qa-douse': 'DOUSE LANTERN',
      'btn-qa-score': 'SCORE',
      'btn-qa-pray': 'PRAY',
      'btn-qa-help': 'HELP',
      'btn-qa-save': 'SAVE',
      'btn-qa-load': 'LOAD'
    };

    Object.keys(quickActions).forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', () => {
          executeCommand(quickActions[id]);
          if (input) input.focus();
        });
      }
    });

    if (btnNewGame) {
      btnNewGame.addEventListener('click', () => {
        if (walkthroughInterval) {
          clearInterval(walkthroughInterval);
          walkthroughInterval = null;
        }
        if (input) input.disabled = false;
        newGame();
        if (input) input.focus();
      });
    }

    if (btnWalkthrough) {
      btnWalkthrough.addEventListener('click', () => {
        runWalkthrough(true);
      });
    }

    if (btnSoundToggle) {
      btnSoundToggle.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        btnSoundToggle.textContent = soundEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF';
        btnSoundToggle.classList.toggle('active', soundEnabled);
        if (soundEnabled) playTone(440, 0.1);
      });
    }

    if (btnScanlines && terminalBox) {
      btnScanlines.addEventListener('click', () => {
        terminalBox.classList.toggle('scanlines-enabled');
        const active = terminalBox.classList.contains('scanlines-enabled');
        btnScanlines.classList.toggle('active', active);
      });
    }

    // Auto-focus input when clicking terminal screen
    if (terminalScreen && input) {
      terminalScreen.addEventListener('click', () => input.focus());
    }

    // Initialize game
    newGame();
  });
})();
