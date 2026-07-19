"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useWindowStore } from "@/lib/window/store";
import { getApp } from "@/lib/window/registry";
import type { AppId } from "@/lib/window/model";

gsap.registerPlugin(useGSAP);

/**
 * A non-modal labelled region. Multiple desktop windows can remain visible,
 * so deliberately do not use a modal Dialog or focus trap here.
 */
export function WindowFrame({
  id,
  z,
  focused,
  boundsRef,
  onRequestClose,
  entryToken,
}: {
  id: AppId;
  z: number;
  focused: boolean;
  boundsRef: React.RefObject<HTMLElement | null>;
  onRequestClose: (id: AppId) => void;
  /** Only launcher/restore actions provide this; focus changes never do. */
  entryToken: number | null;
}) {
  const frameRef = useRef<HTMLElement>(null);
  const titlebarRef = useRef<HTMLDivElement>(null);
  const geometry = useWindowStore((s) => s.windows[id]?.geometry);
  const minimized = useWindowStore((s) => s.windows[id]?.minimized);
  const focus = useWindowStore((s) => s.focus);
  const minimize = useWindowStore((s) => s.minimize);
  const [isClosing, setIsClosing] = useState(false);

  const { contextSafe } = useGSAP(
    () => {
      const frame = frameRef.current;
      const titlebar = titlebarRef.current;
      if (!frame || !titlebar || !geometry || minimized) return;

      // Geometry lives in the serializable store; GSAP owns the performant
      // transform that renders it. Clamp restored/default positions after the
      // responsive frame size is known so a large window never opens offscreen.
      const bounds = boundsRef.current;
      const margin = 16;
      const maxX = bounds
        ? Math.max(margin, bounds.clientWidth - frame.offsetWidth - margin)
        : geometry.x;
      const maxY = bounds
        ? Math.max(margin, bounds.clientHeight - frame.offsetHeight - margin)
        : geometry.y;
      gsap.set(frame, {
        x: Math.min(Math.max(margin, geometry.x), maxX),
        y: Math.min(Math.max(margin, geometry.y), maxY),
      });

      const media = gsap.matchMedia();
      media.add("(hover: hover)", () => {
        // Plugins are loaded only for a hover-capable desktop window, keeping
        // drag/inertia code out of the phone presentation path.
        let cancelled = false;
        let destroyDraggable: (() => void) | undefined;
        void Promise.all([import("gsap/Draggable"), import("gsap/InertiaPlugin")]).then(
          ([{ Draggable }, { InertiaPlugin }]) => {
            if (cancelled) return;
            gsap.registerPlugin(Draggable, InertiaPlugin);
            const draggable = Draggable.create(frame, {
              type: "x,y",
              trigger: titlebar,
              bounds: boundsRef.current ?? undefined,
              edgeResistance: 0.9,
              inertia: true,
              onPress: () => focus(id),
              onDragEnd: function () {
                useWindowStore
                  .getState()
                  .setGeometry(id, { ...geometry, x: Math.round(this.x), y: Math.round(this.y) });
              },
              onThrowComplete: function () {
                useWindowStore
                  .getState()
                  .setGeometry(id, { ...geometry, x: Math.round(this.x), y: Math.round(this.y) });
              },
            });
            destroyDraggable = () => draggable.forEach((instance) => instance.kill());
          },
        );

        return () => {
          cancelled = true;
          destroyDraggable?.();
        };
      });

      return () => media.revert();
    },
    { scope: frameRef, dependencies: [] },
  );

  useGSAP(
    () => {
      const frame = frameRef.current;
      if (!frame || entryToken === null) return;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          frame,
          { autoAlpha: 0, scale: 0.975 },
          { autoAlpha: 1, scale: 1, duration: 0.3, ease: "power3.out", overwrite: "auto" },
        );
      });
      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(frame, { autoAlpha: 1, scale: 1 });
      });
      return () => media.revert();
    },
    { scope: frameRef, dependencies: [entryToken] },
  );

  if (!geometry || minimized) return null;
  const app = getApp(id);
  const titleId = `window-title-${id}`;

  const requestClose = contextSafe(() => {
    if (isClosing) return;
    const frame = frameRef.current;
    if (!frame || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onRequestClose(id);
      return;
    }
    setIsClosing(true);
    gsap.to(frame, {
      autoAlpha: 0,
      scale: 0.98,
      duration: 0.22,
      ease: "power3.in",
      overwrite: "auto",
      onComplete: () => onRequestClose(id),
    });
  });
  const onWindowKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape" || (event.altKey && event.key === "F4")) {
      event.preventDefault();
      requestClose();
      return;
    }
    if (event.altKey && event.key.toLowerCase() === "m") {
      event.preventDefault();
      minimize(id);
    }
  };

  return (
    <section
      ref={frameRef}
      data-window-id={id}
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      aria-describedby={`${titleId}-shortcuts`}
      tabIndex={-1}
      onFocusCapture={() => focus(id)}
      onPointerDown={() => focus(id)}
      onKeyDown={onWindowKeyDown}
      style={{
        left: 0,
        top: 0,
        // Existing persisted windows were 520×360. Give every desktop app a
        // useful canvas now, while still fitting compact desktop viewports.
        width: `min(${Math.max(geometry.w, 840)}px, calc(100vw - 2rem))`,
        height: `min(${Math.max(geometry.h, 600)}px, calc(100dvh - 5rem))`,
        zIndex: 10 + z,
      }}
      className={`absolute flex flex-col bg-term-bg-window shadow-[0_12px_40px_rgba(0,0,0,0.6)] focus:outline-none ${
        focused ? "border border-term-green" : "border border-term-border"
      } ${isClosing ? "pointer-events-none" : ""}`}
    >
      <div
        ref={titlebarRef}
        className="flex h-[30px] shrink-0 cursor-move items-center gap-2 border-b border-term-border-dim bg-term-bg-titlebar px-2.5 text-[11px] text-term-fg-bright"
      >
        <button
          type="button"
          aria-label={`Focus and move ${app.title}`}
          onClick={() => focus(id)}
          className="min-w-0 truncate text-left outline-none focus-visible:ring-1 focus-visible:ring-term-green"
        >
          <span id={titleId}>{app.title}</span>
        </button>
        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            aria-label={`Minimize ${app.title}`}
            onClick={() => minimize(id)}
            className="flex h-5 w-5 items-center justify-center border border-term-border text-xs text-term-fg-dim hover:border-term-green hover:text-term-green focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-term-green"
          >
            −
          </button>
          <button
            type="button"
            aria-label={`Close ${app.title}`}
            onClick={requestClose}
            className="flex h-5 w-5 items-center justify-center border border-term-amber text-xs text-term-amber hover:bg-term-amber hover:text-term-bg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-term-amber"
          >
            ×
          </button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-4">
        <app.Body />
      </div>
      <p id={`${titleId}-shortcuts`} className="sr-only">
        Use the title button or taskbar to focus this window. Press Alt M to
        minimize it, or Escape or Alt F4 to close it.
      </p>
    </section>
  );
}
