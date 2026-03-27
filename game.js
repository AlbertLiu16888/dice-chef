// ===== Game Data =====
const DATA = {
  ingredients: {
    basic: [
      { id: "tomato", name: "番茄", icon: "🍅", baseWeight: 10 },
      { id: "beef", name: "牛肉", icon: "🥩", baseWeight: 10 },
      { id: "noodle", name: "麵條", icon: "🍜", baseWeight: 10 },
      { id: "sugarcane", name: "甘蔗", icon: "🎋", baseWeight: 15 },
      { id: "lettuce", name: "生菜", icon: "🥬", baseWeight: 15 },
      { id: "cheese", name: "起司", icon: "🧀", baseWeight: 10 },
      { id: "bread", name: "吐司", icon: "🍞", baseWeight: 15 },
      { id: "pork", name: "豬肉", icon: "🥓", baseWeight: 10 },
      { id: "kimchi", name: "泡菜", icon: "🥬", baseWeight: 8 },
      { id: "rice", name: "白飯", icon: "🍚", baseWeight: 15 },
      { id: "shrimp", name: "蝦", icon: "🦐", baseWeight: 5 },
    ],
    advanced: [
      { id: "sugar", name: "砂糖", icon: "🧂" },
      { id: "broth", name: "高湯", icon: "🍲" },
    ],
  },
  recipes: [
    {
      id: "r_sugar",
      name: "砂糖",
      type: "advanced_ingredient",
      category: "none",
      ingredients: ["sugarcane", "sugarcane", "sugarcane"],
      points: 0,
    },
    {
      id: "r_broth",
      name: "高湯",
      type: "advanced_ingredient",
      category: "none",
      ingredients: ["beef", "beef", "pork"],
      points: 0,
    },
    {
      id: "r_caesar",
      name: "凱薩沙拉",
      type: "food",
      category: "general",
      ingredients: ["lettuce", "cheese", "tomato"],
      points: 10,
    },
    {
      id: "r_sub",
      name: "潛艇堡",
      type: "food",
      category: "general",
      ingredients: ["bread", "lettuce", "beef", "cheese"],
      points: 25,
    },
    {
      id: "r_beefnoodle",
      name: "番茄牛肉麵",
      type: "food",
      category: "taiwan",
      ingredients: ["tomato", "beef", "noodle", "broth"],
      points: 50,
    },
    {
      id: "r_kimchipork",
      name: "泡菜豬肉鍋",
      type: "food",
      category: "korea",
      ingredients: ["kimchi", "pork", "broth"],
      points: 45,
    },
  ],
  events: [
    {
      id: "event_thai_season",
      name: "🌶️ 泰國季熱賣！",
      duration_sec: 30,
      weight_modifiers: { shrimp: 300, tomato: 200 },
    },
  ],
};

// ===== Audio Engine (Web Audio API) =====
const SFX = {
  ctx: null,
  enabled: true,

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  },

  play(type) {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    switch (type) {
      case "roll":
        osc.type = "square";
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(600, now + 0.1);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
        break;
      case "pick":
        osc.type = "sine";
        osc.frequency.setValueAtTime(523, now);
        osc.frequency.setValueAtTime(659, now + 0.06);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
        break;
      case "drop":
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
        break;
      case "cook_success":
        osc.type = "sine";
        osc.frequency.setValueAtTime(523, now);
        osc.frequency.setValueAtTime(659, now + 0.1);
        osc.frequency.setValueAtTime(784, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
        break;
      case "cook_fail":
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.4);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
        break;
      case "score":
        osc.type = "sine";
        osc.frequency.setValueAtTime(660, now);
        osc.frequency.setValueAtTime(880, now + 0.08);
        osc.frequency.setValueAtTime(1047, now + 0.16);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      case "trash":
        osc.type = "triangle";
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.15);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
        break;
      case "unlock":
        osc.type = "sine";
        osc.frequency.setValueAtTime(523, now);
        osc.frequency.setValueAtTime(659, now + 0.1);
        osc.frequency.setValueAtTime(784, now + 0.2);
        osc.frequency.setValueAtTime(1047, now + 0.3);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
        break;
      case "gameover":
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(349, now + 0.3);
        osc.frequency.setValueAtTime(262, now + 0.6);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.9);
        osc.start(now);
        osc.stop(now + 0.9);
        break;
      case "event":
        osc.type = "square";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(660, now + 0.08);
        osc.frequency.setValueAtTime(440, now + 0.16);
        osc.frequency.setValueAtTime(660, now + 0.24);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
        break;
      case "btn":
        osc.type = "sine";
        osc.frequency.setValueAtTime(480, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
    }
  },

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  },
};

