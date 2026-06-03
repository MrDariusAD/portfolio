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
  Tools: {
    labelKey: 'category.tools',
    icon: 'pi pi-wrench',
    classes: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300'
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
  templateUrl: './skill-card.component.html'
})
export class SkillCardComponent {
  protected readonly i18n = inject(TranslationService);
  readonly skill = input.required<Skill>();

  protected readonly meta = computed(() => CATEGORY_META[this.skill().category]);
}
