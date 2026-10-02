import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GENERIC_TAGS, HOSTS, KINDS, facetLabel, isTag, splitTags } from './facets.ts';

test('splitTags sorts tags into kinds, hosts and topics, keeping tag order', () => {
  assert.deepEqual(splitTags(['cli', 'mcp', 'claude-code', 'codex', 'web-scraping', 'python']), {
    kinds: ['cli', 'mcp'],
    hosts: ['claude-code', 'codex'],
    topics: ['web-scraping', 'python'],
  });
  assert.deepEqual(splitTags(['self-hosted', 'crm']), { kinds: [], hosts: [], topics: ['self-hosted', 'crm'] });
});

test('facetLabel uses the vocabulary and falls back to the tag', () => {
  assert.equal(facetLabel('mcp'), 'MCP server');
  assert.equal(facetLabel('claude-code'), 'Claude Code');
  assert.equal(facetLabel('self-hosted'), 'self-hosted');
});

test('vocabulary: unique lowercase kebab-case tags, no tag both a kind and a host', () => {
  const tags = [...KINDS, ...HOSTS].map((f) => f.tag);
  assert.equal(new Set(tags).size, tags.length);
  for (const t of tags) assert.ok(isTag(t), t);
  for (const f of [...KINDS, ...HOSTS]) assert.ok(f.label.trim());
  assert.equal(GENERIC_TAGS.size, tags.length);
});

test('isTag accepts lowercase kebab-case only', () => {
  for (const t of ['skill', 'claude-code', 'gpt-5', 'a1']) assert.ok(isTag(t), t);
  for (const t of ['Claude-Code', 'claude_code', 'claude code', '-skill', 'skill-', 'a--b', '']) assert.ok(!isTag(t), t);
});
