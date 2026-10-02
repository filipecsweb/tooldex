import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  botChallenged, classifyHomepage, missingSections, cropBox, goodThumb, guessCategory, normalizeRedirects, parseGithubRepo,
  parseRedirects, pickName, pngFromIco, pngText, pngWithText, readmeImages, slugify,
} from './lib.ts';

test('parseGithubRepo', () => {
  assert.deepEqual(parseGithubRepo('https://github.com/NVIDIA/SkillSpector'), { owner: 'NVIDIA', name: 'SkillSpector' });
  assert.deepEqual(parseGithubRepo('https://github.com/a/b.git'), { owner: 'a', name: 'b' });
  assert.deepEqual(parseGithubRepo('https://github.com/a/b/tree/main/x'), { owner: 'a', name: 'b' });
  assert.equal(parseGithubRepo('https://github.com/sponsors/a'), null);
  assert.equal(parseGithubRepo('https://claude-ads.md'), null);
});

test('classifyHomepage: site roots are websites, deep pages are links', () => {
  assert.deepEqual(classifyHomepage('https://claude-ads.md'), { kind: 'website' });
  assert.deepEqual(classifyHomepage('https://tt-a1i.github.io/archify/'), { kind: 'website' });
  assert.deepEqual(classifyHomepage('https://creatoreconomy.so/p/use-my-no-ai-slop-skill'), { kind: 'link', label: 'Article' });
  assert.deepEqual(classifyHomepage('https://docs.nvidia.com/skills/scanning-agent-skills'), { kind: 'link', label: 'Docs' });
  assert.deepEqual(classifyHomepage('https://example.com/some/page'), { kind: 'link', label: 'Homepage' });
});

test('pickName', () => {
  assert.equal(pickName('🎭 The Agency: AI Specialists Ready to Transform Your Workflow', 'agency-agents'), 'The Agency');
  assert.equal(pickName('/last30days', 'last30days-skill'), 'last30days');
  assert.equal(pickName(undefined, 'archify'), 'archify');
  assert.equal(pickName('A heading that is far too long to be a product name', 'x'), 'x');
});

test('slugify', () => {
  assert.equal(slugify('No AI Slop'), 'no-ai-slop');
  assert.equal(slugify('  Café / Déjà vu! '), 'cafe-deja-vu');
});

test('guessCategory ranks topic matches above text matches', () => {
  const cats = [{ id: 'research', keywords: ['research', 'reddit'] }, { id: 'security', keywords: ['security'] }];
  assert.equal(guessCategory(cats, ['security'], 'a research tool')[0].id, 'security');
  assert.equal(guessCategory(cats, [], 'searches reddit for research')[0].id, 'research');
});

test('readmeImages drops badges and resolves relative paths', () => {
  const md = `![b](https://img.shields.io/x.svg)\n<img src="docs/hero.png" width=800>\n![a](https://github.com/o/r/blob/main/a.gif)\n\`\`\`\n![c](in-code.png)\n\`\`\``;
  assert.deepEqual(readmeImages(md, { owner: 'o', name: 'r' }), [
    'https://raw.githubusercontent.com/o/r/HEAD/docs/hero.png',
    'https://raw.githubusercontent.com/o/r/main/a.gif',
  ]);
});

test('goodThumb and cropBox', () => {
  assert.ok(goodThumb(1200, 630));
  assert.ok(!goodThumb(600, 330)); // too small
  assert.ok(!goodThumb(2000, 400)); // contribution-graph shaped
  assert.deepEqual(cropBox(2000, 1000, 2), { left: 0, top: 0, width: 2000, height: 1000 });
  assert.deepEqual(cropBox(3000, 1000, 2), { left: 500, top: 0, width: 2000, height: 1000 });
  assert.deepEqual(cropBox(1000, 1000, 2), { left: 0, top: 0, width: 1000, height: 500 });
});

