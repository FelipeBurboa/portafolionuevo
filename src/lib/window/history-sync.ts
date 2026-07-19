"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import { useWindowStore } from "./store";
import { appIdToPath, pathToAppId } from "./model";

/**
 * The thin glue between the window store and the browser History API.
 *
 *  - init: rehydrate persisted windows, then reconcile focus to the current
 *    URL (canonical focused route wins; other windows are restored from store).
 *  - forward sync: when a user action changes focus, push (new app) or replace
 *    (re-focus) the URL via the native History API — NOT a Next navigation, so
 *    the desktop never remounts and content stays client-side (registry).
 *  - popstate: Back/Forward reconciles the store from the new URL.
 *
 * Locale switches go through next-intl's router (a real navigation); the store
 * is a module singleton, so open windows survive that remount untouched.
 */
export function useHistorySync() {
  const locale = useLocale();
  const navSeq = useWindowStore((s) => s.nav.seq);
  const initialized = useRef(false);

  // init — run once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await useWindowStore.persist.rehydrate();
      if (cancelled) return;
      const id = pathToAppId(window.location.pathname, locale);
      // reconcile() opens the focused app if needed and never pushes history.
      useWindowStore.getState().reconcile(id);
      initialized.current = true;
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // forward sync — push/replace the URL when a user action changes focus
  useEffect(() => {
    if (!initialized.current) return;
    const { nav, focusedId } = useWindowStore.getState();
    if (nav.hint === "none") return;
    // A nested route (for example /projects/signalgrid) already names the
    // focused app. Raising or dragging that window must not collapse its URL
    // back to the app root and lose the detail view.
    if (pathToAppId(window.location.pathname, locale) === focusedId) return;
    const path = appIdToPath(focusedId, locale);
    if (path === window.location.pathname) return;
    if (nav.hint === "push") {
      window.history.pushState(null, "", path);
    } else {
      window.history.replaceState(null, "", path);
    }
  }, [navSeq, locale]);

  // popstate — follow Back/Forward
  useEffect(() => {
    const onPop = () => {
      const id = pathToAppId(window.location.pathname, locale);
      useWindowStore.getState().reconcile(id);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [locale]);
}
