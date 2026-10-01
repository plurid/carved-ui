import { useState, useSyncExternalStore } from 'react';

let pressing = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());
const press = () => {
  pressing = true;
  emit();
};
// Release only after the click that follows pointerup has been dispatched.
const release = () =>
  setTimeout(() => {
    pressing = false;
    emit();
  });

function subscribe(listener: () => void) {
  if (listeners.size === 0) {
    document.addEventListener('pointerdown', press, true);
    document.addEventListener('pointerup', release, true);
    document.addEventListener('pointercancel', release, true);
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size > 0) return;
    document.removeEventListener('pointerdown', press, true);
    document.removeEventListener('pointerup', release, true);
    document.removeEventListener('pointercancel', release, true);
  };
}

/**
 * Keep the value from before the pointer went down until the press completes.
 *
 * Pressing a button blurs the focused field, which revalidates it. If its error appears or
 * disappears mid-press, the layout moves the button out from under the pointer and the press
 * is lost. Holding the previous value until the click lands keeps the layout still.
 */
export function useHeldDuringPress<T>(value: T): T {
  const held = useSyncExternalStore(
    subscribe,
    () => pressing,
    () => false,
  );
  const [shown, setShown] = useState(value);
  if (!held && shown !== value) setShown(value);
  return held ? shown : value;
}