test('normalizeRedirects follows chains, drops live sources, rescues dead targets', () => {
  const live = new Set(['/', '/tools/c', '/tools/reused', '/categories/x']);
  const rules = parseRedirects('/tools/a /tools/b 301\n/tools/b /tools/c 301\n/tools/reused /tools/c 301\n/tools/d /categories/gone 301\n/tools/e /categories/x 301');
  assert.deepEqual(
    normalizeRedirects(rules, (p) => live.has(p)).map((r) => `${r.from} ${r.to}`),
    ['/tools/a /tools/c', '/tools/b /tools/c', '/tools/d /', '/tools/e /categories/x'],
  );
});

test('pngFromIco extracts the largest embedded PNG', () => {
  const png = [0x89, 0x50, 0x4e, 0x47, 1, 2, 3];
  const ico = new Uint8Array(6 + 16 + png.length);
  const dv = new DataView(ico.buffer);
  dv.setUint16(2, 1, true); dv.setUint16(4, 1, true);
  ico[6] = 64; dv.setUint32(6 + 8, png.length, true); dv.setUint32(6 + 12, 22, true);
  ico.set(png, 22);
  assert.deepEqual([...pngFromIco(ico)!], png);
  assert.equal(pngFromIco(new Uint8Array([1, 2, 3])), null);
});

test('pngWithText writes, replaces and reads a provenance chunk', async () => {
  const { default: sharp } = await import('sharp');
  const png = await sharp({ create: { width: 2, height: 2, channels: 3, background: '#000' } }).png().toBuffer();
  const once = pngWithText(png, 'impeccable:prompt', 'first');
  const twice = pngWithText(once, 'impeccable:prompt', 'second');
  assert.equal(pngText(twice, 'impeccable:prompt'), 'second');
  assert.equal((await sharp(twice).metadata()).width, 2); // still a valid PNG
});

test('halftone: white prints nothing, black prints most of each cell, mid-grey about half', async () => {
  const { halftone } = await import('./lib.ts');
  const ink = (v: number) => {
    const a = halftone(new Uint8Array(60 * 60).fill(v), 60, 60, 6);
    return a.reduce((s, x) => s + x, 0) / (a.length * 255);
  };
  assert.ok(ink(255) < 0.01);
  assert.ok(ink(0) > 0.7);
  assert.ok(Math.abs(ink(128) - 0.5) < 0.1);
});

test('toneMap stretches the 2nd-98th percentile to full ink-to-paper range', async () => {
  const { toneMap } = await import('./lib.ts');
  const dark = new Uint8Array(100).map((_, i) => 10 + Math.floor(i / 2)); // 10..59
  const out = toneMap(dark);
  assert.equal(out[0], 0); // darkest prints solid
  assert.equal(out[99], 255); // lightest is bare paper
  assert.ok(out[50] > 60 && out[50] < 200);
});

test('toneMap lifts a mostly dark image off solid ink and keeps its lights as paper', async () => {
  const { toneMap } = await import('./lib.ts');
  const ui = new Uint8Array(100).map((_, i) => (i < 90 ? 5 : 250)); // dark UI, a little white text
  const out = toneMap(ui);
  assert.ok(out[0] > 60 && out[0] < 110); // background prints as an open screen, not a slab
  assert.equal(out[99], 255);
});

test('botChallenged only excuses a Cloudflare challenge', () => {
  assert.equal(botChallenged(403, new Headers({ 'cf-mitigated': 'challenge' })), true);
  assert.equal(botChallenged(403, new Headers()), false);
  assert.equal(botChallenged(404, new Headers({ 'cf-mitigated': 'challenge' })), false);
});

test('missingSections finds the write-up paragraphs the body lacks', () => {
  const full = 'Intro.\n\n**When to use it:** often.\n\n**Caveats:** some.\n';
  assert.deepEqual(missingSections(full), []);
  assert.deepEqual(missingSections('Intro.\n\n**When to use it**: often.\n'), ['Caveats']);
  assert.deepEqual(missingSections('Intro mentions **Caveats:** mid-line.'), ['When to use it', 'Caveats']);
});
