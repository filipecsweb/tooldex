import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handNote, sourcedNote, thumbNote, thumbNoteProblem, thumbSource } from './provenance.ts';

const sidecar = (prompt: unknown) => JSON.stringify({ prompt, createdAt: '2026-10-02T00:00:00.000Z' });

test('thumbSource reads the source sourcedNote writes, and notes written by hand in the same form', () => {
  assert.deepEqual(thumbSource(thumbNote('README image', 'https://example.com/a.png', '2026-10-02')), { caption: "From the project's README", alt: 'an image from its README' });
  assert.equal(thumbSource('Sourced, not generated: repository screenshot (https://github.com/o/r), fetched 2026-10-02 with Scrapling and resized.')?.alt, 'as shown in its README');
  assert.equal(thumbSource('Sourced, not generated: README image (https://example.com/a.gif), frame 520 picked by hand, cropped.')?.alt, 'an image from its README');
  assert.equal(thumbSource('Sourced, not generated: README image (), fetched by hand.'), null);
  assert.deepEqual(
    ['website og:image', 'website screenshot', 'repository screenshot', 'repo social preview', 'README image'].map((from) => thumbSource(sourcedNote(from, 'https://example.com', '2026-10-02'))?.alt),
    ['its own preview image', 'as shown on its website', 'as shown in its README', "its repository's social preview", 'an image from its README'],
  );
  assert.equal(thumbSource(sourcedNote('README screenshot', 'https://example.com', '2026-10-02')), null);
  assert.equal(thumbSource(sourcedNote('constructor', 'https://example.com', '2026-10-02')), null);
  assert.equal(thumbSource(handNote('2026-10-02')), null);
  assert.equal(thumbSource(undefined), null);
  assert.equal(thumbSource(123), null);
});

test('thumbNoteProblem accepts the notes the tool page can read and names the rest', () => {
  assert.equal(thumbNoteProblem(sidecar(sourcedNote('website og:image', 'https://example.com/og.png', '2026-10-02'))), null);
  assert.equal(thumbNoteProblem(sidecar(handNote('2026-10-02'))), null);
  assert.match(thumbNoteProblem(sidecar(sourcedNote('README screenshot', 'https://example.com', '2026-10-02')))!, /^"prompt" must read/);
  assert.match(thumbNoteProblem(sidecar('Supplied by handcrafted capture (https://example.com)'))!, /^"prompt" must read/);
  assert.match(thumbNoteProblem(sidecar(undefined))!, /^"prompt" must read/);
  assert.match(thumbNoteProblem(sidecar(123))!, /^"prompt" must read/);
  assert.equal(thumbNoteProblem('{"prompt": "x",}'), 'not valid JSON');
});
