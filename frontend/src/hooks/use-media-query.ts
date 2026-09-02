"use client";

import { useCallback, useSyncExternalStore } from "react";

function subscribe(query: string, callback: () => void) {
  const mediaQuery = window.matchMedia(query);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getSnapshot(query: string) {
  return window.matchMedia(query).matches;
}

function getServerSnapshot() {
  return false;
}

export function useMediaQuery(query: string): boolean {
  const subscribeToQuery = useCallback(
    (callback: () => void) => subscribe(query, callback),
    [query],
  );

  return useSyncExternalStore(
    subscribeToQuery,
    () => getSnapshot(query),
    getServerSnapshot,
  );
}
