/**
 * Pure window-workspace model — no React, no next, no DOM. Every state
 * transition and every URL⇄focus mapping lives here so the whole behavior
 * table can be proven with a plain Node test. The Zustand store (store.ts) and
 * the history glue (history-sync.ts) are thin wrappers over these functions.
 *
 * Invariants:
 *  - `stack` is z-order, last element = topmost.
 *  - `focusedId` is the app the URL names; may be null (desktop, no window
 *    focused) even while windows remain open.
 *  - State holds ONLY serializable presentation data (ids + geometry +
 *    minimized). No React nodes, no translated strings.
 */

export type AppId = "projects" | "about" | "contact" | "terminal";

export const APP_IDS: readonly AppId[] = [
  "projects",
  "about",
  "contact",
  "terminal",
];

export type Geometry = { x: number; y: number; w: number; h: number };

export type WindowState = {
  geometry: Geometry;
  minimized: boolean;
};

export type Workspace = {
  windows: Record<string, WindowState>;
  stack: AppId[];
  focusedId: AppId | null;
};

/** What the history glue should do after a transition. */
export type HistoryOp = "push" | "replace" | "none";

export type Transition = { state: Workspace; history: HistoryOp };

export const emptyWorkspace = (): Workspace => ({
  windows: {},
  stack: [],
  focusedId: null,
});

const DEFAULT_SIZE = { w: 840, h: 600 };

/** Cascade new windows so they don't stack exactly on top of each other. */
export function cascadeGeometry(openCount: number): Geometry {
  return {
    x: 80 + openCount * 56,
    y: 44 + openCount * 44,
    ...DEFAULT_SIZE,
  };
}

export function isOpen(state: Workspace, id: AppId): boolean {
  return id in state.windows;
}

/** Topmost non-minimized window, or null. */
export function topmostVisible(state: Workspace): AppId | null {
  for (let i = state.stack.length - 1; i >= 0; i--) {
    const id = state.stack[i];
    if (!state.windows[id]?.minimized) return id;
  }
  return null;
}

function raise(stack: AppId[], id: AppId): AppId[] {
  return [...stack.filter((x) => x !== id), id];
}

/**
 * Open an app, or if already open, focus it. Opening a NOT-open app pushes a
 * history entry; re-focusing an already-open one replaces (focus churn must
 * not flood Back).
 */
export function openApp(state: Workspace, id: AppId): Transition {
  if (isOpen(state, id)) {
    return {
      state: {
        windows: {
          ...state.windows,
          [id]: { ...state.windows[id], minimized: false },
        },
        stack: raise(state.stack, id),
        focusedId: id,
      },
      history: "replace",
    };
  }
  return {
    state: {
      windows: {
        ...state.windows,
        [id]: { geometry: cascadeGeometry(state.stack.length), minimized: false },
      },
      stack: [...state.stack, id],
      focusedId: id,
    },
    history: "push",
  };
}

/** Focus an already-open window (raise + unminimize). Replaces history. */
export function focusApp(state: Workspace, id: AppId): Transition {
  if (!isOpen(state, id)) return { state, history: "none" };
  return {
    state: {
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], minimized: false },
      },
      stack: raise(state.stack, id),
      focusedId: id,
    },
    history: "replace",
  };
}

/** Close a window. Focus falls to the topmost remaining visible window, else null. */
export function closeApp(state: Workspace, id: AppId): Transition {
  if (!isOpen(state, id)) return { state, history: "none" };
  const windows = { ...state.windows };
  delete windows[id];
  const stack = state.stack.filter((x) => x !== id);
  const next: Workspace = { windows, stack, focusedId: null };
  next.focusedId = topmostVisible(next);
  return { state: next, history: "push" };
}

/** Minimize a window; if it was focused, focus falls to the next visible window. */
export function minimizeApp(state: Workspace, id: AppId): Transition {
  if (!isOpen(state, id)) return { state, history: "none" };
  const windows = {
    ...state.windows,
    [id]: { ...state.windows[id], minimized: true },
  };
  const next: Workspace = { windows, stack: state.stack, focusedId: state.focusedId };
  if (state.focusedId === id) next.focusedId = topmostVisible(next);
  return { state: next, history: "push" };
}

/** Restore a minimized window and focus it. */
export function restoreApp(state: Workspace, id: AppId): Transition {
  if (!isOpen(state, id)) return { state, history: "none" };
  return {
    state: {
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], minimized: false },
      },
      stack: raise(state.stack, id),
      focusedId: id,
    },
    history: "replace",
  };
}

/**
 * Mobile sheets are dismissed back to the launcher without destroying the
 * desktop workspace. This maps a sheet's Back affordance to the locale root.
 */
export function dismissMobileSheet(state: Workspace): Transition {
  if (!state.focusedId) return { state, history: "none" };
  return { state: { ...state, focusedId: null }, history: "push" };
}

export function setGeometry(
  state: Workspace,
  id: AppId,
  geometry: Geometry,
): Workspace {
  if (!isOpen(state, id)) return state;
  return {
    ...state,
    windows: { ...state.windows, [id]: { ...state.windows[id], geometry } },
  };
}

/**
 * Reconcile the workspace to a URL the browser navigated to (Back/Forward).
 * NEVER destroys unrelated windows. A null target = locale root (no focused
 * window, windows stay open). History op is always "none" — the URL already
 * changed, we're following it.
 */
export function reconcileFromPath(
  state: Workspace,
  target: AppId | null,
): Transition {
  if (target === null) {
    return { state: { ...state, focusedId: null }, history: "none" };
  }
  const opened = isOpen(state, target)
    ? focusApp(state, target)
    : openApp(state, target);
  return { state: opened.state, history: "none" };
}

/* ------------------------------------------------------------------ *
 * URL ⇄ focus mapping. The URL names the focused app (or the locale root
 * when nothing is focused). Detail routes (/projects/[slug]) arrive in T6.
 * ------------------------------------------------------------------ */

const SEGMENTS: Record<AppId, string> = {
  projects: "projects",
  about: "about",
  contact: "contact",
  terminal: "terminal",
};

const SEGMENT_TO_APP: Record<string, AppId> = Object.fromEntries(
  Object.entries(SEGMENTS).map(([id, seg]) => [seg, id as AppId]),
) as Record<string, AppId>;

/** Build the path the focused app implies, e.g. ("projects","en") → "/en/projects". */
export function appIdToPath(focusedId: AppId | null, locale: string): string {
  if (!focusedId) return `/${locale}`;
  return `/${locale}/${SEGMENTS[focusedId]}`;
}

/** Derive the focused app from a pathname, or null for the locale root. */
export function pathToAppId(pathname: string, locale: string): AppId | null {
  const stripped = pathname.replace(/^\/+|\/+$/g, ""); // trim slashes
  const parts = stripped.split("/");
  // parts[0] is the locale; parts[1] (if any) is the app segment.
  if (parts[0] !== locale) return null;
  const segment = parts[1];
  if (!segment) return null;
  return SEGMENT_TO_APP[segment] ?? null;
}
