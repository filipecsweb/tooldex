import { test } from 'node:test';
import assert from 'node:assert/strict';
import { facetCounts, facetOptions, filterTools, readQuery, writeQuery, type Filters } from './filter.ts';

const t = (name: string, category: string, hosts: string[], kinds: string[], price = 'free') =>
  ({ name, tagline: '', tags: [...kinds, price, ...hosts], categoryName: category, category, hosts, kinds, pricing: [price] });
const tools = [
  t('Alpha', 'research', ['claude-code', 'codex'], ['skill']),
  t('Beta', 'research', ['claude-code'], ['mcp'], 'freemium'),
  t('Gamma', 'security', ['codex'], ['skill', 'cli']),
  t('Delta', 'security', [], ['app'], 'paid'),
];
const none: Filters = { q: '', section: '', hosts: [], kinds: [], pricing: [] };
const names = (f: Partial<Filters>) => filterTools(tools, { ...none, ...f }).map((x) => x.name);

test('no filters keeps every tool in order', () => assert.deepEqual(names({}), ['Alpha', 'Beta', 'Gamma', 'Delta']));
test('OR inside a group', () => {
  assert.deepEqual(names({ kinds: ['mcp', 'cli'] }), ['Beta', 'Gamma']);
  assert.deepEqual(names({ pricing: ['free', 'freemium'] }), ['Alpha', 'Beta', 'Gamma']);
});
test('AND between groups, the section and the search', () => {
  assert.deepEqual(names({ hosts: ['codex'], kinds: ['skill'] }), ['Alpha', 'Gamma']);
  assert.deepEqual(names({ hosts: ['codex'], section: 'security' }), ['Gamma']);
  assert.deepEqual(names({ hosts: ['claude-code'], q: 'beta' }), ['Beta']);
  assert.deepEqual(names({ kinds: ['skill'], pricing: ['free'] }), ['Alpha', 'Gamma']);
  assert.deepEqual(names({ section: 'security', pricing: ['paid'] }), ['Delta']);
});

test("an option's count ignores its own group and applies the rest", () => {
  const c = facetCounts(tools, { ...none, hosts: ['codex'], kinds: ['skill'] });
  // Hosts: kinds=skill applied, host group ignored -> Alpha, Gamma.
  assert.equal(c.hosts.get('claude-code'), 1);
  assert.equal(c.hosts.get('codex'), 2);
  // Kinds: host=codex applied -> Alpha, Gamma.
  assert.equal(c.kinds.get('cli'), 1);
  assert.equal(c.kinds.get('mcp'), undefined);
  // Sections: both groups applied, section ignored.
  assert.equal(c.sections.get('research'), 1);
  assert.equal(c.sections.get('security'), 1);
  // Price: hosts and kinds applied -> Alpha, Gamma, both free.
  assert.equal(c.pricing.get('free'), 2);
  assert.equal(c.pricing.get('paid'), undefined);
});
test('host and kind counts apply the section', () => {
  const c = facetCounts(tools, { ...none, section: 'security' });
  assert.equal(c.hosts.get('codex'), 1);
  assert.equal(c.hosts.get('claude-code'), undefined);
  assert.equal(c.kinds.get('skill'), 1);
  assert.equal(c.kinds.get('app'), 1);
});
test('section counts ignore the selected section and apply the rest', () => {
  const c = facetCounts(tools, { ...none, section: 'research', kinds: ['skill'] });
  assert.equal(c.sections.get('research'), 1);
  assert.equal(c.sections.get('security'), 1);
});
test('counts follow the search', () => assert.equal(facetCounts(tools, { ...none, q: 'gamma' }).kinds.get('skill'), 1));

test('options: used values, by catalog count then label; a scale keeps its own order', () => {
  assert.deepEqual(facetOptions('kinds', tools).map((f) => f.tag), ['skill', 'app', 'cli', 'mcp']);
  assert.deepEqual(facetOptions('pricing', [tools[3], tools[3], tools[1]]).map((f) => f.tag), ['freemium', 'paid']);
});
test('options: one every tool has narrows nothing, so it is left out', () => {
  assert.deepEqual(facetOptions('pricing', [tools[0], tools[2]]), []);
  assert.deepEqual(facetOptions('hosts', [tools[0], tools[1]]).map((f) => f.tag), ['codex']);
});

const known = { sections: ['research', 'security'], hosts: ['claude-code', 'codex'], kinds: ['skill', 'mcp'], pricing: ['free', 'paid'] };
test('URL round-trips', () => {
  const f = { q: 'diagrams', section: 'research', hosts: ['claude-code', 'codex'], kinds: ['skill'], pricing: ['free', 'paid'] };
  const qs = writeQuery(f, 'name');
  assert.equal(qs, 'q=diagrams&section=research&host=claude-code,codex&kind=skill&price=free,paid&order=name');
  assert.deepEqual(readQuery(`?${qs}`, known), { ...f, order: 'name' });
  assert.equal(writeQuery(none, 'newest'), '');
});
test('URL round-trips a query with commas and spaces', () => {
  const f = { q: 'diagrams, sequence charts', section: '', hosts: ['codex'], kinds: [], pricing: [] };
  assert.deepEqual(readQuery(`?${writeQuery(f, 'newest')}`, known), { ...f, order: 'newest' });
});
test('URL: repeated parameters and comma lists both work', () => {
  const r = readQuery('?host=codex&host=claude-code&kind=skill,mcp&kind=skill', known);
  assert.deepEqual(r.hosts, ['codex', 'claude-code']);
  assert.deepEqual(r.kinds, ['skill', 'mcp']);
});
test('URL: unknown values are ignored', () =>
  assert.deepEqual(readQuery('?section=nope&host=codex,zed,codex&kind=bogus&price=cheap,free&order=x', known), {
    q: '', section: '', hosts: ['codex'], kinds: [], pricing: ['free'], order: 'newest',
  }));
