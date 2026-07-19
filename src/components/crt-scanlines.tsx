/**
 * Fixed, non-interactive CRT scanline overlay. Purely presentational —
 * kept at ≤ 0.05 opacity so it reads as texture, not decoration.
 */
export function CrtScanlines() {
  return <div aria-hidden className="crt-scanlines" />;
}
