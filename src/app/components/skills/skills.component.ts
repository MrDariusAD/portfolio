import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal
} from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { InputTextModule } from 'primeng/inputtext';
import { Skill, SkillCategory } from '../../core/models';
import { TranslationService } from '../../core/translation.service';
import { SkillCardComponent } from './skill-card.component';

type CategoryValue = SkillCategory | 'All';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [
    NgClass,
    NgFor,
    NgIf,
    ReactiveFormsModule,
    InputTextModule,
    SkillCardComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './skills.component.html'
})
export class SkillsComponent {
  protected readonly i18n = inject(TranslationService);
  readonly skills = input<Skill[]>([]);

  protected readonly search = new FormControl('', { nonNullable: true });
  private readonly searchValue = toSignal(this.search.valueChanges, {
    initialValue: ''
  });
  protected readonly query = computed(() => this.searchValue().trim().toLowerCase());

  protected readonly category = signal<CategoryValue>('All');

  private readonly categoryKeys: { key: string; value: CategoryValue }[] = [
    { key: 'category.all', value: 'All' },
    { key: 'category.languages', value: 'Languages' },
    { key: 'category.frontend', value: 'Frontend' },
    { key: 'category.backend', value: 'Backend' },
    { key: 'category.cloud', value: 'Cloud' },
    { key: 'category.data', value: 'Data' },
    { key: 'category.tools', value: 'Tools' },
    { key: 'category.design', value: 'Design' }
  ];

  /** Recomputed on language change so the chip labels stay translated. */
  protected readonly categoryOptions = computed(() =>
    this.categoryKeys.map((c) => ({ label: this.i18n.t(c.key), value: c.value }))
  );

  protected readonly introText = computed(() =>
    this.i18n.t('skills.intro').replace('{count}', String(this.skills().length))
  );

  protected readonly emptyText = computed(() =>
    this.i18n.t('skills.empty').replace('{query}', this.query())
  );

  protected readonly filtered = computed(() => {
    const q = this.query();
    const cat = this.category();
    return this.skills().filter((s) => {
      const matchesCat = cat === 'All' || s.category === cat;
      const matchesQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCat && matchesQuery;
    });
  });

  protected setCategory(value: CategoryValue): void {
    this.category.set(value);
  }

  protected trackById(_: number, s: Skill): string {
    return s.id;
  }
}
