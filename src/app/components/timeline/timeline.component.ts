import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal
} from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { TimelineMilestone } from '../../core/models';
import { TranslationService } from '../../core/translation.service';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [NgFor, NgIf, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="timeline" class="scroll-mt-20 border-t border-hairline bg-surface-muted/40">
      <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <header class="max-w-2xl">
          <p class="section-eyebrow">{{ i18n.t('timeline.eyebrow') }}</p>
          <h2 class="section-title mt-2">{{ i18n.t('timeline.title') }}</h2>
          <p class="mt-3 text-content-muted">{{ i18n.t('timeline.intro') }}</p>
        </header>

        <div class="mt-10 grid gap-8 lg:grid-cols-[minmax(0,380px)_1fr]">
          <!-- Node rail (newest first) -->
          <ol
            class="relative ml-3 border-l-2 border-hairline"
            [attr.aria-label]="i18n.t('timeline.ariaMilestones')"
          >
            <li *ngFor="let m of milestones()" class="relative pb-7 pl-7 last:pb-0">
              <!-- Parent node -->
              <div class="flex items-start gap-2">
                <button type="button" (click)="select(m.id)" class="group block flex-1 text-left">
                  <span
                    class="absolute -left-[9px] top-1 grid h-4 w-4 place-items-center rounded-full border-2 transition-all duration-300 ease-in-out"
                    [ngClass]="
                      m.id === selectedId()
                        ? 'border-gs-crimson-700 bg-gs-crimson-700 scale-125 animate-pulse-node'
                        : 'border-hairline bg-surface group-hover:border-gs-gold-400'
                    "
                  ></span>

                  <span
                    class="text-xs font-semibold uppercase tracking-wider transition-colors duration-300"
                    [ngClass]="
                      m.id === selectedId()
                        ? 'text-gs-crimson-700 dark:text-gs-gold-400'
                        : 'text-content-muted'
                    "
                  >
                    {{ m.period }}
                    <span
                      *ngIf="isCurrent(m)"
                      class="ml-1 rounded-full bg-gs-gold-400/20 px-2 py-0.5 text-[10px] text-gs-gold-600 dark:text-gs-gold-300"
                      >{{ i18n.t('timeline.now') }}</span
                    >
                  </span>
                  <span
                    class="mt-0.5 block text-sm font-bold transition-colors duration-300"
                    [ngClass]="
                      m.id === selectedId()
                        ? 'text-content'
                        : 'text-content-muted group-hover:text-content'
                    "
                  >
                    {{ m.role }}
                  </span>
                  <span class="block text-xs text-content-muted">{{ m.organisation }}</span>
                </button>

                <!-- Collapse toggle (only when there are sub-entries) -->
                <button
                  *ngIf="m.children?.length"
                  type="button"
                  (click)="toggle(m.id)"
                  [attr.aria-expanded]="isExpanded(m.id)"
                  [attr.aria-label]="m.organisation + ' — ' + (m.children || []).length + ' entries'"
                  class="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-hairline text-content-muted transition-all duration-300 ease-in-out hover:border-gs-gold-400 hover:text-gs-gold-500"
                >
                  <i
                    class="pi pi-chevron-down text-xs transition-transform duration-300 ease-in-out"
                    [class.rotate-180]="isExpanded(m.id)"
                  ></i>
                </button>
              </div>

              <!-- Nested sub-entries: own indented line, collapsible -->
              <ol
                *ngIf="m.children?.length && isExpanded(m.id)"
                class="relative ml-1 mt-4 animate-fade-in-up border-l-2 border-hairline/70"
              >
                <li *ngFor="let c of m.children" class="relative pb-5 pl-6 last:pb-0">
                  <button type="button" (click)="select(c.id)" class="group block w-full text-left">
                    <span
                      class="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full border-2 transition-all duration-300 ease-in-out"
                      [ngClass]="
                        c.id === selectedId()
                          ? 'border-gs-crimson-600 bg-gs-crimson-600 scale-125'
                          : 'border-hairline bg-surface group-hover:border-gs-gold-400'
                      "
                    ></span>
                    <span class="text-[11px] font-medium uppercase tracking-wider text-content-muted">
                      {{ c.period }}
                      <span
                        *ngIf="isCurrent(c)"
                        class="ml-1 rounded-full bg-gs-gold-400/20 px-1.5 py-0.5 text-[9px] text-gs-gold-600 dark:text-gs-gold-300"
                        >{{ i18n.t('timeline.now') }}</span
                      >
                    </span>
                    <span
                      class="block text-sm font-semibold transition-colors duration-300"
                      [ngClass]="
                        c.id === selectedId()
                          ? 'text-gs-crimson-700 dark:text-gs-gold-400'
                          : 'text-content-muted group-hover:text-content'
                      "
                    >
                      {{ c.organisation }}
                    </span>
                    <span class="block text-xs text-content-muted">{{ c.role }}</span>
                  </button>
                </li>
              </ol>
            </li>
          </ol>

          <!-- Preview panel -->
          <div
            *ngIf="active() as a"
            class="card theme-transition animate-fade-in-up relative overflow-hidden border-l-4 border-l-gs-crimson-600 p-6 dark:bg-gradient-to-br dark:from-surface dark:to-gs-crimson-950/30 sm:p-8"
            [attr.key]="selectedId()"
          >
            <p class="section-eyebrow">{{ a.period }} · {{ a.organisation }}</p>
            <h3 class="mt-2 text-xl font-bold sm:text-2xl">{{ a.title }}</h3>
            <p class="mt-1 text-sm font-semibold text-gs-crimson-700 dark:text-gs-gold-400">
              {{ a.role }}
            </p>
            <p class="mt-4 leading-relaxed text-content-muted">{{ a.summary }}</p>

            <h4 class="mt-6 text-sm font-bold uppercase tracking-wide text-content">
              {{ i18n.t('timeline.responsibilities') }}
            </h4>
            <ul class="mt-3 space-y-2">
              <li
                *ngFor="let r of a.responsibilities"
                class="flex items-start gap-2.5 text-sm text-content-muted"
              >
                <i class="pi pi-angle-right mt-0.5 text-gs-crimson-600"></i>{{ r }}
              </li>
            </ul>

            <h4 class="mt-6 text-sm font-bold uppercase tracking-wide text-content">
              {{ i18n.t('timeline.techStack') }}
            </h4>
            <div class="mt-3 flex flex-wrap gap-2">
              <span
                *ngFor="let t of a.techStack"
                class="pill border border-gs-gold-400/40 bg-gs-gold-400/10 text-content"
              >
                {{ t }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class TimelineComponent {
  protected readonly i18n = inject(TranslationService);
  readonly milestones = input<TimelineMilestone[]>([]);

  protected readonly selectedId = signal<string>('');
  private readonly expandedIds = signal<ReadonlySet<string>>(new Set());

  /** Flattened lookup of every node (parents + children). */
  private readonly flat = computed<TimelineMilestone[]>(() => {
    const out: TimelineMilestone[] = [];
    for (const m of this.milestones()) {
      out.push(m);
      for (const c of m.children ?? []) out.push(c);
    }
    return out;
  });

  protected readonly active = computed(
    () => this.flat().find((n) => n.id === this.selectedId()) ?? this.flat()[0] ?? null
  );

  constructor() {
    // On data load, select the most recent "current" node and expand its parent.
    effect(
      () => {
        const list = this.milestones();
        if (!list.length || this.selectedId()) return;

        for (const m of list) {
          const currentChild = m.children?.find((c) => c.current);
          if (currentChild) {
            this.selectedId.set(currentChild.id);
            this.expandedIds.set(new Set([m.id]));
            return;
          }
          if (m.current) {
            this.selectedId.set(m.id);
            if (m.children?.length) this.expandedIds.set(new Set([m.id]));
            return;
          }
        }
        // Fallback: first (newest) top-level entry.
        this.selectedId.set(list[0].id);
        if (list[0].children?.length) this.expandedIds.set(new Set([list[0].id]));
      },
      { allowSignalWrites: true }
    );
  }

  protected isCurrent(node: TimelineMilestone): boolean {
    return Boolean(node.current);
  }

  protected isExpanded(id: string): boolean {
    return this.expandedIds().has(id);
  }

  protected select(id: string): void {
    this.selectedId.set(id);
  }

  protected toggle(id: string): void {
    const next = new Set(this.expandedIds());
    next.has(id) ? next.delete(id) : next.add(id);
    this.expandedIds.set(next);
  }
}
