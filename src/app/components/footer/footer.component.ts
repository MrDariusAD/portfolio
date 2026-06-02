import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { NgFor } from '@angular/common';
import { SocialLink } from '../../core/models';
import { TranslationService } from '../../core/translation.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgFor],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="border-t border-hairline bg-surface">
      <div
        class="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-10 sm:flex-row sm:justify-between sm:px-6"
      >
        <div class="text-center sm:text-left">
          <p class="font-bold">
            Salih <span class="text-gs-crimson-600 dark:text-gs-gold-400">Özdemir</span>
          </p>
          <p class="mt-1 text-sm text-content-muted">{{ i18n.t('footer.role') }}</p>
        </div>

        <!-- General social channels only — no legal links here by design. -->
        <div class="flex items-center gap-2">
          <a
            *ngFor="let s of socials()"
            [href]="s.url"
            target="_blank"
            rel="noopener noreferrer"
            [attr.aria-label]="s.label"
            class="grid h-10 w-10 place-items-center rounded-xl border border-hairline text-content-muted transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-gs-gold-400 hover:text-gs-gold-500"
          >
            <i [class]="s.icon" class="text-lg"></i>
          </a>
        </div>
      </div>

      <div class="border-t border-hairline">
        <p class="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-content-muted sm:px-6">
          © {{ year }} Salih-Can Özdemir. {{ i18n.t('footer.rights') }}
        </p>
      </div>
    </footer>
  `
})
export class FooterComponent {
  protected readonly i18n = inject(TranslationService);
  readonly socials = input<SocialLink[]>([]);
  protected readonly year = new Date().getFullYear();
}