// ===== Haptic / Vibration =====
function vibrate(pattern) {
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}

// ===== State =====
const state = {
  gameState: "idle", // idle | playing | gameover
  mode: "solo", // solo | vs
  timer: 300,
  score: 0,
  handCards: [],
  cookingZone: [null, null, null, null, null],
  unlockedCategories: ["general", "none"],
  activeEvent: null,
  eventTimer: 0,
  uidCounter: 0,
  // AI state (battle mode)
  ai: {
    score: 0,
    hand: [],
    cooking: [],
    unlockedCategories: ["general", "none"],
    nextActionIn: 0,
    logs: [],
  },
};

function nextUid() {
  return `card_${++state.uidCounter}`;
}

// ===== DOM References =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const dom = {
  timerEl: $("#timer"),
  scoreEl: $("#score"),
  scoreP2: $("#score-p2"),
  scoreVs: $("#score-vs"),
  scoreP2Wrap: $("#score-p2-wrap"),
  startScreen: $("#start-screen"),
  gameoverScreen: $("#gameover-screen"),
  gameArea: $("#game-area"),
  playerArea: $("#player-area"),
  btnStart: $("#btn-start"),
  btnStartVs: $("#btn-start-vs"),
  btnRestart: $("#btn-restart"),
  btnRoll: $("#btn-roll"),
  btnCook: $("#btn-cook"),
  diceResults: $("#dice-results"),
  handCards: $("#hand-cards"),
  handCount: $("#hand-count"),
  cookingSlots: $$(".cook-slot"),
  judgeDrop: $("#judge-drop"),
  trashDrop: $("#trash-drop"),
  eventBanner: $("#event-banner"),
  eventText: $("#event-text"),
  eventTimerEl: $("#event-timer"),
  finalScore: $("#final-score"),
  finalRank: $("#final-rank"),
  recipeBook: $("#recipe-book"),
  recipeList: $("#recipe-list"),
  btnRecipeBook: $("#btn-recipe-book"),
  btnCloseBook: $("#btn-close-book"),
  btnSound: $("#btn-sound"),
  toastContainer: $("#toast-container"),
  badgeTaiwan: $("#badge-taiwan"),
  badgeKorea: $("#badge-korea"),
  // Battle mode
  aiArea: $("#ai-area"),
  aiHandDisplay: $("#ai-hand-display"),
  aiCookingDisplay: $("#ai-cooking-display"),
  aiActionLog: $("#ai-action-log"),
  gameoverSolo: $("#gameover-solo"),
  gameoverVs: $("#gameover-vs"),
  vsP1Score: $("#vs-p1-score"),
  vsP2Score: $("#vs-p2-score"),
  vsWinner: $("#vs-winner"),
};

// ===== Helpers =====
function getIngredientById(id) {
  return (
    DATA.ingredients.basic.find((i) => i.id === id) ||
    DATA.ingredients.advanced.find((i) => i.id === id)
  );
}

function makeCardObj(ingredientId, cardType = "ingredient") {
  const ing = getIngredientById(ingredientId);
  if (!ing) return null;
  return {
    uid: nextUid(),
    id: ing.id,
    name: ing.name,
    icon: ing.icon,
    cardType,
    recipeId: null,
    points: 0,
  };
}

function makeDishCard(recipe) {
  return {
    uid: nextUid(),
    id: recipe.id,
    name: recipe.name,
    icon: "🍽️",
    cardType: "dish",
    recipeId: recipe.id,
    points: recipe.points,
  };
}

function makeAdvancedCard(recipe) {
  const ing = getIngredientById(
    recipe.id === "r_sugar" ? "sugar" : recipe.id === "r_broth" ? "broth" : recipe.ingredients[0]
  );
  return {
    uid: nextUid(),
    id: ing.id,
    name: ing.name,
    icon: ing.icon,
    cardType: "advanced",
    recipeId: null,
    points: 0,
  };
}

