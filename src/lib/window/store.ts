import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as M from "./model";

/**
 * Presentation-only window store — a module singleton (lives OUTSIDE React, so
 * it survives the [locale] layout remount on a language switch). Holds only
 * serializable data: open ids, z-order, geometry, minimized, focusedId. No
 * React nodes, no translated strings. All transitions delegate to the pure
 * model; `nav` carries the history intent for history-sync.ts to flush.
 */

type NavIntent = { hint: M.HistoryOp; seq: number };

type State = {
  windows: M.Workspace["windows"];
  stack: M.AppId[];
  focusedId: M.AppId | null;
  nav: NavIntent;
};

type Actions = {
  open: (id: M.AppId) => void;
  focus: (id: M.AppId) => void;
  close: (id: M.AppId) => void;
  minimize: (id: M.AppId) => void;
  restore: (id: M.AppId) => void;
  dismissMobileSheet: () => void;
  setGeometry: (id: M.AppId, geometry: M.Geometry) => void;
  /** Follow a Back/Forward URL change — never pushes history. */
  reconcile: (id: M.AppId | null) => void;
};

export const useWindowStore = create<State & Actions>()(
  persist(
    (set, get) => {
      const workspace = (): M.Workspace => {
        const s = get();
        return { windows: s.windows, stack: s.stack, focusedId: s.focusedId };
      };
      const commit = (t: M.Transition) =>
        set((s) => ({
          windows: t.state.windows,
          stack: t.state.stack,
          focusedId: t.state.focusedId,
          nav: { hint: t.history, seq: s.nav.seq + 1 },
        }));

      return {
        windows: {},
        stack: [],
        focusedId: null,
        nav: { hint: "none", seq: 0 },

        open: (id) => commit(M.openApp(workspace(), id)),
        focus: (id) => commit(M.focusApp(workspace(), id)),
        close: (id) => commit(M.closeApp(workspace(), id)),
        minimize: (id) => commit(M.minimizeApp(workspace(), id)),
        restore: (id) => commit(M.restoreApp(workspace(), id)),
        dismissMobileSheet: () => commit(M.dismissMobileSheet(workspace())),
        setGeometry: (id, geometry) =>
          commit({ state: M.setGeometry(workspace(), id, geometry), history: "none" }),
        reconcile: (id) => commit(M.reconcileFromPath(workspace(), id)),
      };
    },
    {
      name: "felipeos-workspace",
      storage: createJSONStorage(() => sessionStorage),
      // Persist only the serializable workspace, not the transient nav intent.
      partialize: (s) => ({
        windows: s.windows,
        stack: s.stack,
        focusedId: s.focusedId,
      }),
      // Rehydrate manually on mount (history-sync) so we can reconcile the
      // restored windows against the URL and avoid an SSR hydration mismatch.
      skipHydration: true,
    },
  ),
);
