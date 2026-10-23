/* =====================================================
   Birthday Surprise 💗  —  script.js
   Plain JavaScript, no libraries.

   Part 1: ✏️ EDIT-ME settings, small helpers, cartoon characters
   Part 2: floating decorations + confetti / balloons / fireworks
   Part 3: music player + typing animation
   Part 4: the story (scenes) + replay
   ===================================================== */
"use strict";

/* =====================================================
   ✏️ EDIT ME — all the messages live here
   ===================================================== */
const CONFIG = {
  // number of candles on the cake (the cake drawing fits 5 nicely)
  candleCount: 5,

  // typing speed in milliseconds per character (bigger number = slower)
  personalTypingSpeed: 70,
  secretTypingSpeed: 32,

  // 💬 personal birthday message (scene 4)
  personalMessage:
    "I was planning to give u the best gift ever, but then I remembered u already have ME. Ur welcome, sir 😌🎁🤡",

  // 💌 the secret letter (scene 5). Each line below is one paragraph.
  secretLetter: [
    "Wishing u a very happiest happy birthday, bakksssss! 🎂💗🫂🦋",
    "Bngrm, u don't even know how happy u make me feel with all those little things u dooo. The way u call me bngrm 😭💗, I feel like butterflies are flying all around me every single timeee. 🦋🎀 The love and care u show me, the way u remind me to do things on time, the way u tell me to eat now or do this now, and the way u remember even the smallest things about me... everything means sooo much to meee. 🥹🫶🏻",
    "And u know what? It's not just the big things that make me happy. Even the tiniest things u do make my heart so happieee. The way u get happy over the little things I do for u, the priority u give me, and the way u make me feel loved without even tryinggg... I'll never forget any of it, bakkss. Because just like u feel happy with my little efforts, I feel equally happy with every little thing u do for meee. 🥹💗",
    "Sometimes, I wonder how someone can make me feel so special just by being themselves. But then I remember it's YOUUU bakkss, and u have ur own little ways of making everything feel beautiful. 🫂🎀❤️‍🩹",
    "I'm really sorry that I can't be beside u on one of the most special days of ur life. 😭💔 I wish I could be there to make u smile, and make u feel as special as u make me feel every single dayyy. If I could, I'd definitely be right there with u today. 🥹🫂💗",
    "On ur special day, I just want u to know that u are sooo loved, bakkss. I hope life gives u all the happiness, love, care, and beautiful little moments that u give to the people around u. May u always have that beautiful smile on ur face, may all ur wishes come true, and may u never have to doubt how special u are to meee. 🧿💗✨",
    "Thank u for being YOUUU, for loving me the way u do, for caring about me in ur own little ways, and for making even the simplest moments feel special. I'll always cherish our bond and every little memory we create together. 🥹🦋",
    "Happiest birthday once again bakkssss, bngrm, cutayyy😭🎂🎀💗",
    "I LOVE U SOOO MUCHHH, MORE THAN THESE WORDS CAN EVER EXPLAINNN🫂❤️‍🩹",
    "Distance may keep me away from u today, but u'll always have a special place in my heart bakkss. 🥹💗🧿"
  ],

  // 🫂 messages shown one by one in the final hug scene
  hugLines: [
    "If I could wish for one thing today... 🥹",
    "It would be to be right there beside u, celebrating ur special day. 💗",
    "Until then, here's a little virtual hug from ur bakkss. 🫂🎀"
  ],
  hugLineSeconds: [4.2, 5.6, 5.6]   // how long each hug message stays on screen
};

/* =====================================================
   Small helpers
   ===================================================== */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const rand = (min, max) => Math.random() * (max - min) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const SVG_NS = "http://www.w3.org/2000/svg";

// Timers that are tracked, so "Relive" can cancel everything cleanly.
const timers = new Set();
function later(fn, ms) {
  const id = setTimeout(() => { timers.delete(id); fn(); }, ms);
  timers.add(id);
  return id;
}
function clearAllTimers() {
  timers.forEach(clearTimeout);
  timers.clear();
}

let toastTimer = null;
function toast(message, ms = 3600) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), ms);
}

/* =====================================================
   🧸 Cartoon characters (drawn with SVG, no images needed)
   To change their look, edit the colors at the top of style.css
   (--girl-dress, --girl-hair, --boy-shirt, --boy-hair, --skin ...)
   ===================================================== */
const EYES_OPEN = `
  <g class="eyes-open">
    <circle class="c-eye" cx="55" cy="72" r="5.2"/><circle class="c-white" cx="57" cy="70" r="1.9"/>
    <circle class="c-eye" cx="85" cy="72" r="5.2"/><circle class="c-white" cx="87" cy="70" r="1.9"/>
  </g>
  <g class="eyes-closed">
    <path class="c-line" d="M48 73 Q55 80 62 73"/><path class="c-line" d="M78 73 Q85 80 92 73"/>
  </g>`;

const FACE_EXTRAS = `
  <ellipse class="c-blush" cx="45" cy="85" rx="7.5" ry="4.8"/>
  <ellipse class="c-blush" cx="95" cy="85" rx="7.5" ry="4.8"/>
  <path class="c-mouth" d="M62 85 Q70 95 78 85"/>`;

