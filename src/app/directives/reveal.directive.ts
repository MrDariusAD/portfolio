import { DOCUMENT } from '@angular/common';
import {
  DestroyRef,
  Directive,
  ElementRef,
  afterNextRender,
  inject,
  input,
  output
} from '@angular/core';

/**
 * Reveals an element the first time it scrolls into view: it rests 12px low
 * and transparent, then settles in (420ms, IntMotion "settle"). Elements that
 * are already on screen at load reveal immediately. `revealDelay` staggers
 * siblings in steps of the DS stagger (40ms). Runs once, never on scroll back.
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
  host: { '[style.--i]': 'revealDelay()' }
})
export class RevealDirective {
  readonly revealDelay = input(0);
  readonly revealed = output<void>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly doc = inject(DOCUMENT);

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const el = this.host.nativeElement;
      const win = this.doc.defaultView;
      if (!win || !('IntersectionObserver' in win)) {
        this.revealed.emit();
        return;
      }
      el.classList.add('reveal-pending');

      const io = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          io.disconnect();
          el.classList.add('reveal-in');
          // Next frame, so the pending state is painted before it transitions.
          win.requestAnimationFrame(() => {
            el.classList.remove('reveal-pending');
            this.revealed.emit();
          });
          el.addEventListener(
            'transitionend',
            () => el.classList.remove('reveal-in'),
            { once: true }
          );
        },
        { rootMargin: '0px 0px -10% 0px' }
      );
      io.observe(el);
      destroyRef.onDestroy(() => io.disconnect());
    });
  }
}
