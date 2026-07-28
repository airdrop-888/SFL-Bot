// ============================================================
// Sunflower Land Automation v6.1 - Smart + Reconnect + Persistence + XP Tracking
// ============================================================

(function() {
  'use strict';

  if (window.sfl && window.sfl.version) {
    console.log(`%c[SFL] v${window.sfl.version} running. sfl.stop() first.`, 'color:#FF9800;font-weight:bold');
    return;
  }

  // ======================== GAME DATA ========================

  const LEVEL_XP = {1:0,2:2,3:22,4:205,5:555,6:1155,7:2155,8:3405,9:5405,10:7905,11:10905,12:14405,13:18405,14:22905,15:27905,16:33655,17:40155,18:47405,19:55405,20:64155,21:73905,22:84655,23:96405,24:109155,25:122905,26:137405,27:152905,28:169405,29:186905,30:205405};
  function getLevel(xp) { for (let l = 200; l >= 1; l--) { if (LEVEL_XP[l] !== undefined && xp >= LEVEL_XP[l]) return l; } return 1; }

  const SEASONAL = {
    spring: ['Sunflower Seed','Rhubarb Seed','Carrot Seed','Cabbage Seed','Soybean Seed','Corn Seed','Wheat Seed','Kale Seed','Barley Seed','Tomato Seed','Blueberry Seed','Orange Seed','Sunpetal Seed','Bloom Seed','Lily Seed','Lavender Seed','Rice Seed','Olive Seed','Grape Seed'],
    summer: ['Sunflower Seed','Potato Seed','Zucchini Seed','Pepper Seed','Beetroot Seed','Cauliflower Seed','Eggplant Seed','Radish Seed','Wheat Seed','Lemon Seed','Orange Seed','Banana Plant','Sunpetal Seed','Bloom Seed','Lily Seed','Gladiolus Seed','Rice Seed','Olive Seed','Grape Seed'],
    autumn: ['Potato Seed','Pumpkin Seed','Carrot Seed','Yam Seed','Broccoli Seed','Soybean Seed','Wheat Seed','Barley Seed','Artichoke Seed','Tomato Seed','Apple Seed','Banana Plant','Sunpetal Seed','Bloom Seed','Lily Seed','Clover Seed','Rice Seed','Olive Seed','Grape Seed'],
    winter: ['Potato Seed','Cabbage Seed','Beetroot Seed','Cauliflower Seed','Parsnip Seed','Onion Seed','Turnip Seed','Wheat Seed','Kale Seed','Lemon Seed','Blueberry Seed','Apple Seed','Sunpetal Seed','Bloom Seed','Lily Seed','Edelweiss Seed','Rice Seed','Olive Seed','Grape Seed'],
  };

  const SEEDS = {
    'Sunflower Seed':{level:1,sec:60,xp:1,crop:'Sunflower',price:0.01},'Potato Seed':{level:2,sec:300,xp:3,crop:'Potato',price:0.05},
    'Pumpkin Seed':{level:3,sec:1800,xp:5,crop:'Pumpkin',price:0.10},'Rhubarb Seed':{level:3,sec:1200,xp:5,crop:'Rhubarb',price:0.10},
    'Carrot Seed':{level:4,sec:2700,xp:8,crop:'Carrot',price:0.50},'Cabbage Seed':{level:5,sec:3600,xp:12,crop:'Cabbage',price:1},
    'Soybean Seed':{level:5,sec:3600,xp:12,crop:'Soybean',price:1},'Barley Seed':{level:6,sec:3600,xp:12,crop:'Barley',price:1},
    'Turnip Seed':{level:6,sec:3600,xp:12,crop:'Turnip',price:1},'Beetroot Seed':{level:7,sec:4500,xp:16,crop:'Beetroot',price:1.50},
    'Zucchini Seed':{level:8,sec:5400,xp:20,crop:'Zucchini',price:2},'Yam Seed':{level:8,sec:5400,xp:20,crop:'Yam',price:2},
    'Onion Seed':{level:8,sec:5400,xp:20,crop:'Onion',price:2},'Broccoli Seed':{level:10,sec:7200,xp:25,crop:'Broccoli',price:3},
    'Cauliflower Seed':{level:10,sec:7200,xp:25,crop:'Cauliflower',price:3},'Pepper Seed':{level:12,sec:7200,xp:30,crop:'Pepper',price:4},
    'Parsnip Seed':{level:13,sec:9000,xp:35,crop:'Parsnip',price:5},'Artichoke Seed':{level:14,sec:10800,xp:40,crop:'Artichoke',price:6},
    'Eggplant Seed':{level:16,sec:10800,xp:45,crop:'Eggplant',price:7},'Corn Seed':{level:18,sec:14400,xp:55,crop:'Corn',price:10},
    'Radish Seed':{level:20,sec:3600,xp:40,crop:'Radish',price:3},'Wheat Seed':{level:23,sec:1800,xp:20,crop:'Wheat',price:1},
    'Kale Seed':{level:26,sec:21600,xp:70,crop:'Kale',price:10},
    'Tomato Seed':{level:13,sec:7200,xp:10,crop:'Tomato',isFruit:true,price:1},
    'Lemon Seed':{level:12,sec:14400,xp:10,crop:'Lemon',isFruit:true,price:1},
    'Blueberry Seed':{level:13,sec:21600,xp:10,crop:'Blueberry',isFruit:true,price:1},
    'Orange Seed':{level:14,sec:28800,xp:10,crop:'Orange',isFruit:true,price:1},
    'Apple Seed':{level:15,sec:43200,xp:10,crop:'Apple',isFruit:true,price:1},
    'Banana Plant':{level:16,sec:43200,xp:10,crop:'Banana',isFruit:true,price:1},
  };

  const CROP_SELL_ORDER = ['Parsnip','Corn','Artichoke','Pepper','Eggplant','Kale','Beetroot','Broccoli','Cauliflower','Onion','Zucchini','Yam','Cabbage','Soybean','Barley','Turnip','Carrot','Pumpkin','Rhubarb','Wheat','Potato','Sunflower'];

  const ALL_RECIPES = {
    'Rhubarb Tart':{building:'Fire Pit',xp:5,sec:60,ingredients:{Rhubarb:3}},
    'Mashed Potato':{building:'Fire Pit',xp:3,sec:30,ingredients:{Potato:8}},
    'Pumpkin Soup':{building:'Fire Pit',xp:24,sec:180,ingredients:{Pumpkin:10}},
    'Reindeer Carrot':{building:'Fire Pit',xp:36,sec:300,ingredients:{Carrot:5}},
    'Mushroom Soup':{building:'Fire Pit',xp:56,sec:600,ingredients:{'Wild Mushroom':5}},
    'Popcorn':{building:'Fire Pit',xp:200,sec:720,ingredients:{Sunflower:100,Corn:5}},
    'Bumpkin Broth':{building:'Fire Pit',xp:96,sec:1200,ingredients:{Carrot:10,Cabbage:5}},
    'Boiled Eggs':{building:'Fire Pit',xp:90,sec:3600,ingredients:{Egg:10}},
    'Kale Stew':{building:'Fire Pit',xp:400,sec:7200,ingredients:{Kale:10}},
    'Kale Omelette':{building:'Fire Pit',xp:1250,sec:12600,ingredients:{Egg:40,Kale:5}},
    'Fried Tofu':{building:'Fire Pit',xp:400,sec:5400,ingredients:{Soybean:15,Sunflower:200}},
    'Rice Bun':{building:'Fire Pit',xp:2600,sec:18000,ingredients:{Rice:2,Wheat:50}},
    'Antipasto':{building:'Fire Pit',xp:3000,sec:10800,ingredients:{Olive:2,Grape:2}},
    'Sunflower Crunch':{building:'Kitchen',xp:50,sec:600,ingredients:{Sunflower:300}},
    'Mushroom Jacket Potatoes':{building:'Kitchen',xp:240,sec:600,ingredients:{'Wild Mushroom':10,Potato:5}},
  };

  const TOOL_COSTS = { Axe:{price:20,ingredients:{}}, Pickaxe:{price:20,ingredients:{Wood:3}} };

  // Build "crops used in recipes" lookup — these are MORE valuable cooked than raw
  const RECIPE_INGREDIENTS = {};
  for (const [, r] of Object.entries(ALL_RECIPES)) {
    for (const [item] of Object.entries(r.ingredients)) {
      RECIPE_INGREDIENTS[item] = true;
    }
  }

  const COMPOSTER_BUILDINGS = ['Compost Bin', 'Worm'];

  // ======================== CONFIG ========================

  const CFG = { SAVE_MS:60000, AUTO_SAVE:true, AUTO_HARVEST:true, AUTO_PLANT:true, AUTO_COOK:true, AUTO_CHOP:true, AUTO_MINE:true, AUTO_CRAFT_TOOLS:true, AUTO_BUY_SEEDS:true, AUTO_SELL:true, AUTO_FRUIT:true, AUTO_COMPOSTER:true, SELL_KEEP:50, LOG_LEVEL:'info' };

  // ======================== STATE ========================

  const S = { on:false, paused:false, svc:null, lvl:0, xp:0, asc:0, season:null, bldgs:[], feats:{}, start:null, tickId:null, saveId:null, reconnectId:null, stats:{harvested:0,planted:0,cooked:0,collected:0,chopped:0,mined:0,crafted:0,eaten:0,delivered:0,sold:0,fruits:0,composted:0,bought:0,errors:0}, tasks:{}, xpHistory:[] };

  // ======================== UTILS ========================

  const L = {
    i: (...a) => CFG.LOG_LEVEL !== 'silent' && console.log('%c[SFL]', 'color:#4CAF50;font-weight:bold', ...a),
    w: (...a) => console.warn('%c[SFL]', 'color:#FF9800', ...a),
    e: (...a) => console.error('%c[SFL]', 'color:#F44336;font-weight:bold', ...a),
    d: (...a) => CFG.LOG_LEVEL === 'debug' && console.log('%c[DBG]', 'color:#888', ...a),
  };

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const fmt = n => Number(n).toLocaleString();
  const fmtT = ms => { if (ms <= 0) return 'now'; if (ms < 60000) return `${Math.floor(ms/1000)}s`; if (ms < 3600000) return `${Math.floor(ms/60000)}m ${Math.floor((ms%60000)/1000)}s`; return `${Math.floor(ms/3600000)}h ${Math.floor((ms%3600000)/60000)}m`; };

  // ======================== PERSISTENCE (localStorage) ========================

  function saveStats() {
    try {
      const data = { stats: S.stats, xpHistory: S.xpHistory };
      localStorage.setItem('sfl_stats', JSON.stringify(data));
    } catch {}
  }

  function loadStats() {
    try {
      const raw = localStorage.getItem('sfl_stats');
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data.stats) Object.assign(S.stats, data.stats);
      if (data.xpHistory) S.xpHistory = data.xpHistory;
      L.i('📂 Loaded stats from previous session');
    } catch {}
  }

  // ======================== GAME SERVICE ========================

  function findGS() {
    function walk(f, d) {
      if (!f || d <= 0) return null;
      let h = f.memoizedState;
      while (h) { const v = h.memoizedState; if (v?.gameService?.send) return v.gameService; if (v?.value?.gameService?.send) return v.value.gameService; if (v?.current?.gameService?.send) return v.current.gameService; h = h.next; }
      if (f.memoizedProps?.gameService?.send) return f.memoizedProps.gameService;
      if (f.memoizedProps?.value?.gameService?.send) return f.memoizedProps.value.gameService;
      return walk(f.child, d - 1) || walk(f.sibling, d - 1);
    }
    try { const root = document.getElementById('root'); if (root) { const k = Object.keys(root).find(k => k.startsWith('__reactFiber$')); if (k) { const r = walk(root[k], 500); if (r) return r; } } } catch {}
    try { for (const el of document.querySelectorAll('div,canvas,section')) { const k = Object.keys(el).find(k => k.startsWith('__reactFiber$')); if (k) { let f = el[k], d = 0; while (f && d < 30) { if (f.memoizedProps?.value?.gameService?.send) return f.memoizedProps.value.gameService; f = f.return; d++; } } } } catch {}
    try { for (const k of Object.getOwnPropertyNames(window)) { try { const v = window[k]; if (v?.send && v?.getSnapshot) { const snap = v.getSnapshot(); if (snap?.context?.state) return v; } } catch {} } } catch {}
    return null;
  }

  function gs() { try { return S.svc?.getSnapshot()?.context?.state || null; } catch { return null; } }
  function send(type, payload = {}) {
    if (!S.svc) return false;
    try { S.svc.send(type, payload); return true; }
    catch(e) { S.stats.errors++; L.d(`Error: ${type} - ${e.message}`); return false; }
  }

  // ======================== AUTO-RECONNECT ========================

  function startReconnect() {
    if (S.reconnectId) return;
    S.reconnectId = setInterval(() => {
      if (!S.on || S.paused) return;
      if (!S.svc || !gs()) {
        L.w('🔄 Lost connection — reconnecting...');
        S.svc = findGS();
        if (S.svc && gs()) {
          updateState();
          L.i('✅ Reconnected! Level ' + S.lvl + ' | Coins: ' + fmt(coins()));
        }
      }
    }, 30000);
  }

  function stopReconnect() {
    if (S.reconnectId) { clearInterval(S.reconnectId); S.reconnectId = null; }
  }

  // ======================== STATE HELPERS ========================

  function updateState() {
    const g = gs(); if (!g) return;
    const b = g.bumpkin;
    if (b) { S.lvl = getLevel(b.experience || 0); S.xp = b.experience || 0; S.asc = b.ascensionLevel || 0; }
    S.season = g.season?.season || 'spring';
    S.bldgs = [];
    if (g.buildings) for (const [n, i] of Object.entries(g.buildings)) if (i?.length) S.bldgs.push(n);
    const has = n => S.bldgs.includes(n);
    S.feats = {
      plant: S.lvl >= 1,
      cook: has('Fire Pit') || has('Kitchen'),
      chop: true, mine: true,
      fruit: S.lvl >= 12 && !!(g.fruitPatches && Object.keys(g.fruitPatches).length),
      animals: (S.lvl >= 6 && has('Hen House')) || (S.lvl >= 14 && has('Barn')),
      pets: !!(g.pets && Object.keys(g.pets).length > 0),
      composter: has('Compost Bin') || has('Worm'),
    };
  }

  function toolCount(name) { return Number(gs()?.inventory?.[name] || 0); }
  function coins() { return gs()?.coins || 0; }
  function hasItems(items) { const inv = gs()?.inventory || {}; return Object.entries(items).every(([k, v]) => Number(inv[k] || 0) >= v); }
  function invCount(name) { return Number(gs()?.inventory?.[name] || 0); }

  // ======================== XP/HOUR TRACKING ========================

  function trackXP() {
    S.xpHistory.push({ time: Date.now(), xp: S.xp });
    if (S.xpHistory.length > 200) S.xpHistory = S.xpHistory.slice(-100);
  }

  function getXPPerHour() {
    if (S.xpHistory.length < 2) return 0;
    const first = S.xpHistory[0];
    const last = S.xpHistory[S.xpHistory.length - 1];
    const elapsedMs = last.time - first.time;
    if (elapsedMs < 60000) return 0; // Need at least 1 minute of data
    const xpGained = last.xp - first.xp;
    return (xpGained / (elapsedMs / 3600000));
  }

  function getTimeToLevel() {
    const rate = getXPPerHour();
    if (rate <= 0) return 'unknown';
    const next = LEVEL_XP[S.lvl + 1] || Infinity;
    if (next === Infinity) return 'MAX';
    const need = next - S.xp;
    const hours = need / rate;
    if (hours < 1) return Math.floor(hours * 60) + 'm';
    return Math.floor(hours) + 'h ' + Math.floor((hours % 1) * 60) + 'm';
  }

  // ======================== RATE LIMIT PROTECTION ========================

  let baseGap = 3000;
  let currentGap = 3000;
  let rateLimitHits = 0;

  function onRateLimit() {
    rateLimitHits++;
    currentGap = Math.min(baseGap * Math.pow(2, rateLimitHits), 15000);
    L.w(`⚠️ Rate limit! Gap now ${currentGap/1000}s`);
  }

  function onRateLimitOk() {
    if (rateLimitHits > 0) rateLimitHits--;
    currentGap = Math.max(baseGap, baseGap * Math.pow(2, rateLimitHits));
  }

  // ======================== AUTO-CRAFT TOOLS ========================

  async function ensureTool(name, minCount) {
    if (toolCount(name) >= minCount) return true;
    if (!CFG.AUTO_CRAFT_TOOLS) return false;
    const tool = TOOL_COSTS[name];
    if (!tool) return false;
    if (coins() < tool.price) { L.i(`❌ Need ${tool.price} coins for ${name}, have ${Math.floor(coins())}`); return false; }
    if (!hasItems(tool.ingredients)) { L.i(`❌ Missing: ${Object.entries(tool.ingredients).map(([k,v])=>`${k}(${v})`).join(', ')}`); return false; }
    L.i(`🛠️ Crafting ${name} (${tool.price} coins)...`);
    const before = toolCount(name);
    send('tool.crafted', { tool: name, amount: 1 });
    for (let i = 0; i < 10; i++) { await sleep(500); if (toolCount(name) > before) { L.i(`✅ Crafted ${name}! (${toolCount(name)} now)`); S.stats.crafted++; return true; } }
    return false;
  }

  // ======================== DELIVERY HELPERS ========================

  function getDeliveryNeeds() {
    const g = gs(); if (!g?.delivery?.orders) return null;
    const now = Date.now();
    const inv = g.inventory || {};
    const needs = {};
    let totalReward = 0;
    for (const order of g.delivery.orders) {
      if (order.completedAt || now < order.readyAt) continue;
      const items = order.items || {};
      for (const [item, amt] of Object.entries(items)) {
        if (item === 'coins') continue;
        const need = Number(amt || 0);
        const have = Number(inv[item] || 0);
        const diff = need - have;
        if (diff > 0) {
          if (!needs[item]) needs[item] = { need: 0, have: 0 };
          needs[item].need += diff;
          needs[item].have = have;
        }
      }
      totalReward += Number(order.reward?.coins || 0);
    }
    return { needs, totalReward, orderCount: Object.keys(needs).length };
  }

  function getDeliveryPrioritySeed() {
    const g = gs(); if (!g) return null;
    const inv = g.inventory || {};
    const season = S.season || 'spring';
    const seasonal = SEASONAL[season] || SEASONAL.spring;
    const deliveryNeeds = getDeliveryNeeds();
    if (!deliveryNeeds || !Object.keys(deliveryNeeds.needs).length) return null;

    let bestDelivery = null;
    let bestNormal = null;

    for (const name of seasonal) {
      const def = SEEDS[name];
      if (!def || def.isFruit || S.lvl < def.level) continue;
      const crop = def.crop;
      const seedAmt = Number(inv[name] || 0);
      if (seedAmt <= 0) continue;
      const xpPerMin = def.xp / (def.sec / 60);

      const need = deliveryNeeds.needs[crop];
      if (need && need.need > 0) {
        if (!bestDelivery || need.need > bestDelivery.deliveryNeed) {
          bestDelivery = { name, crop, sec: def.sec, amt: seedAmt, deliveryNeed: need.need, xpPerMin, isDelivery: true };
        }
      } else {
        if (!bestNormal || xpPerMin > bestNormal.xpPerMin) {
          bestNormal = { name, crop, sec: def.sec, amt: seedAmt, xpPerMin, isDelivery: false };
        }
      }
    }

    return bestDelivery || bestNormal;
  }

  // ======================== SMART SEED SELECTION ========================

  function pickBestSeed() {
    return getDeliveryPrioritySeed();
  }

  // ======================== SMART BUY SEEDS ========================

  function getSeasonalSeeds() {
    const inv = gs()?.inventory || {};
    const coinsAvail = coins();
    const season = S.season || 'spring';
    const seasonal = SEASONAL[season] || SEASONAL.spring;
    const empty = Object.values(gs()?.crops || {}).filter(p => !p.crop).length;
    if (empty === 0) return null;

    // PRIORITY 1: Buy seed for delivery crop
    const deliveryNeeds = getDeliveryNeeds();
    if (deliveryNeeds) {
      for (const name of seasonal) {
        const def = SEEDS[name];
        if (!def || def.isFruit || S.lvl < def.level) continue;
        const need = deliveryNeeds.needs[def.crop];
        if (!need || need.need <= 0) continue;
        const have = Number(inv[name] || 0);
        if (have >= need.need) continue; // Already have enough
        const buyAmt = Math.min(need.need - have, 5, empty);
        const cost = (def.price || 0.01) * buyAmt;
        if (coinsAvail >= cost) {
          return { name, price: def.price || 0.01, xp: def.xp, sec: def.sec, xpPerMin: def.xp / (def.sec / 60), need: buyAmt, have, isDeliveryBuy: true };
        }
      }
    }

    // PRIORITY 2: Buy best XP/min seasonal seed
    const candidates = seasonal
      .filter(name => {
        const def = SEEDS[name];
        if (!def || def.isFruit) return false;
        if (S.lvl < def.level) return false;
        return coinsAvail >= (def.price || 0.01) * empty;
      })
      .map(name => {
        const def = SEEDS[name];
        const have = Number(inv[name] || 0);
        return { name, price: def.price || 0.01, xp: def.xp, sec: def.sec, xpPerMin: def.xp / (def.sec / 60), need: Math.min(empty, 5), have, isDeliveryBuy: false };
      })
      .filter(s => s.have === 0)
      .sort((a, b) => b.xpPerMin - a.xpPerMin);

    return candidates.length > 0 ? candidates[0] : null;
  }

  // ======================== SMART SELL ========================

  function getSellableCrops() {
    const g = gs(); if (!g?.inventory) return [];
    const inv = g.inventory;
    const toSell = [];

    // Don't sell crops that are useful as recipe ingredients
    // unless we have a LOT of them
    const delivNeeds = getDeliveryNeeds();
    const needItems = delivNeeds ? Object.keys(delivNeeds.needs) : [];

    for (const crop of CROP_SELL_ORDER) {
      const amt = Number(inv[crop] || 0);
      if (amt <= 0) continue;

      // Keep enough for delivery
      const keepForDelivery = delivNeeds?.needs[crop] ? delivNeeds.needs[crop].need : 0;

      // Keep extra for recipe ingredients (2x recipe amount)
      let keepForRecipes = 0;
      if (RECIPE_INGREDIENTS[crop]) {
        keepForRecipes = CFG.SELL_KEEP;
      }

      const totalKeep = keepForDelivery + keepForRecipes;
      const sellable = amt - totalKeep;
      if (sellable > 0) {
        toSell.push({ crop, amount: sellable, keep: totalKeep });
      }
    }
    return toSell;
  }

  // ======================== AUTO-SELL CROPS ========================

  async function doSell() {
    if (!CFG.AUTO_SELL) return false;
    const g = gs(); if (!g) return false;
    const sellable = getSellableCrops();
    if (!sellable.length) return false;

    let soldAny = false;
    for (const { crop, amount } of sellable) {
      L.i(`💰 Selling ${amount}x ${crop}...`);
      if (send('crop.sold', { crop, amount })) {
        S.stats.sold += amount;
        soldAny = true;
        await sleep(rand(500, 1000));
      }
    }
    if (soldAny) {
      await sleep(1000);
      updateState();
      L.i(`💰 Sold! Coins: ${fmt(coins())}`);
    }
    return soldAny;
  }

  // ======================== FRUIT HARVEST ========================

  async function doHarvestFruit() {
    if (!S.feats.fruit || !CFG.AUTO_FRUIT) return false;
    const g = gs(); if (!g?.fruitPatches) return false;
    const now = Date.now();
    let count = 0;

    for (const [id, patch] of Object.entries(g.fruitPatches)) {
      if (!patch.fruit || patch.fruit.harvestedAt) continue;
      if (patch.fruit.plantedAt) {
        const seedDef = SEEDS[patch.fruit.seed || ''];
        const growMs = seedDef ? seedDef.sec * 1000 : 3600000;
        if (now < patch.fruit.plantedAt + growMs) continue;
      }
      L.i(`🍋 Harvesting fruit patch #${id}...`);
      if (send('fruit.harvested', { index: id })) {
        S.stats.fruits++;
        count++;
        await sleep(rand(500, 1000));
      }
    }
    if (count > 0) L.i(`Lemon harvested: ${count} patches`);
    return count > 0;
  }

  // ======================== COMPOSTER ========================

  async function doComposter() {
    if (!S.feats.composter || !CFG.AUTO_COMPOSTER) return false;
    const g = gs(); if (!g?.buildings) return false;
    let didSomething = false;

    for (const bName of COMPOSTER_BUILDINGS) {
      const instances = g.buildings[bName];
      if (!instances) continue;
      for (const inst of instances) {
        const crafting = inst.crafting || [];
        const ready = crafting.filter(c => c.readyAt <= Date.now());
        for (const c of ready) {
          L.i(`♻️ Collecting compost from ${bName}#${inst.id}...`);
          if (send('compost.collected', { buildingId: inst.id, building: bName })) {
            S.stats.composted++;
            didSomething = true;
            await sleep(rand(500, 1000));
          }
        }
        const hasActive = crafting.some(c => c.readyAt > Date.now());
        if (!hasActive && ready.length === 0) {
          L.i(`♻️ Starting compost in ${bName}#${inst.id}...`);
          if (send('composter.started', { buildingId: inst.id, building: bName })) {
            didSomething = true;
            await sleep(500);
          }
        }
      }
    }
    return didSomething;
  }

  // ======================== COOKING HELPERS ========================

  function getReadyRecipes(buildingName) {
    const g = gs(); if (!g?.buildings?.[buildingName]) return [];
    const now = Date.now(); const ready = [];
    for (const inst of g.buildings[buildingName]) { for (const c of (inst.crafting || [])) { if (c.readyAt <= now) ready.push({ buildingId: inst.id, building: buildingName, recipe: c.name }); } }
    return ready;
  }

  function getFreeSlot(buildingName) {
    const g = gs(); if (!g?.buildings?.[buildingName]) return null;
    const now = Date.now();
    for (const inst of g.buildings[buildingName]) { const crafting = inst.crafting || []; if (!crafting.some(c => c.readyAt > now)) return inst.id; }
    return null;
  }

  function pickBestRecipe() {
    const g = gs(); if (!g) return null;
    const inv = g.inventory || {}; let best = null;
    for (const [name, r] of Object.entries(ALL_RECIPES)) {
      const slot = getFreeSlot(r.building); if (!slot) continue;
      let canCook = true;
      for (const [ing, need] of Object.entries(r.ingredients)) { if (Number(inv[ing] || 0) < need) { canCook = false; break; } }
      if (!canCook) continue;
      const xpPerMin = r.xp / (r.sec / 60);
      if (!best || xpPerMin > best.xpPerMin) best = { name, building: r.building, buildingId: slot, xp: r.xp, sec: r.sec, xpPerMin };
    }
    return best;
  }

  // ======================== TASK ACTIONS ========================

  async function doHarvest() {
    const g = gs(); if (!g?.crops) return false;
    const cropCount = Object.keys(g.crops).length;
    if (cropCount === 0) return false;
    L.i('🌾 Bulk harvest (' + cropCount + ' plots)...');
    const ok = send('crops.bulkHarvested');
    if (ok) {
      S.stats.harvested++;
      // Chain: immediately try to plant
      S.tasks.plant.nextRun = Date.now() + 1000;
      // Don't try harvest again for 30s (server needs time to update state)
      S.tasks.harvest.nextRun = Date.now() + 30000;
    }
    return ok;
  }

  async function doPlant() {
    const g = gs(); if (!g?.crops) return false;
    const empty = Object.values(g.crops).filter(p => !p.crop).length;
    if (empty === 0) {
      // No empty plots — don't check again for 60s
      S.tasks.plant.nextRun = Date.now() + 60000;
      return false;
    }
    const seed = pickBestSeed();
    if (!seed || seed.amt <= 0) {
      // No seeds — try buying, then check again in 15s
      S.tasks.buy.nextRun = Date.now();
      S.tasks.plant.nextRun = Date.now() + 15000;
      return false;
    }
    const label = seed.isDelivery ? '📦DELIVERY' : 'XP';
    L.i(`🌱 Planting ${seed.name} → ${seed.crop} (${Math.min(empty, seed.amt)} plots, ${Math.round(seed.sec/60)}min, ${label})`);
    if (send('seeds.bulkPlanted', { seed: seed.name })) {
      S.stats.planted++;
      // Chain: set harvest to grow time (use 80% of grow time to be early)
      const growMs = Math.max(seed.sec * 1000 * 0.8, 30000);
      S.tasks.harvest.nextRun = Date.now() + growMs;
      S.tasks.plant.nextRun = Date.now() + 60000;
      L.i(`  ⏰ Harvest in ${fmtT(growMs)}`);
      return true;
    }
    return false;
  }

  async function doEat() {
    const food = getBestFood();
    if (!food) return false;
    L.i('🍽️ Eating ' + food.name + ' (+' + food.xp + ' XP)...');
    if (send('bumpkin.feed', { food: food.name, amount: 1 })) {
      S.stats.eaten = (S.stats.eaten || 0) + 1;
      await sleep(800);
      updateState();
      L.i('🍽️ Fed! Now: Level ' + S.lvl + ' | XP: ' + fmt(S.xp));
      return true;
    }
    return false;
  }

  const FOOD_XP = {
    'Parsnip': 6, 'Mashed Potato': 3, 'Pumpkin Soup': 24,
    'Reindeer Carrot': 36, 'Bumpkin Broth': 40, 'Goblin Treat': 30,
    'Roasted Cauliflower': 52, 'Sauerkraut': 50, 'Vegetable Medley': 62,
    'Pumpkin Feasts': 90, 'Apple Pie': 80, 'Bread': 5,
    'Eggplant Stuffed': 65, 'Rhubarb Tart': 5, 'Radish Pie': 40,
  };

  function getBestFood() {
    const inv = gs()?.inventory || {};
    const foods = [];
    for (const [name, xp] of Object.entries(FOOD_XP)) {
      const amt = Number(inv[name] || 0);
      if (amt > 0) foods.push({ name, xp, amt });
    }
    if (!foods.length) return null;
    foods.sort((a, b) => b.xp - a.xp);
    return foods[0];
  }

  async function doBuySeeds() {
    if (!CFG.AUTO_BUY_SEEDS) return false;
    const seed = getSeasonalSeeds();
    if (!seed) return false;
    
    let boughtCount = 0;
    for (let i = 0; i < seed.need; i++) {
      if (coins() < seed.price) break;
      const label = seed.isDeliveryBuy ? '📦DELIVERY' : 'XP';
      L.i(`Buying 1x ${seed.name} (${seed.price.toFixed(2)} coins, ${label})...`);
      if (send('seed.bought', { item: seed.name, amount: 1 })) {
        boughtCount++;
        S.stats.bought = (S.stats.bought || 0) + 1;
        await sleep(rand(2000, 3000));
        updateState();
      } else {
        break;
      }
    }
    
    if (boughtCount > 0) {
      L.i(`Bought ${boughtCount}x ${seed.name}! (Coins: ${fmt(coins())})`);
      return true;
    }
    return false;
  }

  async function doCook() {
    if (!S.feats.cook) return false;
    let collected = false;
    for (const bldg of ['Fire Pit', 'Kitchen']) {
      const ready = getReadyRecipes(bldg);
      for (const item of ready) {
        L.i(`📦 Collecting ${item.recipe} from ${item.building}...`);
        if (send('recipes.collected', { buildingId: item.buildingId, building: item.building })) { S.stats.collected++; collected = true; await sleep(rand(500, 1000)); }
      }
    }
    if (collected) await sleep(1000);
    const recipe = pickBestRecipe();
    if (!recipe) { S.tasks.cook.nextRun = Date.now() + 30000; return collected; }
    L.i(`🍳 Cooking ${recipe.name} (${recipe.xp} XP, ${Math.round(recipe.sec/60)}min)`);
    if (send('recipe.cooked', { item: recipe.name, buildingId: recipe.buildingId })) { S.stats.cooked++; S.tasks.cook.nextRun = Date.now() + (recipe.sec * 1000) + 5000; return true; }
    return false;
  }

  async function doDeliver() {
    const g = gs(); if (!g?.delivery?.orders) return false;
    const now = Date.now();
    const inv = g.inventory || {};
    const ready = g.delivery.orders.filter(o => !o.completedAt && now > o.readyAt);
    if (!ready.length) { S.tasks.deliver.nextRun = now + 30000; return false; }

    for (const order of ready) {
      const items = order.items || {};
      const itemNames = Object.keys(items);
      if (!itemNames.length) continue;
      const hasAll = itemNames.every(name => {
        const need = Number(items[name] || 0);
        if (name === 'coins') return Number(g.coins || 0) >= need;
        return Number(inv[name] || 0) >= need;
      });
      if (!hasAll) {
        const missing = itemNames.filter(name => {
          const need = Number(items[name] || 0);
          if (name === 'coins') return Number(g.coins || 0) < need;
          return Number(inv[name] || 0) < need;
        }).map(name => name + '(' + Number(inv[name] || 0) + '/' + items[name] + ')');
        L.i('Delivery #' + order.id + ' missing: ' + missing.join(', '));
        continue;
      }
      const reward = Number(order.reward?.coins || 0);
      L.i('Delivering to ' + (order.from || 'NPC') + ': ' + itemNames.join(', ') + ' → +' + reward + ' coins');
      if (send('order.delivered', { id: order.id, friendship: true })) {
        S.stats.delivered = (S.stats.delivered || 0) + 1;
        await sleep(2000);
        updateState();
        L.i('Delivery complete! Coins: ' + fmt(coins()));
        return true;
      }
      L.i('Delivery failed for order #' + order.id);
    }
    return false;
  }

  async function doSkipOrders() {
    const g = gs(); if (!g?.delivery?.orders) return false;
    const now = Date.now();
    const inv = g.inventory || {};
    let skipped = false;

    for (const order of g.delivery.orders) {
      if (order.completedAt || now < order.readyAt) continue;
      const items = order.items || {};
      const itemNames = Object.keys(items).filter(n => n !== 'coins');

      // Skip if too many different items
      if (itemNames.length > 3) {
        L.i('Skip #' + order.id + ' (too many items: ' + itemNames.length + ')');
        if (send('order.skipped', { id: order.id })) { await sleep(1000); skipped = true; }
        continue;
      }

      // Skip if any crop need > 50 and we have < 10
      const tooHard = itemNames.some(name => {
        const need = Number(items[name] || 0);
        const have = Number(inv[name] || 0);
        return need > 50 && have < 10;
      });
      if (tooHard) {
        L.i('Skip #' + order.id + ' (need too much)');
        if (send('order.skipped', { id: order.id })) { await sleep(1000); skipped = true; }
      }
    }
    if (skipped) updateState();
    return skipped;
  }

  async function doChop() {
    if (toolCount('Axe') < 1) {
      L.i('No Axes — auto-crafting...');
      if (!await ensureTool('Axe', 1)) {
        S.tasks.chop.nextRun = Date.now() + 60000;
        return false;
      }
    }
    const g = gs(); if (!g?.trees) return false;
    const treeIds = Object.keys(g.trees);
    if (!treeIds.length) return false;

    L.i('Chopping ' + treeIds.length + ' trees (Axe: ' + toolCount('Axe') + ')...');
    let count = 0;
    for (const id of treeIds) {
      if (toolCount('Axe') < 1) {
        if (!await ensureTool('Axe', 1)) break;
      }
      if (send('timber.chopped', { index: id, item: 'Axe' })) {
        S.stats.chopped++; count++;
        await sleep(rand(800, 1500));
      }
    }
    L.i('Chop done: ' + count + '/' + treeIds.length);
    S.tasks.chop.nextRun = Date.now() + (count > 0 ? 300000 : 60000);
    return count > 0;
  }

  async function doMine() {
    const g = gs(); if (!g) return false;
    let minedAny = false;

    const mineRocks = async (resourceMap, eventName) => {
      if (!resourceMap) return;
      for (const id of Object.keys(resourceMap)) {
        if (toolCount('Pickaxe') < 1) {
          if (!(await ensureTool('Pickaxe', 1))) break;
        }
        if (send(eventName, { index: id })) { S.stats.mined++; minedAny = true; await sleep(rand(800, 1200)); }
      }
    };

    if (g.stones) await mineRocks(g.stones, 'stoneRock.mined');
    if (S.lvl >= 5 && g.ironStones) await mineRocks(g.ironStones, 'ironRock.mined');
    if (S.lvl >= 10 && g.goldStones) await mineRocks(g.goldStones, 'goldRock.mined');

    S.tasks.mine.nextRun = Date.now() + 30000;
    return minedAny;
  }

  async function doAnimals() {
    if (!S.feats.animals) return false;
    L.i('🐔 Animals...');
    send('animal.fed'); await sleep(800);
    send('animal.wakeUp'); await sleep(800);
    S.tasks.animals.nextRun = Date.now() + 14400000;
    return true;
  }

  async function doPets() {
    if (!S.feats.pets) return false;
    L.i('🐾 Pets...');
    send('pet.fetched'); await sleep(500);
    send('pet.pet'); await sleep(500);
    send('pet.walked'); await sleep(500);
    send('pet.fed'); await sleep(500);
    S.tasks.pets.nextRun = Date.now() + 43200000;
    return true;
  }

  // ======================== SCHEDULER ========================

  let lastLog = 0;

  function initTasks() {
    const now = Date.now();
    S.tasks = {
      harvest:   { name:'Harvest',   priority:1,  nextRun:now, cooldown:5000,  action:doHarvest },
      plant:     { name:'Plant',     priority:2,  nextRun:now, cooldown:5000,  action:doPlant },
      eat:       { name:'Eat',       priority:3,  nextRun:now, cooldown:5000,  action:doEat },
      buy:       { name:'Buy',       priority:4,  nextRun:now, cooldown:30000, action:doBuySeeds },
      cook:      { name:'Cook',      priority:5,  nextRun:now, cooldown:5000,  action:doCook },
      deliver:   { name:'Deliver',   priority:6,  nextRun:now, cooldown:10000, action:doDeliver },
      sell:      { name:'Sell',      priority:7,  nextRun:now, cooldown:30000, action:doSell },
      fruit:     { name:'Fruit',     priority:8,  nextRun:now, cooldown:30000, action:doHarvestFruit },
      composter: { name:'Compost',   priority:9,  nextRun:now, cooldown:60000, action:doComposter },
      chop:      { name:'Chop',      priority:10, nextRun:now, cooldown:60000, action:doChop },
      mine:      { name:'Mine',      priority:11, nextRun:now, cooldown:60000, action:doMine },
      skip:      { name:'Skip',      priority:12, nextRun:now, cooldown:120000, action:doSkipOrders },
      animals:   { name:'Animals',   priority:13, nextRun:now, cooldown:14400000, action:doAnimals },
      pets:      { name:'Pets',      priority:14, nextRun:now, cooldown:43200000, action:doPets },
    };
  }

  let isRunning = false;
  let lastEventTime = 0;

  async function schedulerTick() {
    if (!S.on || S.paused || isRunning) return;
    isRunning = true;
    const now = Date.now();

    // Track XP every tick
    trackXP();

    const due = Object.entries(S.tasks)
      .filter(([, t]) => t.nextRun <= now)
      .sort(([, a], [, b]) => a.priority - b.priority);

    if (due.length > 0) {
      const [, task] = due[0];
      // Respect EVENT_GAP between server hits
      if (lastEventTime > 0) {
        const gap = Date.now() - lastEventTime;
        if (gap < currentGap) await sleep(currentGap - gap);
      }
      try {
        await task.action();
        lastEventTime = Date.now();
        onRateLimitOk();
        // Only reset cooldown if action didn't set its own nextRun
        if (task.nextRun <= Date.now()) task.nextRun = Date.now() + task.cooldown;
      } catch (e) {
        L.e('Error: ' + task.name, e);
        S.stats.errors++;
        task.nextRun = Date.now() + task.cooldown;
      }
    }

    isRunning = false;
    if (now - lastLog > 30000) {
      lastLog = now;
      const xpRate = getXPPerHour();
      const ttl = getTimeToLevel();
      const nextUp = Object.values(S.tasks).filter(t => t.nextRun > Date.now()).sort((a, b) => a.nextRun - b.nextRun)[0];
      L.i('Cycle | ' + (nextUp ? 'Next: ' + nextUp.name + ' in ' + fmtT(nextUp.nextRun - Date.now()) : 'Idle') + ' | XP: ' + fmt(S.xp) + ' | Coins: ' + fmt(coins()) + ' | Rate: ' + xpRate.toFixed(1) + '/hr | Lvl up: ~' + ttl);
    }
  }

  // ======================== CONTROLS ========================

  function connected() { if (!S.svc) S.svc = findGS(); return !!S.svc; }

  function doStart() {
    if (S.on) { L.w('Already running! sfl.stop() first.'); return; }
    L.i('🚀 Starting SFL v6.1...');
    S.on = true; S.paused = false; S.start = Date.now();
    loadStats();
    initTasks();
    if (connected()) {
      updateState();
      const startXP = S.xp;
      S.xpHistory = [{ time: Date.now(), xp: startXP }];
      L.i(`✅ Level ${S.lvl} | XP: ${fmt(S.xp)} | Season: ${S.season} | Coins: ${fmt(coins())}`);
      L.i(`🪓 Axe: ${toolCount('Axe')} | ⛏️ Pickaxe: ${toolCount('Pickaxe')}`);
      const g = gs();
      if (g) {
        const now = Date.now();
        const trees = g.trees ? Object.values(g.trees).filter(t => {
          if (!t.wood || t.removedAt) return false;
          if (!t.wood.choppedAt) return true;
          return now > t.wood.choppedAt + (t.wood.baseDurationMs || 3600000);
        }).length : 0;
        const stones = g.stones ? Object.keys(g.stones).length : 0;
        const fruits = g.fruitPatches ? Object.values(g.fruitPatches).filter(p => p.fruit && !p.fruit.harvestedAt).length : 0;
        L.i(`Trees: ${trees}/${Object.keys(g.trees||{}).length} | Stones: ${stones} | Fruits: ${fruits}`);
      }
      const deliveryNeeds = getDeliveryNeeds();
      if (deliveryNeeds && Object.keys(deliveryNeeds.needs).length > 0) {
        L.i('📦 Delivery needs:');
        for (const [item, info] of Object.entries(deliveryNeeds.needs)) L.i('  ' + item + ': have ' + info.have + ', need ' + info.need);
        L.i('  💰 Reward: ' + deliveryNeeds.totalReward + ' coins');
      }
      const seed = pickBestSeed();
      if (seed) {
        const label = seed.isDelivery ? '📦DELIVERY' : 'XP';
        L.i(`🌱 Best seed: ${seed.name} (${label}, XP/m: ${seed.xpPerMin.toFixed(1)})`);
      }
      const recipe = pickBestRecipe(); if (recipe) L.i(`🍳 Best recipe: ${recipe.name} (XP/m: ${recipe.xpPerMin.toFixed(1)})`);
      logTasks();
    } else L.w('⚠️ Game not found. sfl.init() after loading.');

    if (S.tickId) clearInterval(S.tickId);
    if (S.saveId) clearInterval(S.saveId);
    S.tickId = setInterval(schedulerTick, 1000);
    S.saveId = setInterval(saveStats, 300000);
    startReconnect();
  }

  function doStop() {
    if (!S.on) { L.w('Not running.'); return; }
    S.on = false; S.paused = false;
    if (S.tickId) clearInterval(S.tickId);
    if (S.saveId) clearInterval(S.saveId);
    stopReconnect();
    saveStats();
    L.i('Stopped. Stats saved.');
  }

  function doPause() { S.paused = true; L.i('⏸️ Paused.'); }
  function doResume() { S.paused = false; L.i('▶️ Resumed.'); }

  function logTasks() {
    const now = Date.now();
    L.i('\nScheduler:');
    for (const [, t] of Object.entries(S.tasks)) {
      const s = t.nextRun <= now ? 'DUE' : 'Wait ' + fmtT(t.nextRun - now);
      L.i('  ' + t.name + ': ' + s);
    }
  }

  function doStatus() {
    updateState();
    const next = LEVEL_XP[S.lvl + 1] || Infinity;
    const cur = LEVEL_XP[S.lvl] || 0;
    const pct = next === Infinity ? 100 : ((S.xp - cur) / (next - cur) * 100).toFixed(1);
    const xpRate = getXPPerHour();
    const ttl = getTimeToLevel();
    L.i(`\n${'═'.repeat(60)}`);
    L.i(`  🌻 SFL v6.1 - Smart Full Auto`);
    L.i(`${'═'.repeat(60)}`);
    L.i(`  Running: ${S.on ? '✅' : '❌'}${S.paused ? ' (PAUSED)' : ''} | Gap: ${currentGap/1000}s`);
    L.i(`  Level: ${S.lvl} (${pct}% to ${S.lvl + 1}) | XP: ${fmt(S.xp)} | Need: ${fmt(next - S.xp)}`);
    L.i(`  XP Rate: ${xpRate.toFixed(1)}/hr | Lvl up in: ~${ttl}`);
    L.i(`  Season: ${S.season} | Coins: ${fmt(coins())}`);
    L.i(`  Tools: 🪓 ${toolCount('Axe')} | ⛏️ ${toolCount('Pickaxe')}`);
    L.i(`  Buildings: ${S.bldgs.join(', ') || 'None'}`);
    if (S.start) L.i(`  Uptime: ${fmtT(Date.now() - S.start)}`);
    const d = getDeliveryNeeds();
    if (d && Object.keys(d.needs).length > 0) {
      L.i(`  📦 Delivery: ${Object.keys(d.needs).map(n => n + '(' + d.needs[n].have + '/' + (d.needs[n].need + d.needs[n].have) + ')').join(', ')} → ${d.totalReward} coins`);
    }
    L.i(`\n  📊 🌾${S.stats.harvested} 🌱${S.stats.planted} 🍳${S.stats.cooked} 📦${S.stats.collected} ⛏️${S.stats.mined} 🪵${S.stats.chopped} 🔨${S.stats.crafted}`);
    L.i(`     🍽️${S.stats.eaten} 💰${S.stats.sold} 📦${S.stats.delivered} 🍋${S.stats.fruits} ♻️${S.stats.composted} 🌱${S.stats.bought} | Err:${S.stats.errors}`);
    logTasks();
    L.i(`${'═'.repeat(60)}`);
  }

  function doEnable(name, val) {
    const map = { harvest:'AUTO_HARVEST', plant:'AUTO_PLANT', cook:'AUTO_COOK', mine:'AUTO_MINE', chop:'AUTO_CHOP', tools:'AUTO_CRAFT_TOOLS', sell:'AUTO_SELL', fruit:'AUTO_FRUIT', composter:'AUTO_COMPOSTER' };
    const k = map[name]; if (!k) { L.w(`Unknown: ${name}. Use: ${Object.keys(map).join(', ')}`); return; }
    CFG[k] = val !== undefined ? !!val : !CFG[k]; L.i(`✅ ${name} = ${CFG[k] ? 'ON' : 'OFF'}`);
  }

  function doConfig(k, v) {
    if (k === undefined) { L.i('\n⚙️ Config:'); for (const [key, val] of Object.entries(CFG)) L.i(`  ${key}: ${JSON.stringify(val)}`); return; }
    if (k in CFG) { if (v !== undefined) { CFG[k] = v; L.i(`✅ ${k} = ${JSON.stringify(v)}`); } else L.i(`${k} = ${JSON.stringify(CFG[k])}`); } else L.w(`Unknown: ${k}`);
  }

  function doInventory() {
    connected(); updateState();
    const g = gs(); if (!g?.inventory) { L.w('No inventory'); return; }
    const seasonSeeds = SEASONAL[S.season] || [];
    L.i(`📦 Inventory (${S.season}):`);
    Object.entries(g.inventory).filter(([, a]) => Number(a) > 0).sort((a, b) => Number(b[1]) - Number(a[1])).forEach(([n, a]) => {
      if (n.includes('Seed')) { const inS = seasonSeeds.includes(n) ? '✅' : '❌'; const s = SEEDS[n]; const lvlOk = s && S.lvl >= s.level ? '✅' : s ? '🔒' : ''; L.i(`  ${inS}${lvlOk} ${n}: ${fmt(Number(a))}`); }
      else {
        const isRecipe = RECIPE_INGREDIENTS[n] ? '🍳' : '';
        L.i(`  ${isRecipe} ${n}: ${fmt(Number(a))}`);
      }
    });
    L.i(`  🔨 Axe: ${toolCount('Axe')} | Pickaxe: ${toolCount('Pickaxe')} | 💰 Coins: ${fmt(coins())}`);
  }

  function doRecipes() {
    L.i(`\n🍳 Recipes (sorted by XP/min):`);
    Object.entries(ALL_RECIPES).map(([name, r]) => ({ name, ...r, xpPerMin: r.xp / (r.sec / 60) })).sort((a, b) => b.xpPerMin - a.xpPerMin).forEach(r => {
      const slot = getFreeSlot(r.building); const g = gs(); const inv = g?.inventory || {};
      const missing = Object.entries(r.ingredients).filter(([k, v]) => Number(inv[k] || 0) < v).map(([k, v]) => `${k}(${Number(inv[k] || 0)}/${v})`);
      const status = !slot ? '🔒 busy' : missing.length ? `❌ ${missing.join(', ')}` : '✅';
      L.i(`  ${r.name}: ${r.xp}XP ${Math.round(r.sec/60)}min (${r.xpPerMin.toFixed(1)} XP/m) ${status}`);
    });
  }

  function doGetState() { connected(); const g = gs(); if (g) console.log(g); return g; }

  function doDebug() {
    L.i('🔍 Debug:');
    const g = gs();
    if (g) {
      const trees = g.trees ? Object.values(g.trees) : [];
      const treesAvail = trees.filter(t => t.wood && !t.wood.choppedAt && !t.removedAt).length;
      const stones = g.stones ? Object.values(g.stones) : [];
      const stonesAvail = stones.filter(s => s.stone && !s.stone.minedAt && !s.removedAt).length;
      const fruits = g.fruitPatches ? Object.entries(g.fruitPatches) : [];
      const fruitsAvail = fruits.filter(([, p]) => p.fruit && !p.fruit.harvestedAt).length;
      L.i(`  Season: ${g.season?.season} | Level: ${S.lvl} | Coins: ${Math.floor(g.coins || 0)}`);
      L.i(`  🪓 Axe: ${toolCount('Axe')} | ⛏️ Pickaxe: ${toolCount('Pickaxe')}`);
      L.i(`  🪵 Trees: ${treesAvail} ready / ${trees.length} total`);
      L.i(`  🪨 Stones: ${stonesAvail} ready / ${stones.length} total`);
      L.i(`  🌾 Crops: ${Object.keys(g.crops || {}).length} plots`);
      L.i(`  🍋 Fruit Patches: ${fruitsAvail} ready / ${fruits.length} total`);
      L.i(`  Buildings: ${S.bldgs.join(', ') || 'None'}`);
      const deliv = getDeliveryNeeds();
      if (deliv && Object.keys(deliv.needs).length) {
        L.i(`  📦 Delivery needs:`);
        for (const [item, info] of Object.entries(deliv.needs)) L.i(`    ${item}: ${info.have}/${info.need + info.have}`);
      }
      for (const [b, items] of Object.entries(g.buildings || {})) {
        for (const inst of items) {
          const crafting = inst.crafting || [];
          if (crafting.length > 0) {
            const ready = crafting.filter(c => c.readyAt <= Date.now());
            const active = crafting.filter(c => c.readyAt > Date.now());
            L.i(`  ${b}#${inst.id}: ${ready.length} ready, ${active.length} active`);
            for (const c of active) L.i(`    ${c.name}: ${fmtT(c.readyAt - Date.now())} left`);
          }
        }
      }
    } else L.e('❌ Game state not found');
  }

  function doInit() { S.svc = findGS(); if (S.svc) { L.i('✅ Connected!'); updateState(); } else L.e('❌ Not found.'); }
  function once(type) { connected(); updateState(); S.on = true; S.tasks[type]?.action().then(() => S.on = false); }

  // ======================== EXPOSE ========================

  window.sfl = {
    start: doStart, stop: doStop, pause: doPause, resume: doResume,
    status: doStatus, enable: doEnable,
    harvest: () => once('harvest'), plant: () => once('plant'),
    cook: () => once('cook'), mine: () => once('mine'), chop: () => once('chop'),
    eat: () => once('eat'), deliver: () => once('deliver'),
    sell: () => once('sell'), fruit: () => once('fruit'),
    composter: () => once('composter'),
    buy: () => once('buy'),
    deliveryNeeds: () => { connected(); updateState(); const d = getDeliveryNeeds(); if (d && Object.keys(d.needs).length) { L.i('📦 Delivery needs:'); for (const [item, info] of Object.entries(d.needs)) L.i('  ' + item + ': have ' + info.have + ', need ' + info.need); L.i('Total reward: ' + d.totalReward + ' coins'); } else L.i('No pending delivery needs'); },
    craft: (t, n) => ensureTool(t, n || 20),
    config: doConfig, inventory: doInventory, recipes: doRecipes,
    sniff: () => { const g = gs(); return g ? JSON.stringify(g) : null; },
    state: doGetState, debug: doDebug, init: doInit,
    version: '6.1.0',
  };

  console.log(`
%c╔══════════════════════════════════════════════════════════════════╗
║  🌻 SFL v6.1 - Smart Full Auto                                  ║
╠══════════════════════════════════════════════════════════════════╣
║  sfl.start()       Start all tasks                              ║
║  sfl.stop()        Stop + save stats                            ║
║  sfl.status()      Status + XP rate + delivery                  ║
║  sfl.debug()       Debug all resources                          ║
║  sfl.inventory()   Inventory + recipe flags                     ║
║  sfl.recipes()     Recipes + availability                       ║
║  sfl.deliveryNeeds()  Delivery requirements                     ║
║                                                                  ║
║  🌾 Delivery-aware planting + buying                            ║
║  💰 Smart sell (keep recipe ingredients)                        ║
║  🍋 Auto-harvest fruit patches                                  ║
║  ♻️ Auto-composter (Compost Bin + Worm)                         ║
║  📊 XP/hour tracking + time to level                            ║
║  💾 Stats persistence (localStorage)                            ║
║  🔄 Auto-reconnect (every 30s)                                  ║
║  🛡️ Rate-limit protection                                       ║
╚══════════════════════════════════════════════════════════════════╝`, 'color:#4CAF50;font-family:monospace');

  setTimeout(() => {
    S.svc = findGS();
    if (S.svc) { updateState(); L.i(`✅ Level ${S.lvl} | ${fmt(S.xp)} XP | ${S.season} | ${fmt(coins())} coins`); L.i('📌 sfl.start()'); }
    else L.w('⚠️ sfl.init() after loading.');
  }, 3000);

})();
