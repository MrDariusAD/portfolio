import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Dialog, DialogModule } from 'primeng/dialog';
import { MarkdownComponent } from 'ngx-markdown';
import { Project } from '../../core/models';
import { TranslationService } from '../../core/translation.service';
import { IconComponent, isImage, isSymbol } from '../icon/icon.component';
import { RevealDirective } from '../../directives/reveal.directive';
import { RippleDirective } from '../../directives/ripple.directive';
import { ProjectCardComponent } from './project-card.component';

/** Dialog motion: settle in (240ms), leave faster (150ms). Modals stay centred. */
const OPEN_TRANSITION = '240ms cubic-bezier(0.16, 1, 0.3, 1)';
const CLOSE_TRANSITION = '150ms cubic-bezier(0.16, 1, 0.3, 1)';
/** Enter from just below and slightly smaller — never from scale(0.7). */
const DIALOG_TRANSFORM = 'translateY(8px) scale(0.96)';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    RouterLink,
    DialogModule,
    MarkdownComponent,
    IconComponent,
    RevealDirective,
    RippleDirective,
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
  protected readonly transition = signal(OPEN_TRANSITION);
  protected readonly currentHasImage = computed(() => isImage(this.current()?.icon));
  protected readonly currentHasSymbol = computed(() => isSymbol(this.current()?.icon));

  private readonly dialog = viewChild(Dialog);

  constructor() {
    // PrimeNG has no input for the enter/leave transform; it defaults to scale(0.7).
    effect(() => {
      const d = this.dialog();
      if (d) d.transformOptions = DIALOG_TRANSFORM;
    });
  }

  protected openDialog(project: Project): void {
    this.transition.set(OPEN_TRANSITION);
    this.current.set(project);
    this.visible.set(true);
  }

  /** Trigger the (faster) leave animation; content is cleared in `onHide`. */
  protected close(): void {
    this.transition.set(CLOSE_TRANSITION);
    this.visible.set(false);
  }

  protected onVisibleChange(visible: boolean): void {
    if (!visible) this.transition.set(CLOSE_TRANSITION);
    this.visible.set(visible);
  }

  /** Fired once the leave animation has completed. */
  protected onHide(): void {
    this.current.set(null);
  }
}
