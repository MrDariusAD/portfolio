import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  signal
} from '@angular/core';
import { TimelineMilestone } from '../../core/models';
import { TranslationService } from '../../core/translation.service';
import { IconComponent } from '../icon/icon.component';
import { RevealDirective } from '../../directives/reveal.directive';

/** How long the old detail takes to blur out before the new one settles in. */
const SWAP_OUT_MS = 110;

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [IconComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './timeline.component.html'
})
export class TimelineComponent {
  protected readonly i18n = inject(TranslationService);
  readonly milestones = input<TimelineMilestone[]>([]);

  protected readonly selectedId = signal<string>('');
  /** The node the detail panel renders — lags `selectedId` during a swap. */
  protected readonly shownId = signal<string>('');
  protected readonly phase = signal<'idle' | 'out' | 'in-start'>('idle');
  private readonly expandedIds = signal<ReadonlySet<string>>(new Set());
  private swapTimer: ReturnType<typeof setTimeout> | undefined;

  /** Flattened lookup of every node (all levels). */
  private readonly flat = computed<TimelineMilestone[]>(() => {
    const out: TimelineMilestone[] = [];
    const walk = (nodes: TimelineMilestone[]) => {
      for (const n of nodes) {
        out.push(n);
        walk(n.children ?? []);
      }
    };
    walk(this.milestones());
    return out;
  });

  protected readonly active = computed(
    () => this.flat().find((n) => n.id === this.shownId()) ?? this.flat()[0] ?? null
  );

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.swapTimer));

    // On data load, select the main "current" node and expand the path to it.
    effect(
      () => {
        const list = this.milestones();
        if (!list.length || this.selectedId()) return;

        const pick = (node: TimelineMilestone, ...expand: string[]) => {
          this.selectedId.set(node.id);
          this.shownId.set(node.id);
          // Also open the node itself when it has sub-projects (adessoGPT → customers).
          if (node.children?.length) expand.push(node.id);
          this.expandedIds.set(new Set(expand));
        };
        // Several engagements can run at once; the longest-running current one is
        // the main role (e.g. adessoGPT, not a project that started last month).
        const start = (n: TimelineMilestone) => parseInt(n.period, 10) || Number.MAX_SAFE_INTEGER;
        for (const m of list) {
          const current = (m.children ?? []).filter((c) => c.current);
          if (current.length) {
            const main = current.reduce((a, b) => (start(b) < start(a) ? b : a));
            return pick(main, m.id);
          }
          if (m.current) return pick(m);
        }
        pick(list[0]);
      },
      { allowSignalWrites: true }
    );
  }

  protected isExpanded(id: string): boolean {
    return this.expandedIds().has(id);
  }

  /** Select a node; `ancestors` are opened so the selection stays visible. */
  protected select(id: string, ...ancestors: string[]): void {
    for (const a of ancestors) if (!this.isExpanded(a)) this.toggle(a);
    if (id === this.selectedId()) return;
    this.selectedId.set(id);

    // Blur the old detail out, then settle the new one in (interruptible).
    clearTimeout(this.swapTimer);
    this.phase.set('out');
    this.swapTimer = setTimeout(() => {
      this.shownId.set(id);
      this.phase.set('in-start');
      requestAnimationFrame(() => requestAnimationFrame(() => this.phase.set('idle')));
    }, SWAP_OUT_MS);
  }

  protected toggle(id: string): void {
    const next = new Set(this.expandedIds());
    next.has(id) ? next.delete(id) : next.add(id);
    this.expandedIds.set(next);
  }
}
