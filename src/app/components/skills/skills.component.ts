import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Skill, SkillCategory } from '../../core/models';
import { IconRef, skillIcon } from '../../core/skill-icons';
import { TranslationService } from '../../core/translation.service';
import { IconComponent } from '../icon/icon.component';
import { RevealDirective } from '../../directives/reveal.directive';
import { RippleDirective } from '../../directives/ripple.directive';
import { SkillCardComponent } from './skill-card.component';

type CategoryValue = SkillCategory | 'All';
type View = 'bento' | 'grid';
type Sort = 'mix' | 'level' | 'az' | 'category';
type Shape = 'big' | 'tall' | 'wide' | 'sq';

export interface BentoTile {
  skill: Skill;
  shape: Shape;
  face: string;
  icon: IconRef;
  ctx: string;
  tech: string[];
}

const CATEGORY_ORDER: SkillCategory[] = ['Languages', 'Frontend', 'Backend', 'Cloud', 'Data', 'Tools', 'Design'];

/* Bento recipe — level decides the shape, these sequences vary shape and surface
   so the grid reads like a composed page rather than a sorted table. */
const TOP_SHAPES: Shape[] = ['big', 'tall', 'wide', 'tall', 'big', 'wide'];
const TOP_FACES = ['f-night', 'f-crimson', 'f-plain', 'f-gold', 'f-crimson', 'f-night'];
const HI_SHAPES: Shape[] = ['wide', 'sq', 'sq', 'wide', 'sq'];
const SQ_FACES = ['f-plain', 'f-gold', 'f-plain', 'f-rose', 'f-plain', 'f-plain', 'f-gold'];
/** "Mix" order: a hero tile, a couple of smalls, a wide, … so big shapes spread out. */
const RHYTHM = ['T', 'm', 'm', 'H', 'm', 'T', 'H', 'm', 'm', 'H', 'm', 'T', 'm', 'H', 'm'] as const;

/** Tile movement on sort / filter (FLIP), IntMotion "travel". */
const MOVE = { duration: 320, easing: 'cubic-bezier(0.5, 0, 0.2, 1)' };
/** Tiles that newly appear, IntMotion "settle". */
const ENTER = { duration: 220, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' };

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [ReactiveFormsModule, IconComponent, RevealDirective, RippleDirective, SkillCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './skills.component.html'
})
export class SkillsComponent {
  protected readonly i18n = inject(TranslationService);
  private readonly doc = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  readonly skills = input<Skill[]>([]);

  protected readonly search = new FormControl('', { nonNullable: true });
  private readonly searchValue = toSignal(this.search.valueChanges, { initialValue: '' });
  protected readonly query = computed(() => this.searchValue().trim().toLowerCase());

  protected readonly category = signal<CategoryValue>('All');
  protected readonly view = signal<View>('bento');
  protected readonly sort = signal<Sort>('mix');
  /** Bars and rings draw once, when the skills first scroll into view. */
  protected readonly drawn = signal(false);

  private readonly items = viewChild<ElementRef<HTMLElement>>('items');
  private readonly catRow = viewChild<ElementRef<HTMLElement>>('catRow');
  private readonly catActive = viewChild<ElementRef<HTMLElement>>('catActive');
  private catPlaced = false;

  protected readonly categoryOptions = computed(() => {
    const all = this.skills();
    const opts: { label: string; value: CategoryValue; count: number }[] = [
      { label: this.i18n.t('category.all'), value: 'All', count: all.length }
    ];
    for (const c of CATEGORY_ORDER) {
      opts.push({
        label: this.i18n.t(`category.${c.toLowerCase()}`),
        value: c,
        count: all.filter((s) => s.category === c).length
      });
    }
    return opts;
  });

  protected readonly sortOptions = computed(() => [
    { value: 'mix' as Sort, icon: 'shuffle', label: this.i18n.t('skills.sort.mix') },
    { value: 'level' as Sort, icon: 'trending_down', label: this.i18n.t('skills.sort.level') },
    { value: 'az' as Sort, icon: 'sort_by_alpha', label: this.i18n.t('skills.sort.az') },
    { value: 'category' as Sort, icon: 'category', label: this.i18n.t('skills.sort.category') }
  ]);

  protected readonly introText = computed(() =>
    this.i18n.t('skills.intro').replace('{count}', String(this.skills().length))
  );
  protected readonly emptyText = computed(() =>
    this.i18n.t('skills.empty').replace('{query}', this.query())
  );

  /** Shape + surface per skill, assigned over the FULL list so a tile keeps its
      look while filtering and sorting (which is what lets FLIP move it). */
  private readonly looks = computed(() => {
    const map = new Map<string, { shape: Shape; face: string }>();
    let top = 0;
    let hi = 0;
    let sq = 0;
    for (const s of this.skills()) {
      const p = s.proficiency;
      if (p >= 100) {
        map.set(s.id, { shape: TOP_SHAPES[top % TOP_SHAPES.length], face: TOP_FACES[top % TOP_FACES.length] });
        top++;
      } else if (p >= 90) {
        const shape = HI_SHAPES[hi++ % HI_SHAPES.length];
        map.set(s.id, { shape, face: shape === 'wide' ? 'f-plain' : SQ_FACES[sq++ % SQ_FACES.length] });
      } else if (p >= 80) {
        map.set(s.id, { shape: 'sq', face: SQ_FACES[sq++ % SQ_FACES.length] });
      } else {
        map.set(s.id, { shape: 'sq', face: 'f-quiet' });
      }
    }
    return map;
  });

