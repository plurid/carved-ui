import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { spawn, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from '@playwright/test';
const root = fileURLToPath(new URL('../../', import.meta.url));
const temporary = await mkdtemp(join(tmpdir(), 'carved-consumers-'));
const rootManifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
const run = (command, args, cwd = root) =>
  execFileSync(command, args, {
    cwd,
    stdio: 'inherit',
    env: { ...process.env, CI: 'true', NEXT_TELEMETRY_DISABLED: '1' },
  });
const output = (command, args) => execFileSync(command, args, { encoding: 'utf8' });
let browser;
const servers = [];
try {
  const tarballs = {};
  for (const name of ['core', 'react']) {
    const directory = join(root, 'packages', name);
    run('pnpm', ['--dir', directory, 'pack', '--pack-destination', temporary]);
    const filename = (await readdir(temporary)).find((file) =>
      file.startsWith(`plurid-carved-ui-${name}-`),
    );
    assert(filename, `Missing ${name} archive`);
    const archive = join(temporary, filename);
    tarballs[name] = archive;
    const entries = output('tar', ['-tzf', archive]).trim().split('\n');
    assert(entries.includes('package/dist/LICENSE'));
    assert(entries.includes('package/README.md'));
    assert(!entries.some((entry) => /(?:\.test\.|\.stories\.|^package\/src\/)/.test(entry)));
    const manifest = JSON.parse(output('tar', ['-xOzf', archive, 'package/package.json']));
    assert(
      !JSON.stringify(manifest).includes('workspace:'),
      'Pack must replace workspace dependencies',
    );
    const targets = (value) =>
      typeof value === 'string' ? [value] : Object.values(value).flatMap(targets);
    for (const target of targets(manifest.exports))
      assert(entries.includes(`package/${target.slice(2)}`), `Missing export ${target}`);
    assert(manifest.sideEffects.includes('**/*.css'));
    if (name === 'react')
      for (const module of [
        'actions',
        'fields',
        'collections',
        'overlays',
        'navigation',
        'feedback',
        'provider',
        'avatar',
      ]) {
        assert.match(
          output('tar', ['-xOzf', archive, `package/dist/${module}.js`]),
          /^['"]use client['"];/,
        );
      }
    run('pnpm', ['exec', 'publint', directory, '--strict']);
    run('pnpm', [
      'exec',
      'attw',
      archive,
      '--profile',
      'esm-only',
      '--exclude-entrypoints',
      './styles.css',
      './tokens.json',
      '--no-definitely-typed',
    ]);
  }
  browser = await chromium.launch({ headless: true });
  for (const fixture of ['vite', 'next']) {
    const directory = join(temporary, fixture);
    await cp(join(root, 'tools', 'fixtures', fixture), directory, { recursive: true });
    const manifest = JSON.parse(await readFile(join(directory, 'package.json'), 'utf8'));
    manifest.dependencies = {
      '@plurid/carved-ui-core': `file:${tarballs.core}`,
      '@plurid/carved-ui-react': `file:${tarballs.react}`,
      react: rootManifest.devDependencies.react,
      'react-dom': rootManifest.devDependencies['react-dom'],
    };
    // The unpublished core dependency must resolve to its packed artifact transitively too.
    await writeFile(
      join(directory, 'pnpm-workspace.yaml'),
      JSON.stringify({
        packages: [],
        overrides: { '@plurid/carved-ui-core': `file:${tarballs.core}` },
      }),
    );
    manifest.devDependencies = Object.fromEntries(
      ['typescript', '@types/react', '@types/react-dom', '@types/node', fixture].map((name) => [
        name,
        rootManifest.devDependencies[name],
      ]),
    );
    await writeFile(join(directory, 'package.json'), JSON.stringify(manifest, null, 2));
    run(
      'pnpm',
      ['install', '--prefer-offline', '--ignore-scripts', '--config.minimumReleaseAge=1440'],
      directory,
    );
    run('pnpm', ['build'], directory);
    const port = fixture === 'vite' ? 6017 : 6018;
    const server =
      fixture === 'vite'
        ? spawn(
            process.execPath,
            [join(root, 'tools/build/serve.mjs'), join(directory, 'dist'), String(port)],
            { stdio: 'inherit' },
          )
        : spawn('pnpm', ['exec', 'next', 'start', '-p', String(port), '-H', '127.0.0.1'], {
            cwd: directory,
            stdio: 'inherit',
            env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
          });
    servers.push(server);
    const url = `http://127.0.0.1:${port}`;
    for (let attempt = 0; attempt < 100; attempt++) {
      try {
        const response = await fetch(url);
        if (response.ok) break;
      } catch {
        /* Server is starting. */
      }
      if (attempt === 99) throw new Error(`${fixture} did not start`);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (fixture === 'next')
      assert.match(
        await (await fetch(url)).text(),
        /Next server component/,
        'Heading must render on the server',
      );
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await page.goto(url);
    const button = page.getByRole('button', { name: 'Count 0' });
    await button.click();
    await page.getByRole('button', { name: 'Count 1' }).waitFor();
    assert.notEqual(
      await page
        .getByRole('button', { name: 'Count 1' })
        .evaluate((element) => getComputedStyle(element).backgroundColor),
      'rgba(0, 0, 0, 0)',
      'Stylesheet must survive production bundling',
    );
    if (fixture === 'next') {
      await page.getByRole('button', { name: 'Open dialog' }).click();
      await page.getByRole('dialog', { name: 'Consumer dialog' }).waitFor();
      await page.keyboard.press('Escape');
      await page.getByRole('dialog').waitFor({ state: 'hidden' });
    } else {
      const assets = await readdir(join(directory, 'dist/assets'));
      const javascript = (
        await Promise.all(
          assets
            .filter((file) => file.endsWith('.js'))
            .map((file) => readFile(join(directory, 'dist/assets', file), 'utf8')),
        )
      ).join('');
      assert(!javascript.includes('carved-dialog'), 'Button-only consumer must tree-shake dialogs');
      assert(!javascript.includes('carved-toast'), 'Button-only consumer must tree-shake toasts');
    }
    assert.deepEqual(errors, [], `${fixture} console or hydration errors`);
    await page.close();
    server.kill();
    console.log(`Verified isolated ${fixture} production consumer`);
  }
} finally {
  await browser?.close();
  for (const server of servers) server.kill();
  await rm(temporary, { recursive: true, force: true });
}
