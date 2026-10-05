import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  Injector,
  effect,
  inject,
  input,
  signal,
  viewChild
} from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { SocialLink } from '../../core/models';
import { ThemeService } from '../../core/theme.service';
import { TranslationService } from '../../core/translation.service';
import { IconComponent } from '../icon/icon.component';
import { RippleDirective } from '../../directives/ripple.directive';

interface NavItem {
  key: string;
  fragment: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TooltipModule, IconComponent, RippleDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  protected readonly theme = inject(ThemeService);
  protected readonly i18n = inject(TranslationService);
  private readonly doc = inject(DOCUMENT);

  readonly socials = input<SocialLink[]>([]);

  protected readonly nav: NavItem[] = [
    { key: 'nav.about', fragment: 'about' },
    { key: 'nav.journey', fragment: 'timeline' },
    { key: 'nav.skills', fragment: 'skills' },
    { key: 'nav.projects', fragment: 'projects' }
  ];

  /** Section currently under the header (scroll-spy). */
  protected readonly active = signal('about');
  protected readonly scrolled = signal(false);

  private readonly navRow = viewChild<ElementRef<HTMLElement>>('navRow');
  private readonly navActive = viewChild<ElementRef<HTMLElement>>('navActive');
  private placedOnce = false;

  constructor() {
    const destroyRef = inject(DestroyRef);

    // Move the clipped "active" copy onto the active link whenever it changes.
    effect(() => {
      this.active();
      queueMicrotask(() => this.placeIndicator());
    });

    // A language switch changes every label's width: re-place once the new
    // labels are rendered (the observer below covers font loads and resizes).
    const injector = inject(Injector);
    effect(() => {
      this.i18n.lang();
      afterNextRender(() => this.placeIndicator(true), { injector });
    });

    afterNextRender(() => {
      const win = this.doc.defaultView;
      if (!win) return;
      let frame = 0;
      const update = () => {
        frame = 0;
        this.scrolled.set(win.scrollY > 8);
        const probe = 96; // just below the sticky header
        let current = this.nav[0].fragment;
        for (const item of this.nav) {
          const el = this.doc.getElementById(item.fragment);
          if (el && el.getBoundingClientRect().top <= probe) current = item.fragment;
        }
        // At the very bottom the last section may never reach the probe line.
        if (win.innerHeight + win.scrollY >= this.doc.documentElement.scrollHeight - 4) {
          current = this.nav[this.nav.length - 1].fragment;
        }
        this.active.set(current);
      };
      const onScroll = () => {
        if (!frame) frame = win.requestAnimationFrame(update);
      };
      const ro = new ResizeObserver(() => this.placeIndicator(true));
      const row = this.navRow()?.nativeElement;
      if (row) for (const link of Array.from(row.children)) ro.observe(link);
      win.addEventListener('scroll', onScroll, { passive: true });
      update();
      this.placeIndicator(true);
      destroyRef.onDestroy(() => {
        win.removeEventListener('scroll', onScroll);
        ro.disconnect();
      });
    });
  }

  private placeIndicator(instant = false): void {
    const row = this.navRow()?.nativeElement;
    const layer = this.navActive()?.nativeElement;
    if (!row || !layer) return;
    const link = row.querySelector<HTMLElement>(`[data-fragment="${this.active()}"]`);
    if (!link || !row.offsetWidth) return;
    const c = row.getBoundingClientRect();
    const b = link.getBoundingClientRect();
    const skip = instant || !this.placedOnce;
    if (skip) layer.style.transition = 'none';
    layer.style.clipPath = `inset(${b.top - c.top}px ${c.right - b.right}px ${c.bottom - b.bottom}px ${b.left - c.left}px round 999px)`;
    if (skip) {
      void layer.offsetWidth;
      layer.style.transition = '';
    }
    this.placedOnce = true;
  }
}
