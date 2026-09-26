import { test } from 'node:test';
import assert from 'node:assert/strict';
import { match } from './match.ts';

const t = (name: string, tagline = '', tags: string[] = [], categoryName = 'Other') => ({ name, tagline, tags, categoryName });
const items = [
  t('Archify', 'Interactive architecture diagrams', ['diagrams'], 'Design & diagrams'),
  t('No AI Slop', 'Removes AI patterns from writing', ['editing'], 'Writing'),
  t('SkillSpector', 'Scans skills for prompt injection', ['security'], 'Security'),
  t('Diagrammer', 'Another one', [], 'Design & diagrams'),
];
const names = (q: string) => match(items, q).map((x) => x.name);

test('empty query returns everything in order', () => assert.deepEqual(names('  '), items.map((x) => x.name)));
test('all tokens must match', () => assert.deepEqual(names('prompt injection'), ['SkillSpector']));
test('name prefix ranks first, then name contains, then the rest', () =>
  assert.deepEqual(names('diagram'), ['Diagrammer', 'Archify']));
test('matches tags and category names', () => {
  assert.deepEqual(names('editing'), ['No AI Slop']);
  assert.deepEqual(names('security'), ['SkillSpector']);
});
test('case and accents are ignored', () => assert.deepEqual(names('ARCHÏFY'), ['Archify']));
test('no match returns nothing', () => assert.deepEqual(names('zzz'), []));
