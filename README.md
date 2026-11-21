# BMWorld
Serve over HTTP (`python3 -m http.server`, then open http://localhost:8000). Needed for fonts, the video and the 3D module.

## Structure
- Pages: `index.html` (intro + home), `models.html`, `model.html?model=<slug>` (one template for all cars), `history.html`, `m-performance.html`, `3d-experience.html`, `gallery.html`, `about.html`
- `models.js` car data · `images.js` ALL image URLs · `content.js` timeline, gallery, M4 generations
- `common.js` header/footer, carousel, helpers · `pages.js` per-page logic · `intro.js` homepage intro only · `viewer.js` Three.js viewer
- `bmworld-intro.mp4` intro video (unchanged) · `intro-final-frame.jpg` final-frame fallback

## Add a model
Copy a block in `models.js`, give it a new `slug`, add `"new-slug":["","","",""]` to `MODEL_IMAGES` in `images.js`. Add its series to `CATS` only if it is a new category. It appears in the catalogue and at `model.html?model=new-slug`. Use `"TBD"` for unverified specs.

## Add or replace image URLs
Open `images.js`, find the model slug in `MODEL_IMAGES` and paste links (4-5 slots; `""` shows a placeholder):
```js
"e30-m3":["e30-m3","https://example.com/e30-front.jpg","e30-rear.jpg","",""],
```
A slot can be a named key from `REMOTE`/`LOCAL`, a direct https URL, or a local path. For custom alt text use `{src:"https://...",alt:"E30 M3 rear three-quarter"}`. Gallery items (`content.js`, field `k`) accept the same values. Broken links fall back to a labelled placeholder.

## Add a 3D model
Put `my-car.glb` in `assets/models/` and add `model3d:"assets/models/my-car.glb"` to that model in `models.js`. It then appears on `3d-experience.html` (and a "View in 3D" button on its details page) with a working Three.js viewer.

## Intro video
`bmworld-intro.mp4`, homepage only, replays on every fresh load or refresh (skipped only when returning from another site page). Scroll unlocks on the video's `ended` event; if it fails or autoplay is blocked the final frame shows and the page unlocks after 6 s at most.

## Extras (v3)
- **Intro:** black gate (click enables sound; browsers block audible autoplay) -> "Developed by Smit Salunkhe" fades in, ~2 s hold, drops away -> 0.5 s black -> video. Replay in the same session with `index.html?intro`.
- **Settings:** `config.js` (mascot image, engine sound file, optional AI endpoint).
- **Mascot:** set `MASCOT_SRC` to a transparent PNG/SVG of a car facing right (about 300 px wide). Empty = built-in simple car.
- **Navbar sound button (Engine):** plays `ENGINE_SOUND` (default: `bmw-engine.mp3`, set in `config.js`). Replace the file or change the path.
- **Drive modes:** Comfort/Sport/Track recolour the site (saved in the browser).
- **Chat guide:** answers from `models.js` and the timeline, no key needed. New models work automatically; add short names to `AL` in `extras.js` so "ask about the M3" finds them.
- **Real AI (optional):** never put an API key in the website or in a git-ignored file you ship. Deploy `chat-worker.js`, keep the key as a Worker secret, put the Worker URL in `CHAT_ENDPOINT`.
- **Tools:** `compare.html?a=<slug>&b=<slug>` and `quiz.html`.
