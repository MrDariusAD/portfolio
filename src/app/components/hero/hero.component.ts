import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Profile } from '../../core/models';
import { TranslationService } from '../../core/translation.service';
import { IconComponent } from '../icon/icon.component';
import { RippleDirective } from '../../directives/ripple.directive';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [IconComponent, RippleDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.component.html'
})
export class HeroComponent {
  protected readonly i18n = inject(TranslationService);
  readonly profile = input<Profile | null>(null);

  protected firstName(name: string): string {
    return name.split(' ')[0] ?? name;
  }
}
