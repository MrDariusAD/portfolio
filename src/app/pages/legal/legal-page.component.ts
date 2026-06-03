import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { MarkdownComponent } from 'ngx-markdown';
import { CmsService } from '../../core/cms.service';
import { TranslationService } from '../../core/translation.service';

type LegalKind = 'privacy' | 'gdpr';

/**
 * Renders a project's privacy policy or GDPR instructions from Markdown.
 *
 * Reached only via the deep routes `/projects/:slug/privacy|gdpr`, which are
 * deliberately absent from all site navigation. Content is loaded for the
 * active language and re-fetched when the language is toggled.
 */
@Component({
  selector: 'app-legal-page',
  standalone: true,
  imports: [NgIf, RouterLink, MarkdownComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './legal-page.component.html'
})
export class LegalPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly cms = inject(CmsService);
  protected readonly i18n = inject(TranslationService);

  protected readonly kind = toSignal(
    this.route.data.pipe(map((d) => (d['kind'] as LegalKind) ?? 'privacy')),
    { initialValue: 'privacy' as LegalKind }
  );

  private readonly slug = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('slug') ?? '')),
    { initialValue: '' }
  );

  // Re-fetch when the language changes.
  private readonly projects = toSignal(
    toObservable(this.i18n.lang).pipe(switchMap((lang) => this.cms.getProjects(lang))),
    { initialValue: [] }
  );

  protected readonly vm = computed(() => {
    const project = this.projects().find((p) => p.slug === this.slug());
    const content =
      this.kind() === 'privacy'
        ? project?.privacyPolicyMarkdown
        : project?.gdprInstructionsMarkdown;
    return { project, content };
  });
}
