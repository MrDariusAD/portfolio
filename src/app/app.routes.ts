import { Routes } from '@angular/router';

/**
 * Application routes.
 *
 * The landing page is a single composed view. The privacy & GDPR sub-pages live
 * under deep nested trees `/projects/:slug/privacy` and `/projects/:slug/gdpr`.
 *
 * ⚠️ Visibility constraint: these legal routes are intentionally NOT surfaced in
 * any nav bar, menu, header or footer. They are reachable only via links rendered
 * inside the corresponding project card or the action bar of its detail dialog.
 */
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: 'Salih Özdemir — Senior Software Engineer'
  },
  {
    // Hidden legal sub-pages — deep-linked only from project cards / dialogs.
    path: 'projects/:slug',
    children: [
      {
        path: 'privacy',
        loadComponent: () =>
          import('./pages/legal/legal-page.component').then(
            (m) => m.LegalPageComponent
          ),
        data: { kind: 'privacy' },
        title: 'Privacy Policy'
      },
      {
        path: 'gdpr',
        loadComponent: () =>
          import('./pages/legal/legal-page.component').then(
            (m) => m.LegalPageComponent
          ),
        data: { kind: 'gdpr' },
        title: 'GDPR Instructions'
      }
    ]
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
    title: 'Page not found'
  }
];