function girlSVG() {
  return `
  <svg viewBox="0 0 140 230" aria-hidden="true">
    <ellipse class="c-shadow" cx="70" cy="225" rx="36" ry="5"/>
    <!-- legs + shoes -->
    <rect class="c-skin" x="55" y="186" width="10" height="30" rx="5"/>
    <rect class="c-skin" x="75" y="186" width="10" height="30" rx="5"/>
    <ellipse class="g-shoe" cx="59" cy="218" rx="9.5" ry="5.5"/>
    <ellipse class="g-shoe" cx="81" cy="218" rx="9.5" ry="5.5"/>
    <!-- arms (behind dress) -->
    <g class="arm arm-l">
      <rect class="c-skin" x="42" y="116" width="11" height="50" rx="5.5"/>
      <circle class="c-skin" cx="47.5" cy="167" r="6.5"/>
      <rect class="g-dress" x="40.5" y="113" width="14" height="17" rx="6"/>
    </g>
    <g class="arm arm-r">
      <rect class="c-skin" x="87" y="116" width="11" height="50" rx="5.5"/>
      <circle class="c-skin" cx="92.5" cy="167" r="6.5"/>
      <rect class="g-dress" x="85.5" y="113" width="14" height="17" rx="6"/>
    </g>
    <!-- dress -->
    <path class="g-dress" d="M51 112 Q70 105 89 112 L102 192 Q70 203 38 192 Z"/>
    <path d="M44 160 Q70 170 96 160" fill="none" stroke="#fff" stroke-width="3" opacity=".55" stroke-linecap="round"/>
    <circle class="c-white" cx="58" cy="176" r="2.6" opacity=".65"/><circle class="c-white" cx="76" cy="182" r="2.6" opacity=".65"/>
    <circle class="c-white" cx="88" cy="170" r="2.2" opacity=".65"/><circle class="c-white" cx="50" cy="150" r="2.2" opacity=".65"/>
    <ellipse class="c-white" cx="70" cy="112" rx="13" ry="5.5"/>
    <path class="g-bow" d="M70 124 L58 118 L58 130 Z M70 124 L82 118 L82 130 Z"/><circle class="g-bow" cx="70" cy="124" r="3.4"/>
    <!-- head -->
    <g class="head">
      <circle class="g-hair" cx="24" cy="78" r="16"/><circle class="g-hair" cx="116" cy="78" r="16"/>
      <ellipse class="g-hair" cx="70" cy="62" rx="43" ry="45"/>
      <circle class="c-skin" cx="70" cy="68" r="38"/>
      <path class="g-hair" d="M31 66 Q34 24 70 22 Q106 24 109 66 Q98 44 82 47 Q70 38 58 47 Q42 44 31 66 Z"/>
      <path class="g-bow" d="M30 56 L16 48 L16 64 Z M30 56 L44 48 L44 64 Z"/><circle class="g-bow" cx="30" cy="56" r="4"/>
      <path class="g-bow" d="M110 56 L96 48 L96 64 Z M110 56 L124 48 L124 64 Z"/><circle class="g-bow" cx="110" cy="56" r="4"/>
      ${EYES_OPEN}
      ${FACE_EXTRAS}
    </g>
  </svg>`;
}

function boySVG() {
  return `
  <svg viewBox="0 0 140 230" aria-hidden="true">
    <ellipse class="c-shadow" cx="70" cy="225" rx="36" ry="5"/>
    <!-- legs + shoes -->
    <rect class="c-skin" x="56" y="184" width="11" height="32" rx="5.5"/>
    <rect class="c-skin" x="73" y="184" width="11" height="32" rx="5.5"/>
    <ellipse class="b-shoe" cx="60" cy="218" rx="10" ry="5.5"/>
    <ellipse class="b-shoe" cx="80" cy="218" rx="10" ry="5.5"/>
    <!-- arms -->
    <g class="arm arm-l">
      <rect class="c-skin" x="38" y="116" width="11" height="50" rx="5.5"/>
      <circle class="c-skin" cx="43.5" cy="167" r="6.5"/>
      <rect class="b-shirt" x="36.5" y="113" width="14" height="19" rx="6"/>
    </g>
    <g class="arm arm-r">
      <rect class="c-skin" x="91" y="116" width="11" height="50" rx="5.5"/>
      <circle class="c-skin" cx="96.5" cy="167" r="6.5"/>
      <rect class="b-shirt" x="89.5" y="113" width="14" height="19" rx="6"/>
    </g>
    <!-- shirt + shorts -->
    <rect class="b-pants" x="51" y="164" width="38" height="26" rx="9"/>
    <path d="M70 172 L70 190" stroke="#fff" stroke-width="2" opacity=".5"/>
    <rect class="b-shirt" x="49" y="110" width="42" height="62" rx="15"/>
    <path class="c-white" d="M60 110 L70 124 L80 110 Z"/>
    <path class="c-white" d="M70 142 C63 133 52 142 70 156 C88 142 77 133 70 142 Z" opacity=".85"/>
    <!-- head -->
    <g class="head">
      <circle class="c-skin" cx="32" cy="72" r="6.5"/><circle class="c-skin" cx="108" cy="72" r="6.5"/>
      <circle class="c-skin" cx="70" cy="68" r="38"/>
      <path class="b-hair" d="M32 64 Q30 22 70 20 Q110 22 108 64 Q101 42 85 40 Q70 54 52 42 Q38 46 32 64 Z"/>
      <path class="b-hair" d="M64 22 Q58 4 78 10 Q70 16 76 24 Z"/>
      ${EYES_OPEN}
      ${FACE_EXTRAS}
    </g>
  </svg>`;
}

// Fill every <div data-char="girl|boy"> with a character
function mountCharacters() {
  $$("[data-char]").forEach((el) => {
    el.innerHTML = el.dataset.char === "girl" ? girlSVG() : boySVG();
  });
}

