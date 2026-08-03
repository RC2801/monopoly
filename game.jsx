/* React comes from the UMD global loaded in index.html */
const { useState, useRef, useEffect } = React;

/* ================= DATA ================= */
const GROUPS = {
  brown:  { c: "#A07856", hc: 50 },
  lblue:  { c: "#93C6E0", hc: 50 },
  pink:   { c: "#E39BB7", hc: 100 },
  orange: { c: "#EFA054", hc: 100 },
  red:    { c: "#E05B52", hc: 150 },
  yellow: { c: "#EFCB5C", hc: 150 },
  green:  { c: "#6FAE84", hc: 200 },
  dblue:  { c: "#5674C4", hc: 200 },
};

const BOARD = [
  { t: "go", name: "GO" },
  { t: "prop", name: "Mill Road", g: "brown", price: 60, r: [2, 10, 30, 90, 160, 250] },
  { t: "chest", name: "Chest" },
  { t: "prop", name: "Dock Row", g: "brown", price: 60, r: [4, 20, 60, 180, 320, 450] },
  { t: "tax", name: "Income Tax", amt: 200 },
  { t: "station", name: "South Station", price: 200 },
  { t: "prop", name: "Aster Avenue", g: "lblue", price: 100, r: [6, 30, 90, 270, 400, 550] },
  { t: "fortune", name: "Fortune" },
  { t: "prop", name: "Birch Street", g: "lblue", price: 100, r: [6, 30, 90, 270, 400, 550] },
  { t: "prop", name: "Cedar Lane", g: "lblue", price: 120, r: [8, 40, 100, 300, 450, 600] },
  { t: "jail", name: "Jail" },
  { t: "prop", name: "Harbor View", g: "pink", price: 140, r: [10, 50, 150, 450, 625, 750] },
  { t: "util", name: "City Power", price: 150 },
  { t: "prop", name: "Marina Drive", g: "pink", price: 140, r: [10, 50, 150, 450, 625, 750] },
  { t: "prop", name: "Beacon Way", g: "pink", price: 160, r: [12, 60, 180, 500, 700, 900] },
  { t: "station", name: "West Station", price: 200 },
  { t: "prop", name: "Anvil Street", g: "orange", price: 180, r: [14, 70, 200, 550, 750, 950] },
  { t: "chest", name: "Chest" },
  { t: "prop", name: "Forge Avenue", g: "orange", price: 180, r: [14, 70, 200, 550, 750, 950] },
  { t: "prop", name: "Union Square", g: "orange", price: 200, r: [16, 80, 220, 600, 800, 1000] },
  { t: "park", name: "Free Parking" },
  { t: "prop", name: "Grand Plaza", g: "red", price: 220, r: [18, 90, 250, 700, 875, 1050] },
  { t: "fortune", name: "Fortune" },
  { t: "prop", name: "Regent Row", g: "red", price: 220, r: [18, 90, 250, 700, 875, 1050] },
  { t: "prop", name: "Opera Lane", g: "red", price: 240, r: [20, 100, 300, 750, 925, 1100] },
  { t: "station", name: "North Station", price: 200 },
  { t: "prop", name: "Amber Court", g: "yellow", price: 260, r: [22, 110, 330, 800, 975, 1150] },
  { t: "prop", name: "Golden Mile", g: "yellow", price: 260, r: [22, 110, 330, 800, 975, 1150] },
  { t: "util", name: "City Water", price: 150 },
  { t: "prop", name: "Sunset Street", g: "yellow", price: 280, r: [24, 120, 360, 850, 1025, 1200] },
  { t: "gotojail", name: "Go to Jail" },
  { t: "prop", name: "Laurel Hill", g: "green", price: 300, r: [26, 130, 390, 900, 1100, 1275] },
  { t: "prop", name: "Park Circle", g: "green", price: 300, r: [26, 130, 390, 900, 1100, 1275] },
  { t: "chest", name: "Chest" },
  { t: "prop", name: "Royal Oaks", g: "green", price: 320, r: [28, 150, 450, 1000, 1200, 1400] },
  { t: "station", name: "East Station", price: 200 },
  { t: "fortune", name: "Fortune" },
  { t: "prop", name: "Summit Place", g: "dblue", price: 350, r: [35, 175, 500, 1100, 1300, 1500] },
  { t: "tax", name: "Luxury Tax", amt: 100 },
  { t: "prop", name: "Crown Point", g: "dblue", price: 400, r: [50, 200, 600, 1400, 1700, 2000] },
];

const GIDX = {};
BOARD.forEach((s, i) => { if (s.t === "prop") { if (!GIDX[s.g]) GIDX[s.g] = []; GIDX[s.g].push(i); } });
const STATIONS = [5, 15, 25, 35];
const UTILS = [12, 28];

const FORTUNE = [
  { t: "Advance to GO. Collect $200.", k: "goto", pos: 0 },
  { t: "Ride the rails. Advance to North Station.", k: "goto", pos: 25 },
  { t: "Advance to Crown Point.", k: "goto", pos: 39 },
  { t: "Advance to Grand Plaza.", k: "goto", pos: 21 },
  { t: "Advance to Harbor View.", k: "goto", pos: 11 },
  { t: "Advance to the nearest Station.", k: "nearStation" },
  { t: "Go back 3 spaces.", k: "back3" },
  { t: "Go directly to Jail. No GO bonus on the way.", k: "jail" },
  { t: "Speeding fine. Pay $15.", k: "pay", amt: 15 },
  { t: "Your loan matures. Collect $150.", k: "get", amt: 150 },
  { t: "The bank pays you a dividend. Collect $50.", k: "get", amt: 50 },
  { t: "Elected board chair. Pay each player $50.", k: "payEach", amt: 50 },
  { t: "General repairs: $25 per house, $100 per hotel.", k: "repairs", h: 25, ho: 100 },
  { t: "Get Out of Jail Free. Keep this card.", k: "goojf" },
];

const CHEST = [
  { t: "The bank miscounts in your favor. Collect $200.", k: "get", amt: 200 },
  { t: "Clinic bill. Pay $50.", k: "pay", amt: 50 },
  { t: "Tax refund arrives. Collect $20.", k: "get", amt: 20 },
  { t: "Birthday! Every player gives you $10.", k: "collectEach", amt: 10 },
  { t: "Insurance pays out. Collect $100.", k: "get", amt: 100 },
  { t: "Hospital bill. Pay $100.", k: "pay", amt: 100 },
  { t: "Tuition is due. Pay $50.", k: "pay", amt: 50 },
  { t: "A small inheritance. Collect $100.", k: "get", amt: 100 },
  { t: "Your shares pay off. Collect $50.", k: "get", amt: 50 },
  { t: "Your savings jar is full. Collect $100.", k: "get", amt: 100 },
  { t: "Street repairs: $40 per house, $115 per hotel.", k: "repairs", h: 40, ho: 115 },
  { t: "You win a local design award. Collect $10.", k: "get", amt: 10 },
  { t: "Consulting fee. Collect $25.", k: "get", amt: 25 },
  { t: "Advance to GO. Collect $200.", k: "goto", pos: 0 },
  { t: "Go directly to Jail. No GO bonus on the way.", k: "jail" },
  { t: "Get Out of Jail Free. Keep this card.", k: "goojf" },
];

const TOK = ["🎩", "🚗", "🐕", "🚀"];
const PC = ["#F0574A", "#5C8CFF", "#3ED198", "#F5B13D"];
const PCD = ["#7E211A", "#1E3A8F", "#0F6B4C", "#8A5B10"];

/* a turned wooden pawn, shaded to read as 3D at any size */
function Pawn({ i, cls }) {
  const c = PC[i], d = PCD[i], k = "pw" + i + (cls || "");
  return (
    <svg className={"pawn " + (cls || "")} viewBox="0 0 44 58" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={"hd" + k} cx="34%" cy="26%" r="80%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity=".95" />
          <stop offset="34%" stopColor={c} />
          <stop offset="100%" stopColor={d} />
        </radialGradient>
        <linearGradient id={"bd" + k} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={d} />
          <stop offset="22%" stopColor={c} />
          <stop offset="52%" stopColor={c} />
          <stop offset="78%" stopColor={d} />
          <stop offset="100%" stopColor={d} />
        </linearGradient>
        <linearGradient id={"gl" + k} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity=".34" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse cx="22" cy="53.4" rx="14.5" ry="3.6" fill="#000" opacity=".5" />
      <path
        fill={"url(#bd" + k + ")"}
        d="M22 21.5c5 0 7.7 2.6 7.7 5.9 0 5.4-3.4 8.3-4.1 12.5 6.7 1.4 11.6 4.5 12.6 8.5H7.8c1-4 5.9-7.1 12.6-8.5-.7-4.2-4.1-7.1-4.1-12.5 0-3.3 2.7-5.9 7.7-5.9z"
      />
      <ellipse cx="22" cy="48.4" rx="14.7" ry="4.3" fill={"url(#bd" + k + ")"} />
      <ellipse cx="22" cy="47.1" rx="14.7" ry="4.3" fill="#000" opacity=".18" />
      <ellipse cx="22" cy="22.6" rx="8.6" ry="2.7" fill={"url(#bd" + k + ")"} />
      <circle cx="22" cy="13" r="10.1" fill={"url(#hd" + k + ")"} />
      <ellipse cx="17.9" cy="9.2" rx="3.5" ry="2.5" fill="#FFFFFF" opacity=".6" />
      <path d="M12.5 8.5a10.1 10.1 0 0 1 19 0z" fill={"url(#gl" + k + ")"} />
    </svg>
  );
}

const CR = 13.2;
const CW = (100 - 2 * CR) / 9;
/* ---------- board labels ---------- */
const ABBR = { AVENUE: "AVE", STREET: "ST", ROAD: "RD", DRIVE: "DR", STATION: "STN" };
function cellLabel(sp) {
  if (sp.t === "fortune") return "FORTUNE";
  if (sp.t === "chest") return "CHEST";
  if (["go", "jail", "park", "gotojail"].indexOf(sp.t) >= 0) return null;
  return sp.name.toUpperCase().split(" ").map((w) => ABBR[w] || w).join(" ");
}
/* fit the longest word to the cell: returns a font-size in cqw */
function nameFS(txt, innerW) {
  let mw = 1;
  txt.split(" ").forEach((w) => { if (w.length > mw) mw = w.length; });
  const fit = (innerW * 0.94) / (mw * 0.55);
  return Math.max(1.3, Math.min(1.95, fit));
}

function rect(i) {
  if (i === 0) return { x: 100 - CR, y: 100 - CR, w: CR, h: CR, side: "corner" };
  if (i < 10) return { x: 100 - CR - i * CW, y: 100 - CR, w: CW, h: CR, side: "bottom" };
  if (i === 10) return { x: 0, y: 100 - CR, w: CR, h: CR, side: "corner" };
  if (i < 20) return { x: 0, y: 100 - CR - (i - 10) * CW, w: CR, h: CW, side: "left" };
  if (i === 20) return { x: 0, y: 0, w: CR, h: CR, side: "corner" };
  if (i < 30) return { x: CR + (i - 21) * CW, y: 0, w: CW, h: CR, side: "top" };
  if (i === 30) return { x: 100 - CR, y: 0, w: CR, h: CR, side: "corner" };
  return { x: 100 - CR, y: CR + (i - 31) * CW, w: CR, h: CW, side: "right" };
}