// ===== Weighted Random =====
function weightedRandom(count) {
  const pool = DATA.ingredients.basic;
  const results = [];
  for (let i = 0; i < count; i++) {
    let totalWeight = 0;
    const weights = pool.map((item) => {
      let w = item.baseWeight;
      if (state.activeEvent) {
        const mod = state.activeEvent.weight_modifiers[item.id];
        if (mod) w = (w * mod) / 100;
      }
      totalWeight += w;
      return w;
    });
    let rand = Math.random() * totalWeight;
    for (let j = 0; j < pool.length; j++) {
      rand -= weights[j];
      if (rand <= 0) {
        results.push(pool[j].id);
        break;
      }
    }
  }
  return results;
}

// ===== Recipe Matching =====
function sortedIds(arr) {
  return [...arr].sort().join(",");
}

function matchRecipe(ingredientIds, categories) {
  const sorted = sortedIds(ingredientIds);
  for (const recipe of DATA.recipes) {
    if (
      recipe.category !== "none" &&
      !categories.includes(recipe.category)
    )
      continue;
    if (sortedIds(recipe.ingredients) === sorted) return recipe;
  }
  for (const recipe of DATA.recipes) {
    if (recipe.category === "none" && sortedIds(recipe.ingredients) === sorted)
      return recipe;
  }
  return null;
}

// ===== Button press helper =====
function btnPress(el) {
  el.classList.remove("btn-press");
  void el.offsetWidth;
  el.classList.add("btn-press");
  SFX.play("btn");
  vibrate(10);
}

// ===== Toast =====
function showToast(msg, type = "info") {
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.textContent = msg;
  dom.toastContainer.appendChild(el);
  setTimeout(() => el.remove(), 2200);
}

// ===== Score Pop =====
function showScorePop(pts, x, y) {
  const el = document.createElement("div");
  el.className = "score-pop";
  el.textContent = `+${pts}`;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1100);
}

// ===== Render =====
function renderHand() {
  dom.handCards.innerHTML = "";
  dom.handCount.textContent = state.handCards.length;
  state.handCards.forEach((card) => {
    const el = createCardElement(card);
    el.draggable = true;
    el.addEventListener("dragstart", onDragStart);
    el.addEventListener("dragend", onDragEnd);
    // Touch drag support
    el.addEventListener("touchstart", onTouchStart, { passive: false });
    dom.handCards.appendChild(el);
  });
}

function renderCookingZone() {
  dom.cookingSlots.forEach((slot, i) => {
    slot.innerHTML = "";
    const card = state.cookingZone[i];
    if (card) {
      const el = createCardElement(card);
      el.draggable = true;
      el.addEventListener("dragstart", onDragStart);
      el.addEventListener("dragend", onDragEnd);
      el.addEventListener("touchstart", onTouchStart, { passive: false });
      slot.appendChild(el);
    }
  });
}

function createCardElement(card) {
  const el = document.createElement("div");
  el.className = "card";
  if (card.cardType === "dish") el.classList.add("dish-card");
  if (card.cardType === "advanced") el.classList.add("advanced-card");
  el.dataset.uid = card.uid;
  el.innerHTML = `
    <span class="card-icon">${card.icon}</span>
    <span class="card-name">${card.name}</span>
    ${card.cardType === "dish" ? `<span class="card-points">${card.points}⭐</span>` : ""}
  `;
  return el;
}

function renderTimer() {
  const min = Math.floor(state.timer / 60);
  const sec = state.timer % 60;
  dom.timerEl.textContent = `${min}:${sec.toString().padStart(2, "0")}`;
}

function renderScore() {
  dom.scoreEl.textContent = state.score;
  if (state.mode === "vs") {
    dom.scoreP2.textContent = state.ai.score;
  }
}

function renderRecipeBook() {
  dom.recipeList.innerHTML = "";
  DATA.recipes.forEach((r) => {
    const locked =
      r.category !== "none" &&
      r.category !== "general" &&
      !state.unlockedCategories.includes(r.category);
    const ings = r.ingredients.map((id) => {
      const ing = getIngredientById(id);
      return ing ? `${ing.icon}${ing.name}` : id;
    });
    const div = document.createElement("div");
    div.className = `recipe-entry${locked ? " locked-recipe" : ""}`;
    div.innerHTML = `
      <div class="recipe-name">${locked ? "???" : r.name} ${r.points ? `(${r.points}⭐)` : r.type === "advanced_ingredient" ? "(進階食材)" : ""}</div>
      <div class="recipe-ingredients">${locked ? "🔒 需解鎖" : ings.join(" + ")}</div>
    `;
    dom.recipeList.appendChild(div);
  });
}

