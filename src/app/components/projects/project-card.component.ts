import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output
} from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Project } from '../../core/models';
import { TranslationService } from '../../core/translation.service';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './project-card.component.html'
})
export class ProjectCardComponent {
  protected readonly i18n = inject(TranslationService);
  readonly project = input.required<Project>();
  readonly open = output<Project>();

  protected hasFooter(): boolean {
    const p = this.project();
    return Boolean(p.githubUrl || p.hasPrivacyPolicy || p.hasGdprInstructions);
  }
}