const fmt = (n) => "$" + Math.round(n).toLocaleString();
const rnd6 = () => 1 + Math.floor(Math.random() * 6);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------- sound engine (synthesized, no assets) ---------- */
const SFX = { muted: false };
let _ac = null, _nb = null, _mg = null;
function actx() {
  if (SFX.muted) return null;
  try {
    if (!_ac) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      _ac = new C();
      _mg = _ac.createGain();
      _mg.gain.value = 0.9;
      _mg.connect(_ac.destination);
    }
    if (_ac.state === "suspended") _ac.resume();
    return _ac;
  } catch (e) { return null; }
}
function noiseBuf(c) {
  if (!_nb) {
    const len = Math.ceil(c.sampleRate * 0.5);
    _nb = c.createBuffer(1, len, c.sampleRate);
    const ch = _nb.getChannelData(0);
    for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
  }
  return _nb;
}
function blip(o) {
  const c = actx(); if (!c) return;
  const t0 = c.currentTime + (o.at || 0);
  const d = o.d || 0.12;
  const v = o.v == null ? 0.14 : o.v;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = o.type || "sine";
  osc.frequency.setValueAtTime(o.f, t0);
  if (o.f2) osc.frequency.exponentialRampToValueAtTime(Math.max(24, o.f2), t0 + d);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(v, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
  osc.connect(g); g.connect(_mg);
  osc.start(t0); osc.stop(t0 + d + 0.03);
}
function hiss(o) {
  const c = actx(); if (!c) return;
  const t0 = c.currentTime + (o.at || 0);
  const d = o.d || 0.1;
  const v = o.v == null ? 0.12 : o.v;
  const src = c.createBufferSource();
  src.buffer = noiseBuf(c);
  src.loop = true;
  const f = c.createBiquadFilter();
  f.type = o.ft || "bandpass";
  f.frequency.setValueAtTime(o.hz || 1200, t0);
  if (o.hz2) f.frequency.exponentialRampToValueAtTime(o.hz2, t0 + d);
  f.Q.value = o.q == null ? 1 : o.q;
  const g = c.createGain();
  g.gain.setValueAtTime(v, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
  src.connect(f); f.connect(g); g.connect(_mg);
  src.start(t0); src.stop(t0 + d + 0.03);
}
const S = {
  tap:   () => blip({ f: 660, f2: 520, d: 0.05, v: 0.05, type: "triangle" }),
  turn:  () => { blip({ f: 523, d: 0.09, v: 0.05, type: "sine" }); blip({ f: 784, at: 0.08, d: 0.14, v: 0.045, type: "sine" }); },
  dice:  () => { for (let i = 0; i < 6; i++) hiss({ at: i * 0.058, d: 0.045, hz: 2600 - i * 210, q: 2.6, v: 0.085 }); },
  step:  () => blip({ f: 300, f2: 240, d: 0.05, v: 0.045, type: "triangle" }),
  land:  () => { blip({ f: 190, f2: 120, d: 0.16, v: 0.11, type: "sine" }); hiss({ d: 0.05, hz: 1500, q: 1.4, v: 0.05 }); },
  cash:  () => { blip({ f: 784, d: 0.09, v: 0.08, type: "triangle" }); blip({ f: 1175, at: 0.07, d: 0.15, v: 0.07, type: "triangle" }); },
  pay:   () => { blip({ f: 440, d: 0.08, v: 0.07, type: "triangle" }); blip({ f: 294, at: 0.07, d: 0.16, v: 0.065, type: "triangle" }); },
  buy:   () => [523, 659, 784].forEach((f, i) => blip({ f, at: i * 0.055, d: 0.18, v: 0.075, type: "triangle" })),
  card:  () => { hiss({ d: 0.26, hz: 380, hz2: 2800, q: 1.1, v: 0.06 }); blip({ f: 880, at: 0.17, d: 0.11, v: 0.055, type: "sine" }); },
  jail:  () => { blip({ f: 155, f2: 92, d: 0.34, v: 0.12, type: "square" }); hiss({ d: 0.2, hz: 820, q: 0.7, v: 0.075 }); },
  build: () => { hiss({ d: 0.045, hz: 2400, q: 3, v: 0.1 }); blip({ f: 540, f2: 400, d: 0.09, v: 0.06, type: "triangle" }); },
  sell:  () => blip({ f: 392, f2: 247, d: 0.15, v: 0.075, type: "triangle" }),
  bid:   () => blip({ f: 700, f2: 880, d: 0.07, v: 0.07, type: "triangle" }),
  gavel: () => { hiss({ d: 0.06, hz: 1100, q: 1.6, v: 0.13 }); hiss({ at: 0.11, d: 0.09, hz: 760, q: 1.2, v: 0.115 }); },
  bust:  () => [392, 311, 247, 185].forEach((f, i) => blip({ f, at: i * 0.13, d: 0.28, v: 0.09, type: "triangle" })),
  win:   () => [523, 659, 784, 1046].forEach((f, i) => blip({ f, at: i * 0.12, d: 0.4, v: 0.1, type: "triangle" })),
};

function shuffle(a) {
  const x = [...a];
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = x[i]; x[i] = x[j]; x[j] = t;
  }
  return x;
}

/* ================= STYLES ================= */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo+Narrow:wght@500;600;700&family=Inter:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap');
:root {
  --ui: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --dis: 'Instrument Serif', 'Times New Roman', Georgia, serif;
  --cond: 'Archivo Narrow', 'Inter', system-ui, sans-serif;
  --bg: #0C0B0A;
  --panel: #191817;
  --panel2: #221F1D;
  --cell: #1C1B19;
  --cellHi: #232120;
  --line: rgba(240,228,205,.10);
  --line2: rgba(240,228,205,.18);
  --ink: #F1EBE1;
  --dim: #A79E90;
  --dim2: #7B7365;
  --gold: #D7A94B;
  --teal: #4FA895;
  --danger: #E0574A;
  --noise: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; margin: 0; }
.app { font-family: var(--ui); color: var(--ink); position: relative;
  height: 100vh; height: 100dvh; display: flex; flex-direction: column; overflow: hidden;
  user-select: none; -webkit-user-select: none;
  background:
    radial-gradient(140% 90% at 12% -12%, rgba(215,169,75,.20), transparent 58%),
    radial-gradient(120% 80% at 108% 106%, rgba(70,110,220,.20), transparent 56%),
    radial-gradient(90% 60% at 50% 45%, rgba(79,168,149,.07), transparent 70%),
    linear-gradient(178deg, #13120F 0%, #0B0A09 55%, #070706 100%); }
.app::before { content: ''; position: fixed; inset: 0; background-image: var(--noise);
  opacity: .35; mix-blend-mode: soft-light; pointer-events: none; z-index: 0; }
.app::after { content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background: radial-gradient(120% 85% at 50% 50%, transparent 45%, rgba(0,0,0,.55) 100%); }
.app > * { position: relative; z-index: 1; }
button { touch-action: manipulation; }

.hdr { display: flex; align-items: center; gap: 8px; padding: 12px 16px 6px; }
.hLogo { font-family: var(--dis); font-weight: 400; letter-spacing: .16em; font-size: 18px;
  color: var(--ink); text-shadow: 0 2px 14px rgba(215,169,75,.30); }
.hSp { flex: 1; }
.hBtn { width: 33px; height: 33px; border-radius: 99px; border: 1px solid var(--line2);
  background: rgba(255,255,255,.05); backdrop-filter: blur(6px);
  font-family: var(--ui); font-weight: 600; font-size: 13px; cursor: pointer; color: var(--dim); }
.hBtn:active { transform: scale(.94); }
.hBtn.off { opacity: .38; }

.boardWrap { flex: 1; display: flex; align-items: center; justify-content: center; padding: 6px 10px; min-height: 0; }
.camWrap { position: relative; width: 100%; aspect-ratio: 1/1; overflow: hidden; border-radius: 18px;
  max-width: min(96vw, calc(100dvh - 218px), 560px);
  box-shadow: 0 26px 60px rgba(0,0,0,.62), 0 0 0 1px rgba(240,228,205,.09),
    inset 0 0 60px rgba(0,0,0,.5); }
.board { position: absolute; inset: 0; container-type: inline-size;
  background:
    radial-gradient(120% 120% at 50% 8%, rgba(215,169,75,.10), transparent 58%),
    radial-gradient(90% 90% at 50% 100%, rgba(70,110,220,.10), transparent 60%),
    repeating-linear-gradient(45deg, rgba(255,255,255,.014) 0 2px, transparent 2px 5px),
    linear-gradient(165deg, #191916 0%, #121210 60%, #0E0E0C 100%); }

.cell { position: absolute; cursor: pointer; background: linear-gradient(180deg, var(--cellHi), var(--cell));
  border: 1px solid rgba(240,228,205,.07); box-shadow: inset 0 1px 0 rgba(255,255,255,.035); }
.cell:active { filter: brightness(1.35); }
.cInner { position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 3%; text-align: center; padding: 0 3%; box-sizing: border-box; }
.bar { position: absolute; display: flex; align-items: center; justify-content: center; gap: 4%;
  box-shadow: inset 0 0 8px rgba(0,0,0,.35); }
.hp { width: 1.15cqw; height: 1.15cqw; background: #F6F2E6; border-radius: 20%; box-shadow: 0 0 0 .4px rgba(0,0,0,.5); }
.hot { width: 2.6cqw; height: 1.5cqw; background: #8E2E26; border-radius: 2px; box-shadow: 0 0 0 .4px rgba(0,0,0,.5); }
.nm { font-family: var(--cond); font-weight: 600; line-height: 1.02; letter-spacing: .012em;
  color: #EFE8DC; text-align: center; max-width: 100%; overflow-wrap: break-word; hyphens: none; }
.cell.mortgaged .nm { color: var(--dim2); }
.nm.sub { font-weight: 600; color: var(--dim2); letter-spacing: .1em; }
.price { font-family: var(--cond); font-size: 1.55cqw; font-weight: 500; color: var(--dim2); letter-spacing: .03em; }
.ic { font-size: 2.1cqw; line-height: 1; filter: saturate(1.1); }
.qMark { font-family: var(--dis); font-size: 3.5cqw; font-style: italic; color: var(--gold); line-height: 1;
  text-shadow: 0 0 10px rgba(215,169,75,.35); }
.chMark { font-size: 2.45cqw; font-weight: 700; color: var(--teal); line-height: 1;
  text-shadow: 0 0 10px rgba(79,168,149,.3); }
.cornBig { font-family: var(--dis); font-size: 2.9cqw; letter-spacing: .06em; color: var(--ink); }
.cornSm { font-family: var(--cond); font-size: 1.35cqw; font-weight: 600; letter-spacing: .16em;
  color: var(--dim2); text-transform: uppercase; }
.jailBox { width: 30%; aspect-ratio: 1; border: .35cqw solid var(--dim2); border-radius: 2px;
  background: repeating-linear-gradient(90deg, var(--dim2) 0 12%, transparent 12% 30%); }
.ownRing { position: absolute; inset: 0; pointer-events: none; }
.mortB { position: absolute; top: 3%; left: 5%; font-family: var(--cond); font-size: 1.55cqw; font-weight: 700;
  color: #F0C4BE; background: rgba(180,60,50,.5); padding: 0 .7cqw; border-radius: 2px; }
.pulse { position: absolute; pointer-events: none; animation: pulse 1.5s ease-out infinite; border-radius: 2px; }
@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(240,228,205,.45); } 100% { box-shadow: 0 0 0 2.6cqw rgba(240,228,205,0); } }

.tok { position: absolute; width: 6.6cqw; height: 8.7cqw; transform: translate(-50%,-88%);
  transition: left .15s cubic-bezier(.35,.02,.3,1), top .15s cubic-bezier(.35,.02,.3,1); z-index: 6; }
.pawn { width: 100%; height: 100%; display: block; overflow: visible;
  filter: drop-shadow(0 .5cqw .8cqw rgba(0,0,0,.6)); }
.tokCur { z-index: 8; animation: bob 1.9s ease-in-out infinite; }
@keyframes bob { 0%,100% { margin-top: 0; } 50% { margin-top: -.9cqw; } }

.center { position: absolute; inset: 14.5%; display: flex; flex-direction: column; align-items: center;
  justify-content: space-between; padding: 3cqw 3cqw 3.4cqw; }
.wordmark { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  font-family: var(--dis); font-size: 12cqw; letter-spacing: .2em; padding-left: .2em;
  color: rgba(240,228,205,.045); pointer-events: none; }
.logbox { width: 100%; background: rgba(255,255,255,.035); border: 1px solid var(--line); border-radius: 1.8cqw;
  padding: 1.5cqw 2.2cqw; font-family: var(--cond); font-size: 2.05cqw; line-height: 1.5; color: var(--dim);
  cursor: pointer; backdrop-filter: blur(4px); }
.logln { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.curRow { display: flex; align-items: center; gap: 1.6cqw; font-size: 2.6cqw; font-weight: 600; letter-spacing: .01em; }
.curDot { width: 2.4cqw; height: 2.4cqw; border-radius: 50%; box-shadow: 0 0 8px currentColor; }
.cpuTag { font-family: var(--cond); font-size: 1.8cqw; font-weight: 600; letter-spacing: .12em; color: var(--dim2);
  border: 1px solid var(--line2); border-radius: 3px; padding: .2cqw 1cqw; }
.diceRow { display: flex; gap: 3cqw; }
.die { width: 10.5cqw; height: 10.5cqw; border-radius: 2.2cqw; padding: 1.7cqw;
  display: grid; grid-template-columns: repeat(3,1fr); grid-template-rows: repeat(3,1fr);
  background: linear-gradient(155deg, #FBF7EE 0%, #DED6C6 100%);
  box-shadow: 0 .9cqw 2cqw rgba(0,0,0,.55), inset 0 -.6cqw .4cqw rgba(0,0,0,.14), inset 0 .5cqw 0 rgba(255,255,255,.7); }
.pip { border-radius: 50%; }
.pip.on { background: #17150F; box-shadow: inset 0 .2cqw .3cqw rgba(0,0,0,.5); }
.rollin { animation: shk .13s linear infinite; }
@keyframes shk { 0% { transform: rotate(-9deg) translateY(-3%); } 50% { transform: rotate(9deg) translateY(3%); } 100% { transform: rotate(-9deg) translateY(-3%); } }
.btnRow { display: flex; gap: 1.8cqw; flex-wrap: wrap; justify-content: center; align-items: center; min-height: 8cqw; }
.cbtn { background: linear-gradient(180deg, #F3ECDF, #D8CDB8); color: #16140F; border: none; border-radius: 99px;
  padding: 2.1cqw 4.2cqw; font-family: var(--ui); font-weight: 600; font-size: 2.45cqw; cursor: pointer;
  box-shadow: 0 .8cqw 1.8cqw rgba(0,0,0,.45); }
.cbtn:active { transform: scale(.96); }
.cbtn2 { background: rgba(255,255,255,.05); color: var(--ink); border: 1px solid var(--line2); border-radius: 99px;
  padding: 1.8cqw 3.3cqw; font-family: var(--ui); font-weight: 600; font-size: 2.25cqw; cursor: pointer; }
.cbtn2:active { transform: scale(.96); }
.thinking { font-size: 2.4cqw; color: var(--dim2); animation: blink 1.3s ease infinite; }
@keyframes blink { 0%,100% { opacity: .3; } 50% { opacity: 1; } }

.strip { display: grid; grid-template-columns: repeat(4,1fr); gap: 7px;
  padding: 9px 10px 10px; padding-bottom: calc(10px + env(safe-area-inset-bottom)); }
.chip { position: relative; background: linear-gradient(180deg, rgba(255,255,255,.055), rgba(255,255,255,.02));
  border: 1px solid var(--line); border-radius: 13px; padding: 7px 8px; display: flex; flex-direction: column;
  gap: 2px; cursor: pointer; min-width: 0; backdrop-filter: blur(6px); }
.chipCur { border-color: currentColor; box-shadow: 0 0 0 1px currentColor, 0 6px 18px rgba(0,0,0,.5); }
.chipDead { opacity: .35; filter: grayscale(1); }
.chipTop { display: flex; gap: 5px; align-items: center; font-size: 11px; font-weight: 600; min-width: 0; color: var(--dim); }
.chipPawn { width: 12px; height: 16px; flex: none; }
.chipName { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.chipCash { font-size: 13px; font-weight: 700; font-variant-numeric: tabular-nums; letter-spacing: -.01em; color: var(--ink); }
.chipBadges { font-size: 10px; display: flex; gap: 4px; color: var(--dim2); min-height: 13px; align-items: center; }
.mini { border: 1px solid var(--line2); border-radius: 3px; padding: 0 3px; font-size: 8px; letter-spacing: .08em; }
.flt { position: absolute; right: 8px; top: -4px; font-size: 12px; font-weight: 700;
  animation: fadeUp 1.25s ease forwards; pointer-events: none; text-shadow: 0 2px 8px rgba(0,0,0,.6); }
.fpos { color: #4FD39C; } .fneg { color: #F27263; }
@keyframes fadeUp { 0% { opacity: 0; transform: translateY(7px); } 20% { opacity: 1; } 100% { opacity: 0; transform: translateY(-16px); } }

.scrim { position: fixed; inset: 0; background: rgba(4,4,3,.62); backdrop-filter: blur(3px); display: flex;
  align-items: flex-end; justify-content: center; z-index: 50; animation: fadeIn .2s ease; }
.scrimC { align-items: center; perspective: 900px; }
@keyframes fadeIn { from { opacity: 0; } }
.sheet { background: linear-gradient(180deg, #1E1C1A, #151413); width: 100%; max-width: 560px;
  border-radius: 20px 20px 0 0; border-top: 1px solid var(--line2);
  padding: 20px 16px 16px; padding-bottom: calc(16px + env(safe-area-inset-bottom));
  animation: slideUp .3s cubic-bezier(.2,.9,.3,1); max-height: 82dvh; overflow-y: auto;
  box-shadow: 0 -20px 60px rgba(0,0,0,.6); }
@keyframes slideUp { from { transform: translateY(52px); opacity: .3; } }
.shTitle { font-size: 16px; font-weight: 700; letter-spacing: -.01em; display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.shSub { font-size: 12px; color: var(--dim); margin-bottom: 10px; line-height: 1.5; }
.shSub2 { font-size: 12px; color: var(--dim2); margin: 8px 0; }
.shBtns { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px; }
.btn { background: linear-gradient(180deg, #F3ECDF, #D6CBB6); color: #16140F; border: none; border-radius: 99px;
  padding: 12px 18px; font-family: var(--ui); font-weight: 600; font-size: 13px; cursor: pointer; flex: 1;
  box-shadow: 0 6px 16px rgba(0,0,0,.4); }
.btn:disabled { opacity: .3; cursor: default; box-shadow: none; }
.btn:active:not(:disabled) { transform: scale(.97); }
.btn2 { background: rgba(255,255,255,.05); color: var(--ink); border: 1px solid var(--line2); border-radius: 99px;
  padding: 12px 18px; font-family: var(--ui); font-weight: 600; font-size: 13px; cursor: pointer; flex: 1; }
.btn2:disabled { opacity: .3; cursor: default; }
.btn2:active:not(:disabled) { transform: scale(.97); }
.btnS { flex: 0 0 auto; min-width: 72px; padding: 13px 14px; }
.btnDanger { background: linear-gradient(180deg, #C2483D, #9E362D); color: #FFF3F0; border: none; border-radius: 99px;
  padding: 12px 18px; font-family: var(--ui); font-weight: 600; font-size: 13px; cursor: pointer; flex: 1; }
.btnFull { width: 100%; margin-top: 12px; flex: none; }
.gDot { width: 12px; height: 12px; border-radius: 4px; display: inline-block; flex: none; box-shadow: 0 0 10px currentColor; }
.rTab { border: 1px solid var(--line); border-radius: 12px; overflow: hidden; margin: 10px 0; background: rgba(255,255,255,.03); }
.rRow { display: flex; justify-content: space-between; gap: 12px; padding: 7px 12px; font-size: 12px; color: var(--dim); }
.rRow + .rRow { border-top: 1px solid var(--line); }
.rRow b { text-align: right; color: var(--ink); font-variant-numeric: tabular-nums; }
.debtBox { background: rgba(180,60,50,.14); border: 1px solid rgba(224,87,74,.35); border-radius: 12px; padding: 12px;
  font-size: 13px; font-weight: 600; color: #F1A79D; margin-bottom: 10px; }
.mList { display: flex; flex-direction: column; gap: 6px; margin: 8px 0; }
.mRow { display: flex; align-items: center; gap: 7px; background: rgba(255,255,255,.04); border: 1px solid var(--line);
  border-radius: 11px; padding: 8px 9px; font-size: 12.5px; }
.mName { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 600; }
.mH { font-size: 11px; flex: none; }
.mBtn { width: 33px; height: 33px; border-radius: 9px; border: 1px solid var(--line2); background: rgba(255,255,255,.06);
  font-size: 16px; font-weight: 700; cursor: pointer; flex: none; font-family: var(--ui); color: var(--ink); }
.mBtn:disabled { opacity: .2; }
.mBtn2 { border: 1px solid var(--line2); background: rgba(255,255,255,.05); border-radius: 9px; padding: 8px 9px;
  font-size: 10.5px; font-weight: 600; cursor: pointer; flex: none; font-family: var(--ui); color: var(--dim); }
.mBtn2:disabled { opacity: .25; }

.cardM { background: linear-gradient(180deg, #201E1B, #171614); border-radius: 18px; padding: 26px 22px 20px;
  max-width: 330px; width: 86%; text-align: center; animation: flipIn .5s cubic-bezier(.2,.8,.3,1.1);
  box-shadow: 0 24px 70px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.06); border-top: 6px solid; }
.cardF { border-top-color: var(--gold); } .cardC { border-top-color: var(--teal); }
@keyframes flipIn { from { transform: rotateY(90deg) scale(.9); opacity: 0; } }
.cardTag { font-family: var(--cond); font-size: 11px; letter-spacing: .38em; font-weight: 600; color: var(--dim2); margin-bottom: 14px; }
.cardTxt { font-family: var(--dis); font-size: 17px; line-height: 1.35; margin-bottom: 18px; color: var(--ink); }

.pRow { display: flex; gap: 8px; margin: 8px 0 10px; }
.pPick { flex: 1; border: 1px solid; background: rgba(255,255,255,.04); border-radius: 12px; padding: 9px 4px;
  font-size: 12px; font-weight: 600; cursor: pointer; font-family: var(--ui); opacity: .4; color: var(--ink); }
.pOn { opacity: 1; box-shadow: 0 4px 14px rgba(0,0,0,.4); }
.tCols { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.tCol { background: rgba(255,255,255,.03); border: 1px solid var(--line); border-radius: 12px; padding: 8px;
  display: flex; flex-direction: column; gap: 5px; max-height: 210px; overflow-y: auto; }
.tHead { font-family: var(--cond); font-size: 10px; font-weight: 600; letter-spacing: .14em; color: var(--dim2); text-transform: uppercase; }
.tItem { display: flex; align-items: center; gap: 6px; border: 1px solid var(--line); background: rgba(255,255,255,.04);
  border-radius: 9px; padding: 8px 6px; font-size: 11px; font-weight: 600; cursor: pointer;
  text-align: left; font-family: var(--ui); color: var(--ink); }
.tOn { border-color: var(--ink); background: #EDE6DA; color: #16140F; }
.tCash { border: 1px solid var(--line2); border-radius: 9px; padding: 8px; font-size: 15px;
  font-family: var(--ui); width: 100%; background: rgba(255,255,255,.05); color: var(--ink); }

.setup { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 24px; gap: 8px; animation: fadeIn .5s; overflow-y: auto; }
.suLogo { font-family: var(--dis); font-size: 42px; letter-spacing: .12em; margin-left: .12em; line-height: 1;
  text-shadow: 0 4px 30px rgba(215,169,75,.35); }
.suRule { width: 64px; height: 1px; background: linear-gradient(90deg, transparent, var(--gold), transparent); margin: 12px 0 10px; }
.suSub { font-family: var(--cond); font-size: 12px; color: var(--dim2); margin-bottom: 22px;
  letter-spacing: .22em; text-transform: uppercase; }
.suCount { width: 100%; max-width: 420px; display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 12px; padding: 0 2px; }
.suCountL { font-family: var(--cond); font-size: 11px; font-weight: 600; letter-spacing: .18em;
  text-transform: uppercase; color: var(--dim2); }
.suSeg { display: flex; background: rgba(255,255,255,.05); border: 1px solid var(--line); border-radius: 99px; padding: 3px; }
.suSegB { border: none; background: transparent; border-radius: 99px; width: 42px; padding: 7px 0;
  font-family: var(--ui); font-size: 13px; font-weight: 600; color: var(--dim); cursor: pointer; }
.suSegB.suOn { background: #EDE6DA; color: #16140F; }
.suList { width: 100%; max-width: 420px; display: flex; flex-direction: column; gap: 8px; }
.suRow { display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,.045); border-radius: 13px;
  border: 1px solid var(--line); border-left: 4px solid; padding: 9px 12px; backdrop-filter: blur(6px); }
.suPawn { width: 20px; height: 26px; flex: none; }
.suName { flex: 1; border: none; background: transparent; font-family: var(--ui); font-size: 15px;
  font-weight: 600; outline: none; min-width: 0; color: var(--ink); }
.suTog { display: flex; background: rgba(0,0,0,.3); border-radius: 99px; padding: 2px; flex: none; }
.suT { border: none; background: transparent; border-radius: 99px; padding: 6px 11px; font-size: 11px;
  font-weight: 600; cursor: pointer; font-family: var(--ui); color: var(--dim2); }
.suOn { background: #EDE6DA; color: #16140F; }
.btnBig { margin-top: 18px; padding: 13px 44px; font-size: 14px; flex: none; }
.suHint { font-family: var(--cond); font-size: 11px; color: var(--dim2); margin-top: 10px; letter-spacing: .08em; }

.winOv { background: rgba(4,4,3,.72); }
.winCard { background: linear-gradient(180deg, #221F1C, #16150F); border: 1px solid var(--line2); border-radius: 22px;
  padding: 32px 40px; text-align: center; animation: popIn .45s cubic-bezier(.2,.9,.3,1.4); z-index: 2;
  box-shadow: 0 30px 80px rgba(0,0,0,.7); }
@keyframes popIn { from { transform: scale(.7); opacity: 0; } }
.winTro { font-size: 42px; }
.winName { font-family: var(--dis); font-size: 26px; margin: 8px 0 2px; letter-spacing: .02em; }
.confetti { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
.confetti span { position: absolute; top: -5%; width: 8px; height: 13px; border-radius: 2px;
  animation-name: fall; animation-timing-function: linear; animation-iteration-count: infinite; }
@keyframes fall { to { transform: translateY(110vh) rotate(540deg); } }

.logFull { max-height: 52dvh; overflow-y: auto; display: flex; flex-direction: column; gap: 7px; margin: 8px 0; }
.logFl { font-size: 12.5px; color: var(--dim); border-bottom: 1px solid var(--line); padding-bottom: 7px; }
.hlp p { font-size: 12.5px; line-height: 1.6; color: var(--dim); margin: 0 0 10px; }
.hlp b { color: var(--ink); }

@media (prefers-reduced-motion: reduce) {
  * { animation-duration: .001s !important; transition-duration: .001s !important; }
}
`;

/* ================= SMALL COMPONENTS ================= */
function Die({ v, rolling }) {
  const PIPS = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };
  const on = PIPS[v] || [4];
  return (
    <div className={"die" + (rolling ? " rollin" : "")}>
      {Array.from({ length: 9 }).map((_, i) => (
        <span key={i} className={"pip" + (on.includes(i) ? " on" : "")} />
      ))}
    </div>
  );
}

function Sheet({ children, onClose, locked }) {
  return (
    <div className="scrim" onClick={() => { if (!locked && onClose) onClose(); }}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

function Confetti() {
  const bits = React.useMemo(() => Array.from({ length: 70 }).map((_, i) => ({
    l: Math.random() * 100,
    d: Math.random() * 2.4,
    s: 2.6 + Math.random() * 2.2,
    c: ["#E05B52", "#EFCB5C", "#6FAE84", "#5674C4", "#E39BB7"][i % 5],
    r: Math.floor(Math.random() * 360),
  })), []);
  return (
    <div className="confetti">
      {bits.map((b, i) => (
        <span key={i} style={{ left: b.l + "%", background: b.c, animationDuration: b.s + "s",
          animationDelay: b.d + "s", transform: "rotate(" + b.r + "deg)" }} />
      ))}
    </div>
  );
}

/* ================= APP ================= */
function TycoonGame() {
  const [, setV] = useState(0);
  const R = () => setV((v) => v + 1);
  const Sr = useRef(null);
  const uiRes = useRef(null);
  const debtRes = useRef(null);
  const botBusy = useRef(false);
  const fid = useRef(0);
  const [setup, setSetup] = useState([
    { name: "Player 1", human: true },
    { name: "Player 2", human: false },
    { name: "Player 3", human: false },
    { name: "Player 4", human: false },
  ]);

  const [muted, setMuted] = useState(false);
  const [count, setCount] = useState(4);

  /* ---------- tiny helpers ---------- */
  const cur = () => Sr.current.players[Sr.current.cur];
  const alive = () => Sr.current.players.filter((p) => !p.bankrupt);

  function log(m) {
    const gg = Sr.current; if (!gg) return;
    gg.log.push(m);
    if (gg.log.length > 100) gg.log.shift();
    R();
  }

  function float(pid, txt, neg) {
    const gg = Sr.current; if (!gg) return;
    fid.current += 1;
    const id = fid.current;
    gg.float.push({ id, pid, txt, neg });
    R();
    setTimeout(() => {
      const g2 = Sr.current; if (!g2) return;
      g2.float = g2.float.filter((f) => f.id !== id);
      R();
    }, 1300);
  }

  /* ---------- camera ---------- */

  function buzz(ms) { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {} }

  function awaitUI() { return new Promise((res) => { uiRes.current = res; }); }
  function uiDone(v) {
    S.tap();
    const gg = Sr.current;
    if (gg) gg.sheet = null;
    const r = uiRes.current;
    uiRes.current = null;
    R();
    if (r) r(v);
  }
  function awaitDebt() { return new Promise((res) => { debtRes.current = res; }); }

  /* ---------- money ---------- */
  function transfer(pid, amt, to) {
    const gg = Sr.current;
    const p = gg.players[pid];
    p.cash -= amt;
    float(pid, "-$" + amt, true);
    S.pay();
    if (to !== null && to !== undefined && to >= 0) {
      gg.players[to].cash += amt;
      float(to, "+$" + amt, false);
    }
    R();
  }

  async function charge(pid, amt, to) {
    const gg = Sr.current;
    const p = gg.players[pid];
    if (p.cash >= amt) { transfer(pid, amt, to); return true; }
    if (!p.human) {
      autoLiquidate(pid, amt);
      if (p.cash >= amt) { transfer(pid, amt, to); return true; }
      bankrupt(pid, to);
      return false;
    }
    gg.debt = { amt, to };
    gg.sheet = { t: "manage" };
    log(p.name + " needs " + fmt(amt) + " — raise funds or fold.");
    R();
    const ok = await awaitDebt();
    return ok;
  }

  function chargeAuto(pid, amt, to) {
    const gg = Sr.current;
    const p = gg.players[pid];
    if (p.cash < amt) autoLiquidate(pid, amt);
    if (p.cash >= amt) transfer(pid, amt, to);
    else bankrupt(pid, to);
  }

  function autoLiquidate(pid, need) {
    const gg = Sr.current;
    const p = gg.players[pid];
    let acted = true;
    while (p.cash < need && acted) {
      acted = false;
      let best = -1, bh = 0;
      Object.keys(gg.houses).forEach((k) => {
        const i = +k;
        if (gg.owner[i] === pid && (gg.houses[i] || 0) > bh) { bh = gg.houses[i]; best = i; }
      });
      if (best >= 0) {
        gg.houses[best] -= 1;
        p.cash += GROUPS[BOARD[best].g].hc / 2;
        log(p.name + " sells a house on " + BOARD[best].name + ".");
        acted = true;
        continue;
      }
      let mi = -1, mp = Infinity;
      Object.keys(gg.owner).forEach((k) => {
        const i = +k;
        if (gg.owner[i] === pid && !gg.mort[i] && BOARD[i].price < mp) { mp = BOARD[i].price; mi = i; }
      });
      if (mi >= 0) {
        gg.mort[mi] = true;
        p.cash += BOARD[mi].price / 2;
        log(p.name + " mortgages " + BOARD[mi].name + ".");
        acted = true;
      }
    }
    R();
  }

  function bankrupt(pid, to) {
    const gg = Sr.current;
    const p = gg.players[pid];
    Object.keys(gg.houses).forEach((k) => {
      const i = +k;
      if (gg.owner[i] === pid && (gg.houses[i] || 0) > 0) {
        p.cash += (gg.houses[i] * GROUPS[BOARD[i].g].hc) / 2;
        gg.houses[i] = 0;
      }
    });
    const hasCredit = to !== null && to !== undefined && to >= 0;
    Object.keys(gg.owner).forEach((k) => {
      const i = +k;
      if (gg.owner[i] === pid) {
        if (hasCredit) gg.owner[i] = to;
        else { delete gg.owner[i]; delete gg.mort[i]; gg.houses[i] = 0; }
      }
    });
    if (hasCredit) {
      gg.players[to].cash += p.cash;
      if (p.cash > 0) float(to, "+$" + p.cash, false);
    }
    p.cash = 0;
    p.bankrupt = true;
    p.cards = [];
    log("💥 " + p.name + " is bankrupt" + (hasCredit ? " — assets go to " + gg.players[to].name : "") + ".");
    buzz(40);
    S.bust();
    checkWin();
    R();
  }

  function checkWin() {
    const gg = Sr.current;
    const a = gg.players.filter((p) => !p.bankrupt);
    if (a.length === 1 && gg.winner === null) {
      gg.winner = a[0].id;
      setTimeout(() => S.win(), 700);
      gg.sheet = null;
      gg.debt = null;
      log("🏆 " + a[0].name + " wins the city!");
      if (uiRes.current) { const r = uiRes.current; uiRes.current = null; r("end"); }
      if (debtRes.current) { const r = debtRes.current; debtRes.current = null; r(false); }
      R();
    }
  }

  /* ---------- rent ---------- */
  function ownsFull(pid, grp) {
    const gg = Sr.current;
    return GIDX[grp].every((i) => gg.owner[i] === pid);
  }

  function calcRent(i) {
    const gg = Sr.current;
    const sp = BOARD[i];
    const o = gg.owner[i];
    if (sp.t === "station") {
      const n = STATIONS.filter((s) => gg.owner[s] === o).length;
      return 25 * Math.pow(2, n - 1);
    }
    if (sp.t === "util") {
      const n = UTILS.filter((s) => gg.owner[s] === o).length;
      return (n === 2 ? 10 : 4) * (gg.lastRoll || 7);
    }
    const h = gg.houses[i] || 0;
    if (h > 0) return sp.r[h];
    return ownsFull(o, sp.g) ? sp.r[0] * 2 : sp.r[0];
  }

  /* ---------- movement ---------- */
  async function animateDice() {
    const gg = Sr.current;
    gg.rolling = true;
    buzz(12);
    S.dice();
    R();
    for (let t = 0; t < 8; t++) {
      gg.dice = [rnd6(), rnd6()];
      R();
      await sleep(70);
    }
    gg.dice = [rnd6(), rnd6()];
    gg.rolling = false;
    R();
    await sleep(340);
  }

  async function moveBy(n) {
    const gg = Sr.current;
    const p = cur();
    for (let s = 0; s < n; s++) {
      p.pos = (p.pos + 1) % 40;
      S.step();
      if (p.pos === 0) {
        p.cash += 200;
        float(gg.cur, "+$200", false);
        log(p.name + " passes GO — collect $200."); S.cash();
      }
      R();
      await sleep(150);
    }
    S.land();
    await sleep(240);
  }

  async function teleport(target, collectGo) {
    const gg = Sr.current;
    const p = cur();
    let guard = 0;
    while (p.pos !== target && guard++ < 41) {
      p.pos = (p.pos + 1) % 40;
      S.step();
      if (p.pos === 0 && collectGo) {
        p.cash += 200;
        float(gg.cur, "+$200", false);
        log(p.name + " passes GO — collect $200."); S.cash();
      }
      R();
      await sleep(80);
    }
    S.land();
    await sleep(240);
  }

  async function sendJail(pid) {
    const gg = Sr.current;
    const p = gg.players[pid];
    log("🚔 " + p.name + " goes to Jail.");
    buzz(30);
    S.jail();
    p.pos = 10;
    p.inJail = true;
    p.jailTries = 0;
    gg.doubles = 0;
    gg.landing = 10;
    R();
    await sleep(500);
  }

  /* ---------- landing / cards ---------- */
  function buyProp(pid, i, price) {
    const gg = Sr.current;
    const p = gg.players[pid];
    p.cash -= price;
    float(pid, "-$" + price, true);
    gg.owner[i] = pid;
    log(p.name + " buys " + BOARD[i].name + " for " + fmt(price) + ".");
    S.buy();
    R();
  }

  async function resolveLand() {
    const gg = Sr.current;
    if (gg.winner !== null) return;
    const p = cur();
    if (p.bankrupt) return;
    const i = p.pos;
    const sp = BOARD[i];
    gg.landing = i;
    R();
    if (sp.t === "prop" || sp.t === "station" || sp.t === "util") {
      const o = gg.owner[i];
      if (o === undefined) {
        if (p.human) {
          gg.sheet = { t: "buy", idx: i };
          R();
          const act = await awaitUI();
          if (gg.winner !== null) return;
          if (act === "auction") await runAuction(i);
        } else {
          await sleep(600);
          if (botWants(p, i) && p.cash >= sp.price) {
            buyProp(gg.cur, i, sp.price);
          } else {
            log(p.name + " passes on " + sp.name + " — auction!");
            await runAuction(i);
          }
        }
      } else if (o === gg.cur) {
        log(p.name + " visits their own " + sp.name + ".");
      } else if (gg.mort[i]) {
        log(sp.name + " is mortgaged — no rent due.");
      } else {
        const rent = calcRent(i);
        log(p.name + " owes " + gg.players[o].name + " " + fmt(rent) + " rent for " + sp.name + ".");
        buzz(20);
        await charge(gg.cur, rent, o);
      }
    } else if (sp.t === "tax") {
      log(p.name + " pays " + sp.name + ": " + fmt(sp.amt) + ".");
      await charge(gg.cur, sp.amt, -1);
    } else if (sp.t === "fortune" || sp.t === "chest") {
      await drawCard(sp.t);
    } else if (sp.t === "gotojail") {
      await sendJail(gg.cur);
    } else if (sp.t === "park") {
      log(p.name + " rests at Free Parking.");
    } else if (sp.t === "go") {
      log(p.name + " lands on GO.");
    } else if (sp.t === "jail") {
      log(p.name + " is just visiting Jail.");
    }
  }

  async function drawCard(deck) {
    const gg = Sr.current;
    const p = cur();
    const arr = deck === "fortune" ? gg.fdeck : gg.cdeck;
    const cid = arr.shift();
    const card = (deck === "fortune" ? FORTUNE : CHEST)[cid];
    if (card.k === "goojf") p.cards.push({ deck, cid });
    else arr.push(cid);
    log((deck === "fortune" ? "✦ " : "✚ ") + p.name + " draws a card.");
    S.card();
    gg.sheet = { t: "card", deck, cid };
    R();
    const pr = awaitUI();
    if (!p.human) setTimeout(() => { if (uiRes.current) uiDone(); }, 1900);
    await pr;
    if (gg.winner !== null) return;
    await applyCard(card);
  }

  async function applyCard(c) {
    const gg = Sr.current;
    const p = cur();
    if (c.k === "get") {
      p.cash += c.amt;
      float(gg.cur, "+$" + c.amt, false);
      log(p.name + " collects " + fmt(c.amt) + ".");
      R();
    } else if (c.k === "pay") {
      await charge(gg.cur, c.amt, -1);
    } else if (c.k === "goto") {
      await teleport(c.pos, true);
      await resolveLand();
    } else if (c.k === "nearStation") {
      let t = STATIONS.find((s) => s > p.pos);
      if (t === undefined) t = STATIONS[0];
      await teleport(t, true);
      await resolveLand();
    } else if (c.k === "back3") {
      for (let s = 0; s < 3; s++) {
        p.pos = (p.pos + 39) % 40;
        S.step();
        R();
        await sleep(170);
      }
      await sleep(200);
      await resolveLand();
    } else if (c.k === "jail") {
      await sendJail(gg.cur);
    } else if (c.k === "goojf") {
      log(p.name + " keeps a Get Out of Jail Free card.");
      R();
    } else if (c.k === "repairs") {
      let cost = 0;
      Object.keys(gg.houses).forEach((k) => {
        const i = +k;
        if (gg.owner[i] === gg.cur) {
          const h = gg.houses[i] || 0;
          cost += h === 5 ? c.ho : h * c.h;
        }
      });
      if (cost > 0) {
        log(p.name + " pays " + fmt(cost) + " in repairs.");
        await charge(gg.cur, cost, -1);
      } else {
        log(p.name + " has nothing to repair.");
      }
    } else if (c.k === "payEach") {
      for (const o of alive()) {
        if (o.id === gg.cur) continue;
        const ok = await charge(gg.cur, c.amt, o.id);
        if (!ok) break;
      }
    } else if (c.k === "collectEach") {
      for (const o of alive()) {
        if (o.id === gg.cur) continue;
        chargeAuto(o.id, c.amt, gg.cur);
        if (gg.winner !== null) break;
      }
    }
    R();
  }

  /* ---------- auction ---------- */
  function botMax(p, i) {
    const gg = Sr.current;
    const sp = BOARD[i];
    let m = sp.price * 0.75;
    if (sp.t === "prop") {
      const mine = GIDX[sp.g].filter((x) => gg.owner[x] === p.id).length;
      const total = GIDX[sp.g].length;
      if (mine === total - 1) m = sp.price * 1.5;
      else if (mine > 0) m = sp.price * 1.05;
      else {
        const oppClose = gg.players.some((o) => !o.bankrupt && o.id !== p.id &&
          GIDX[sp.g].filter((x) => gg.owner[x] === o.id).length === total - 1);
        if (oppClose) m = sp.price * 1.15;
      }
    }
    return Math.min(m, p.cash - 40);
  }

  function botWants(p, i) {
    const gg = Sr.current;
    const sp = BOARD[i];
    if (sp.t !== "prop") return p.cash >= sp.price + 60;
    const mine = GIDX[sp.g].filter((x) => gg.owner[x] === p.id).length;
    if (mine === GIDX[sp.g].length - 1) return p.cash >= sp.price;
    return p.cash >= sp.price + 80;
  }

  async function runAuction(idx) {
    const gg = Sr.current;
    const order = alive().map((p) => p.id);
    const inA = new Set(order);
    let bid = 0;
    let holder = null;
    log("🔨 Auction: " + BOARD[idx].name + ".");
    let k = Math.max(0, order.indexOf(gg.cur));
    let guard = 0;
    while (guard++ < 300) {
      if (gg.winner !== null) { gg.sheet = null; R(); return; }
      if (inA.size === 0) break;
      if (inA.size === 1 && holder !== null && inA.has(holder)) break;
      k = (k + 1) % order.length;
      const pid = order[k];
      if (!inA.has(pid)) continue;
      if (pid === holder) continue;
      const p = gg.players[pid];
      if (p.bankrupt) { inA.delete(pid); continue; }
      if (p.human) {
        gg.sheet = { t: "auction", idx, bid, holder, pid };
        R();
        const act = await awaitUI();
        if (gg.winner !== null) return;
        if (act === "pass" || act === "end" || typeof act !== "number") {
          inA.delete(pid);
          log(p.name + " passes.");
        } else {
          const nb = bid + act;
          if (nb <= p.cash) { bid = nb; holder = pid; log(p.name + " bids " + fmt(bid) + "."); S.bid(); }
          else { inA.delete(pid); log(p.name + " passes."); }
        }
      } else {
        await sleep(520);
        const mx = botMax(p, idx);
        const inc = bid + 50 <= mx ? 50 : 10;
        if (bid + inc <= mx && bid + inc <= p.cash - 20) {
          bid += inc;
          holder = pid;
          log(p.name + " bids " + fmt(bid) + "."); S.bid();
        } else {
          inA.delete(pid);
          log(p.name + " passes.");
        }
        R();
      }
    }
    if (holder !== null) {
      const w = gg.players[holder];
      w.cash -= bid;
      float(holder, "-$" + bid, true);
      gg.owner[idx] = holder;
      S.gavel();
      log(w.name + " wins " + BOARD[idx].name + " for " + fmt(bid) + ".");
    } else {
      log("No bids — it stays with the bank.");
    }
    gg.sheet = null;
    R();
  }

  /* ---------- turn flow ---------- */
  function endOfMove(dbl) {
    const gg = Sr.current;
    if (gg.winner !== null) return;
    const p = cur();
    if (p.bankrupt) { nextTurn(); return; }
    if (p.inJail) gg.phase = "post";
    else if (dbl) { gg.phase = "pre"; log("Doubles — " + p.name + " rolls again!"); }
    else gg.phase = "post";
    R();
  }

  async function playRoll() {
    const gg = Sr.current;
    if (gg.phase !== "pre" || gg.winner !== null) return;
    const p = cur();
    gg.phase = "anim";
    gg.sheet = null;
    R();
    await animateDice();
    const a = gg.dice[0], b = gg.dice[1];
    gg.lastRoll = a + b;
    const dbl = a === b;
    if (dbl) gg.doubles += 1; else gg.doubles = 0;
    log(p.name + " rolls " + a + " + " + b + (dbl ? " — doubles!" : "") + ".");
    if (dbl && gg.doubles >= 3) {
      log("Three doubles in a row!");
      await sendJail(gg.cur);
      gg.phase = "post";
      R();
      return;
    }
    await moveBy(a + b);
    await resolveLand();
    endOfMove(dbl);
  }

  async function jailAttempt() {
    const gg = Sr.current;
    const p = cur();
    gg.sheet = null;
    gg.phase = "anim";
    R();
    await animateDice();
    const a = gg.dice[0], b = gg.dice[1];
    gg.lastRoll = a + b;
    if (a === b) {
      p.inJail = false;
      p.jailTries = 0;
      log(p.name + " rolls doubles — free!");
      await moveBy(a + b);
      await resolveLand();
      endOfMove(false);
    } else {
      p.jailTries += 1;
      if (p.jailTries >= 3) {
        log("Third try — " + p.name + " must pay $50 bail.");
        const ok = await charge(gg.cur, 50, -1);
        if (!ok) { if (cur().bankrupt) nextTurn(); return; }
        p.inJail = false;
        p.jailTries = 0;
        await moveBy(a + b);
        await resolveLand();
        endOfMove(false);
      } else {
        log("No doubles — " + p.name + " stays in Jail (" + p.jailTries + "/3).");
        gg.phase = "post";
        R();
      }
    }
  }

  async function jailPay() {
    const gg = Sr.current;
    const p = cur();
    gg.sheet = null;
    R();
    const ok = await charge(gg.cur, 50, -1);
    if (!ok) { if (cur().bankrupt) nextTurn(); return; }
    p.inJail = false;
    p.jailTries = 0;
    log(p.name + " pays $50 bail.");
    gg.phase = "pre";
    R();
  }

  function jailCard() {
    const gg = Sr.current;
    const p = cur();
    const card = p.cards.shift();
    if (card) (card.deck === "fortune" ? gg.fdeck : gg.cdeck).push(card.cid);
    p.inJail = false;
    p.jailTries = 0;
    log(p.name + " uses Get Out of Jail Free.");
    gg.sheet = null;
    gg.phase = "pre";
    R();
  }

  function nextTurn() {
    const gg = Sr.current;
    if (gg.winner !== null) return;
    gg.doubles = 0;
    gg.landing = null;
    gg.sheet = null;
    gg.debt = null;
    let n = gg.cur;
    for (let s = 0; s < gg.players.length; s++) {
      n = (n + 1) % gg.players.length;
      if (!gg.players[n].bankrupt) break;
    }
    gg.cur = n;
    gg.phase = "pre";
    const p = gg.players[n];
    log("— " + p.name + "'s turn —");
    S.turn();
    if (p.inJail && p.human) gg.sheet = { t: "jail" };
    R();
  }

  /* ---------- build / mortgage ---------- */
  function canBuild(i) {
    const gg = Sr.current;
    if (gg.debt) return false;
    const sp = BOARD[i];
    if (sp.t !== "prop") return false;
    if (gg.owner[i] !== gg.cur) return false;
    if (!ownsFull(gg.cur, sp.g)) return false;
    if (GIDX[sp.g].some((x) => gg.mort[x])) return false;
    const h = gg.houses[i] || 0;
    if (h >= 5) return false;
    const minH = Math.min(...GIDX[sp.g].map((x) => gg.houses[x] || 0));
    if (h > minH) return false;
    return cur().cash >= GROUPS[sp.g].hc;
  }

  function build(i) {
    const gg = Sr.current;
    const sp = BOARD[i];
    const p = cur();
    gg.houses[i] = (gg.houses[i] || 0) + 1;
    p.cash -= GROUPS[sp.g].hc;
    float(gg.cur, "-$" + GROUPS[sp.g].hc, true);
    log(p.name + " builds on " + sp.name + " (" + (gg.houses[i] === 5 ? "hotel 🏨" : gg.houses[i] + " 🏠") + ").");
    S.build();
    R();
  }

  function canSell(i) {
    const gg = Sr.current;
    const sp = BOARD[i];
    if (sp.t !== "prop") return false;
    if (gg.owner[i] !== gg.cur) return false;
    const h = gg.houses[i] || 0;
    if (h === 0) return false;
    const maxH = Math.max(...GIDX[sp.g].map((x) => gg.houses[x] || 0));
    return h === maxH;
  }

  function sellHouse(i) {
    const gg = Sr.current;
    const sp = BOARD[i];
    const p = cur();
    gg.houses[i] -= 1;
    p.cash += GROUPS[sp.g].hc / 2;
    float(gg.cur, "+$" + GROUPS[sp.g].hc / 2, false);
    log(p.name + " sells a house on " + sp.name + ".");
    S.sell();
    R();
  }

  function canMort(i) {
    const gg = Sr.current;
    const sp = BOARD[i];
    if (gg.owner[i] !== gg.cur || gg.mort[i]) return false;
    if (sp.t === "prop" && GIDX[sp.g].some((x) => (gg.houses[x] || 0) > 0)) return false;
    return true;
  }

  function mortgage(i) {
    const gg = Sr.current;
    const p = cur();
    gg.mort[i] = true;
    p.cash += BOARD[i].price / 2;
    float(gg.cur, "+$" + BOARD[i].price / 2, false);
    log(p.name + " mortgages " + BOARD[i].name + ".");
    S.sell();
    R();
  }

  function canUnmort(i) {
    const gg = Sr.current;
    if (gg.debt) return false;
    return gg.owner[i] === gg.cur && !!gg.mort[i] && cur().cash >= Math.ceil(BOARD[i].price * 0.55);
  }

  function unmortgage(i) {
    const gg = Sr.current;
    const p = cur();
    const c = Math.ceil(BOARD[i].price * 0.55);
    gg.mort[i] = false;
    p.cash -= c;
    float(gg.cur, "-$" + c, true);
    log(p.name + " lifts the mortgage on " + BOARD[i].name + ".");
    S.buy();
    R();
  }

  /* ---------- bots ---------- */
  async function botBuild() {
    const gg = Sr.current;
    const p = cur();
    let guard = 0;
    while (guard++ < 10) {
      let pick = -1;
      for (const grp of Object.keys(GIDX)) {
        if (!ownsFull(p.id, grp)) continue;
        for (const i of GIDX[grp]) {
          if (canBuild(i) && p.cash >= GROUPS[grp].hc + 250) {
            if (pick < 0 || (gg.houses[i] || 0) < (gg.houses[pick] || 0)) pick = i;
          }
        }
      }
      if (pick < 0) break;
      build(pick);
      await sleep(320);
    }
    if (p.cash > 700) {
      const owned = Object.keys(gg.owner).map(Number).filter((i) => gg.owner[i] === p.id && gg.mort[i]);
      for (const i of owned) {
        if (p.cash >= Math.ceil(BOARD[i].price * 0.55) + 300) {
          unmortgage(i);
          await sleep(220);
        }
      }
    }
  }

  async function botTurn() {
    const gg = Sr.current;
    if (!gg || gg.winner !== null) return;
    const me = gg.cur;
    const p = gg.players[me];
    await sleep(850);
    if (Sr.current !== gg || gg.winner !== null) return;
    if (p.inJail) {
      if (p.cards.length > 0) {
        jailCard();
        await sleep(450);
      } else if (p.cash >= 150) {
        const ok = await charge(me, 50, -1);
        if (!ok) { if (p.bankrupt) nextTurn(); return; }
        p.inJail = false;
        p.jailTries = 0;
        log(p.name + " pays $50 bail.");
        R();
        await sleep(450);
      } else {
        await jailAttempt();
        if (gg.winner !== null || gg.cur !== me || p.bankrupt) return;
        if (p.inJail || gg.phase === "post") {
          await botBuild();
          await sleep(450);
          if (gg.winner === null && gg.cur === me) nextTurn();
          return;
        }
      }
    }
    let guard = 0;
    while (gg.winner === null && guard++ < 6) {
      await playRoll();
      if (gg.winner !== null) return;
      if (gg.cur !== me || p.bankrupt) return;
      if (gg.phase === "pre" && !p.inJail) { await sleep(650); continue; }
      break;
    }
    if (gg.winner !== null) return;
    await botBuild();
    await sleep(500);
    if (gg.winner === null && gg.cur === me && !p.bankrupt) nextTurn();
  }

  useEffect(() => {
    const gg = Sr.current;
    if (!gg || gg.winner !== null) return;
    const p = gg.players[gg.cur];
    if (!p.human && !p.bankrupt && gg.phase === "pre" && !gg.sheet && !botBusy.current) {
      botBusy.current = true;
      botTurn().finally(() => { botBusy.current = false; R(); });
    }
  });

  /* ---------- trade ---------- */
  function tradeable(pid) {
    const gg = Sr.current;
    return Object.keys(gg.owner).map(Number).filter((i) => {
      if (gg.owner[i] !== pid) return false;
      const sp = BOARD[i];
      if (sp.t === "prop" && GIDX[sp.g].some((x) => (gg.houses[x] || 0) > 0)) return false;
      return true;
    }).sort((a, b) => a - b);
  }

  function openTrade() {
    const gg = Sr.current;
    const others = alive().filter((p) => p.id !== gg.cur);
    if (others.length === 0) return;
    gg.sheet = { t: "trade", partner: others[0].id, give: {}, get: {}, gc: 0, rc: 0, stage: "edit" };
    R();
  }

  function evalTrade(sh) {
    const gg = Sr.current;
    const val = (idxs, forPid) => idxs.reduce((s, i) => {
      let v = BOARD[i].price * (gg.mort[i] ? 0.45 : 1);
      const sp = BOARD[i];
      if (sp.t === "prop") {
        const others = GIDX[sp.g].filter((x) => x !== i);
        if (others.length > 0 && others.every((x) => gg.owner[x] === forPid)) v *= 1.9;
      }
      return s + v;
    }, 0);
    const giveIdx = Object.keys(sh.give).map(Number);
    const getIdx = Object.keys(sh.get).map(Number);
    const recv = val(giveIdx, sh.partner) + (sh.gc || 0);
    const lose = val(getIdx, gg.cur) + (sh.rc || 0);
    return recv >= lose * 1.15 && recv > 0;
  }

  function execTrade(sh) {
    const gg = Sr.current;
    const a = gg.cur, b = sh.partner;
    Object.keys(sh.give).forEach((k) => { gg.owner[+k] = b; });
    Object.keys(sh.get).forEach((k) => { gg.owner[+k] = a; });
    const gc = Math.min(sh.gc || 0, gg.players[a].cash);
    const rc = Math.min(sh.rc || 0, gg.players[b].cash);
    gg.players[a].cash += rc - gc;
    gg.players[b].cash += gc - rc;
    if (gc > rc) { float(b, "+$" + (gc - rc), false); float(a, "-$" + (gc - rc), true); }
    if (rc > gc) { float(a, "+$" + (rc - gc), false); float(b, "-$" + (rc - gc), true); }
    log("🤝 Trade complete between " + gg.players[a].name + " and " + gg.players[b].name + ".");
    R();
  }

  function proposeTrade() {
    const gg = Sr.current;
    const sh = gg.sheet;
    const partner = gg.players[sh.partner];
    if (partner.human) {
      sh.stage = "review";
      R();
    } else {
      if (evalTrade(sh)) {
        execTrade(sh);
        log("🤝 " + partner.name + " accepts the trade!");
        gg.sheet = null;
      } else {
        log(partner.name + " declines the trade.");
        sh.stage = "declined";
      }
      R();
    }
  }

  /* ---------- debt handlers ---------- */
  function payDebt() {
    const gg = Sr.current;
    if (!gg.debt) return;
    const d = gg.debt;
    const p = cur();
    if (p.cash < d.amt) return;
    transfer(gg.cur, d.amt, d.to);
    gg.debt = null;
    gg.sheet = null;
    R();
    const r = debtRes.current;
    debtRes.current = null;
    if (r) r(true);
  }

  function doBankrupt() {
    const gg = Sr.current;
    const to = gg.debt ? gg.debt.to : -1;
    bankrupt(gg.cur, to);
    gg.debt = null;
    gg.sheet = null;
    R();
    const r = debtRes.current;
    debtRes.current = null;
    if (r) r(false);
  }

  /* ---------- setup ---------- */
  function togHuman(i, v) {
    const a = [...setup];
    a[i] = { ...a[i], human: v };
    setSetup(a);
  }

  function startGame() {
    Sr.current = {
      players: setup.slice(0, count).map((s, i) => ({
        id: i,
        name: (s.name || "").trim() || "Player " + (i + 1),
        human: s.human,
        emoji: TOK[i],
        cash: 1500,
        pos: 0,
        inJail: false,
        jailTries: 0,
        cards: [],
        bankrupt: false,
      })),
      cur: 0,
      dice: [3, 4],
      rolling: false,
      doubles: 0,
      lastRoll: 7,
      owner: {},
      houses: {},
      mort: {},
      fdeck: shuffle(FORTUNE.map((_, i) => i)),
      cdeck: shuffle(CHEST.map((_, i) => i)),
      log: ["Welcome to Tycoon. " + ((setup[0].name || "").trim() || "Player 1") + " rolls first."],
      sheet: null,
      phase: "pre",
      debt: null,
      winner: null,
      landing: null,
      float: [],
    };
    R();
  }

  function close() {
    S.tap();
    const gg = Sr.current;
    if (!gg) return;
    gg.sheet = null;
    R();
  }

  const g = Sr.current;

  /* ================= RENDER ================= */
  function renderSetup() {
    return (
      <div className="setup">
        <div className="suLogo">TYCOON</div>
        <div className="suRule" />
        <div className="suSub">Buy · Build · Bankrupt</div>
        <div className="suCount">
          <span className="suCountL">Players</span>
          <div className="suSeg">
            {[2, 3, 4].map((n) => (
              <button
                key={n}
                className={"suSegB" + (count === n ? " suOn" : "")}
                onClick={() => { S.tap(); setCount(n); }}
              >{n}</button>
            ))}
          </div>
        </div>
        <div className="suList">
          {setup.slice(0, count).map((s, i) => (
            <div key={i} className="suRow" style={{ borderLeftColor: PC[i] }}>
              <Pawn i={i} cls="suPawn" />
              <input
                className="suName"
                value={s.name}
                maxLength={12}
                onChange={(e) => {
                  const a = [...setup];
                  a[i] = { ...a[i], name: e.target.value };
                  setSetup(a);
                }}
              />
              <div className="suTog">
                <button className={"suT" + (s.human ? " suOn" : "")} onClick={() => togHuman(i, true)}>Human</button>
                <button className={"suT" + (!s.human ? " suOn" : "")} onClick={() => togHuman(i, false)}>CPU</button>
              </div>
            </div>
          ))}
        </div>
        <button className="btn btnBig" onClick={startGame}>Start game</button>
        <div className="suHint">Pass-and-play · $1,500 each · last one standing wins</div>
      </div>
    );
  }

  function renderCell(sp, i) {
    const rc = rect(i);
    const pos = { left: rc.x + "%", top: rc.y + "%", width: rc.w + "%", height: rc.h + "%" };
    const own = g.owner[i];
    const h = g.houses[i] || 0;
    const isM = !!g.mort[i];
    const side = rc.side;
    let bar = null;
    if (sp.t === "prop") {
      const bs =
        side === "bottom" ? { top: 0, left: 0, right: 0, height: "24%", flexDirection: "row" } :
        side === "top" ? { bottom: 0, left: 0, right: 0, height: "24%", flexDirection: "row" } :
        side === "left" ? { right: 0, top: 0, bottom: 0, width: "24%", flexDirection: "column" } :
        { left: 0, top: 0, bottom: 0, width: "24%", flexDirection: "column" };
      bar = (
        <div className="bar" style={{ ...bs, background: GROUPS[sp.g].c, opacity: isM ? 0.35 : 1 }}>
          {h > 0 && h < 5 && Array.from({ length: h }).map((_, k) => <span key={k} className="hp" />)}
          {h === 5 && <span className="hot" />}
        </div>
      );
    }
    const innerPos =
      sp.t !== "prop" ? { inset: 0 } :
      side === "bottom" ? { top: "24%", left: 0, right: 0, bottom: 0 } :
      side === "top" ? { top: 0, left: 0, right: 0, bottom: "24%" } :
      side === "left" ? { left: 0, top: 0, bottom: 0, right: "24%" } :
      { left: "24%", top: 0, bottom: 0, right: 0 };
    const lbl = cellLabel(sp);
    const innerW =
      side === "bottom" || side === "top" ? CW :
      sp.t === "prop" ? CR * 0.76 : CR;
    const nm = lbl ? (
      <span className="nm" style={{ fontSize: nameFS(lbl, innerW).toFixed(2) + "cqw" }}>{lbl}</span>
    ) : null;
    let inner = null;
    if (sp.t === "prop") inner = (<>{nm}<span className="price">${sp.price}</span></>);
    else if (sp.t === "station") inner = (<><span className="ic">🚂</span>{nm}<span className="price">${sp.price}</span></>);
    else if (sp.t === "util") inner = (<><span className="ic">{i === 12 ? "⚡" : "💧"}</span>{nm}<span className="price">${sp.price}</span></>);
    else if (sp.t === "tax") inner = (<>{nm}<span className="price">${sp.amt}</span></>);
    else if (sp.t === "fortune") inner = (<><span className="qMark">?</span><span className="nm sub" style={{ fontSize: nameFS(lbl, innerW).toFixed(2) + "cqw" }}>{lbl}</span></>);
    else if (sp.t === "chest") inner = (<><span className="chMark">✚</span><span className="nm sub" style={{ fontSize: nameFS(lbl, innerW).toFixed(2) + "cqw" }}>{lbl}</span></>);
    else if (sp.t === "go") inner = (<><span className="cornBig">GO</span><span className="cornSm">⟵ $200</span></>);
    else if (sp.t === "jail") inner = (<><span className="jailBox" /><span className="cornSm">Jail</span></>);
    else if (sp.t === "park") inner = (<><span className="cornBig">P</span><span className="cornSm">Free Parking</span></>);
    else if (sp.t === "gotojail") inner = (<><span className="cornSm">Go to</span><span className="cornBig">JAIL</span></>);
    return (
      <div
        key={i}
        className={"cell" + (isM ? " mortgaged" : "")}
        style={pos}
        onClick={() => {
          if (!g.sheet && g.phase !== "anim" && g.winner === null) {
            g.sheet = { t: "info", idx: i };
            R();
          }
        }}
      >
        {bar}
        <div className="cInner" style={innerPos}>{inner}</div>
        {own !== undefined && <div className="ownRing" style={{ boxShadow: "inset 0 0 0 2.5px " + PC[own] }} />}
        {isM && <div className="mortB">M</div>}
      </div>
    );
  }

  function renderPulse() {
    const rc = rect(g.landing);
    return <div className="pulse" style={{ left: rc.x + "%", top: rc.y + "%", width: rc.w + "%", height: rc.h + "%" }} />;
  }

  function renderToken(pl) {
    if (pl.bankrupt) return null;
    const rc = rect(pl.pos);
    const off = [[-1, -1], [1, -1], [-1, 1], [1, 1]][pl.id];
    const cx = rc.x + rc.w / 2 + off[0] * 1.9;
    const cy = rc.y + rc.h / 2 + off[1] * 1.5;
    return (
      <div
        key={pl.id}
        className={"tok" + (pl.id === g.cur ? " tokCur" : "")}
        style={{ left: cx + "%", top: cy + "%", zIndex: 6 + Math.round(cy / 12) + (pl.id === g.cur ? 4 : 0) }}
      >
        <Pawn i={pl.id} />
      </div>
    );
  }

  function renderChip(pl) {
    return (
      <div
        key={pl.id}
        className={"chip" + (pl.id === g.cur ? " chipCur" : "") + (pl.bankrupt ? " chipDead" : "")}
        style={{ color: PC[pl.id] }}
        onClick={() => {
          if (g.winner === null && !g.sheet) {
            g.sheet = { t: "player", pid: pl.id };
            R();
          }
        }}
      >
        <div className="chipTop"><Pawn i={pl.id} cls="chipPawn" /><span className="chipName">{pl.name}</span></div>
        <div className="chipCash">{pl.bankrupt ? "OUT" : fmt(pl.cash)}</div>
        <div className="chipBadges">
          {pl.inJail && <span>🔒</span>}
          {pl.cards.length > 0 && <span>🎟️{pl.cards.length > 1 ? "×" + pl.cards.length : ""}</span>}
          {!pl.human && <span className="mini">CPU</span>}
        </div>
        {g.float.filter((f) => f.pid === pl.id).map((f) => (
          <span key={f.id} className={"flt " + (f.neg ? "fneg" : "fpos")}>{f.txt}</span>
        ))}
      </div>
    );
  }

  function rentPreview(i) {
    const sp = BOARD[i];
    if (sp.t === "prop") {
      return (
        <div className="rTab">
          <div className="rRow"><span>Base rent</span><b>${sp.r[0]}</b></div>
          <div className="rRow"><span>Full set</span><b>${sp.r[0] * 2}</b></div>
          <div className="rRow"><span>1–4 houses</span><b>${sp.r[1]} · ${sp.r[2]} · ${sp.r[3]} · ${sp.r[4]}</b></div>
          <div className="rRow"><span>Hotel</span><b>${sp.r[5]}</b></div>
          <div className="rRow"><span>House cost</span><b>${GROUPS[sp.g].hc}</b></div>
        </div>
      );
    }
    if (sp.t === "station") {
      return (
        <div className="rTab">
          <div className="rRow"><span>1–4 stations owned</span><b>$25 · $50 · $100 · $200</b></div>
        </div>
      );
    }
    if (sp.t === "util") {
      return (
        <div className="rTab">
          <div className="rRow"><span>Rent</span><b>4× dice roll</b></div>
          <div className="rRow"><span>Both utilities</span><b>10× dice roll</b></div>
        </div>
      );
    }
    return null;
  }

  function tRow(i, set) {
    const sp = BOARD[i];
    const on = !!set[i];
    return (
      <button
        key={i}
        className={"tItem" + (on ? " tOn" : "")}
        onClick={() => {
          if (on) delete set[i]; else set[i] = true;
          R();
        }}
      >
        <span className="gDot" style={{ background: sp.g ? GROUPS[sp.g].c : "#9AA0A6" }} />
        <span>{sp.name}{g.mort[i] ? " (M)" : ""}</span>
      </button>
    );
  }

  function tradeSummary(sh) {
    const names = (obj) => Object.keys(obj).map((k) => BOARD[+k].name);
    const gv = names(sh.give);
    const gt = names(sh.get);
    return (
      <div className="rTab">
        <div className="rRow"><span>{g.players[g.cur].name} gives</span><b>{[...gv, sh.gc > 0 ? fmt(sh.gc) : null].filter(Boolean).join(", ") || "nothing"}</b></div>
        <div className="rRow"><span>{g.players[sh.partner].name} gives</span><b>{[...gt, sh.rc > 0 ? fmt(sh.rc) : null].filter(Boolean).join(", ") || "nothing"}</b></div>
      </div>
    );
  }

  function renderSheet() {
    const sh = g.sheet;
    switch (sh.t) {
      case "buy": {
        const i = sh.idx;
        const sp = BOARD[i];
        const p = cur();
        return (
          <Sheet locked>
            <div className="shTitle">
              {sp.g && <span className="gDot" style={{ background: GROUPS[sp.g].c }} />}
              {sp.name}
            </div>
            <div className="shSub">Unowned · your cash {fmt(p.cash)}</div>
            {rentPreview(i)}
            <div className="shBtns">
              <button
                className="btn"
                disabled={p.cash < sp.price}
                onClick={() => { buyProp(g.cur, i, sp.price); uiDone("bought"); }}
              >
                Buy for {fmt(sp.price)}
              </button>
              <button className="btn2" onClick={() => uiDone("auction")}>Auction it</button>
            </div>
          </Sheet>
        );
      }
      case "auction": {
        const sp = BOARD[sh.idx];
        const p = g.players[sh.pid];
        return (
          <Sheet locked>
            <div className="shTitle">🔨 Auction · {sp.name}</div>
            <div className="shSub">
              {sh.bid > 0 ? "High bid " + fmt(sh.bid) + " by " + g.players[sh.holder].name : "No bids yet · list price " + fmt(sp.price)}
            </div>
            <div className="shSub2">{p.name} — your move · cash {fmt(p.cash)}</div>
            <div className="shBtns">
              {[10, 50, 100].map((inc) => (
                <button key={inc} className="btn2 btnS" disabled={sh.bid + inc > p.cash} onClick={() => uiDone(inc)}>
                  +${inc}
                </button>
              ))}
              <button className="btn btnS" onClick={() => uiDone("pass")}>Pass</button>
            </div>
          </Sheet>
        );
      }
      case "card": {
        const c = (sh.deck === "fortune" ? FORTUNE : CHEST)[sh.cid];
        const isF = sh.deck === "fortune";
        return (
          <div className="scrim scrimC">
            <div className={"cardM " + (isF ? "cardF" : "cardC")}>
              <div className="cardTag">{isF ? "✦ FORTUNE" : "✚ CHEST"}</div>
              <div className="cardTxt">{c.t}</div>
              {cur().human && <button className="btn btnFull" onClick={() => uiDone()}>OK</button>}
            </div>
          </div>
        );
      }
      case "jail": {
        const p = cur();
        return (
          <Sheet onClose={close}>
            <div className="shTitle">🔒 {p.name} is in Jail</div>
            <div className="shSub">Roll doubles to walk free · attempt {p.jailTries + 1} of 3</div>
            <div className="shBtns">
              <button className="btn" onClick={() => jailAttempt()}>🎲 Roll for doubles</button>
            </div>
            <div className="shBtns">
              <button className="btn2" disabled={p.cash < 50} onClick={() => jailPay()}>Pay $50 bail</button>
              <button className="btn2" disabled={p.cards.length === 0} onClick={() => jailCard()}>Use 🎟️ card</button>
            </div>
          </Sheet>
        );
      }
      case "manage": {
        const p = cur();
        const mine = Object.keys(g.owner).map(Number).filter((i) => g.owner[i] === g.cur).sort((a, b) => a - b);
        const d = g.debt;
        return (
          <Sheet locked={!!d} onClose={close}>
            <div className="shTitle">Your properties</div>
            {d && (
              <div className="debtBox">
                Owe {fmt(d.amt)} to {d.to !== null && d.to !== undefined && d.to >= 0 ? g.players[d.to].name : "the bank"} · cash {fmt(p.cash)}
                <div className="shBtns">
                  <button className="btn" disabled={p.cash < d.amt} onClick={payDebt}>Pay {fmt(d.amt)}</button>
                  <button className="btnDanger" onClick={doBankrupt}>Go bankrupt</button>
                </div>
              </div>
            )}
            {!d && <div className="shSub">Cash {fmt(p.cash)} · own a full colour set to build</div>}
            <div className="mList">
              {mine.length === 0 && <div className="shSub2">No deeds yet — go land on something.</div>}
              {mine.map((i) => {
                const sp = BOARD[i];
                const h = g.houses[i] || 0;
                return (
                  <div key={i} className="mRow">
                    <span className="gDot" style={{ background: sp.g ? GROUPS[sp.g].c : "#9AA0A6" }} />
                    <span className="mName">{sp.name}</span>
                    <span className="mH">{h === 5 ? "🏨" : h > 0 ? "🏠×" + h : ""}</span>
                    {sp.t === "prop" && (
                      <>
                        <button className="mBtn" disabled={!canSell(i)} onClick={() => sellHouse(i)}>−</button>
                        <button className="mBtn" disabled={!canBuild(i)} onClick={() => build(i)}>+</button>
                      </>
                    )}
                    {!g.mort[i] && (
                      <button className="mBtn2" disabled={!canMort(i)} onClick={() => mortgage(i)}>
                        Mort. +{fmt(BOARD[i].price / 2)}
                      </button>
                    )}
                    {g.mort[i] && (
                      <button className="mBtn2" disabled={!canUnmort(i)} onClick={() => unmortgage(i)}>
                        Lift −{fmt(Math.ceil(BOARD[i].price * 0.55))}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            {!d && <button className="btn btnFull" onClick={close}>Done</button>}
          </Sheet>
        );
      }
      case "info": {
        const i = sh.idx;
        const sp = BOARD[i];
        const o = g.owner[i];
        return (
          <Sheet onClose={close}>
            <div className="shTitle">
              {sp.g && <span className="gDot" style={{ background: GROUPS[sp.g].c }} />}
              {sp.name}
            </div>
            {sp.price !== undefined && (
              <div className="shSub">
                {o !== undefined
                  ? "Owned by " + g.players[o].name + (g.mort[i] ? " · mortgaged" : "")
                  : "Unowned · " + fmt(sp.price)}
              </div>
            )}
            {sp.t === "tax" && <div className="shSub">Pay {fmt(sp.amt)} on landing.</div>}
            {sp.t === "fortune" && <div className="shSub">Draw a Fortune card.</div>}
            {sp.t === "chest" && <div className="shSub">Draw a Chest card.</div>}
            {sp.t === "go" && <div className="shSub">Collect $200 each time you pass.</div>}
            {sp.t === "jail" && <div className="shSub">Just visiting — unless you were sent here.</div>}
            {sp.t === "park" && <div className="shSub">A quiet corner. Nothing happens.</div>}
            {sp.t === "gotojail" && <div className="shSub">Straight to Jail. No GO bonus.</div>}
            {rentPreview(i)}
            <button className="btn btnFull" onClick={close}>Close</button>
          </Sheet>
        );
      }
      case "player": {
        const p = g.players[sh.pid];
        const props = Object.keys(g.owner).map(Number).filter((i) => g.owner[i] === sh.pid).sort((a, b) => a - b);
        const worth = p.cash + props.reduce((s, i) => {
          const hv = BOARD[i].g ? (g.houses[i] || 0) * GROUPS[BOARD[i].g].hc * 0.5 : 0;
          return s + BOARD[i].price * (g.mort[i] ? 0.5 : 1) + hv;
        }, 0);
        return (
          <Sheet onClose={close}>
            <div className="shTitle">
              <span style={{ fontSize: 20 }}>{p.emoji}</span>
              {p.name}
              {!p.human && <span className="mini">CPU</span>}
            </div>
            <div className="shSub">
              {p.bankrupt ? "Bankrupt" : "Cash " + fmt(p.cash) + " · net worth " + fmt(worth) + (p.inJail ? " · in Jail" : "")}
            </div>
            <div className="mList">
              {props.length === 0 && <div className="shSub2">No deeds.</div>}
              {props.map((i) => (
                <div key={i} className="mRow">
                  <span className="gDot" style={{ background: BOARD[i].g ? GROUPS[BOARD[i].g].c : "#9AA0A6" }} />
                  <span className="mName">{BOARD[i].name}</span>
                  <span className="mH">
                    {g.mort[i] ? "M " : ""}
                    {(g.houses[i] || 0) === 5 ? "🏨" : (g.houses[i] || 0) > 0 ? "🏠×" + g.houses[i] : ""}
                  </span>
                </div>
              ))}
            </div>
            <button className="btn btnFull" onClick={close}>Close</button>
          </Sheet>
        );
      }
      case "trade": {
        const me = cur();
        const others = alive().filter((p) => p.id !== g.cur);
        if (sh.stage === "review") {
          const pt = g.players[sh.partner];
          return (
            <Sheet locked>
              <div className="shTitle">🤝 Offer for {pt.name}</div>
              <div className="shSub">Hand the phone to {pt.name} to decide.</div>
              {tradeSummary(sh)}
              <div className="shBtns">
                <button className="btn" onClick={() => { execTrade(sh); g.sheet = null; R(); }}>Accept</button>
                <button className="btn2" onClick={() => { log(pt.name + " declines the trade."); g.sheet = null; R(); }}>Decline</button>
              </div>
            </Sheet>
          );
        }
        return (
          <Sheet onClose={close}>
            <div className="shTitle">Propose a trade</div>
            <div className="pRow">
              {others.map((o) => (
                <button
                  key={o.id}
                  className={"pPick" + (sh.partner === o.id ? " pOn" : "")}
                  style={{ borderColor: PC[o.id] }}
                  onClick={() => { sh.partner = o.id; sh.get = {}; sh.rc = 0; R(); }}
                >
                  {o.emoji} {o.name}
                </button>
              ))}
            </div>
            <div className="tCols">
              <div className="tCol">
                <div className="tHead">You give</div>
                {tradeable(g.cur).map((i) => tRow(i, sh.give))}
                <div className="tHead">+ cash (max {fmt(me.cash)})</div>
                <input
                  className="tCash"
                  type="number"
                  min="0"
                  value={sh.gc}
                  onChange={(e) => { sh.gc = Math.max(0, Math.min(me.cash, Math.floor(+e.target.value || 0))); R(); }}
                />
              </div>
              <div className="tCol">
                <div className="tHead">You get</div>
                {tradeable(sh.partner).map((i) => tRow(i, sh.get))}
                <div className="tHead">+ cash (max {fmt(g.players[sh.partner].cash)})</div>
                <input
                  className="tCash"
                  type="number"
                  min="0"
                  value={sh.rc}
                  onChange={(e) => { sh.rc = Math.max(0, Math.min(g.players[sh.partner].cash, Math.floor(+e.target.value || 0))); R(); }}
                />
              </div>
            </div>
            <div className="shSub2">Deeds in built-up colour sets can't be traded — sell the houses first.</div>
            {sh.stage === "declined" && <div className="shSub2">Declined — sweeten the deal and try again.</div>}
            <div className="shBtns">
              <button
                className="btn"
                disabled={Object.keys(sh.give).length + Object.keys(sh.get).length + (sh.gc || 0) + (sh.rc || 0) === 0}
                onClick={proposeTrade}
              >
                Propose
              </button>
              <button className="btn2" onClick={close}>Cancel</button>
            </div>
          </Sheet>
        );
      }
      case "help":
        return (
          <Sheet onClose={close}>
            <div className="shTitle">How to play</div>
            <div className="hlp">
              <p>Roll and move. Land on an unowned space to buy it — or send it to auction, where anyone can bid.</p>
              <p>Rent is paid automatically. Own a full colour set to double base rent and unlock building.</p>
              <p>Build evenly across a set. The fifth build turns houses into a hotel. Sell back anytime at half price.</p>
              <p>Mortgage a deed for half its price; lift it later for 55%. Mortgaged spaces collect no rent.</p>
              <p>Doubles roll again — three in a row means Jail. Escape by paying $50, using a 🎟️ card, or rolling doubles within three tries.</p>
              <p>Pass GO for $200. Tap any space or player for details. Last player solvent wins the city.</p>
            </div>
            <button className="btn btnFull" onClick={close}>Close</button>
          </Sheet>
        );
      case "log":
        return (
          <Sheet onClose={close}>
            <div className="shTitle">Game log</div>
            <div className="logFull">
              {[...g.log].reverse().map((l, i) => (<div key={i} className="logFl">{l}</div>))}
            </div>
            <button className="btn btnFull" onClick={close}>Close</button>
          </Sheet>
        );
      case "newgame":
        return (
          <Sheet onClose={close}>
            <div className="shTitle">Start over?</div>
            <div className="shSub">The current game will be lost.</div>
            <div className="shBtns">
              <button className="btn" onClick={() => { Sr.current = null; R(); }}>New game</button>
              <button className="btn2" onClick={close}>Keep playing</button>
            </div>
          </Sheet>
        );
      default:
        return null;
    }
  }

  function renderWinner() {
    const w = g.players[g.winner];
    return (
      <div className="scrim scrimC winOv">
        <Confetti />
        <div className="winCard">
          <div className="winTro">🏆</div>
          <div className="winName" style={{ color: PC[w.id] }}>{w.name}</div>
          <div className="shSub" style={{ marginBottom: 16 }}>owns the city</div>
          <button className="btn" onClick={() => { Sr.current = null; R(); }}>Play again</button>
        </div>
      </div>
    );
  }

  function renderGame() {
    const p = cur();
    const humanTurn = p.human && g.winner === null;
    return (
      <>
        <div className="hdr">
          <span className="hLogo">TYCOON</span>
          <span className="hSp" />
          <button
            className={"hBtn" + (muted ? " off" : "")}
            aria-label={muted ? "Unmute sound" : "Mute sound"}
            onClick={() => { const m = !muted; SFX.muted = m; setMuted(m); if (!m) S.tap(); }}
          >{muted ? "🔇" : "🔊"}</button>
          <button className="hBtn" onClick={() => { if (!g.sheet) { g.sheet = { t: "help" }; R(); } }}>?</button>
          <button className="hBtn" onClick={() => { if (!g.sheet) { g.sheet = { t: "newgame" }; R(); } }}>↺</button>
        </div>
        <div className="boardWrap">
          <div className="camWrap">
          <div className="board">
            {BOARD.map((sp, i) => renderCell(sp, i))}
            {g.landing !== null && renderPulse()}
            <div className="center">
              <div className="wordmark">TYCOON</div>
              <div className="logbox" onClick={() => { if (!g.sheet && g.winner === null) { g.sheet = { t: "log" }; R(); } }}>
                {g.log.slice(-4).map((l, i) => (<div key={i} className="logln">{l}</div>))}
              </div>
              <div className="curRow">
                <span className="curDot" style={{ background: PC[g.cur] }} />
                <span>{p.name}</span>
                {!p.human && <span className="cpuTag">CPU</span>}
              </div>
              <div className="diceRow">
                <Die v={g.dice[0]} rolling={g.rolling} />
                <Die v={g.dice[1]} rolling={g.rolling} />
              </div>
              <div className="btnRow">
                {humanTurn && g.phase === "pre" && !p.inJail && (
                  <button className="cbtn" onClick={() => playRoll()}>🎲 Roll</button>
                )}
                {humanTurn && g.phase === "pre" && p.inJail && (
                  <button className="cbtn" onClick={() => { g.sheet = { t: "jail" }; R(); }}>🔒 Jail options</button>
                )}
                {humanTurn && g.phase === "post" && (
                  <button className="cbtn" onClick={() => nextTurn()}>End turn</button>
                )}
                {humanTurn && (g.phase === "pre" || g.phase === "post") && (
                  <>
                    <button className="cbtn2" onClick={() => { g.sheet = { t: "manage" }; R(); }}>Build</button>
                    <button className="cbtn2" onClick={() => openTrade()}>Trade</button>
                  </>
                )}
                {!p.human && g.winner === null && <span className="thinking">thinking…</span>}
              </div>
            </div>
            {g.players.map((pl) => renderToken(pl))}
          </div>
          </div>
        </div>
        <div className="strip" style={{ gridTemplateColumns: "repeat(" + g.players.length + ",1fr)" }}>
          {g.players.map((pl) => renderChip(pl))}
        </div>
        {g.sheet && renderSheet()}
        {g.winner !== null && renderWinner()}
      </>
    );
  }

  return (
    <div className="app">
      <style>{CSS}</style>
      {!g ? renderSetup() : renderGame()}
    </div>
  );
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<TycoonGame />);
