import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Profile, Project, Skill, TimelineMilestone } from './models';
import { Lang } from './translation.service';

/**
 * Decoupled content gateway.
 *
 * The portfolio is designed against a headless Payload CMS (v3+) but ships with
 * a complete local mock so it runs autonomously out-of-the-box with zero
 * network dependency.
 *
 *   • Localised content (profile, projects, timeline) is loaded per language
 *     from `assets/cms/<lang>/<name>.json`.
 *   • `skills` are language-agnostic (tech names are universal) and shared at
 *     `assets/cms/skills.json`.
 *   • When `environment.useRemoteCms` is `true`, the service calls the Payload
 *     REST API and falls back to the local JSON if the request fails — so the
 *     UI always renders.
 *
 * Streams are memoised per cache key so components can subscribe freely.
 */
@Injectable({ providedIn: 'root' })
export class CmsService {
  private readonly http = inject(HttpClient);
  private readonly localBase = 'assets/cms';
  private readonly remoteBase = environment.cmsApiUrl;
  private readonly useRemote = environment.useRemoteCms;

  private readonly cache = new Map<string, Observable<unknown>>();

  getProfile(lang: Lang): Observable<Profile> {
    return this.memo(`profile-${lang}`, () =>
      this.loadGlobal<Profile>('profile', lang)
    );
  }

  getProjects(lang: Lang): Observable<Project[]> {
    return this.memo(`projects-${lang}`, () =>
      this.loadCollection<Project>('projects', lang)
    );
  }

  getTimeline(lang: Lang): Observable<TimelineMilestone[]> {
    return this.memo(`timeline-${lang}`, () =>
      this.loadCollection<TimelineMilestone>('timeline', lang)
    );
  }

  /** Skills are shared across languages. */
  getSkills(): Observable<Skill[]> {
    return this.memo('skills', () => {
      const local = this.http.get<Skill[]>(`${this.localBase}/skills.json`);
      if (!this.useRemote) return local;
      return this.http
        .get<{ docs: Skill[] }>(`${this.remoteBase}/skills?limit=200`)
        .pipe(
          map((res) => res.docs ?? []),
          catchError(() => local)
        );
    });
  }

  getProject(slug: string, lang: Lang): Observable<Project | undefined> {
    return this.getProjects(lang).pipe(
      map((all) => all.find((p) => p.slug === slug))
    );
  }

  // ── internals ─────────────────────────────────────────────────────────────

  private memo<T>(key: string, factory: () => Observable<T>): Observable<T> {
    if (!this.cache.has(key)) {
      this.cache.set(key, factory().pipe(shareReplay(1)));
    }
    return this.cache.get(key) as Observable<T>;
  }

  private loadGlobal<T>(name: string, lang: Lang): Observable<T> {
    const local = this.http.get<T>(`${this.localBase}/${lang}/${name}.json`);
    if (!this.useRemote) return local;
    return this.http
      .get<T>(`${this.remoteBase}/globals/${name}?locale=${lang}`)
      .pipe(catchError(() => local));
  }

  private loadCollection<T>(name: string, lang: Lang): Observable<T[]> {
    const local = this.http.get<T[]>(`${this.localBase}/${lang}/${name}.json`);
    if (!this.useRemote) return local;
    return this.http
      .get<{ docs: T[] }>(`${this.remoteBase}/${name}?limit=200&locale=${lang}`)
      .pipe(
        map((res) => res.docs ?? []),
        catchError(() => local)
      );
  }
}
