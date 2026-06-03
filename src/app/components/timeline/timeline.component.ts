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
  templateUrl: './timeline.component.html'
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