/* =====================================================
   🌸 Floating hearts, stars & butterflies (background)
   ===================================================== */
const HEARTS = ["💗", "💖", "💕", "🩷"];

function spawnFloater(preFlown = false) {
  const layer = $("#bg");
  if (!layer || layer.childElementCount > 26 || document.hidden) return;

  const type = pick(["heart", "heart", "heart", "star", "spark", "bfly", "bfly"]);
  const emoji = { heart: pick(HEARTS), star: pick(["⭐", "🌟"]), spark: "✨", bfly: "🦋" }[type];
  const duration = rand(10, 18);

  const el = document.createElement("div");
  el.className = "floater " + (type === "spark" ? "star" : type);
  el.style.setProperty("--x", rand(2, 95).toFixed(1) + "vw");
  el.style.setProperty("--s", rand(16, 34).toFixed(0) + "px");
  el.style.setProperty("--d", duration.toFixed(1) + "s");
  el.style.setProperty("--drift", rand(-70, 70).toFixed(0) + "px");
  if (preFlown) el.style.animationDelay = "-" + rand(0, duration * 0.8).toFixed(1) + "s";
  el.innerHTML = "<span>" + emoji + "</span>";
  el.addEventListener("animationend", (e) => { if (e.target === el) el.remove(); });
  layer.appendChild(el);
}

function startFloaters() {
  for (let i = 0; i < 12; i++) spawnFloater(true);
  setInterval(spawnFloater, 1100);
}

// Glowing hearts + butterflies around a letter card
function scatterDeco(layer, count) {
  layer.innerHTML = "";
  const icons = ["💗", "💖", "🦋", "✨", "🦋", "🩷", "💕"];
  for (let i = 0; i < count; i++) {
    const icon = pick(icons);
    const el = document.createElement("span");
    el.className = "deco" + (icon === "🦋" ? " bfly" : "");
    // keep them around the edges of the card
    const side = i % 4;
    let left, top;
    if (side === 0) { left = rand(-3, 6); top = rand(0, 95); }
    else if (side === 1) { left = rand(94, 103); top = rand(0, 95); }
    else if (side === 2) { left = rand(4, 94); top = rand(-4, 4); }
    else { left = rand(4, 94); top = rand(96, 104); }
    el.style.left = left + "%";
    el.style.top = top + "%";
    el.style.setProperty("--s", rand(1.1, 2.0).toFixed(2) + "rem");
    el.style.setProperty("--d", rand(4, 8).toFixed(1) + "s");
    el.style.setProperty("--delay", "-" + rand(0, 6).toFixed(1) + "s");
    el.innerHTML = "<span>" + icon + "</span>";
    layer.appendChild(el);
  }
}

/* =====================================================
   🎊 Canvas effects: confetti, fireworks, hearts, party poppers
   ===================================================== */
const canvas = $("#fx");
const ctx = canvas.getContext("2d");
let W = 0, H = 0;
const particles = [];
let rafId = null;
let lastTime = 0;
const MAX_PARTICLES = 650;
const CONFETTI_COLORS = ["#ff8fc0", "#ffc4de", "#c59bff", "#d9c8ff", "#9fd2ff", "#cfe8ff", "#fff1a8", "#ffffff", "#ffb48f"];

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function addParticle(p) {
  if (particles.length >= MAX_PARTICLES) particles.shift();
  particles.push(p);
  if (!rafId) { lastTime = performance.now(); rafId = requestAnimationFrame(tick); }
}

function tick(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;
  ctx.clearRect(0, 0, W, H);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.age += dt;
    if (p.age >= p.life || p.y > H + 60 || p.y < -200) {
      particles.splice(i, 1);
      if (p.onDie) p.onDie(p);
      continue;
    }
    p.vx *= p.drag;
    p.vy = p.vy * p.drag + p.g * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.rot += p.vr * dt;
    drawParticle(p);
  }

  if (particles.length) rafId = requestAnimationFrame(tick);
  else { rafId = null; ctx.clearRect(0, 0, W, H); }
}

function drawParticle(p) {
  const t = p.age / p.life;
  const alpha = t < 0.7 ? 1 : Math.max(0, 1 - (t - 0.7) / 0.3);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  if (p.kind === "confetti") {
    const flip = Math.cos(p.age * p.flutter);
    ctx.scale(1, flip);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
  } else if (p.kind === "spark") {
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, 0, p.size * (1 - t * 0.5), 0, Math.PI * 2);
    ctx.fill();
  } else if (p.kind === "rocket") {
    ctx.fillStyle = "#fff";
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();
  } else if (p.kind === "emoji") {
    ctx.font = p.size + "px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(p.emoji, 0, 0);
  }
  ctx.restore();
}

function makeParticle(kind, x, y, vx, vy, extra = {}) {
  return Object.assign({
    kind, x, y, vx, vy,
    g: 380, drag: 0.992,
    age: 0, life: rand(2.2, 3.6),
    size: rand(7, 12), rot: rand(0, 6.28), vr: rand(-6, 6),
    flutter: rand(6, 12),
    color: pick(CONFETTI_COLORS)
  }, extra);
}

// 🎉 a burst of confetti from a point
function confettiBurst(x, y, count = 70, power = 520) {
  if (reduceMotion) count = Math.round(count / 3);
  for (let i = 0; i < count; i++) {
    const a = rand(0, Math.PI * 2);
    const s = rand(power * 0.25, power);
    addParticle(makeParticle("confetti", x, y, Math.cos(a) * s, Math.sin(a) * s - power * 0.35));
  }
}