// ===== Category Unlock =====
function checkUnlocks() {
  if (state.score >= 50 && !state.unlockedCategories.includes("taiwan")) {
    state.unlockedCategories.push("taiwan");
    dom.badgeTaiwan.classList.remove("locked");
    dom.badgeTaiwan.classList.add("unlocked");
    showToast("🇹🇼 解鎖台灣料理！", "success");
    SFX.play("unlock");
    vibrate([50, 30, 50]);
    renderRecipeBook();
  }
  if (state.score >= 100 && !state.unlockedCategories.includes("korea")) {
    state.unlockedCategories.push("korea");
    dom.badgeKorea.classList.remove("locked");
    dom.badgeKorea.classList.add("unlocked");
    showToast("🇰🇷 解鎖韓國料理！", "success");
    SFX.play("unlock");
    vibrate([50, 30, 50]);
    renderRecipeBook();
  }
}

// ===== Dice Roll =====
function rollDice() {
  if (state.handCards.length >= 5) {
    showToast("手牌已滿！先使用或丟棄卡牌", "error");
    vibrate(100);
    return;
  }
  btnPress(dom.btnRoll);
  SFX.play("roll");
  vibrate(30);
  dom.btnRoll.disabled = true;
  const ids = weightedRandom(3);
  dom.diceResults.innerHTML = "";

  ids.forEach((id) => {
    const ing = getIngredientById(id);
    const el = document.createElement("div");
    el.className = "card dice-card";
    el.dataset.ingredientId = id;
    el.innerHTML = `
      <span class="card-icon">${ing.icon}</span>
      <span class="card-name">${ing.name}</span>
    `;
    el.addEventListener("click", () => pickDiceCard(el, id));
    dom.diceResults.appendChild(el);
  });
}

function pickDiceCard(el, ingredientId) {
  if (state.handCards.length >= 5) {
    showToast("手牌已滿！", "error");
    return;
  }
  SFX.play("pick");
  vibrate(15);
  el.classList.add("picked");
  setTimeout(() => {
    const card = makeCardObj(ingredientId);
    state.handCards.push(card);
    renderHand();
    dom.diceResults.innerHTML = "";
    dom.btnRoll.disabled = false;
  }, 300);
}

// ===== Drag & Drop =====
let draggedUid = null;
let dragSource = null;

function findCardByUid(uid) {
  const inHand = state.handCards.find((c) => c.uid === uid);
  if (inHand) return { card: inHand, source: "hand" };
  for (let i = 0; i < state.cookingZone.length; i++) {
    if (state.cookingZone[i] && state.cookingZone[i].uid === uid) {
      return { card: state.cookingZone[i], source: "cooking", index: i };
    }
  }
  return null;
}

function onDragStart(e) {
  const uid = e.target.closest(".card").dataset.uid;
  draggedUid = uid;
  const found = findCardByUid(uid);
  dragSource = found ? found.source : null;
  e.target.closest(".card").classList.add("dragging");
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", uid);
  SFX.play("drop");
}

function onDragEnd(e) {
  e.target.closest(".card")?.classList.remove("dragging");
  draggedUid = null;
  dragSource = null;
}

// ===== Touch Drag Support =====
let touchDragEl = null;
let touchDragUid = null;
let touchClone = null;

function onTouchStart(e) {
  const card = e.target.closest(".card");
  if (!card) return;
  e.preventDefault();
  touchDragUid = card.dataset.uid;
  touchDragEl = card;
  card.classList.add("dragging");

  touchClone = card.cloneNode(true);
  touchClone.style.position = "fixed";
  touchClone.style.pointerEvents = "none";
  touchClone.style.zIndex = "1000";
  touchClone.style.opacity = "0.8";
  touchClone.style.width = card.offsetWidth + "px";
  document.body.appendChild(touchClone);

  const touch = e.touches[0];
  touchClone.style.left = (touch.clientX - 40) + "px";
  touchClone.style.top = (touch.clientY - 50) + "px";

  document.addEventListener("touchmove", onTouchMove, { passive: false });
  document.addEventListener("touchend", onTouchEnd);
}

function onTouchMove(e) {
  if (!touchClone) return;
  e.preventDefault();
  const touch = e.touches[0];
  touchClone.style.left = (touch.clientX - 40) + "px";
  touchClone.style.top = (touch.clientY - 50) + "px";
}

