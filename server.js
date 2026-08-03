/* TYCOON — local network play.
   Pure Node, no npm install. Run:  node server.js
   One machine runs this; everyone on the same Wi-Fi opens the printed address. */

const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

const PORT = process.env.PORT || 8000;
const ROOT = __dirname;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jsx": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

/* ---------- the room ---------- */
let clients = [];          // open server-sent-event streams
let lastState = null;      // most recent game state from the host
let hostId = null;
let nextId = 1;

function fanout(msg, exceptId) {
  const line = "data: " + JSON.stringify(msg) + "\n\n";
  clients = clients.filter((c) => !c.dead);
  for (const c of clients) {
    if (exceptId != null && c.id === exceptId) continue;
    try { c.res.write(line); } catch (e) { c.dead = true; }
  }
}

function readBody(req) {
  return new Promise((resolve) => {
    let b = "";
    req.on("data", (d) => {
      b += d;
      if (b.length > 4e6) { b = ""; req.destroy(); }
    });
    req.on("end", () => resolve(b));
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://" + (req.headers.host || "localhost"));

  /* the client uses this to tell whether it is being served by this server
     (on a static host it 404s and multiplayer stays hidden) */
  if (url.pathname === "/net-ping") {
    res.writeHead(200, { "content-type": "application/json", "cache-control": "no-store" });
    res.end(JSON.stringify({ ok: true, players: clients.length, hosted: hostId !== null }));
    return;
  }

  if (url.pathname === "/events") {
    const id = nextId++;
    res.writeHead(200, {
      "content-type": "text/event-stream",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
      "x-accel-buffering": "no",
    });
    res.write("retry: 1500\n\n");
    const client = { id, res, dead: false };
    clients.push(client);
    res.write("data: " + JSON.stringify({ k: "welcome", id, hosted: hostId !== null }) + "\n\n");
    if (lastState) res.write("data: " + JSON.stringify({ k: "state", state: lastState }) + "\n\n");

    const ping = setInterval(() => {
      try { res.write(": ping\n\n"); } catch (e) { client.dead = true; }
    }, 20000);

    req.on("close", () => {
      client.dead = true;
      clearInterval(ping);
      clients = clients.filter((c) => c.id !== id);
      if (hostId === id) {
        hostId = null;
        lastState = null;
        fanout({ k: "hostgone" });
        console.log("host left — room reset");
      }
    });
    return;
  }

  if (url.pathname === "/send" && req.method === "POST") {
    const body = await readBody(req);
    let msg = null;
    try { msg = JSON.parse(body); } catch (e) {}
    if (msg) {
      if (msg.k === "state") { lastState = msg.state; hostId = msg.from; }
      if (msg.k === "claim") hostId = msg.from;
      fanout(msg, msg.from);
    }
    res.writeHead(204).end();
    return;
  }

  /* static files */
  let p = decodeURIComponent(url.pathname);
  if (p === "/") p = "/index.html";
  const file = path.join(ROOT, path.normalize(p).replace(/^(\.\.[/\\])+/, ""));
  if (!file.startsWith(ROOT)) { res.writeHead(403).end("no"); return; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404).end("not found"); return; }
    res.writeHead(200, {
      "content-type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream",
      "cache-control": "no-store",
    });
    res.end(data);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  const nets = os.networkInterfaces();
  const addrs = [];
  for (const name of Object.keys(nets)) {
    for (const n of nets[name] || []) {
      if (n.family === "IPv4" && !n.internal) addrs.push(n.address);
    }
  }
  console.log("\n  TYCOON is running.\n");
  console.log("  On this computer:   http://localhost:" + PORT);
  for (const a of addrs) console.log("  On your Wi-Fi:      http://" + a + ":" + PORT);
  console.log("\n  One player taps Host, everyone else taps Join.");
  console.log("  Stop the server with Ctrl+C.\n");
});
