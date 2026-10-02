import { test } from 'node:test';
import assert from 'node:assert/strict';
import { captionFor } from './format.ts';

test('captionFor names the source recorded in the provenance note', () => {
  const note = (from: string) => `Sourced, not generated: ${from} (https://example.com), fetched 2026-10-01 with Scrapling and resized.`;
  assert.equal(captionFor(note('repository screenshot')), "The project's README");
  assert.equal(captionFor(note('website screenshot')), "The project's website");
  assert.equal(captionFor('Supplied by hand; recorded 2026-10-01 by scripts/tool.ts.'), null);
  assert.equal(captionFor(undefined), null);
});
