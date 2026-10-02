import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GENERIC_TAGS, VOCABULARY, badges, facetLabel, isTag, splitTags, tagProblems } from './facets.ts';

test('splitTags sorts tags into kinds, hosts, pricing and topics, keeping tag order', () => {
  assert.deepEqual(splitTags(['cli', 'mcp', 'freemium', 'claude-code', 'codex', 'web-scraping', 'python']), {
    kinds: ['cli', 'mcp'],
    hosts: ['claude-code', 'codex'],
    pricing: ['freemium'],
    topics: ['web-scraping', 'python'],
  });
  assert.deepEqual(splitTags(['self-hosted', 'crm']), { kinds: [], hosts: [], pricing: [], topics: ['self-hosted', 'crm'] });
});

test('badges: kinds, then the price, in tag order', () => {
  assert.deepEqual(badges(['claude-code', 'mcp', 'web-scraping', 'freemium', 'cli']), ['mcp', 'cli', 'freemium']);
});

test('facetLabel uses the vocabulary and falls back to the tag', () => {
  assert.equal(facetLabel('mcp'), 'MCP');
  assert.equal(facetLabel('claude-code'), 'Claude Code');
  assert.equal(facetLabel('freemium'), 'Freemium');
  assert.equal(facetLabel('self-hosted'), 'self-hosted');
});

test('vocabulary: unique lowercase kebab-case tags, none in two groups', () => {
  const facets = Object.values(VOCABULARY).flat();
  const tags = facets.map((f) => f.tag);
  assert.equal(new Set(tags).size, tags.length);
  for (const t of tags) assert.ok(isTag(t), t);
  for (const f of facets) assert.ok(f.label.trim());
  assert.equal(GENERIC_TAGS.size, tags.length);
});

test('isTag accepts lowercase kebab-case only', () => {
  for (const t of ['skill', 'claude-code', 'gpt-5', 'a1']) assert.ok(isTag(t), t);
  for (const t of ['Claude-Code', 'claude_code', 'claude code', '-skill', 'skill-', 'a--b', '']) assert.ok(!isTag(t), t);
});

test('tagProblems: a kind and exactly one price; no bad or repeated tags', () => {
  assert.deepEqual(tagProblems(['skill', 'free', 'claude-code', 'diagrams']), []);
  const one = (tags: unknown[]) => tagProblems(tags).map((p) => p.split(' (')[0]);
  assert.deepEqual(one(['free', 'diagrams']), ['no kind tag']);
  assert.deepEqual(one(['skill']), ['needs exactly one pricing tag']);
  assert.deepEqual(one(['skill', 'free', 'paid']), ['needs exactly one pricing tag']);
  assert.deepEqual(one(['skill', 'free', 'free', 'skill']), ['tag "free" is listed more than once', 'tag "skill" is listed more than once']);
  assert.deepEqual(one(['skill', 'free', 'Bad_Tag', 3]), ['tag "Bad_Tag" is not lowercase kebab-case', 'tag "3" is not lowercase kebab-case']);
});