  protected readonly filtered = computed(() => {
    const q = this.query();
    const cat = this.category();
    return this.skills().filter(
      (s) =>
        (cat === 'All' || s.category === cat) &&
        (!q || s.name.toLowerCase().includes(q) || s.tags.some((t) => t.toLowerCase().includes(q)))
    );
  });

  protected readonly ordered = computed<Skill[]>(() => {
    const list = this.filtered();
    const byLevel = (a: Skill, b: Skill) => b.proficiency - a.proficiency || a.name.localeCompare(b.name);
    switch (this.sort()) {
      case 'level':
        return [...list].sort(byLevel);
      case 'az':
        return [...list].sort((a, b) => a.name.localeCompare(b.name));
      case 'category':
        return [...list].sort(
          (a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category) || byLevel(a, b)
        );
      default: {
        const top = list.filter((s) => s.proficiency >= 100);
        const hi = list.filter((s) => s.proficiency >= 90 && s.proficiency < 100);
        const mid = list.filter((s) => s.proficiency >= 80 && s.proficiency < 90);
        const low = list.filter((s) => s.proficiency < 80);
        const queues = { T: top, H: hi, m: mid };
        const out: Skill[] = [];
        for (let k = 0; top.length || hi.length || mid.length; k++) {
          const want = queues[RHYTHM[k % RHYTHM.length]];
          const q = want.length ? want : mid.length ? mid : hi.length ? hi : top;
          out.push(q.shift()!);
        }
        return [...out, ...low];
      }
    }
  });

  protected readonly tiles = computed<BentoTile[]>(() => {
    const looks = this.looks();
    return this.ordered().map((skill) => {
      const look = looks.get(skill.id) ?? { shape: 'sq' as Shape, face: 'f-plain' };
      return { skill, ...look, icon: skillIcon(skill), ctx: skill.tags[0] ?? '', tech: skill.tags.slice(1) };
    });
  });

  constructor() {
    const destroyRef = inject(DestroyRef);

    effect(() => {
      this.category();
      queueMicrotask(() => this.placeCategoryPill());
    });

    // Translated chip labels change width: re-place once they have rendered.
    effect(() => {
      this.i18n.lang();
      afterNextRender(() => this.placeCategoryPill(true), { injector: this.injector });
    });

    // Chip labels change width on a language switch / font load and the row
    // re-wraps on resize: re-place the pill (instantly) once that has rendered.
    afterNextRender(() => {
      const row = this.catRow()?.nativeElement;
      if (!row) return;
      const ro = new ResizeObserver(() => this.placeCategoryPill(true));
      ro.observe(row);
      const watchChips = () => Array.from(row.children).forEach((c) => ro.observe(c));
      watchChips();
      const mo = new MutationObserver(watchChips);
      mo.observe(row, { childList: true });
      destroyRef.onDestroy(() => {
        ro.disconnect();
        mo.disconnect();
      });
    });
  }

  protected setCategory(value: CategoryValue): void {
    if (value === this.category()) return;
    this.animateChange(() => this.category.set(value));
  }

  protected setSort(value: Sort): void {
    if (value === this.sort()) return;
    this.animateChange(() => this.sort.set(value));
  }

  protected setView(value: View): void {
    if (value === this.view()) return;
    this.animateChange(() => this.view.set(value));
  }

  /**
   * FLIP: record where every tile is, apply the change, then play each tile
   * from its old place to its new one. Tiles that are new fade + settle in.
   * Measuring mid-flight includes the running transform, so a quick second
   * change retargets from wherever the tile currently is.
   */
  private animateChange(apply: () => void): void {
    const host = this.items()?.nativeElement;
    const reduce = this.doc.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const before = new Map<string, DOMRect>();
    if (host) {
      for (const el of Array.from(host.querySelectorAll<HTMLElement>('[data-skill]'))) {
        before.set(el.dataset['skill']!, el.getBoundingClientRect());
      }
    }
    apply();
    if (!host) return;

    afterNextRender(
      () => {
        const els = Array.from(host.querySelectorAll<HTMLElement>('[data-skill]'));
        let entering = 0;
        for (const el of els) {
          el.getAnimations().forEach((a) => a.cancel());
          const prev = before.get(el.dataset['skill']!);
          if (prev && !reduce) {
            const now = el.getBoundingClientRect();
            const dx = prev.left - now.left;
            const dy = prev.top - now.top;
            if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
              el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], MOVE);
            }
          } else if (!prev) {
            const delay = Math.min(entering++, 12) * 20;
            el.animate(
              reduce
                ? [{ opacity: 0 }, { opacity: 1 }]
                : [{ opacity: 0, transform: 'translateY(4px) scale(0.97)' }, { opacity: 1, transform: 'none' }],
              { ...ENTER, delay, fill: 'backwards' }
            );
          }
        }
      },
      { injector: this.injector }
    );
  }

  private placeCategoryPill(instant = false): void {
    const row = this.catRow()?.nativeElement;
    const layer = this.catActive()?.nativeElement;
    if (!row || !layer || !row.offsetWidth) return;
    const btn = row.querySelector<HTMLElement>(`[data-cat="${this.category()}"]`);
    if (!btn) return;
    const c = row.getBoundingClientRect();
    const b = btn.getBoundingClientRect();
    const skip = instant || !this.catPlaced;
    if (skip) layer.style.transition = 'none';
    layer.style.clipPath = `inset(${b.top - c.top}px ${c.right - b.right}px ${c.bottom - b.bottom}px ${b.left - c.left}px round 999px)`;
    if (skip) {
      void layer.offsetWidth;
      layer.style.transition = '';
    }
    this.catPlaced = true;
  }
}