// 🎊 confetti falling gently from the top
function confettiRain(seconds = 3, perSecond = 30) {
  const steps = Math.round(seconds * 10);
  for (let i = 0; i < steps; i++) {
    later(() => {
      const n = Math.round(perSecond / 10);
      for (let k = 0; k < n; k++) {
        addParticle(makeParticle("confetti", rand(0, W), -20, rand(-40, 40), rand(60, 160), { g: 40, drag: 1, life: rand(5, 8) }));
      }
    }, i * 100);
  }
}

// 🎉 party popper shooting from a bottom corner
function popper(side) {
  const left = side === "left";
  const x = left ? 18 : W - 18;
  const y = H - 24;
  addParticle(makeParticle("emoji", x, y, 0, 0, { emoji: "🎉", size: 34, g: 0, life: 0.9, vr: 0, rot: left ? -0.3 : 0.3 }));
  const count = reduceMotion ? 14 : 48;
  for (let i = 0; i < count; i++) {
    const base = left ? -Math.PI / 3 : (-2 * Math.PI) / 3;   // up and towards the middle
    const a = base + rand(-0.55, 0.55);
    const s = rand(380, 980);
    addParticle(makeParticle("confetti", x, y, Math.cos(a) * s, Math.sin(a) * s, { g: 520, drag: 0.985 }));
  }
}
function partyPoppers() {
  popper("left");
  later(() => popper("right"), 220);
}

// 🎆 a soft firework (rocket + sparks)
function firework(x, y) {
  const color = pick(["#ff8fc0", "#c59bff", "#9fd2ff", "#ffe27a", "#ffb3d6"]);
  const startY = H + 10;
  const rocket = makeParticle("rocket", x, startY, 0, -rand(520, 640), {
    g: 120, drag: 1, life: 0.9, color,
    onDie: (r) => explode(r.x, r.y, color)
  });
  rocket.life = Math.max(0.55, Math.min(1.1, (startY - y) / 560));
  addParticle(rocket);
}
function explode(x, y, color) {
  const n = reduceMotion ? 14 : 34;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + rand(-0.1, 0.1);
    const s = rand(90, 230);
    addParticle(makeParticle("spark", x, y, Math.cos(a) * s, Math.sin(a) * s, {
      g: 110, drag: 0.97, life: rand(1, 1.6), size: rand(2.4, 4), color
    }));
  }
  for (let i = 0; i < 6; i++) {
    addParticle(makeParticle("emoji", x + rand(-20, 20), y + rand(-20, 20), rand(-60, 60), rand(-90, -20), {
      emoji: pick(["💗", "✨", "⭐"]), size: rand(14, 22), g: 40, drag: 0.98, life: rand(1.2, 1.8), vr: 0
    }));
  }
}
function fireworksShow(count = 3) {
  for (let i = 0; i < count; i++) {
    later(() => firework(rand(W * 0.15, W * 0.85), rand(H * 0.15, H * 0.42)), i * 480);
  }
}

// 💗 little hearts & sparkles where you tap
function heartsBurst(x, y, n = 6) {
  if (reduceMotion) n = 3;
  for (let i = 0; i < n; i++) {
    const a = rand(-Math.PI, 0);
    const s = rand(60, 170);
    addParticle(makeParticle("emoji", x, y, Math.cos(a) * s, Math.sin(a) * s - 40, {
      emoji: pick(["💗", "💖", "✨", "🦋", "⭐", "💕"]), size: rand(16, 26),
      g: 70, drag: 0.97, life: rand(1, 1.6), vr: rand(-1, 1)
    }));
  }
}

/* 🎈 Balloons (DOM elements that float up) */
const BALLOON_COLORS = ["#ff9fc6", "#ffc4de", "#c9b2ff", "#aedcff", "#fff0a8", "#ffb8a8", "#b8f0d8"];
function releaseBalloons(count = 10) {
  const layer = $("#balloons");
  if (reduceMotion) count = Math.min(count, 5);
  for (let i = 0; i < count; i++) {
    if (layer.childElementCount > 40) return;
    const b = document.createElement("div");
    const duration = rand(8, 13);
    const delay = rand(0, 1.8);
    b.className = "balloon";
    b.style.setProperty("--x", rand(2, 90).toFixed(1) + "vw");
    b.style.setProperty("--w", rand(46, 78).toFixed(0) + "px");
    b.style.setProperty("--c", pick(BALLOON_COLORS));
    b.style.setProperty("--d", duration.toFixed(1) + "s");
    b.style.setProperty("--delay", delay.toFixed(1) + "s");
    b.style.setProperty("--sway", rand(-26, 26).toFixed(0) + "px");
    b.addEventListener("animationend", (e) => { if (e.target === b) b.remove(); });
    layer.appendChild(b);
  }
}

// Clear every effect (used by the replay button)
function clearEffects() {
  particles.length = 0;
  ctx.clearRect(0, 0, W, H);
  $("#balloons").innerHTML = "";
}

/* =====================================================
   🎵 Music player
   One <audio> element for the whole site. It lives outside the scenes
   and is only ever STARTED (never reloaded), so the song never restarts
   when the scene changes.
   ===================================================== */
const song = $("#song");
const btnPlay = $("#btnPlay");
const btnMute = $("#btnMute");
const volSlider = $("#vol");
const playerEl = $("#player");
const plabel = $("#plabel");

let songStarted = false;      // has the song been started at least once?
let userPaused = false;       // did she press pause herself?
let audioBroken = false;      // true if no audio file could be loaded

