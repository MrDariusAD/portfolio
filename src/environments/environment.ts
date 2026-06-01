/**
 * Default (production) environment.
 *
 * Ships with the local mock CMS active so the static GitHub Pages build is
 * fully self-contained. Flip `useRemoteCms` to `true` and point `cmsApiUrl` at
 * a deployed Payload instance to source content live.
 */
export const environment = {
  production: true,
  useRemoteCms: false,
  cmsApiUrl: 'https://cms.example.com/api'
};
