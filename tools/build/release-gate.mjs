import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
for (const packageName of ['core', 'react']) {
  const manifest = JSON.parse(
    await readFile(new URL(`../../packages/${packageName}/package.json`, import.meta.url), 'utf8'),
  );
  assert.match(
    manifest.version,
    /^1\.\d+\.\d+-next\.\d+$/,
    'Preview workflow only publishes next prereleases',
  );
  assert.equal(manifest.publishConfig.tag, 'next');
}
assert(process.env.NODE_AUTH_TOKEN, 'Configure the npm environment NPM_TOKEN before publishing');
console.log('Preview release gate passed');
