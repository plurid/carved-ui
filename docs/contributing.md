# Contribute and release

Use Node 24 LTS and the pnpm version in the root manifest. Install with `pnpm install --frozen-lockfile`. CI uses the same full `pnpm check` on macOS 15 (Arm64) as the screenshot baseline environment. The selected runner remains available in the [GitHub runner catalog](https://github.com/actions/runner-images).

## Workflows

- `pnpm dev`: build tokens/packages, then run Storybook with source hot reload and token regeneration.
- `pnpm build:packages`: generate tokens and theme CSS, emit ESM/declarations, compile CSS, copy licenses.
- `pnpm build`: packages plus a static Storybook under `apps/storybook/dist`.
- `pnpm check`: all static, behavior, accessibility, artifact, consumer and browser checks. Install all Playwright engines first.
- `pnpm format`: format active code/docs; archives and generated outputs are ignored.

There is no root Babel, Rollup, Jest, Lerna, TSLint or CRA configuration. Shared tools live in `tools/config`. Package-specific TypeScript configuration and Storybook configuration remain with their owners. Do not add root dotfiles when a tool supports an explicit config path or a manifest field.

## API and ownership

Use semantic variants and named parts. Prefer native HTML. Delegate difficult interaction to React Aria. Add shared code to core only when it is independent of React and the browser. Keep domain concepts and customized patterns in applications or editable examples. Add meaningful stories and tests to expose state and behavior, not snapshots that merely duplicate markup.

Token JSON is the source of truth. Run package builds after editing it; `pnpm dev` also watches and rebuilds it. Do not edit generated `src/generated` or `dist`. Client modules must retain their module directives in output. Package verification checks this explicitly.

## Versioning

The two public packages are a fixed Changesets release group. The repository is in `next` prerelease mode. Add `pnpm changeset` for public behavior/API changes, run `pnpm version:packages`, then run `pnpm install` to refresh the lockfile. Commit and review the resulting versions and changelogs before publishing. A pure docs/lab change needs no package release.

The initial modernization changeset has already been versioned into `1.0.0-next.0`. Subsequent changes produce further preview versions. To propose a stable v1 release, use `pnpm exec changeset pre exit` and `pnpm version:packages`, update `publishConfig.tag` to `latest`, and separately change/review the release gate. The preview workflow intentionally refuses stable versions.

## Publication

`Release preview` is manually dispatched on `master`. It runs the full verification workflow before rebuilding and publishing the same commit. Configure a GitHub environment named `npm` and an `NPM_TOKEN` secret with publishing access to both packages. Configure environment reviewer protection if the repository requires it. The setup-node action writes npm authentication configuration in the runner's temporary directory, leaving the repository root unchanged.

The workflow publishes only `next` prereleases. It does not automatically open release PRs, merge, publish Storybook or promote a stable release. `pnpm release` offers the same checks plus Changesets publishing locally for an authorized maintainer. Credentials and registry operations remain the maintainer's responsibility.
