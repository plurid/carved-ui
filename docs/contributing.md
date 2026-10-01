# Contributing

Use Node 24 or newer and the pnpm version named in `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium firefox webkit
pnpm dev        # the laboratory, at localhost:6006
pnpm dev:site   # the documentation site, at localhost:5173
```

Both run on package source: edits to components, styles, tokens or the theme engine reload immediately.

## Checks

`pnpm check` runs everything CI runs, in order:

| Command                | What it proves                                                                                                                                                                                                 |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm lint`            | ESLint, including the React Hooks rules, and Stylelint                                                                                                                                                         |
| `pnpm format:check`    | Prettier formatting                                                                                                                                                                                            |
| `pnpm typecheck`       | Packages, applications, recipes and tests, in strict mode                                                                                                                                                      |
| `pnpm test`            | The theme engine's guarantees on every preset and 500 random colours; server rendering, depth and locale                                                                                                       |
| `pnpm build`           | Both packages, the laboratory and the prerendered site                                                                                                                                                         |
| `pnpm test:stories`    | Every story's interaction test and an axe scan of the page, in Chromium                                                                                                                                        |
| `pnpm test:browser`    | The laboratory and site in Chromium, Firefox and WebKit: accessibility in every preset, a real-pointer form flow, keyboard, right to left, overlays, mobile, reduced motion, forced colours and site hydration |
| `pnpm verify:packages` | Packs both packages and installs them into fresh Vite and Next.js apps (Turbopack and webpack): exports, types, `'use client'` boundaries, tree-shaking, server rendering and hydration                        |

`pnpm test:visual` compares screenshots of the showcase. Font rendering differs between operating systems, so baselines are kept per platform in `tools/tests/snapshots`, and CI checks the macOS ones. After an intended visual change, run `pnpm test:visual --update-snapshots`, look at every changed image, and commit the ones you approve.

## Writing components

- Build interaction on React Aria, and keep its props visible.
- Compose the material classes rather than writing new shadows. If a component needs a new kind of depth, it probably belongs in `material.css`.
- Give every prop Carved adds a JSDoc comment, and an `@default` if it has one: the site's API tables read them.
- Add a story for each meaningful state, with a `play` test for its behaviour, and an example on the site.
- Keep static content out of client modules: it belongs in `content.tsx`.

## Tokens and themes

Tokens live in `packages/core/src/tokens.ts`. The theme engine's guarantees are tested in `theme.test.ts`; if you change the engine, every guarantee must still hold for the presets and the random sweep.

## Releasing

The packages release together as `next` prereleases.

1. Add a changeset with `pnpm changeset` for any change to the packages' behaviour or API.
2. Run `pnpm version:packages`, then `pnpm install` to refresh the lockfile, and review the versions and changelogs.
3. Run the **Release preview** workflow on `master`. It verifies everything, packs the packages, tests those tarballs in real consumers, and publishes exactly them to npm with provenance.

Publishing uses npm trusted publishing, configured for this repository's release workflow. Until that is set up for both packages, an `NPM_TOKEN` secret in the `npm` environment is used instead. A stable release needs `pnpm exec changeset pre exit`, `publishConfig.tag` set to `latest`, and the release gate updated to allow it.
