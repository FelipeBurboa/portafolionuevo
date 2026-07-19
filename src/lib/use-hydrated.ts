"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Returns false during SSR and the first client render, true afterwards.
 * Canonical hydration gate — no setState-in-effect. Use to defer client-only
 * UI (the window layer) until after hydration so server and client HTML match.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