function refreshPlayerUI() {
  const playing = !song.paused && !song.ended;
  btnPlay.textContent = playing ? "⏸" : "▶";
  btnPlay.setAttribute("aria-label", playing ? "Pause birthday song" : "Play birthday song");
  playerEl.classList.toggle("playing", playing);
  const muted = song.muted || song.volume === 0;
  btnMute.textContent = muted ? "🔇" : "🔊";
  btnMute.setAttribute("aria-label", muted ? "Unmute" : "Mute");
}

// Try to start the song. Returns true/false. Never throws.
async function startSong() {
  if (audioBroken) return false;
  try {
    await song.play();
    songStarted = true;
    userPaused = false;
    playerEl.classList.remove("attention");
    $("#btnSongPrompt").hidden = true;
    refreshPlayerUI();
    return true;
  } catch (err) {
    // Browser blocked it, or the file is missing. Show a clear play button instead.
    refreshPlayerUI();
    return false;
  }
}

function pauseSong() {
  song.pause();
  userPaused = true;
  refreshPlayerUI();
}

btnPlay.addEventListener("click", async () => {
  if (!song.paused) { pauseSong(); return; }
  const ok = await startSong();
  if (!ok) {
    toast(audioBroken
      ? "🎵 Add your song to the assets folder (see README) 💗"
      : "Couldn't play the song. Tap play again 💗");
  }
});

btnMute.addEventListener("click", () => {
  song.muted = !song.muted;
  if (!song.muted && song.volume === 0) { song.volume = 0.5; volSlider.value = 50; }
  refreshPlayerUI();
});

volSlider.addEventListener("input", () => {
  song.volume = volSlider.value / 100;
  if (song.volume > 0) song.muted = false;
  refreshPlayerUI();
});

song.volume = 0.8;
["play", "pause", "ended", "volumechange"].forEach((ev) => song.addEventListener(ev, refreshPlayerUI));

// If none of the <source> files exist, the LAST <source> fires an error.
const sources = $$("source", song);
if (sources.length) {
  sources[sources.length - 1].addEventListener("error", () => {
    audioBroken = true;
    plabel.textContent = "No song yet";
    refreshPlayerUI();
  });
}
song.addEventListener("error", () => { audioBroken = true; refreshPlayerUI(); });

// Make the song a little quieter during the emotional letter, then bring it back.
let volumeFade = null;
function fadeVolumeTo(target, ms = 1800) {
  clearInterval(volumeFade);
  const from = song.volume;
  const base = volSlider.value / 100;          // what she chose with the slider
  const goal = Math.max(0, Math.min(1, base * target));
  const steps = 24;
  let i = 0;
  volumeFade = setInterval(() => {
    i++;
    song.volume = from + (goal - from) * (i / steps);
    if (i >= steps) clearInterval(volumeFade);
  }, ms / steps);
}
function restoreVolume() { fadeVolumeTo(1, 1200); }

/* =====================================================
   ⌨️ Typing animation
   Types text slowly, one character at a time.
   Uses Array.from so emojis (which are several characters long) are never cut in half.
   ===================================================== */
let activeTyper = null;

function typeText(el, text, speed, { onDone, onProgress } = {}) {
  // Intl.Segmenter keeps multi-part emojis (like ❤️‍🩹 or 🫶🏻) together; older browsers fall back to Array.from
  const chars = (typeof Intl !== "undefined" && Intl.Segmenter)
    ? Array.from(new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text), (s) => s.segment)
    : Array.from(text);
  let i = 0;
  let timer = null;
  let finished = false;
  el.textContent = "";
  el.classList.remove("done");

  function finish() {
    if (finished) return;
    finished = true;
    clearTimeout(timer);
    el.textContent = text;
    el.classList.add("done");
    if (activeTyper === api) activeTyper = null;
    if (onProgress) onProgress();
    if (onDone) onDone();
  }

  function step() {
    if (finished) return;
    if (i >= chars.length) { finish(); return; }
    const ch = chars[i++];
    el.textContent += ch;
    if (onProgress) onProgress();
    // pause a little longer after punctuation so it feels like real typing
    let delay = speed;
    if (".!?".includes(ch)) delay = speed * 7;
    else if (",…".includes(ch) || ch === "\n") delay = speed * 4;
    timer = setTimeout(step, delay);
  }

  const api = {
    skip: finish,
    cancel() { finished = true; clearTimeout(timer); if (activeTyper === api) activeTyper = null; }
  };
  activeTyper = api;
  step();
  return api;
}

/* =====================================================
   🎂 The cake (drawn with SVG, built here so the number of candles is easy to change)
   ===================================================== */
const cakeWrap = $("#cakeWrap");
const candlesLayer = $("#candles");
const CANDLE_COLORS = ["#ffb3d6", "#bfe0ff", "#d9c8ff", "#fff0a8", "#ffc4a8", "#c6f1de"];
let candlesLeft = 0;
let allOutHandled = false;

function svgEl(name, attrs = {}) {
  const el = document.createElementNS(SVG_NS, name);
  Object.keys(attrs).forEach((k) => el.setAttribute(k, attrs[k]));
  return el;
}

// white dripping icing along an edge
function dripPath(x1, x2, y, count, depths) {
  const w = (x2 - x1) / count;
  let d = `M${x1} ${y - 4} H${x2} V${y + 2}`;
  for (let k = 0; k < count; k++) {
    const xa = x2 - k * w;
    const xb = xa - w;
    const depth = depths[k % depths.length];
    d += ` Q${((xa + xb) / 2).toFixed(1)} ${y + 2 + depth * 2} ${xb.toFixed(1)} ${y + 2}`;
  }
  return d + " Z";
}