function onTouchEnd(e) {
  if (!touchClone) return;
  const touch = e.changedTouches[0];
  const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);

  touchClone.remove();
  touchClone = null;
  if (touchDragEl) touchDragEl.classList.remove("dragging");

  document.removeEventListener("touchmove", onTouchMove);
  document.removeEventListener("touchend", onTouchEnd);

  if (!dropTarget || !touchDragUid) return;

  const slot = dropTarget.closest(".cook-slot");
  if (slot) {
    dropToCooking(touchDragUid, slot);
    return;
  }
  if (dropTarget.closest("#judge-drop")) {
    dropToJudge(touchDragUid, { clientX: touch.clientX, clientY: touch.clientY });
    return;
  }
  if (dropTarget.closest("#trash-drop")) {
    dropToTrash(touchDragUid);
    return;
  }
  if (dropTarget.closest("#hand-zone")) {
    dropToHand(touchDragUid);
  }

  touchDragUid = null;
  touchDragEl = null;
}

function setupDropZones() {
  dom.cookingSlots.forEach((slot) => {
    slot.addEventListener("dragover", (e) => {
      e.preventDefault();
      slot.classList.add("drag-over");
    });
    slot.addEventListener("dragleave", () => slot.classList.remove("drag-over"));
    slot.addEventListener("drop", (e) => {
      e.preventDefault();
      slot.classList.remove("drag-over");
      const uid = e.dataTransfer.getData("text/plain");
      dropToCooking(uid, slot);
    });
  });

  dom.judgeDrop.addEventListener("dragover", (e) => {
    e.preventDefault();
    dom.judgeDrop.classList.add("drag-over");
  });
  dom.judgeDrop.addEventListener("dragleave", () =>
    dom.judgeDrop.classList.remove("drag-over")
  );
  dom.judgeDrop.addEventListener("drop", (e) => {
    e.preventDefault();
    dom.judgeDrop.classList.remove("drag-over");
    const uid = e.dataTransfer.getData("text/plain");
    dropToJudge(uid, e);
  });

  dom.trashDrop.addEventListener("dragover", (e) => {
    e.preventDefault();
    dom.trashDrop.classList.add("drag-over");
  });
  dom.trashDrop.addEventListener("dragleave", () =>
    dom.trashDrop.classList.remove("drag-over")
  );
  dom.trashDrop.addEventListener("drop", (e) => {
    e.preventDefault();
    dom.trashDrop.classList.remove("drag-over");
    const uid = e.dataTransfer.getData("text/plain");
    dropToTrash(uid);
  });

  dom.handCards.parentElement.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
  dom.handCards.parentElement.addEventListener("drop", (e) => {
    e.preventDefault();
    const uid = e.dataTransfer.getData("text/plain");
    dropToHand(uid);
  });
}

function dropToCooking(uid, slot) {
  const found = findCardByUid(uid);
  if (!found) return;
  const slotIdx = parseInt(slot.dataset.slot);

  if (found.card.cardType === "dish") {
    showToast("完成品請拖至評審區！", "info");
    return;
  }

  if (state.cookingZone[slotIdx] !== null) {
    showToast("此格已有食材", "error");
    return;
  }

  if (found.source === "hand") {
    state.handCards = state.handCards.filter((c) => c.uid !== uid);
  } else if (found.source === "cooking") {
    state.cookingZone[found.index] = null;
  }

  state.cookingZone[slotIdx] = found.card;
  SFX.play("drop");
  vibrate(10);
  renderHand();
  renderCookingZone();
}

function dropToJudge(uid, e) {
  const found = findCardByUid(uid);
  if (!found || found.card.cardType !== "dish") {
    showToast("只有完成品能提交評審！", "error");
    return;
  }
  state.score += found.card.points;

  if (found.source === "hand") {
    state.handCards = state.handCards.filter((c) => c.uid !== uid);
  } else if (found.source === "cooking") {
    state.cookingZone[found.index] = null;
  }

  const cx = e.clientX || window.innerWidth / 2;
  const cy = (e.clientY || 200) - 30;
  showScorePop(found.card.points, cx, cy);
  showToast(`${found.card.name} +${found.card.points}⭐`, "success");
  SFX.play("score");
  vibrate([30, 20, 30]);
  renderScore();
  renderHand();
  renderCookingZone();
  checkUnlocks();
}

function dropToTrash(uid) {
  const found = findCardByUid(uid);
  if (!found) return;
  if (found.source === "hand") {
    state.handCards = state.handCards.filter((c) => c.uid !== uid);
  } else if (found.source === "cooking") {
    state.cookingZone[found.index] = null;
  }
  showToast("已丟棄 " + found.card.name, "error");
  SFX.play("trash");
  vibrate(20);
  renderHand();
  renderCookingZone();
}

