/**
 * Ambient desktop backdrop — a non-interactive layer that sits BEHIND the window
 * layer and the launcher (z-0, under the launcher's z-10) to give the idle desktop
 * texture and life.
 *
 * T1 renders the faint felipeOS wordmark with a restrained CRT glitch; the system
 * readout widget (T2) and its ambient motion (T3) mount into this same layer.
 * Purely observational: no pointer/keyboard interaction, hidden from assistive tech.
 */

const WORDMARK = "felipeOS";

// Large VT323 (pixel/CRT) wordmark. Shared class so the base + two glitch slice
// layers overlay exactly; the slices flash green only during the periodic burst.
const markClass =
  "font-pixel leading-none tracking-tight text-[clamp(3.5rem,15vw,10rem)]";

export function AmbientDesktop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden"
    >
      {/* Centered watermark. Base is a faint, always-present phosphor mark; two
          brighter slice layers flash only during the glitch burst. All green —
          no RGB split — to hold the terminal palette. */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className={`wordmark-jitter relative block text-term-border ${markClass}`}>
          {WORDMARK}
        </span>
        <span className={`wordmark-slice-a absolute inset-0 block text-term-green ${markClass}`}>
          {WORDMARK}
        </span>
        <span className={`wordmark-slice-b absolute inset-0 block text-term-green-bright ${markClass}`}>
          {WORDMARK}
        </span>
      </div>
    </div>
  );
}
