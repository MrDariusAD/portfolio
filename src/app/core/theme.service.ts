import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'portfolio-theme';

/**
 * Reactive light/dark theme controller.
 *
 * - Reads the persisted choice (or the OS `prefers-color-scheme`) on init.
 * - Exposes a `theme` signal for templates to react to.
 * - Toggling adds/removes the `.dark` class on <html>, which drives both the
 *   Tailwind `darkMode: 'class'` strategy and PrimeNG's `darkModeSelector`.
 * - Persists the explicit choice to localStorage.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);

  readonly theme = signal<ThemeMode>('light');

  /** Convenience signal for templates: `isDark()`. */
  readonly isDark = () => this.theme() === 'dark';

  init(): void {
    const stored = this.safeRead();
    const prefersDark = this.doc.defaultView?.matchMedia?.(
      '(prefers-color-scheme: dark)'
    ).matches;

    const mode: ThemeMode = stored ?? (prefersDark ? 'dark' : 'light');
    this.apply(mode, false);

    // React to live OS changes only while the user has not made an explicit choice.
    if (!stored) {
      this.doc.defaultView
        ?.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (e) => {
          if (!this.safeRead()) this.apply(e.matches ? 'dark' : 'light', false);
        });
    }
  }

  toggle(): void {
    this.apply(this.theme() === 'dark' ? 'light' : 'dark', true);
  }

  set(mode: ThemeMode): void {
    this.apply(mode, true);
  }

  private apply(mode: ThemeMode, persist: boolean): void {
    const root = this.doc.documentElement;
    root.classList.toggle('dark', mode === 'dark');
    this.theme.set(mode);
    if (persist) {
      try {
        this.doc.defaultView?.localStorage.setItem(STORAGE_KEY, mode);
      } catch {
        /* storage unavailable (private mode) — ignore */
      }
    }
  }

  private safeRead(): ThemeMode | null {
    try {
      const v = this.doc.defaultView?.localStorage.getItem(STORAGE_KEY);
      return v === 'light' || v === 'dark' ? v : null;
    } catch {
      return null;
    }
  }
}
