# Fonts — license & glyph record (T1 exit criterion)

Two families, both **SIL Open Font License 1.1** (free for personal & commercial
use, redistribution allowed), **self-hosted** by `next/font/google` — the files
are downloaded at build time and served from our own origin, so there is **no
runtime external font CDN**. This satisfies the T1 self-hosting requirement
while keeping a clean licensing story.

| Font | Role | Source | License | Subset / weights |
|---|---|---|---|---|
| **IBM Plex Mono** | Window chrome + body | IBM (via Google Fonts, `next/font`) | SIL OFL 1.1 | `latin`, 400/500/600/700 |
| **VT323** | Display / terminal accent (boot log, prompt, large phosphor headers) | Peter Hull (via Google Fonts, `next/font`) | SIL OFL 1.1 | `latin`, 400 |

## Glyph coverage — verified

- **Spanish diacritics & punctuation:** á é í ó ú ñ ¿ ¡ — all lie ≤ U+00FF and
  are included in the Google `latin` subset for both families. No `latin-ext`
  needed (keeps payload minimal per the performance budget).
- **Box-drawing / tree glyphs:** intentionally **not** relied on from the font.
  The file-browser tree and window chrome use CSS borders + ASCII (`|`, `-`,
  `>`, `_`), avoiding glyph-coverage gaps and keeping rendering consistent.

## Notes / open item

- The plan named **Departure Mono** (chrome) and **IBM Plex Mono / Commit Mono**
  (body) as *examples*. VT323 + IBM Plex Mono were chosen for (a) uniform OFL
  licensing, (b) reliable `next/font` self-hosting without hand-managing binary
  files, and (c) an authentic CRT-terminal character for the display font.
  **This pairing is open for Felipe to override** — swapping in Departure Mono
  (also free) would mean self-hosting its WOFF2 via `next/font/local`.
- If the pixel-display look should appear at small chrome sizes (title bars),
  revisit — VT323 is used for display sizes here, with IBM Plex Mono carrying
  small-size legibility.
