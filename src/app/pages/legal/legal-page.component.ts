import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { MarkdownComponent } from 'ngx-markdown';
import { CmsService } from '../../core/cms.service';
import { TranslationService } from '../../core/translation.service';

type LegalKind = 'privacy' | 'gdpr';

/**
 * Renders a project's privacy policy or GDPR instructions from Markdown.
 *
 * Reached only via the deep routes `/projects/:slug/privacy|gdpr`, which are
 * deliberately absent from all site navigation. Content is loaded for the
 * active language and re-fetched when the language is toggled.
 */
@Component({
  selector: 'app-legal-page',
  standalone: true,
  imports: [NgIf, RouterLink, MarkdownComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="theme-transition min-h-screen bg-canvas">
      <!-- Slim branded header -->
      <header class="glass sticky top-0 z-40">
        <div
          class="h-0.5 w-full bg-gradient-to-r from-gs-crimson-700 via-gs-crimson-500 to-gs-gold-400"
        ></div>
        <div class="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
          <a
            routerLink="/"
            class="flex items-center gap-2.5"
            [attr.aria-label]="i18n.t('legal.backToPortfolio')"
          >
            <span
              class="grid h-9 w-9 place-items-center rounded-xl bg-gs-crimson-700 font-extrabold text-white"
              >SÖ</span
            >
            <span class="text-sm font-bold">Salih Özdemir</span>
          </a>
          <a
            routerLink="/"
            fragment="projects"
            class="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-content-muted transition-colors duration-300 hover:text-gs-crimson-700 dark:hover:text-gs-gold-400"
          >
            <i class="pi pi-arrow-left text-xs"></i> {{ i18n.t('legal.backToProjects') }}
          </a>
        </div>
      </header>

      <main class="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <ng-container *ngIf="vm() as v">
          <p class="section-eyebrow">
            {{ v.project?.title }} ·
            {{ kind() === 'privacy' ? i18n.t('legal.privacy') : i18n.t('legal.gdpr') }}
          </p>

          <article
            *ngIf="v.content; else missing"
            class="card prose-portfolio mt-4 border-t-4 border-t-gs-crimson-600 p-6 sm:p-10"
          >
            <markdown [data]="v.content"></markdown>
          </article>

          <ng-template #missing>
            <div class="card mt-4 p-10 text-center">
              <i class="pi pi-file-excel mb-3 text-3xl text-gs-gold-500"></i>
              <h1 class="text-xl font-bold">{{ i18n.t('legal.unavailableTitle') }}</h1>
              <p class="mt-2 text-content-muted">
                {{
                  kind() === 'privacy'
                    ? i18n.t('legal.unavailablePrivacy')
                    : i18n.t('legal.unavailableGdpr')
                }}
              </p>
              <a
                routerLink="/"
                fragment="projects"
                class="mt-6 inline-flex items-center gap-2 rounded-xl bg-gs-crimson-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-gs-crimson-800"
              >
                <i class="pi pi-arrow-left"></i> {{ i18n.t('legal.backToProjects') }}
              </a>
            </div>
          </ng-template>
        </ng-container>
      </main>
    </div>
  `
})
export class LegalPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly cms = inject(CmsService);
  protected readonly i18n = inject(TranslationService);

  protected readonly kind = toSignal(
    this.route.data.pipe(map((d) => (d['kind'] as LegalKind) ?? 'privacy')),
    { initialValue: 'privacy' as LegalKind }
  );

  private readonly slug = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('slug') ?? '')),
    { initialValue: '' }
  );

  // Re-fetch when the language changes.
  private readonly projects = toSignal(
    toObservable(this.i18n.lang).pipe(switchMap((lang) => this.cms.getProjects(lang))),
    { initialValue: [] }
  );

  protected readonly vm = computed(() => {
    const project = this.projects().find((p) => p.slug === this.slug());
    const content =
      this.kind() === 'privacy'
        ? project?.privacyPolicyMarkdown
        : project?.gdprInstructionsMarkdown;
    return { project, content };
  });
}
