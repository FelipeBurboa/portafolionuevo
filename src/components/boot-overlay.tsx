"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

gsap.registerPlugin(useGSAP);

/** A visual boot handoff. The OS exists underneath from the first render. */
export function BootOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [complete, setComplete] = useState(false);

  useGSAP((_, contextSafe) => {
      const overlay = overlayRef.current;
      if (!overlay) return;
      const panel = overlay.querySelector<HTMLElement>("[data-boot-panel]");
      const lines = overlay.querySelectorAll<HTMLElement>("[data-boot-line]");
      const progress = overlay.querySelector<HTMLElement>("[data-boot-progress]");
      if (!panel || !progress) return;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const timeline = gsap.timeline({
          onComplete: contextSafe(() => setComplete(true)),
        });
        timeline
          .set(lines, { autoAlpha: 0, x: -6 })
          .set(progress, { scaleX: 0, transformOrigin: "left center" })
          .fromTo(panel, { autoAlpha: 0, scale: 0.98 }, { autoAlpha: 1, scale: 1, duration: 0.2, ease: "power3.out" })
          .to(lines, { autoAlpha: 1, x: 0, duration: 0.14, stagger: 0.16, ease: "power3.out" }, "+=0.08")
          .to(progress, { scaleX: 1, duration: 0.38, ease: "power3.out" }, "-=0.08")
          .to(overlay, { autoAlpha: 0, duration: 0.24, ease: "power3.in" }, "+=0.18");
      });
      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(overlay, { autoAlpha: 0 });
      });
      return () => media.revert();
    }, { scope: overlayRef });

  if (complete) return null;

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 grid place-items-center bg-term-bg"
    >
      <div data-boot-panel className="w-[min(32rem,calc(100vw-2.5rem))] border border-term-border bg-term-bg-raised p-5 text-[11px] leading-6 text-term-fg-dim shadow-[0_16px_50px_rgba(0,0,0,0.55)]">
        <div className="flex items-baseline justify-between border-b border-term-border-dim pb-3">
          <p className="font-pixel text-3xl leading-none text-term-green">felipeOS</p>
          <p className="text-[10px] tracking-[0.14em] text-term-amber">SYSTEM BOOT</p>
        </div>
        <div className="mt-4 space-y-1">
          <p data-boot-line><span className="text-term-green">[01]</span> mounting workspace</p>
          <p data-boot-line><span className="text-term-green">[02]</span> indexing selected work</p>
          <p data-boot-line><span className="text-term-green">[03]</span> opening portfolio node</p>
        </div>
        <div className="mt-5 h-px overflow-hidden bg-term-border-dim"><div data-boot-progress className="h-full bg-term-green" /></div>
        <p data-boot-line className="mt-2 text-[10px] tracking-[0.1em] text-term-amber">READY // ENTERING DESKTOP</p>
      </div>
    </div>
  );
}
