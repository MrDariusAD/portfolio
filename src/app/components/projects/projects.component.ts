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
  template: `
    <section id="projects" class="scroll-mt-20 border-t border-hairline bg-surface-muted/40 dark:bg-gs-crimson-950/10">
      <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <header class="max-w-2xl">
          <p class="section-eyebrow">{{ i18n.t('projects.eyebrow') }}</p>
          <h2 class="section-title mt-2">{{ i18n.t('projects.title') }}</h2>
          <p class="mt-3 text-content-muted">{{ i18n.t('projects.intro') }}</p>
        </header>

        <div class="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <app-project-card
            *ngFor="let p of projects(); trackBy: trackById"
            [project]="p"
            (open)="openDialog($event)"
          />
        </div>
      </div>
    </section>

    <!-- Detail dialog: chromeless PrimeNG shell, single close + single scroll -->
    <p-dialog
      [visible]="visible()"
      (visibleChange)="onVisibleChange($event)"
      (onHide)="onHide()"
      [modal]="true"
      [dismissableMask]="true"
      [draggable]="false"
      [resizable]="false"
      [style]="{ width: '46rem', maxWidth: '94vw' }"
      [breakpoints]="{ '640px': '94vw' }"
      [closeOnEscape]="true"
      [showHeader]="false"
      [transitionOptions]="'220ms cubic-bezier(0.25, 0.8, 0.25, 1)'"
      [contentStyle]="{ padding: '0', overflow: 'hidden', borderRadius: '1rem' }"
      styleClass="project-dialog"
    >
      <ng-container *ngIf="current() as p">
        <div class="flex max-h-[85vh] flex-col">
          <!-- Branded header band (fixed) -->
          <div
            class="relative flex shrink-0 items-center gap-4 bg-gradient-to-br from-gs-crimson-800 via-gs-crimson-700 to-gs-crimson-900 p-6 text-white"
          >
            <span
              class="grid h-14 w-14 place-items-center rounded-2xl bg-white/15 text-3xl backdrop-blur"
            >
              {{ p.icon || '🚀' }}
            </span>
            <div class="min-w-0 pr-10">
              <h3 class="text-2xl font-extrabold">{{ p.title }}</h3>
              <p class="mt-0.5 text-sm text-white/85">{{ p.shortSummary }}</p>
            </div>
            <button
              type="button"
              (click)="close()"
              aria-label="Close"
              class="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-white transition-colors duration-300 hover:bg-white/25"
            >
              <i class="pi pi-times"></i>
            </button>
          </div>

          <!-- Body (the only scroll region) -->
          <div class="min-h-0 flex-1 overflow-y-auto p-6">
            <markdown
              [data]="p.fullDescription"
              class="prose-portfolio block text-content-muted"
            ></markdown>

            <!-- Tech stack -->
            <h4 class="mt-6 text-sm font-bold uppercase tracking-wide text-content">
              {{ i18n.t('projects.techStack') }}
            </h4>
            <div class="mt-3 flex flex-wrap gap-2">
              <span
                *ngFor="let t of p.techStack"
                class="pill border border-gs-gold-400/40 bg-gs-gold-400/10 text-content"
              >
                {{ t }}
              </span>
            </div>

            <!-- Lifecycle (state machine) -->
            <ng-container *ngIf="p.lifecycle?.length">
              <h4 class="mt-6 text-sm font-bold uppercase tracking-wide text-content">
                {{ i18n.t('projects.lifecycle') }}
              </h4>
              <div class="mt-3 flex flex-wrap items-center gap-1.5">
                <ng-container *ngFor="let state of p.lifecycle; let last = last">
                  <span
                    class="pill border font-mono text-[11px]"
                    [ngClass]="
                      state === 'print failed'
                        ? 'border-amber-400 bg-amber-400/10 text-amber-600 dark:text-amber-300'
                        : 'border-hairline text-content'
                    "
                  >
                    {{ state }}
                  </span>
                  <i
                    *ngIf="!last"
                    class="pi pi-angle-right text-xs text-content-muted"
                  ></i>
                </ng-container>
              </div>
            </ng-container>
          </div>

          <!-- Action bar (fixed): project links only — Code + legal deep-links -->
          <div
            *ngIf="p.githubUrl || p.hasPrivacyPolicy || p.hasGdprInstructions"
            class="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-hairline bg-surface-muted/60 px-6 py-4"
          >
            <div class="flex items-center gap-2">
              <a
                *ngIf="p.githubUrl"
                [href]="p.githubUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 rounded-lg bg-gs-crimson-700 px-3 py-2 text-sm font-semibold text-white transition-colors duration-300 hover:bg-gs-crimson-800"
              >
                <i class="pi pi-github"></i> {{ i18n.t('projects.code') }}
              </a>
            </div>

            <div
              *ngIf="p.hasPrivacyPolicy || p.hasGdprInstructions"
              class="flex items-center gap-3 text-sm"
            >
              <a
                *ngIf="p.hasPrivacyPolicy"
                [routerLink]="['/projects', p.slug, 'privacy']"
                class="inline-flex items-center gap-1.5 text-content-muted transition-colors duration-300 hover:text-gs-gold-600"
              >
                <i class="pi pi-shield"></i> {{ i18n.t('projects.privacyPolicy') }}
              </a>
              <a
                *ngIf="p.hasGdprInstructions"
                [routerLink]="['/projects', p.slug, 'gdpr']"
                class="inline-flex items-center gap-1.5 text-content-muted transition-colors duration-300 hover:text-gs-gold-600"
              >
                <i class="pi pi-book"></i> {{ i18n.t('projects.gdpr') }}
              </a>
            </div>
          </div>
        </div>
      </ng-container>
    </p-dialog>
  `
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
