import { test } from 'node:test';
import assert from 'node:assert/strict';
import { thumbSource } from './format.ts';

test('thumbSource names the source recorded in the provenance note', () => {
  const note = (from: string) => `Sourced, not generated: ${from} (https://example.com), fetched 2026-10-01 with Scrapling and resized.`;
  assert.deepEqual(thumbSource(note('repository screenshot')), { caption: "The project's README", on: 'repository' });
  const on = (from: string) => thumbSource(note(from))?.on;
  assert.deepEqual(
    ['website og:image', 'website screenshot', 'repository screenshot', 'repo social preview', 'README image'].map(on),
    ['website', 'website', 'repository', 'repository', 'repository'],
  );
  assert.equal(thumbSource('Sourced, not generated: README image (https://example.com), frame 520 picked by hand.')?.on, 'repository');
  assert.equal(thumbSource(note('constructor')), null);
  assert.equal(thumbSource('Supplied by hand; recorded 2026-10-01 by scripts/tool.ts.'), null);
  assert.equal(thumbSource(undefined), null);
});
