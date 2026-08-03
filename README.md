# TYCOON

A minimalist property board game for 2–4 players. Pass-and-play, with CPU opponents.

## Deploy to GitHub Pages

No build step, no dependencies to install. Two files are all you need.

1. Create a new repository on GitHub (public — Pages is free for public repos).
2. Upload `index.html` and `game.jsx` to the root of the repo. On the repo page,
   use **Add file → Upload files**, drag both in, and commit.
3. Go to **Settings → Pages**.
4. Under **Source**, choose **Deploy from a branch**. Set the branch to `main`
   and the folder to `/ (root)`. Save.
5. Wait a minute, then open `https://YOUR-USERNAME.github.io/YOUR-REPO/`.

That's it. Because the page has no build output, there's nothing to compile and
no `base` path to configure — it works from any subdirectory.

### From the command line instead

```bash
git init
git add index.html game.jsx
git commit -m "TYCOON"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

Then do steps 3–5 above.

### Testing locally

Opening `index.html` by double-clicking will **not** work — browsers block
loading `game.jsx` from `file://`. Run a local server instead:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## How it works

`index.html` loads React 18 and Babel from a CDN, then hands `game.jsx` to Babel,
which compiles the JSX in the browser. This keeps deployment to two static files.
The trade-off is that Babel is around 2.5 MB and adds roughly a quarter second of
compile time on first load.

## Optional: a faster production build

If you'd rather ship pre-compiled code (smaller, instant load), move to Vite:

```bash
npm create vite@latest tycoon -- --template react
cd tycoon
npm install
```

Then:

1. Copy `game.jsx` to `src/Tycoon.jsx`.
2. At the top of that file, replace the `const { useState, useRef, useEffect } = React;`
   line with `import React, { useState, useRef, useEffect } from "react";`
3. Delete the last two lines (the `createRoot` / `render` calls) and change
   `function TycoonGame() {` to `export default function TycoonGame() {`
4. In `src/main.jsx`, import and render `Tycoon` instead of `App`.
5. In `vite.config.js`, add your repo name as the base path:

```js
export default defineConfig({ plugins: [react()], base: '/YOUR-REPO/' })
```

6. Build and publish:

```bash
npm install --save-dev gh-pages
npm run build
npx gh-pages -d dist
```

Then set **Settings → Pages → Source** to the `gh-pages` branch.


## Playing together on the same Wi-Fi

The Vercel deployment is single-device (pass-and-play). To play from separate
phones and laptops, one computer runs the included server and everyone else
connects to it over the local network.

1. Put `index.html`, `game.jsx` and `server.js` in one folder.
2. On the computer that will host, open a terminal in that folder and run:

```bash
node server.js
```

   No `npm install` — it uses only what ships with Node.

3. The terminal prints two addresses, for example:

```
On this computer:   http://localhost:8000
On your Wi-Fi:      http://192.168.1.24:8000
```

4. Everyone opens the **Wi-Fi address** in their browser. Phones must be on the
   same network — same router, and not on a guest network that isolates devices.
5. One person taps **Host the game**, picks the number of players and presses
   **Start for everyone**. Everyone else picks their player number and taps
   **Join a game**.

### How it works

The host's browser runs the game exactly as it does offline. After every change
it mirrors the whole game state to the server, which forwards it to everyone
else. When a guest taps something, the tap is sent to the host, checked
(you can only roll on your turn, only bid when the auction reaches you, only
mortgage your own property), and applied there. So there is one source of truth
and no way for two devices to disagree.

The server keeps the last state in memory, so a phone that locks its screen or
drops off Wi-Fi catches up automatically when it reconnects.

### Notes

- Keep the host's tab open. If the host closes it, the room resets.
- Nothing is saved to disk. Stopping the server ends the game.
- The multiplayer buttons only appear when the page is served by `server.js`.
  On Vercel they stay hidden, and the game works as pass-and-play.
- If friends can't reach the address, it is almost always a firewall prompt on
  the host machine — allow Node to accept incoming connections.

## Notes

- Sound uses the Web Audio API and is synthesized at runtime — no audio files.
- Fonts load from Google Fonts; the game falls back to system faces offline.
- All game state lives in memory. Refreshing starts a new game.
