import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BRANDS, SYMBOLS } from '../../core/icons.generated';

/**
 * Inline SVG icon. `name` is a Material Symbols Rounded glyph, `brand` a Simple
 * Icons mark (see scripts/gen-icons.mjs for the shipped set). Sized by
 * `font-size` and coloured by `currentColor`, like an icon font.
 */
@Component({
  selector: 'app-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon.component.html',
  host: { class: 'int-icon', 'aria-hidden': 'true' }
})
export class IconComponent {
  readonly name = input<string>();
  readonly brand = input<string>();

  protected readonly glyph = computed(() => {
    const brand = this.brand();
    if (brand && BRANDS[brand]) return { viewBox: '0 0 24 24', d: BRANDS[brand].path };
    const name = this.name();
    if (name && SYMBOLS[name]) return { viewBox: '0 -960 960 960', d: SYMBOLS[name] };
    return null;
  });
}

/** True when `value` is an image path (a project's real app icon in /public). */
export function isImage(value: string | undefined | null): boolean {
  return Boolean(value && /\.(png|svg|webp|jpe?g)$/i.test(value));
}

/** True when `value` is a shipped Material Symbol (vs. e.g. a legacy emoji). */
export function isSymbol(value: string | undefined | null): boolean {
  return Boolean(value && SYMBOLS[value]);
}
