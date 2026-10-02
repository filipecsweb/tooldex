import { test } from 'node:test';
import assert from 'node:assert/strict';
import { facetCounts, facetOptions, filterTools, readQuery, writeQuery, type Filters } from './filter.ts';

const t = (name: string, category: string, hosts: string[], kinds: string[]) =>
  ({ name, tagline: '', tags: [...kinds, ...hosts], categoryName: category, category, hosts, kinds });
const tools = [
  t('Alpha', 'research', ['claude-code', 'codex'], ['skill']),
  t('Beta', 'research', ['claude-code'], ['mcp']),
  t('Gamma', 'security', ['codex'], ['skill', 'cli']),
  t('Delta', 'security', [], ['app']),
];
const none: Filters = { q: '', section: '', hosts: [], kinds: [] };
const names = (f: Partial<Filters>) => filterTools(tools, { ...none, ...f }).map((x) => x.name);

test('no filters keeps every tool in order', () => assert.deepEqual(names({}), ['Alpha', 'Beta', 'Gamma', 'Delta']));
test('OR inside a group', () => assert.deepEqual(names({ kinds: ['mcp', 'cli'] }), ['Beta', 'Gamma']));
test('AND between groups, the section and the search', () => {
  assert.deepEqual(names({ hosts: ['codex'], kinds: ['skill'] }), ['Alpha', 'Gamma']);
  assert.deepEqual(names({ hosts: ['codex'], section: 'security' }), ['Gamma']);
  assert.deepEqual(names({ hosts: ['claude-code'], q: 'beta' }), ['Beta']);
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

test('options: only used values, by catalog count then label', () => {
  const vocab = [{ tag: 'app', label: 'App' }, { tag: 'cli', label: 'CLI' }, { tag: 'skill', label: 'Skill' }, { tag: 'plugin', label: 'Plugin' }];
  assert.deepEqual(facetOptions(vocab, tools, (x) => x.kinds).map((f) => f.tag), ['skill', 'app', 'cli']);
});

const known = { sections: ['research', 'security'], hosts: ['claude-code', 'codex'], kinds: ['skill', 'mcp'] };
test('URL round-trips', () => {
  const f = { q: 'diagrams', section: 'research', hosts: ['claude-code', 'codex'], kinds: ['skill'] };
  const qs = writeQuery(f, 'name');
  assert.equal(qs, 'q=diagrams&section=research&host=claude-code,codex&kind=skill&order=name');
  assert.deepEqual(readQuery(`?${qs}`, known), { ...f, order: 'name' });
  assert.equal(writeQuery(none, 'newest'), '');
});
test('URL round-trips a query with commas and spaces', () => {
  const f = { q: 'diagrams, sequence charts', section: '', hosts: ['codex'], kinds: [] };
  assert.deepEqual(readQuery(`?${writeQuery(f, 'newest')}`, known), { ...f, order: 'newest' });
});
test('URL: repeated parameters and comma lists both work', () => {
  const r = readQuery('?host=codex&host=claude-code&kind=skill,mcp&kind=skill', known);
  assert.deepEqual(r.hosts, ['codex', 'claude-code']);
  assert.deepEqual(r.kinds, ['skill', 'mcp']);
});
test('URL: unknown values are ignored', () =>
  assert.deepEqual(readQuery('?section=nope&host=codex,zed,codex&kind=bogus&order=x', known), {
    q: '', section: '', hosts: ['codex'], kinds: [], order: 'newest',
  }));
