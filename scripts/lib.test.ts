import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  botChallenged, classifyHomepage, cropBox, goodThumb, guessCategory, normalizeRedirects, parseGithubRepo,
  parseRedirects, pickName, pngFromIco, pngText, pngWithText, readmeImages, serializeRedirects, slugify,
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

test('normalizeRedirects follows chains, drops live sources, rescues dead targets, keeps off-site ones', () => {
  const live = new Set(['/', '/tools/c', '/tools/reused', '/categories/x']);
  const rules = parseRedirects('/tools/a /tools/b 301\n/tools/b /tools/c 301\n/tools/reused /tools/c 301\n/tools/d /categories/gone 301\n/tools/e /categories/x 301\n/tools/f https://example.com 301');
  assert.deepEqual(
    normalizeRedirects(rules, (p) => live.has(p)).map((r) => `${r.from} ${r.to}`),
    ['/tools/a /tools/c', '/tools/b /tools/c', '/tools/d /', '/tools/e /categories/x', '/tools/f https://example.com'],
  );
});

test('normalizeRedirects treats /x and /x/ as one source', () => {
  const live = new Set(['/', '/tools/c', '/tools/reused']);
  const rules = parseRedirects('/tools/a /tools/b/ 301\n/tools/a/ /tools/b/ 301\n/tools/b/ /tools/c 301\n/tools/reused/ / 301\n/tools/d / 301\n/tools/d /tools/c 301');
  assert.deepEqual(
    normalizeRedirects(rules, (p) => live.has(p)).map((r) => `${r.from} ${r.to}`),
    ['/tools/a /tools/c', '/tools/b /tools/c', '/tools/d /tools/c'], // twins collapse, a live slash source drops, chains follow a slash target, the later rule wins
  );
});

test('serializeRedirects writes each rule for both forms, and rewriting its output is a no-op', () => {
  const text = serializeRedirects([{ from: '/tools', to: '/', status: '301' }]);
  assert.deepEqual(text.split('\n').slice(1), ['/tools / 301', '/tools/ / 301', '']);
  assert.equal(serializeRedirects(normalizeRedirects(parseRedirects(text), (p) => p === '/')), text);
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

test('botChallenged only excuses a Cloudflare challenge', () => {
  assert.equal(botChallenged(403, new Headers({ 'cf-mitigated': 'challenge' })), true);
  assert.equal(botChallenged(403, new Headers()), false);
  assert.equal(botChallenged(404, new Headers({ 'cf-mitigated': 'challenge' })), false);
});

