import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal
} from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { Skill, SkillCategory } from '../../core/models';
import { TranslationService } from '../../core/translation.service';
import { SkillCardComponent } from './skill-card.component';

type CategoryValue = SkillCategory | 'All';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    SelectButtonModule,
    InputTextModule,
    SkillCardComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="skills" class="scroll-mt-20 border-t border-hairline">
      <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <header class="max-w-2xl">
          <p class="section-eyebrow">{{ i18n.t('skills.eyebrow') }}</p>
          <h2 class="section-title mt-2">{{ i18n.t('skills.title') }}</h2>
          <p class="mt-3 text-content-muted">{{ introText() }}</p>
        </header>

        <!-- Controls -->
        <div class="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <span class="relative w-full lg:max-w-sm">
            <i
              class="pi pi-search absolute left-3 top-1/2 z-10 -translate-y-1/2 text-content-muted"
            ></i>
            <input
              type="text"
              pInputText
              [formControl]="search"
              [placeholder]="i18n.t('skills.searchPlaceholder')"
              class="w-full !pl-10"
              [attr.aria-label]="i18n.t('skills.searchAria')"
            />
          </span>

          <p-selectButton
            [options]="categoryOptions()"
            [(ngModel)]="activeCategory"
            optionLabel="label"
            optionValue="value"
            [allowEmpty]="false"
            (onChange)="onCategoryChange($event.value)"
            styleClass="category-select"
            [attr.aria-label]="i18n.t('skills.filterAria')"
          />
        </div>

        <!-- Result count -->
        <p class="mt-6 text-sm text-content-muted">
          {{ i18n.t('skills.showing') }}
          <span class="font-semibold text-content">{{ filtered().length }}</span>
          {{ filtered().length === 1 ? i18n.t('skills.skill') : i18n.t('skills.skills') }}
        </p>

        <!-- Grid -->
        <div
          *ngIf="filtered().length; else empty"
          class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <app-skill-card *ngFor="let s of filtered(); trackBy: trackById" [skill]="s" />
        </div>

        <ng-template #empty>
          <div class="mt-4 card p-10 text-center text-content-muted">
            <i class="pi pi-inbox mb-3 text-3xl text-gs-gold-500"></i>
            <p>{{ emptyText() }}</p>
          </div>
        </ng-template>
      </div>
    </section>
  `
})
export class SkillsComponent {
  protected readonly i18n = inject(TranslationService);
  readonly skills = input<Skill[]>([]);

  protected readonly search = new FormControl('', { nonNullable: true });
  private readonly searchValue = toSignal(this.search.valueChanges, {
    initialValue: ''
  });
  protected readonly query = computed(() => this.searchValue().trim().toLowerCase());

  protected activeCategory: CategoryValue = 'All';
  private readonly category = signal<CategoryValue>('All');

  private readonly categoryKeys: { key: string; value: CategoryValue }[] = [
    { key: 'category.all', value: 'All' },
    { key: 'category.frontend', value: 'Frontend' },
    { key: 'category.backend', value: 'Backend' },
    { key: 'category.databases', value: 'Databases' },
    { key: 'category.devops', value: 'DevOps' },
    { key: 'category.tools', value: 'Tools_Design' }
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

  protected onCategoryChange(value: CategoryValue): void {
    this.category.set(value ?? 'All');
  }

  protected trackById(_: number, s: Skill): string {
    return s.id;
  }
}
