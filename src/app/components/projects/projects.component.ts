import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal
} from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { MarkdownComponent } from 'ngx-markdown';
import { Project } from '../../core/models';
import { TranslationService } from '../../core/translation.service';
import { ProjectCardComponent } from './project-card.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    NgClass,
    NgFor,
    NgIf,
    RouterLink,
    DialogModule,
    MarkdownComponent,
    ProjectCardComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './projects.component.html'
})
export class ProjectsComponent {
  protected readonly i18n = inject(TranslationService);
  readonly projects = input<Project[]>([]);

  /**
   * `visible` drives the open/close (and thus the enter/leave animation), while
   * `current` holds the project shown. We keep `current` populated until the
   * leave animation finishes (`onHide`) so the dialog animates out with its
   * content intact — a true reverse of the open animation.
   */
  protected readonly visible = signal(false);
  protected readonly current = signal<Project | null>(null);

  protected openDialog(project: Project): void {
    this.current.set(project);
    this.visible.set(true);
  }

  /** Trigger the leave animation; content is cleared in `onHide`. */
  protected close(): void {
    this.visible.set(false);
  }

  protected onVisibleChange(visible: boolean): void {
    this.visible.set(visible);
  }

  /** Fired once the leave animation has completed. */
  protected onHide(): void {
    this.current.set(null);
  }

  protected trackById(_: number, p: Project): string {
    return p.id;
  }
}
