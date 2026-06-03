import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { NgFor } from '@angular/common';
import { SocialLink } from '../../core/models';
import { TranslationService } from '../../core/translation.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgFor],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  protected readonly i18n = inject(TranslationService);
  readonly socials = input<SocialLink[]>([]);
  protected readonly year = new Date().getFullYear();
}
