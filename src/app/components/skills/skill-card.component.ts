import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Skill } from '../../core/models';
import { IconRef } from '../../core/skill-icons';
import { TranslationService } from '../../core/translation.service';
import { IconComponent } from '../icon/icon.component';

/** Grid-view skill card: name, level, meter, context tag first. */
@Component({
  selector: 'app-skill-card',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './skill-card.component.html',
  host: { class: 'block' }
})
export class SkillCardComponent {
  protected readonly i18n = inject(TranslationService);
  readonly skill = input.required<Skill>();
  readonly icon = input<IconRef>({});
}