function decorateCake() {
  $("#dripTop").setAttribute("d", dripPath(84, 236, 110, 8, [9, 16, 11, 19, 8, 15, 12, 18]));
  $("#dripBottom").setAttribute("d", dripPath(48, 272, 166, 8, [10, 18, 13, 20, 9, 17, 12, 19]));

  // sprinkles (fixed positions so the cake always looks the same)
  const spr = $("#sprinkles");
  spr.innerHTML = "";
  const colors = ["#ff6fa8", "#7fb4f0", "#ffd84d", "#9a73ff", "#5fd1a6", "#ffffff"];
  const spots = [
    [90,152],[112,158],[140,150],[168,157],[196,151],[222,158],[96,162],[126,164],[154,163],[212,163],
    [58,212],[82,222],[104,208],[128,224],[152,210],[178,224],[200,209],[226,222],[250,212],[70,196],
    [116,216],[188,214],[238,200],[262,224],[142,198]
  ];
  spots.forEach(([x, y], i) => {
    const r = (i * 37) % 180;
    const line = svgEl("rect", {
      x: x - 5, y: y - 1.6, width: 10, height: 3.2, rx: 1.6,
      fill: colors[i % colors.length],
      transform: `rotate(${r} ${x} ${y})`
    });
    spr.appendChild(line);
  });
}

function buildCandles() {
  candlesLayer.innerHTML = "";
  candlesLayer.style.opacity = "1";
  const n = CONFIG.candleCount;
  const gap = Math.min(30, 130 / Math.max(n - 1, 1));
  for (let i = 0; i < n; i++) {
    const x = 160 + (i - (n - 1) / 2) * gap;
    const color = CANDLE_COLORS[i % CANDLE_COLORS.length];
    const g = svgEl("g", { class: "candle", tabindex: "0", role: "button", "aria-label": `Blow out candle ${i + 1}` });
    g.appendChild(svgEl("rect", { x: x - 15, y: 30, width: 30, height: 78, fill: "rgba(0,0,0,0.001)" }));   // big tap area
    g.appendChild(svgEl("circle", { class: "flame-glow", cx: x, cy: 52, r: 17, fill: "url(#gGlow)" }));
    g.appendChild(svgEl("rect", { x: x - 6, y: 68, width: 12, height: 37, rx: 3, fill: color }));
    [76, 86, 96].forEach((yy) => g.appendChild(svgEl("rect", { x: x - 6, y: yy, width: 12, height: 4, fill: "#fff", opacity: ".55" })));
    g.appendChild(svgEl("path", { d: `M${x} 68 L${x} 62`, stroke: "#6a3b6e", "stroke-width": 2, "stroke-linecap": "round" }));
    const flame = svgEl("g", { class: "flame" });
    flame.appendChild(svgEl("path", { d: `M${x} 40 C${x + 9} 50 ${x + 7} 62 ${x} 62 C${x - 7} 62 ${x - 9} 50 ${x} 40 Z`, fill: "#ffc94d" }));
    flame.appendChild(svgEl("path", { d: `M${x} 49 C${x + 4} 54 ${x + 3.5} 61 ${x} 61 C${x - 3.5} 61 ${x - 4} 54 ${x} 49 Z`, fill: "#fff6a8" }));
    g.appendChild(flame);
    g.addEventListener("click", () => blowOut(g));
    g.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); blowOut(g); }
    });
    candlesLayer.appendChild(g);
  }
  candlesLeft = n;
  allOutHandled = false;
  updateCandleCount();
}

function updateCandleCount() {
  const el = $("#candleCount");
  el.textContent = candlesLeft > 0 ? `(${candlesLeft} left)` : "";
}

function blowOut(candle) {
  if (candle.classList.contains("out") || candle.classList.contains("out-pending") || allOutHandled) return;
  candle.classList.add("blowing");

  // tiny puff of smoke
  const flame = $(".flame path", candle);
  const x = parseFloat(flame.getAttribute("d").slice(1));
  candlesLayer.appendChild(svgEl("ellipse", { class: "smoke", cx: x, cy: 46, rx: 5, ry: 7 }));
  later(() => { const s = $(".smoke", candlesLayer); if (s) s.remove(); }, 1600);

  later(() => candle.classList.add("out"), 180);
  candle.classList.add("out-pending");
  candlesLeft--;
  updateCandleCount();

  const r = candle.getBoundingClientRect();
  heartsBurst(r.left + r.width / 2, r.top + r.height / 3, 5);

  if (candlesLeft === 0) {
    allOutHandled = true;
    // Called straight from the tap, so the browser lets the song start
    handleAllCandlesOut();
  }
}

async function handleAllCandlesOut() {
  // 🎵 start the song (this happens only once; later scenes never restart it)
  const started = await startSong();
  if (!started) {
    $("#btnSongPrompt").hidden = false;
    playerEl.classList.add("attention");
  }

  $("#candleHint").hidden = true;
  $("#wishDone").hidden = false;
  $$("#scene-cake .char").forEach((c) => { c.classList.remove("pose-wave"); c.classList.add("cheer"); });

  const r = cakeWrap.getBoundingClientRect();
  confettiBurst(r.left + r.width / 2, r.top + r.height * 0.3, 90, 560);
  confettiRain(3, 26);
  later(() => confettiBurst(W * 0.2, H * 0.55, 40, 460), 400);
  later(() => confettiBurst(W * 0.8, H * 0.55, 40, 460), 650);

  later(() => { $("#btnCut").hidden = false; }, 1300);
}

