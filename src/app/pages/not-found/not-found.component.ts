import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../core/translation.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="theme-transition grid min-h-screen place-items-center bg-canvas px-4 text-center"
    >
      <div class="animate-fade-in-up">
        <p class="text-7xl font-extrabold text-brand-gradient sm:text-9xl">404</p>
        <h1 class="mt-4 text-2xl font-bold">{{ i18n.t('notFound.title') }}</h1>
        <p class="mt-2 text-content-muted">{{ i18n.t('notFound.subtitle') }}</p>
        <a
          routerLink="/"
          class="mt-8 inline-flex items-center gap-2 rounded-xl bg-gs-crimson-700 px-5 py-3 text-sm font-semibold text-white shadow-glow transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-gs-crimson-800"
        >
          <i class="pi pi-home"></i> {{ i18n.t('notFound.home') }}
        </a>
      </div>
    </div>
  `
})
export class NotFoundComponent {
  protected readonly i18n = inject(TranslationService);
}
