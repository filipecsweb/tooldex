import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Element, ElementContent, Root, RootContent } from 'hast';
import { markdownToHast, markdownToHtml } from 'satteri';
import { bodyProblems, splitBody, splitBodyPlugin } from './body.ts';

const textOf = (n: RootContent | ElementContent): string =>
  n.type === 'text' ? n.value : 'children' in n ? n.children.map(textOf).join('') : '';
/** [heading, text] per section of the page's split of `md`. */
const split = (md: string) =>
  splitBody((markdownToHast(md) as Root).children).flatMap((n) => {
    const kids = (n as Element).children as Element[];
    return kids[0].tagName === 'h2' ? [[textOf(kids[0]), textOf(kids[1]).trim()]] : kids.map((c) => [textOf(c.children[0]), textOf(c.children[1]).trim()]);
  });
const html = (md: string) => (markdownToHtml(md, { hastPlugins: [splitBodyPlugin] }) as { html: string }).html; // the plugin is sync
const FULL = 'Intro one.\n\nIntro two.\n\n**When to use it:** often.\n\n**Caveats**: some.\n';

test('the page splits the labelled paragraphs into cards, label stripped and capitalised', () => {
  assert.deepEqual(split(FULL), [
    ['What it is', 'Intro one.Intro two.'],
    ['When to use it', 'Often.'],
    ['Caveats', 'Some.'],
  ]);
  assert.deepEqual(bodyProblems(FULL), []);
});

test('a missing label, no labels, and text after the last label', () => {
  assert.deepEqual(split('Intro.\n\n__caveats:__ some.'), [['What it is', 'Intro.'], ['Caveats', 'Some.']]);
  assert.deepEqual(split('Only prose.'), [['What it is', 'Only prose.']]);
  assert.deepEqual(split('Intro.\n\n**Caveats:** some.\n\nMore caveat.')[1], ['Caveats', 'Some.More caveat.']);
});

test('capitalises plain words (also in em/strong), never code or links', () => {
  assert.match(html('**Caveats:** `npx foo` runs it.'), /<p><code>npx foo<\/code> runs it\.<\/p>/);
  assert.match(html('**Caveats:** [the docs](https://x.y) say so.'), /<p><a href="https:\/\/x.y">the docs<\/a> say so\.<\/p>/);
  assert.match(html('**Caveats:** *mostly* fine.'), /<p><em>Mostly<\/em> fine\.<\/p>/);
});

test('check reads bodies the way the page does', () => {
  const both = (md: string) => [bodyProblems(md), split(md).map(([h]) => h)];
  // No space after the bold: Markdown does not bold it, so neither reader sees a label.
  assert.deepEqual(both('Intro.\n\n**When to use it:**often.\n\n**Caveats:** some.'), [
    ['body has no **When to use it:** paragraph'],
    ['What it is', 'Caveats'],
  ]);
  // Inside a list item or a fenced code block, a label line is not a labelled paragraph.
  assert.deepEqual(bodyProblems('Intro.\n\n- **When to use it:** often.\n\n**Caveats:** some.'), ['body has no **When to use it:** paragraph']);
  assert.deepEqual(bodyProblems('Intro.\n\n```\n**When to use it:** often.\n```\n\n**Caveats:** some.'), ['body has no **When to use it:** paragraph']);
  // Bold mid-paragraph is not a label.
  assert.deepEqual(bodyProblems('Intro mentions **Caveats:** mid-line.').length, 2);
});

test('check rejects an empty label and a repeated one', () => {
  assert.deepEqual(bodyProblems('Intro.\n\n**When to use it:**\n\n**Caveats:** some.'), ["body's **When to use it:** paragraph is empty"]);
  assert.deepEqual(bodyProblems(FULL + '\n**Caveats:** more.\n'), ['body has 2 **Caveats:** paragraphs; keep one']);
});
