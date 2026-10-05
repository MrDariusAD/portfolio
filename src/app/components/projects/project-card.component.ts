import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '../../core/models';
import { TranslationService } from '../../core/translation.service';
import { IconComponent, isImage, isSymbol } from '../icon/icon.component';
import { RippleDirective } from '../../directives/ripple.directive';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [RouterLink, IconComponent, RippleDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './project-card.component.html',
  host: { class: 'block' }
})
export class ProjectCardComponent {
  protected readonly i18n = inject(TranslationService);
  readonly project = input.required<Project>();
  readonly open = output<Project>();

  protected readonly hasImage = computed(() => isImage(this.project().icon));
  protected readonly hasSymbol = computed(() => isSymbol(this.project().icon));

  /** shortSummary is "<Category> — <what it does>"; the card splits it. */
  private readonly parts = computed(() => {
    const [kicker, ...rest] = this.project().shortSummary.split(' — ');
    return rest.length ? { kicker, summary: rest.join(' — ') } : { kicker: '', summary: kicker };
  });
  protected readonly kicker = computed(() => this.parts().kicker);
  protected readonly summary = computed(() => this.parts().summary);

  protected hasFooter(): boolean {
    const p = this.project();
    return Boolean(p.githubUrl || p.hasPrivacyPolicy || p.hasGdprInstructions);
  }
}
