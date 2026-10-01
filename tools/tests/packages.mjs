// Verify the packages as consumers receive them: pack the tarballs, inspect them, install
// them into isolated Vite and Next.js applications, build those, and test them in a browser.
import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, readdir, realpath, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = fileURLToPath(new URL('../../', import.meta.url));
const temporary = await mkdtemp(join(tmpdir(), 'carved-consumers-'));
// The release workflow keeps the verified tarballs to publish exactly them.
const packs = process.env.CARVED_PACK_DIR ?? temporary;
await mkdir(packs, { recursive: true });
const versions = JSON.parse(await readFile(join(root, 'package.json'), 'utf8')).devDependencies;
const environment = { ...process.env, CI: 'true', NEXT_TELEMETRY_DISABLED: '1' };
const run = (command, args, cwd = root) =>
  execFileSync(command, args, { cwd, stdio: 'inherit', env: environment });
const read = (command, args) => execFileSync(command, args, { encoding: 'utf8' });

/** Start a server in its own process group, failing fast if it exits before it answers. */
async function serve(command, args, cwd, url) {
  const server = spawn(command, args, { cwd, env: environment, stdio: 'inherit', detached: true });
  let exited = null;
  server.on('exit', (code) => (exited = code ?? 'signal'));
  const stop = () => {
    try {
      process.kill(-server.pid, 'SIGTERM');
    } catch {
      /* Already stopped. */
    }
  };
  for (const started = Date.now(); Date.now() - started < 60_000;) {
    if (exited !== null) throw new Error(`${command} ${args.join(' ')} exited with ${exited}`);
    try {
      if ((await fetch(url)).ok) return stop;
    } catch {
      /* Still starting. */
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  stop();
  throw new Error(`${url} did not start within a minute`);
}

function inspect(name, archive) {
  const entries = read('tar', ['-tzf', archive]).trim().split('\n');
  const file = (path) => read('tar', ['-xOzf', archive, `package/${path}`]);
  assert(entries.includes('package/LICENSE'), `${name}: LICENSE`);
  assert(entries.includes('package/README.md'), `${name}: README`);
  assert(
    !entries.some((entry) => /\.(test|stories)\.|^package\/src\//.test(entry)),
    `${name}: sources`,
  );
  const manifest = JSON.parse(file('package.json'));
  assert(!JSON.stringify(manifest).includes('workspace:'), `${name}: workspace ranges`);
  const targets = (value) =>
    typeof value === 'string' ? [value] : Object.values(value).flatMap(targets);
  for (const target of targets(manifest.exports))
    assert(entries.includes(`package/${target.slice(2)}`), `${name}: missing export ${target}`);
  assert(manifest.sideEffects.includes('**/*.css'), `${name}: CSS side effects`);
  if (name !== 'react') return;
  // React Server Components: interactive modules are client modules; static content is not.
  for (const entry of entries.filter((path) => /^package\/dist\/[\w-]+\.js$/.test(path))) {
    const module = entry.slice('package/dist/'.length, -3);
    const source = file(`dist/${module}.js`);
    const client = /^['"]use client['"];/.test(source);
    if (module === 'index' || module === 'content') {
      assert(!client, `${module}.js must stay a server-compatible module`);
      if (module === 'content')
        assert(!source.includes('react-aria'), 'content.js imports React Aria');
    } else assert(client, `${module}.js must start with 'use client'`);
  }
}

let browser;
const stops = [];
try {
  const tarballs = {};
  for (const name of ['core', 'react']) {
    const directory = join(root, 'packages', name);
    run('pnpm', ['--dir', directory, 'pack', '--pack-destination', packs]);
    const archive = (await readdir(packs)).find((file) =>
      file.startsWith(`plurid-carved-ui-${name}-`),
    );
    assert(archive, `Missing ${name} archive`);
    tarballs[name] = join(packs, archive);
    inspect(name, tarballs[name]);
    run('pnpm', ['exec', 'publint', directory, '--strict']);
    run('pnpm', [
      'exec',
      'attw',
      tarballs[name],
      '--profile',
      'esm-only',
      '--exclude-entrypoints',
      './styles.css',
      './tokens.json',
    ]);
  }

  browser = await chromium.launch();
  const consumers = [
    { fixture: 'vite', build: 'build', port: 6017 },
    { fixture: 'next', build: 'build', port: 6018 },
    { fixture: 'next', build: 'build:webpack', port: 6019 },
  ];
  for (const { fixture, build, port } of consumers) {
    const label = `${fixture} (${build})`;
    const directory = join(temporary, `${fixture}-${port}`);
    await cp(join(root, 'tools', 'fixtures', fixture), directory, { recursive: true });
    const manifest = JSON.parse(await readFile(join(directory, 'package.json'), 'utf8'));
    manifest.dependencies = {
      '@plurid/carved-ui-core': `file:${tarballs.core}`,
      '@plurid/carved-ui-react': `file:${tarballs.react}`,
      react: versions.react,
      'react-dom': versions['react-dom'],
    };
    manifest.devDependencies = Object.fromEntries(
      ['typescript', '@types/react', '@types/react-dom', '@types/node', fixture].map((name) => [
        name,
        versions[name],
      ]),
    );
    await writeFile(join(directory, 'package.json'), JSON.stringify(manifest, null, 2));
    // The unpublished core package must resolve to its tarball transitively too.
    await writeFile(
      join(directory, 'pnpm-workspace.yaml'),
      JSON.stringify({
        packages: [],
        overrides: { '@plurid/carved-ui-core': `file:${tarballs.core}` },
      }),
    );
    run('pnpm', ['install', '--prefer-offline', '--ignore-scripts'], directory);

    // Overlays only find their themed host when both packages share one React Aria.
    const installed = await realpath(join(directory, 'node_modules/@plurid/carved-ui-react'));
    const carved = createRequire(join(installed, 'package.json'));
    const components = createRequire(carved.resolve('react-aria-components'));
    assert.equal(
      await realpath(carved.resolve('react-aria/PortalProvider')),
      await realpath(components.resolve('react-aria/PortalProvider')),
      `${label}: more than one react-aria instance`,
    );

    run('pnpm', ['run', build], directory);
    const url = `http://127.0.0.1:${port}`;
    stops.push(
      fixture === 'vite'
        ? await serve(
            process.execPath,
            [join(root, 'tools/build/serve.mjs'), join(directory, 'dist'), String(port)],
            root,
            url,
          )
        : await serve(
            'pnpm',
            ['exec', 'next', 'start', '-p', String(port), '-H', '127.0.0.1'],
            directory,
            url,
          ),
    );

    if (fixture === 'next') {
      const html = await (await fetch(url)).text();
      assert.match(html, /Next server component/, `${label}: server-rendered heading`);
      assert.match(html, /carved-portal-host/, `${label}: server-rendered provider`);
    }
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
    await page.goto(url);
    await page.getByRole('button', { name: 'Count 0' }).click();
    const counted = page.getByRole('button', { name: 'Count 1' });
    await counted.waitFor();
    assert.notEqual(
      await counted.evaluate((element) => getComputedStyle(element).boxShadow),
      'none',
      `${label}: the stylesheet must survive production bundling`,
    );
    if (fixture === 'next') {
      await page.getByRole('button', { name: 'Open dialog' }).click();
      const dialog = page.getByRole('dialog', { name: 'Consumer dialog' });
      await dialog.waitFor();
      assert.equal(
        await dialog.evaluate((element) => element.closest('.carved-portal-host') !== null),
        true,
        `${label}: overlays render inside the provider`,
      );
      await page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'hidden' });
    } else {
      const assets = join(directory, 'dist/assets');
      const javascript = (
        await Promise.all(
          (await readdir(assets))
            .filter((file) => file.endsWith('.js'))
            .map((file) => readFile(join(assets, file), 'utf8')),
        )
      ).join('');
      assert(
        !javascript.includes('carved-modal'),
        `${label}: a button-only app must tree-shake dialogs`,
      );
      assert(
        !javascript.includes('carved-toast'),
        `${label}: a button-only app must tree-shake toasts`,
      );
    }
    assert.deepEqual(errors, [], `${label}: console or hydration errors`);
    await page.close();
    stops.pop()();
    console.log(`Verified the ${label} consumer`);
  }
} finally {
  await browser?.close();
  for (const stop of stops) stop();
  await rm(temporary, { recursive: true, force: true });
}