$("#btnSongPrompt").addEventListener("click", async () => {
  const ok = await startSong();
  if (!ok) toast("Couldn't play the song. Check the assets folder (see README) 💗");
});

/* ✂️ cutting the cake */
function cutCake() {
  $("#btnCut").hidden = true;
  $("#wishDone").hidden = true;
  cakeWrap.classList.add("knife-in");

  later(() => {
    cakeWrap.classList.add("cut");
    candlesLayer.style.transition = "opacity .6s ease";
    candlesLayer.style.opacity = "0";

    const r = cakeWrap.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height * 0.45;
    confettiBurst(cx, cy, 110, 640);
    partyPoppers();
    releaseBalloons(12);
    heartsBurst(cx, cy, 10);
    later(() => fireworksShow(2), 500);
    later(() => confettiRain(3, 30), 600);

    $("#cutMsg").hidden = false;
    later(() => { $("#btnToParty").hidden = false; }, 2600);
  }, 1100);
}

/* =====================================================
   🎬 Scenes
   ===================================================== */
const scenes = {
  welcome: $("#scene-welcome"),
  cake: $("#scene-cake"),
  party: $("#scene-party"),
  message: $("#scene-message"),
  secret: $("#scene-secret"),
  hug: $("#scene-hug")
};
let currentScene = "welcome";

function showScene(name) {
  currentScene = name;
  Object.keys(scenes).forEach((k) => scenes[k].classList.toggle("active", k === name));
  scenes[name].scrollTop = 0;
  if (activeTyper && name !== "message" && name !== "secret") activeTyper.cancel();

  if (name === "party") enterParty();
  if (name === "message") enterMessage();
  if (name === "secret") enterSecret();
  if (name === "hug") enterHug();
}

/* 🎈 Scene 3: celebration */
let lastCelebrate = 0;
function enterParty() {
  releaseBalloons(10);
  later(() => partyPoppers(), 500);
  later(() => fireworksShow(3), 900);
  later(() => confettiRain(3, 20), 300);
}

function celebrateMore() {
  const now = performance.now();
  if (now - lastCelebrate < 700) return;      // keeps it cute, not overwhelming
  lastCelebrate = now;
  releaseBalloons(8);
  confettiBurst(rand(W * 0.2, W * 0.8), rand(H * 0.3, H * 0.55), 70, 520);
  partyPoppers();
  fireworksShow(2);
}

/* 💬 Scene 4: personal message */
function enterMessage() {
  const text = $("#msgText");
  text.textContent = "";
  $("#btnToSecret").hidden = true;
  scatterDeco($("#msgDeco"), 14);
  later(() => {
    typeText(text, CONFIG.personalMessage, CONFIG.personalTypingSpeed, {
      onDone: () => later(() => { $("#btnToSecret").hidden = false; }, 700)
    });
  }, 900);
}

/* 💌 Scene 5: secret envelope + letter */
function resetSecret() {
  scenes.secret.classList.remove("dimmed");
  $("#envelope").classList.remove("opening");
  $("#envStage").classList.remove("leaving");
  $("#envStage").hidden = false;
  $("#letterStage").hidden = true;
  $("#secretText").textContent = "";
  $("#secretText").classList.remove("done");
  $("#secretSign").hidden = true;
  $("#btnToHug").hidden = true;
  $("#btnSkipType").hidden = false;
  $("#btnOpenSecret").disabled = false;
}

function enterSecret() {
  resetSecret();
}

function openSecret() {
  const btn = $("#btnOpenSecret");
  if (btn.disabled) return;
  btn.disabled = true;

  $("#envelope").classList.add("opening");          // flap opens, paper slides out
  scenes.secret.classList.add("dimmed");            // background gets cozy and dark
  fadeVolumeTo(0.5, 2500);                          // song gets softer (it does NOT restart)
  confettiBurst(W / 2, H * 0.45, 25, 300);

  later(() => $("#envStage").classList.add("leaving"), 2300);
  later(() => {
    $("#envStage").hidden = true;
    $("#letterStage").hidden = false;
    scatterDeco($("#secretDeco"), 24);
    startSecretTyping();
  }, 3400);
}

function startSecretTyping() {
  const scroll = $("#secretScroll");
  const text = $("#secretText");
  const full = CONFIG.secretLetter.join("\n\n");

  typeText(text, full, CONFIG.secretTypingSpeed, {
    onProgress: () => {
      // follow the typing, unless she scrolled up to re-read
      const nearBottom = scroll.scrollHeight - scroll.scrollTop - scroll.clientHeight < 140;
      if (nearBottom) scroll.scrollTop = scroll.scrollHeight;
    },
    onDone: () => {
      $("#btnSkipType").hidden = true;
      $("#secretSign").hidden = false;
      scroll.scrollTo({ top: scroll.scrollHeight, behavior: "smooth" });
      heartsBurst(W / 2, H * 0.5, 10);
      later(() => { $("#btnToHug").hidden = false; }, 2200);
    }
  });
}

/* 🫂 Scene 6: the final hug */
let hugRunning = false;

function resetHug() {
  hugRunning = false;
  $("#hugStage").classList.remove("together");
  $$("#hugStage .char").forEach((c) => c.classList.remove("walking", "hugging", "hug-squish", "is-closed"));
  $("#hugHearts").innerHTML = "";
  const line = $("#hugLine");
  line.classList.remove("show");
  line.textContent = "";
  $("#hugFinal").hidden = true;
}

