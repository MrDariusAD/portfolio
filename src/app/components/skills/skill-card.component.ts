import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input
} from '@angular/core';
import { NgFor } from '@angular/common';
import { Skill, SkillCategory } from '../../core/models';
import { TranslationService } from '../../core/translation.service';

const CATEGORY_META: Record<
  SkillCategory,
  { labelKey: string; icon: string; classes: string }
> = {
  Languages: {
    labelKey: 'category.languages',
    icon: 'pi pi-code',
    classes: 'bg-gs-crimson-500/10 text-gs-crimson-700 dark:text-gs-crimson-300'
  },
  Frontend: {
    labelKey: 'category.frontend',
    icon: 'pi pi-palette',
    classes: 'bg-gs-gold-400/15 text-gs-gold-700 dark:text-gs-gold-300'
  },
  Backend: {
    labelKey: 'category.backend',
    icon: 'pi pi-sitemap',
    classes: 'bg-sky-500/10 text-sky-700 dark:text-sky-300'
  },
  Cloud: {
    labelKey: 'category.cloud',
    icon: 'pi pi-cloud',
    classes: 'bg-violet-500/10 text-violet-700 dark:text-violet-300'
  },
  Data: {
    labelKey: 'category.data',
    icon: 'pi pi-database',
    classes: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
  },
  Design: {
    labelKey: 'category.design',
    icon: 'pi pi-pencil',
    classes: 'bg-rose-500/10 text-rose-700 dark:text-rose-300'
  }
};

@Component({
  selector: 'app-skill-card',
  standalone: true,
  imports: [NgFor],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="card theme-transition group h-full p-4 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-gs-gold-400 hover:shadow-gold"
    >
      <div class="flex items-start justify-between gap-2">
        <h3 class="font-semibold leading-tight text-content">{{ skill().name }}</h3>
        <span
          class="pill shrink-0 text-[10px] font-semibold"
          [class]="meta().classes"
        >
          <i [class]="meta().icon" class="text-[11px]"></i>{{ i18n.t(meta().labelKey) }}
        </span>
      </div>

      <!-- Proficiency meter -->
      <div class="mt-4">
        <div class="flex items-center justify-between text-xs text-content-muted">
          <span>{{ i18n.t('skills.proficiency') }}</span>
          <span class="font-bold text-content">{{ skill().proficiency }}%</span>
        </div>
        <div
          class="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-surface-muted"
          role="progressbar"
          [attr.aria-valuenow]="skill().proficiency"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div
            class="h-full rounded-full bg-gradient-to-r from-gs-crimson-700 to-gs-gold-500 transition-all duration-700 ease-in-out"
            [style.width.%]="skill().proficiency"
          ></div>
        </div>
      </div>

      <!-- Tags -->
      <div class="mt-4 flex flex-wrap gap-1.5">
        <span
          *ngFor="let tag of skill().tags"
          class="rounded-md border border-hairline px-2 py-0.5 text-[11px] text-content-muted"
        >
          {{ tag }}
        </span>
      </div>
    </article>
  `
})
export class SkillCardComponent {
  protected readonly i18n = inject(TranslationService);
  readonly skill = input.required<Skill>();

  protected readonly meta = computed(() => CATEGORY_META[this.skill().category]);
}
