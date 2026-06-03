import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { NgFor } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SocialLink } from '../../core/models';
import { ThemeService } from '../../core/theme.service';
import { TranslationService } from '../../core/translation.service';

interface NavItem {
  key: string;
  fragment: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgFor, ButtonModule, TooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  protected readonly theme = inject(ThemeService);
  protected readonly i18n = inject(TranslationService);

  readonly socials = input<SocialLink[]>([]);

  protected readonly nav: NavItem[] = [
    { key: 'nav.about', fragment: 'about' },
    { key: 'nav.journey', fragment: 'timeline' },
    { key: 'nav.skills', fragment: 'skills' },
    { key: 'nav.projects', fragment: 'projects' }
  ];
}
