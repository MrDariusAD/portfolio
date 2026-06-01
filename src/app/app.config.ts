import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideZoneChangeDetection
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling
} from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideMarkdown } from 'ngx-markdown';

import { routes } from './app.routes';
import { ThemeService } from './core/theme.service';
import { TranslationService } from './core/translation.service';
import { GalatasarayPreset } from './theme/galatasaray.preset';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled'
      })
    ),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    provideMarkdown(),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: GalatasarayPreset,
        options: {
          // Bind PrimeNG dark mode to the same `.dark` class Tailwind uses.
          darkModeSelector: '.dark'
        }
      }
    }),
    // Resolve the theme (persisted choice / OS preference) before first render.
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [ThemeService],
      useFactory: (theme: ThemeService) => () => theme.init()
    },
    // Preload i18n dictionaries and resolve the initial language before render.
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [TranslationService],
      useFactory: (i18n: TranslationService) => () => i18n.init()
    }
  ]
};