function spawnHugHeart() {
  const layer = $("#hugHearts");
  if (!layer || layer.childElementCount > 24) return;
  const el = document.createElement("span");
  el.className = "hug-heart";
  el.textContent = pick(["💗", "💖", "💕", "🦋", "✨", "🩷", "🦋"]);
  el.style.left = rand(18, 82).toFixed(0) + "%";
  el.style.top = rand(10, 55).toFixed(0) + "%";
  el.style.setProperty("--s", rand(1.2, 2.2).toFixed(2) + "rem");
  el.style.setProperty("--dx", rand(-50, 50).toFixed(0) + "px");
  el.style.setProperty("--rot", rand(-25, 25).toFixed(0) + "deg");
  el.style.setProperty("--d", rand(2.6, 4).toFixed(1) + "s");
  el.addEventListener("animationend", () => el.remove());
  layer.appendChild(el);
}

function hugHeartLoop() {
  if (!hugRunning) return;
  spawnHugHeart();
  later(hugHeartLoop, reduceMotion ? 1200 : 480);
}

// a gentle shower of sparkles
function sparkleRain(seconds) {
  const steps = Math.round(seconds * 4);
  for (let i = 0; i < steps; i++) {
    later(() => {
      addParticle(makeParticle("emoji", rand(0, W), -20, rand(-20, 20), rand(40, 90), {
        emoji: pick(["✨", "✨", "💗", "⭐"]), size: rand(14, 24), g: 20, drag: 1, life: rand(6, 9), vr: rand(-0.5, 0.5)
      }));
    }, i * 250);
  }
}

function enterHug() {
  resetHug();
  hugRunning = true;
  const chars = $$("#hugStage .char");

  // 1) they walk towards each other
  later(() => {
    chars.forEach((c) => c.classList.add("walking"));
    $("#hugStage").classList.add("together");
  }, 1200);

  // 2) they hug, eyes closed
  later(() => {
    chars.forEach((c) => {
      c.classList.remove("walking");
      c.classList.add("hugging", "is-closed", "hug-squish");
    });
    hugHeartLoop();
    sparkleRain(14);
    confettiRain(8, 12);
    heartsBurst(W / 2, H * 0.4, 8);
  }, 6400);

  // 3) the messages, one after another
  let t = 8000;
  CONFIG.hugLines.forEach((text, i) => {
    const hold = (CONFIG.hugLineSeconds[i] || 5) * 1000;
    later(() => {
      const line = $("#hugLine");
      line.textContent = text;
      void line.offsetWidth;
      line.classList.add("show");
    }, t);
    later(() => $("#hugLine").classList.remove("show"), t + hold);
    t += hold + 1600;
  });

  // 4) the ending
  later(() => {
    $("#hugFinal").hidden = false;
    confettiBurst(W / 2, H * 0.4, 50, 420);
  }, t);
}

/* 🎁 Replay: put everything back exactly as it was at the start */
function replay() {
  clearAllTimers();
  if (activeTyper) activeTyper.cancel();
  clearEffects();
  hugRunning = false;

  // cake
  cakeWrap.classList.remove("knife-in", "cut");
  candlesLayer.style.transition = "none";
  buildCandles();
  $("#candleHint").hidden = false;
  ["#wishDone", "#cutMsg", "#btnSongPrompt", "#btnCut", "#btnToParty"].forEach((s) => { $(s).hidden = true; });
  $$("#scene-cake .char").forEach((c) => { c.classList.remove("cheer"); c.classList.add("pose-wave"); });

  // other scenes
  $("#msgText").textContent = "";
  $("#btnToSecret").hidden = true;
  resetSecret();
  resetHug();

  // song: stop, rewind, back to full volume. It starts again at the candle moment.
  clearInterval(volumeFade);
  song.pause();
  try { song.currentTime = 0; } catch (e) { /* ignore */ }
  song.volume = volSlider.value / 100;
  songStarted = false;
  userPaused = false;
  playerEl.classList.remove("attention");
  refreshPlayerUI();

  showScene("welcome");
}

/* =====================================================
   🔌 Wire up every button
   ===================================================== */
function init() {
  mountCharacters();
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  decorateCake();
  buildCandles();
  startFloaters();
  refreshPlayerUI();

  $("#btnOpen").addEventListener("click", () => {
    heartsBurst(W / 2, H * 0.6, 8);
    confettiBurst(W / 2, H * 0.6, 40, 420);
    showScene("cake");
  });
  $("#btnCut").addEventListener("click", cutCake);
  $("#btnToParty").addEventListener("click", () => showScene("party"));
  $("#btnMore").addEventListener("click", celebrateMore);
  $("#btnToMessage").addEventListener("click", () => showScene("message"));
  $("#btnToSecret").addEventListener("click", () => showScene("secret"));
  $("#btnOpenSecret").addEventListener("click", openSecret);
  $("#btnSkipType").addEventListener("click", () => { if (activeTyper) activeTyper.skip(); });
  $("#btnToHug").addEventListener("click", () => showScene("hug"));
  $("#btnReplay").addEventListener("click", replay);

  // tap anywhere for little hearts (and extra fun in the party scene)
  document.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button, input, .player, .candle")) return;
    if (currentScene === "secret" || currentScene === "message") return;
    heartsBurst(e.clientX, e.clientY, 4);
    if (currentScene === "party") {
      confettiBurst(e.clientX, e.clientY, 22, 380);
      if (Math.random() < 0.3) firework(e.clientX, Math.min(e.clientY, H * 0.45));
    }
  });
}

init();