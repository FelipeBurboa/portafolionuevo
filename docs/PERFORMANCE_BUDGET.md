# Performance budget — FelipeOS

Budgets set at foundation (T1) and enforced continuously, not as a final
Lighthouse afterthought. A change that breaks a budget is a regression to fix
before merge, not after.

## Core Web Vitals (field targets)

| Metric | Budget | Target | Notes |
|---|---|---|---|
| **LCP** | < 2.0s | < 1.5s | Measured on the desktop's real content, never on the boot overlay. Boot must not gate first paint. |
| **INP** | < 200ms | < 100ms | Window drag / open-close must stay responsive; GSAP work off the main-thread-blocking path. |
| **CLS** | < 0.1 | ~0 | Fixed OS chrome (menu bar, taskbar) reserves its space; fonts use `display: swap` with matched fallback metrics. |

## Resource budgets

| Resource | Ceiling | Rationale |
|---|---|---|
| First-load JS (desktop route) | **≤ 180 KB gzip** | Baseline Next app + Zustand (~1 KB) + GSAP core/plugins added later. Code-split GSAP plugins so they load only where used. |
| First-load JS (mobile route) | **≤ 160 KB gzip** | Mobile sheets carry less window-manager weight. |
| Fonts | **2 families, self-hosted WOFF2** | IBM Plex Mono (latin) + VT323 (latin). No runtime font CDN. See `FONTS.md`. |
| Images | AVIF/WebP via `next/image`; project screenshots lazy-loaded below the fold. | |

## Test matrix (per vertical slice / before ship)

Cold load · repeat-session (boot skipped) · **no-JS** (crawlable content present) ·
`prefers-reduced-motion` · slow-device (throttled CPU/4G).

## How to check

- `npm run build` prints per-route First Load JS — compare against the ceilings above.
- Lighthouse (or equivalent) on representative routes for LCP/INP/CLS.
- Verify built HTML with JavaScript disabled for every indexable route.