function dropToHand(uid) {
  const found = findCardByUid(uid);
  if (!found) return;
  if (found.source === "hand") return;

  if (found.source === "cooking") {
    if (state.handCards.length >= 5) {
      showToast("手牌已滿！", "error");
      return;
    }
    state.cookingZone[found.index] = null;
    state.handCards.push(found.card);
    SFX.play("drop");
    renderHand();
    renderCookingZone();
  }
}

// ===== Cooking / Crafting =====
function cook() {
  btnPress(dom.btnCook);
  const ingredients = state.cookingZone.filter((c) => c !== null);
  if (ingredients.length === 0) {
    showToast("料理區是空的！", "error");
    vibrate(100);
    return;
  }

  const ids = ingredients.map((c) => c.id);
  const recipe = matchRecipe(ids, state.unlockedCategories);

  if (recipe) {
    state.cookingZone = [null, null, null, null, null];

    if (recipe.type === "food") {
      const dish = makeDishCard(recipe);
      if (state.handCards.length < 5) {
        state.handCards.push(dish);
        showToast(`🍽️ 完成「${recipe.name}」！拖至評審區得分`, "success");
      } else {
        showToast(`🍽️ 完成「${recipe.name}」但手牌已滿，已丟失！`, "error");
      }
      SFX.play("cook_success");
      vibrate([40, 30, 40]);
    } else if (recipe.type === "advanced_ingredient") {
      const adv = makeAdvancedCard(recipe);
      if (state.handCards.length < 5) {
        state.handCards.push(adv);
        showToast(`✨ 獲得進階食材「${adv.name}」！`, "success");
      } else {
        showToast(`✨ 合成「${adv.name}」但手牌已滿，已丟失！`, "error");
      }
      SFX.play("cook_success");
      vibrate([30, 20, 30]);
    }
  } else {
    showToast("💀 暗黑料理！食材全部銷毀！", "error");
    SFX.play("cook_fail");
    vibrate([100, 50, 100]);
    dom.cookingSlots.forEach((slot) => {
      const card = slot.querySelector(".card");
      if (card) card.classList.add("dark-cooking");
    });
    setTimeout(() => {
      state.cookingZone = [null, null, null, null, null];
      renderCookingZone();
    }, 600);
    renderHand();
    return;
  }

  renderHand();
  renderCookingZone();
}

