import { useSyncExternalStore } from 'react';
import { presetNames } from '@plurid/carved-ui-core';
import type { ThemePreset } from '@plurid/carved-ui-core';

// The site's own theme: one of the presets, remembered in this browser.
const key = 'carved-site-theme';
const fallback: ThemePreset = 'ponton';
const listeners = new Set<() => void>();

function read(): ThemePreset {
  try {
    const stored = localStorage.getItem(key);
    return presetNames.includes(stored as ThemePreset) ? (stored as ThemePreset) : fallback;
  } catch {
    return fallback;
  }
}

export function setSiteTheme(theme: ThemePreset) {
  try {
    localStorage.setItem(key, theme);
  } catch {
    // Storage may be unavailable; the choice then lasts for this page only.
  }
  listeners.forEach((listener) => listener());
}

export function useSiteTheme(): ThemePreset {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    read,
    () => fallback,
  );
}
