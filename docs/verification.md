# Verification

`pnpm check` is the release readiness command. Its order ensures generated outputs exist before static/package checks and that the static laboratory exists before browser regression tests.

| Command                                 | Evidence                                                                                                                    |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `pnpm build:packages`                   | DTCG generation, shared runtime/CSS presets, ESM, declarations, compiled CSS                                                |
| `pnpm lint` / `pnpm format:check`       | Active code, styles and docs; generated outputs/archives excluded                                                           |
| `pnpm typecheck`                        | Both strict packages, laboratory and editable examples                                                                      |
| `pnpm test`                             | Pure theme validation/contrast and server rendering/depth/semantics                                                         |
| `pnpm test:stories`                     | Browser component behavior and Storybook axe assertions                                                                     |
| `pnpm --filter @carved/storybook build` | Deployable static component laboratory                                                                                      |
| `pnpm verify:packages`                  | Packed exports, CSS/types/licenses, directives, publint/ATTW, Vite tree shaking, Next server/client rendering and hydration |
| `pnpm test:visual`                      | Browser regressions, all themes, mobile, RTL, forced colors, reduced motion and canonical screenshots                       |

Consumer tests install real packed artifacts outside the workspace, without source aliases. Because the core preview is unpublished, the isolated pnpm fixture uses a local tarball override for its transitive dependency. Their dependency installs prefer the root install cache and resolve registry metadata when needed. Temporary files and servers are cleaned up after success or failure.

Type-resolution analysis uses ATTW's `esm-only` profile. Node ESM and bundler resolution must pass. CommonJS/legacy Node resolution is explicitly outside the package contract; CSS/JSON exports are checked structurally and CSS imports are compiled in consumers.

Screenshots live under `tools/tests/snapshots/chromium`. They use Playwright Chromium and macOS 15, Arm64, matching CI. Browser versions are pinned by the lockfile. Only Chromium provides the canonical screenshots; Firefox and WebKit run the behavior and accessibility tests. WebKit's forced-colors test is skipped because that engine does not support Playwright's emulation. These are deliberate coverage boundaries, not passing claims.

To review an intentional visual change, run `pnpm test:visual --update-snapshots`, inspect every changed image, then commit the approved baselines with the change. Do not regenerate baselines merely to silence an unexpected difference. Failure reports and traces are written below `tools/tests` and uploaded by CI.

Vite may report that `use client` directives are discarded in its application bundle; they are not meaningful to a client-only SPA. The library output itself preserves those directives and its Next.js consumer checks their server/client behavior. Current Storybook/Vitest dependencies may emit upstream deprecation notices; no check is disabled for them.

The standalone browser suite disables Storybook's duplicate scanner through an explicit test URL flag and runs its own axe scans, preventing simultaneous axe runs in one frame. Component story scans include the mounted story and overlay containers; upstream transient live-announcer logs are outside that scope.

The manual assistive-technology and zoom checklist is in [accessibility.md](accessibility.md). CI configuration is checked locally but a hosted CI run and authenticated npm publication require the remote repository.