// ===== AI Opponent Logic =====
const AI = {
  tick() {
    if (state.mode !== "vs" || state.gameState !== "playing") return;
    const ai = state.ai;
    ai.nextActionIn--;
    if (ai.nextActionIn > 0) return;

    // AI decision cycle: every 3-6 seconds
    ai.nextActionIn = 3 + Math.floor(Math.random() * 4);

    // Strategy: try to cook if possible, otherwise gather ingredients
    const cookResult = this.tryCook();
    if (cookResult) return;

    // Gather: simulate rolling dice and picking one
    if (ai.hand.length < 5) {
      const picks = weightedRandom(3);
      // Pick the one most useful for a recipe
      const best = this.pickBest(picks);
      const card = makeCardObj(best);
      ai.hand.push(card);
      this.log(`抽到 ${card.icon}${card.name}`);
    } else {
      // Hand full, discard least useful
      const worst = this.findLeastUseful();
      if (worst >= 0) {
        const removed = ai.hand.splice(worst, 1)[0];
        this.log(`丟棄 ${removed.icon}${removed.name}`);
      }
    }
    this.renderAI();
  },

  tryCook() {
    const ai = state.ai;
    const hand = ai.hand;
    // Try all subsets of hand to find a matching recipe
    const availableRecipes = DATA.recipes.filter(
      (r) =>
        r.category === "none" || ai.unlockedCategories.includes(r.category)
    );

    for (const recipe of availableRecipes) {
      const needed = [...recipe.ingredients];
      const used = [];
      let found = true;
      for (const need of needed) {
        const idx = hand.findIndex(
          (c, i) => c.id === need && !used.includes(i)
        );
        if (idx === -1) {
          found = false;
          break;
        }
        used.push(idx);
      }
      if (found) {
        // Remove used cards (in reverse to maintain indices)
        used.sort((a, b) => b - a).forEach((i) => hand.splice(i, 1));

        if (recipe.type === "food") {
          ai.score += recipe.points;
          this.log(`🍽️ 完成「${recipe.name}」+${recipe.points}⭐`, "score");
          // Check AI unlocks
          if (ai.score >= 50 && !ai.unlockedCategories.includes("taiwan")) {
            ai.unlockedCategories.push("taiwan");
            this.log("解鎖台灣料理！", "score");
          }
          if (ai.score >= 100 && !ai.unlockedCategories.includes("korea")) {
            ai.unlockedCategories.push("korea");
            this.log("解鎖韓國料理！", "score");
          }
        } else if (recipe.type === "advanced_ingredient") {
          const adv = makeAdvancedCard(recipe);
          if (hand.length < 5) {
            hand.push(adv);
            this.log(`✨ 合成「${adv.name}」`);
          }
        }
        renderScore();
        this.renderAI();
        return true;
      }
    }
    return false;
  },

  pickBest(options) {
    // Count which ingredients we need most for available recipes
    const ai = state.ai;
    const scores = {};
    const available = DATA.recipes.filter(
      (r) =>
        r.category === "none" || ai.unlockedCategories.includes(r.category)
    );
    for (const r of available) {
      for (const ing of r.ingredients) {
        scores[ing] = (scores[ing] || 0) + (r.points || 5);
      }
    }
    // Prefer ingredients we already have partial matches for
    for (const c of ai.hand) {
      if (scores[c.id]) scores[c.id] += 3;
    }
    let best = options[0];
    let bestScore = scores[options[0]] || 0;
    for (const opt of options) {
      if ((scores[opt] || 0) > bestScore) {
        best = opt;
        bestScore = scores[opt] || 0;
      }
    }
    return best;
  },

  findLeastUseful() {
    const ai = state.ai;
    // Find card that appears in fewest available recipes
    const counts = {};
    const available = DATA.recipes.filter(
      (r) =>
        r.category === "none" || ai.unlockedCategories.includes(r.category)
    );
    for (const r of available) {
      for (const ing of r.ingredients) {
        counts[ing] = (counts[ing] || 0) + 1;
      }
    }
    let worstIdx = 0;
    let worstScore = Infinity;
    ai.hand.forEach((c, i) => {
      const s = counts[c.id] || 0;
      if (s < worstScore) {
        worstScore = s;
        worstIdx = i;
      }
    });
    return worstIdx;
  },

  log(msg, type = "") {
    state.ai.logs.unshift({ msg, type, time: state.timer });
    if (state.ai.logs.length > 20) state.ai.logs.pop();
  },

  renderAI() {
    const ai = state.ai;
    // Hand display
    dom.aiHandDisplay.innerHTML = ai.hand
      .map((c) => `<div class="ai-mini-card">${c.icon}</div>`)
      .join("");
    // Cooking display
    dom.aiCookingDisplay.textContent =
      ai.hand.length === 0
        ? "收集食材中..."
        : `持有 ${ai.hand.length} 張卡牌`;
    // Log
    dom.aiActionLog.innerHTML = ai.logs
      .map(
        (l) =>
          `<div class="ai-log-entry ${l.type === "score" ? "score-log" : l.type === "fail" ? "fail-log" : ""}">${l.msg}</div>`
      )
      .join("");
  },

  reset() {
    state.ai.score = 0;
    state.ai.hand = [];
    state.ai.cooking = [];
    state.ai.unlockedCategories = ["general", "none"];
    state.ai.nextActionIn = 5;
    state.ai.logs = [];
  },
};

// ===== Events =====
function tryTriggerEvent() {
  if (state.activeEvent) return;
  if (Math.random() < 0.01) {
    const evt = DATA.events[Math.floor(Math.random() * DATA.events.length)];
    state.activeEvent = evt;
    state.eventTimer = evt.duration_sec;
    dom.eventBanner.classList.remove("hidden");
    dom.eventText.textContent = evt.name;
    showToast(evt.name, "info");
    SFX.play("event");
    vibrate([20, 10, 20, 10, 20]);
  }
}

function tickEvent() {
  if (!state.activeEvent) return;
  state.eventTimer--;
  dom.eventTimerEl.textContent = ` (${state.eventTimer}s)`;
  if (state.eventTimer <= 0) {
    state.activeEvent = null;
    dom.eventBanner.classList.add("hidden");
    showToast("事件結束", "info");
  }
}

// ===== Timer =====
let gameInterval = null;

function startTimer() {
  gameInterval = setInterval(() => {
    if (state.gameState !== "playing") return;
    state.timer--;
    renderTimer();
    tickEvent();
    tryTriggerEvent();
    AI.tick();

    if (state.timer <= 0) {
      endGame();
    }
  }, 1000);
}

