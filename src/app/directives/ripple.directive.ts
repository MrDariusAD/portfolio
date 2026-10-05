import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, inject } from '@angular/core';

/**
 * INT press feedback (M3 ink ripple): an 18% splash of the element's text colour
 * grows from the pointer while it is held, then fades once released. Pairs with
 * the button's own press layer (darker fill, inset shadow). Skipped under
 * reduced motion.
 */
@Directive({
  selector: '[appRipple]',
  standalone: true,
  host: { '(pointerdown)': 'onPointerDown($event)' }
})
export class RippleDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly doc = inject(DOCUMENT);

  protected onPointerDown(e: PointerEvent): void {
    if (e.button !== 0) return;
    const win = this.doc.defaultView;
    if (!win || win.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const el = this.host.nativeElement;
    // The splash must be clipped by the element's own shape.
    const cs = win.getComputedStyle(el);
    if (cs.position === 'static') el.style.position = 'relative';
    if (cs.overflow !== 'hidden') el.style.overflow = 'hidden';

    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    // Big enough to reach the farthest corner from the pointer.
    const radius = Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y));
    const dot = this.doc.createElement('span');
    dot.className = 'int-ripple';
    dot.style.width = dot.style.height = `${radius * 2}px`;
    dot.style.left = `${x - radius}px`;
    dot.style.top = `${y - radius}px`;
    el.appendChild(dot);

    const grow = dot.animate([{ transform: 'scale(0.2)' }, { transform: 'scale(1)' }], {
      duration: 300,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      fill: 'forwards'
    });

    // Fade only after release, and never before the splash has mostly grown.
    const release = () => {
      win.removeEventListener('pointerup', release);
      win.removeEventListener('pointercancel', release);
      const fade = () => {
        dot.animate([{ opacity: 0.18 }, { opacity: 0 }], { duration: 200, easing: 'ease-out', fill: 'forwards' });
        win.setTimeout(() => dot.remove(), 220);
      };
      const elapsed = Number(grow.currentTime ?? 300);
      elapsed >= 150 ? fade() : win.setTimeout(fade, 150 - elapsed);
    };
    win.addEventListener('pointerup', release);
    win.addEventListener('pointercancel', release);
  }
}
