// Refuse to publish anything but a `next` prerelease from the preview workflow.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

for (const name of ['core', 'react']) {
  const manifest = JSON.parse(
    await readFile(new URL(`../../packages/${name}/package.json`, import.meta.url), 'utf8'),
  );
  assert.match(
    manifest.version,
    /^1\.\d+\.\d+-next\.\d+$/,
    `${manifest.name} must be a next prerelease`,
  );
  assert.equal(manifest.publishConfig.tag, 'next', `${manifest.name} must publish to the next tag`);
}
console.log('Release gate passed: both packages are next prereleases.');
