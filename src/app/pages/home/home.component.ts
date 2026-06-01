import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { CmsService } from '../../core/cms.service';
import { TranslationService } from '../../core/translation.service';
import { HeaderComponent } from '../../components/header/header.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { TimelineComponent } from '../../components/timeline/timeline.component';
import { SkillsComponent } from '../../components/skills/skills.component';
import { ProjectsComponent } from '../../components/projects/projects.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    HeroComponent,
    TimelineComponent,
    SkillsComponent,
    ProjectsComponent,
    FooterComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      href="#about"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-gs-crimson-700 focus:px-4 focus:py-2 focus:text-white"
      >{{ i18n.t('common.skipToContent') }}</a
    >

    <div id="top" class="theme-transition flex min-h-screen flex-col">
      <app-header [socials]="profile()?.socials ?? []" />

      <main class="flex-1">
        <app-hero [profile]="profile() ?? null" />
        <app-timeline [milestones]="timeline()" />
        <app-skills [skills]="skills()" />
        <app-projects [projects]="projects()" />
      </main>

      <app-footer [socials]="profile()?.socials ?? []" />
    </div>
  `
})
export class HomeComponent {
  private readonly cms = inject(CmsService);
  protected readonly i18n = inject(TranslationService);

  // Re-fetch localised content whenever the language changes.
  private readonly lang$ = toObservable(this.i18n.lang);

  protected readonly profile = toSignal(
    this.lang$.pipe(switchMap((lang) => this.cms.getProfile(lang)))
  );
  protected readonly timeline = toSignal(
    this.lang$.pipe(switchMap((lang) => this.cms.getTimeline(lang))),
    { initialValue: [] }
  );
  protected readonly projects = toSignal(
    this.lang$.pipe(switchMap((lang) => this.cms.getProjects(lang))),
    { initialValue: [] }
  );
  protected readonly skills = toSignal(this.cms.getSkills(), { initialValue: [] });
}
