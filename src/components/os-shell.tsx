"use client";

import { type ReactNode } from "react";
import { useHistorySync } from "@/lib/window/history-sync";
import { DesktopShell } from "./desktop/desktop-shell";
import { MobileShell } from "./mobile/mobile-shell";
import { CrtScanlines } from "./crt-scanlines";
import { BootOverlay } from "./boot-overlay";

/** Switch presentation policies by viewport width; input capabilities never choose the form factor. */
export function OsShell({ children }: { children: ReactNode }) {
  useHistorySync();

  return (
    <>
      <div className="hidden md:block">
        <DesktopShell />
      </div>
      <div className="md:hidden">
        <MobileShell />
      </div>
      {/* Canonical route content remains once in the accessibility/SEO tree. */}
      <div className="sr-only">{children}</div>
      <BootOverlay />
      <CrtScanlines />
    </>
  );
}