// ===== Game Flow =====
function startGame(mode) {
  SFX.init();
  state.gameState = "playing";
  state.mode = mode;
  state.timer = 300;
  state.score = 0;
  state.handCards = [];
  state.cookingZone = [null, null, null, null, null];
  state.unlockedCategories = ["general", "none"];
  state.activeEvent = null;
  state.eventTimer = 0;

  dom.badgeTaiwan.classList.add("locked");
  dom.badgeTaiwan.classList.remove("unlocked");
  dom.badgeKorea.classList.add("locked");
  dom.badgeKorea.classList.remove("unlocked");

  const startIds = weightedRandom(3);
  startIds.forEach((id) => state.handCards.push(makeCardObj(id)));

  dom.startScreen.classList.add("hidden");
  dom.gameoverScreen.classList.add("hidden");
  dom.gameArea.classList.remove("hidden");
  dom.btnRecipeBook.classList.remove("hidden");
  dom.btnSound.classList.remove("hidden");
  dom.btnRoll.disabled = false;
  dom.eventBanner.classList.add("hidden");

  // Battle mode setup
  if (mode === "vs") {
    AI.reset();
    dom.aiArea.classList.remove("hidden");
    dom.scoreVs.classList.remove("hidden");
    dom.scoreP2Wrap.classList.remove("hidden");
    AI.renderAI();
  } else {
    dom.aiArea.classList.add("hidden");
    dom.scoreVs.classList.add("hidden");
    dom.scoreP2Wrap.classList.add("hidden");
  }

  renderHand();
  renderCookingZone();
  renderTimer();
  renderScore();
  renderRecipeBook();

  if (gameInterval) clearInterval(gameInterval);
  startTimer();
}

function endGame() {
  state.gameState = "gameover";
  clearInterval(gameInterval);
  SFX.play("gameover");
  vibrate([100, 50, 100, 50, 200]);

  dom.gameArea.classList.add("hidden");
  dom.btnRecipeBook.classList.add("hidden");
  dom.btnSound.classList.add("hidden");
  dom.recipeBook.classList.add("hidden");
  dom.gameoverScreen.classList.remove("hidden");

  if (state.mode === "solo") {
    dom.gameoverSolo.classList.remove("hidden");
    dom.gameoverVs.classList.add("hidden");
    dom.finalScore.textContent = state.score;
    let rank = "";
    if (state.score >= 200) rank = "🏆 廚神降臨！";
    else if (state.score >= 120) rank = "🥇 米其林三星主廚";
    else if (state.score >= 60) rank = "🥈 家常料理達人";
    else if (state.score >= 20) rank = "🥉 料理新手";
    else rank = "🍳 繼續加油！";
    dom.finalRank.textContent = rank;
  } else {
    dom.gameoverSolo.classList.add("hidden");
    dom.gameoverVs.classList.remove("hidden");
    dom.vsP1Score.textContent = state.score;
    dom.vsP2Score.textContent = state.ai.score;
    if (state.score > state.ai.score) {
      dom.vsWinner.textContent = "🎉 你贏了！";
      dom.vsWinner.style.color = "#4ade80";
    } else if (state.score < state.ai.score) {
      dom.vsWinner.textContent = "😤 AI 勝出！";
      dom.vsWinner.style.color = "#f87171";
    } else {
      dom.vsWinner.textContent = "🤝 平手！";
      dom.vsWinner.style.color = "#f5c518";
    }
  }
}

// ===== Event Listeners =====
dom.btnStart.addEventListener("click", () => startGame("solo"));
dom.btnStartVs.addEventListener("click", () => startGame("vs"));
dom.btnRestart.addEventListener("click", () => {
  dom.gameoverScreen.classList.add("hidden");
  dom.startScreen.classList.remove("hidden");
});
dom.btnRoll.addEventListener("click", rollDice);
dom.btnCook.addEventListener("click", cook);

dom.btnRecipeBook.addEventListener("click", () => {
  btnPress(dom.btnRecipeBook);
  dom.recipeBook.classList.toggle("hidden");
});
dom.btnCloseBook.addEventListener("click", () => {
  dom.recipeBook.classList.add("hidden");
});

dom.btnSound.addEventListener("click", () => {
  const on = SFX.toggle();
  dom.btnSound.textContent = on ? "🔊" : "🔇";
});

setupDropZones();
