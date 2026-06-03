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
  templateUrl: './hero.component.html'
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
      ? `${base} cta-shine bg-gs-crimson-700 text-white shadow-glow hover:bg-gs-crimson-800`
      : `${base} anim-border border border-hairline bg-surface text-content hover:text-gs-gold-600`;
  }
}
