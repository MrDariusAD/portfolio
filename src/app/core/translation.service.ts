import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export type Lang = 'en' | 'de';

type Dictionary = Record<string, string>;

const STORAGE_KEY = 'portfolio-lang';
const SUPPORTED: Lang[] = ['en', 'de'];

/**
 * Lightweight, dependency-free runtime i18n.
 *
 * Both dictionaries are preloaded at app start (see APP_INITIALIZER in
 * app.config.ts) so `t()` is synchronous. `t()` reads the `lang` and `dict`
 * signals, which means any template calling `i18n.t('key')` establishes a
 * reactive dependency — so even OnPush components re-render the instant the
 * language is toggled, with no extra plumbing.
 */
@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly http = inject(HttpClient);
  private readonly doc = inject(DOCUMENT);

  readonly lang = signal<Lang>('en');
  private readonly dict = signal<Record<Lang, Dictionary>>({ en: {}, de: {} });

  /** True when the active language is German (handy for templates). */
  readonly isGerman = () => this.lang() === 'de';

  /** Preload dictionaries and resolve the initial language. */
  async init(): Promise<void> {
    const [en, de] = await Promise.all([
      firstValueFrom(this.http.get<Dictionary>('assets/i18n/en.json')),
      firstValueFrom(this.http.get<Dictionary>('assets/i18n/de.json'))
    ]);
    this.dict.set({ en, de });

    const stored = this.safeRead();
    const browser = this.doc.defaultView?.navigator?.language
      ?.slice(0, 2)
      .toLowerCase();
    const initial: Lang =
      stored ?? (browser === 'de' ? 'de' : 'en');
    this.apply(initial, false);
  }

  /** Synchronous translation lookup with graceful key fallback. */
  t = (key: string): string => {
    const active = this.lang();
    return this.dict()[active]?.[key] ?? this.dict().en[key] ?? key;
  };

  toggle(): void {
    this.apply(this.lang() === 'de' ? 'en' : 'de', true);
  }

  set(lang: Lang): void {
    this.apply(lang, true);
  }

  private apply(lang: Lang, persist: boolean): void {
    const next = SUPPORTED.includes(lang) ? lang : 'en';
    this.lang.set(next);
    this.doc.documentElement.lang = next;
    if (persist) {
      try {
        this.doc.defaultView?.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* storage unavailable — ignore */
      }
    }
  }

  private safeRead(): Lang | null {
    try {
      const v = this.doc.defaultView?.localStorage.getItem(STORAGE_KEY);
      return v === 'en' || v === 'de' ? v : null;
    } catch {
      return null;
    }
  }
}
