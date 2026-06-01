import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Profile } from '../../core/models';
import { TranslationService } from '../../core/translation.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [NgFor, NgIf, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      id="about"
      class="relative overflow-hidden scroll-mt-20"
      *ngIf="profile() as p"
    >
      <!-- Ambient brand glow -->
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 -z-10"
      >
        <div
          class="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-gs-crimson-500/20 blur-3xl"
        ></div>
        <div
          class="absolute top-10 right-1/4 h-64 w-64 rounded-full bg-gs-gold-400/20 blur-3xl"
        ></div>
      </div>

      <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div class="animate-fade-in-up">
          <span
            class="pill border border-gs-gold-400/50 bg-gs-gold-400/10 text-gs-gold-600 dark:text-gs-gold-300"
          >
            <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-gs-gold-500"></span>
            {{ i18n.t('hero.badge') }}
          </span>

          <h1
            class="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl"
          >
            {{ i18n.t('hero.greeting') }}
            <span class="text-brand-gradient">{{ firstName(p.name) }}</span>.
          </h1>

          <p
            class="mt-3 text-xl font-semibold text-content-muted sm:text-2xl"
          >
            {{ p.title }}
          </p>

          <p class="mt-2 flex items-center gap-2 text-sm text-content-muted">
            <i class="pi pi-map-marker text-gs-crimson-600"></i>{{ p.location }}
          </p>

          <p
            class="mt-6 max-w-3xl text-base leading-relaxed text-content-muted sm:text-lg"
          >
            {{ p.introduction }}
          </p>

          <!-- Social channels — hard redirects to digital touchpoints -->
          <div class="mt-8 flex flex-wrap items-center gap-3">
            <a
              *ngFor="let s of p.socials"
              [href]="s.url"
              target="_blank"
              rel="noopener noreferrer"
              [class]="ctaClass(s.id)"
            >
              <i [class]="s.icon" class="text-lg"></i>
              <span>{{ s.label }}</span>
            </a>
          </div>

          <!-- Credentials -->
          <div class="mt-10 grid gap-6 sm:grid-cols-2">
            <div>
              <h2 class="section-eyebrow">{{ i18n.t('hero.certifications') }}</h2>
              <ul class="mt-3 space-y-2">
                <li
                  *ngFor="let c of p.certifications"
                  class="flex items-start gap-2 text-sm text-content-muted"
                >
                  <i class="pi pi-verified mt-0.5 text-gs-crimson-600"></i>{{ c }}
                </li>
              </ul>
            </div>
            <div>
              <h2 class="section-eyebrow">{{ i18n.t('hero.languages') }}</h2>
              <ul class="mt-3 space-y-2">
                <li
                  *ngFor="let l of p.languages"
                  class="flex items-center gap-2 text-sm text-content-muted"
                >
                  <i class="pi pi-globe text-gs-gold-500"></i>
                  <span class="font-medium text-content">{{ l.language }}</span>
                  <span class="text-content-muted">— {{ l.level }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class HeroComponent {
  protected readonly i18n = inject(TranslationService);
  readonly profile = input<Profile | null>(null);

  protected firstName(name: string): string {
    return name.split(' ')[0] ?? name;
  }

  protected ctaClass(id: string): string {
    const base =
      'inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ease-in-out hover:-translate-y-0.5';
    return id === 'github'
      ? `${base} bg-gs-crimson-700 text-white shadow-glow hover:bg-gs-crimson-800`
      : `${base} border border-hairline bg-surface text-content hover:border-gs-gold-400 hover:text-gs-gold-600`;
  }
}
