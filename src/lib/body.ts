// A write-up is opening prose plus two labelled paragraphs ("**When to use it:** …", "**Caveats:** …").
// One reading of it serves both readers: the tool page (splitBody, on the tree Astro renders) and
// `check` (bodyProblems, which parses the Markdown to the same kind of tree and reads it the same
// way), so `check` passes exactly the bodies the page can split. A paragraph is labelled when it is
// top-level and opens with bold text that is the label, the colon inside or right after the bold,
// in any case.
import type { Element, ElementContent, Root, RootContent } from 'hast';
import { markdownToHast, type HastPluginDefinition } from 'satteri';

export const BODY_SECTIONS = ['When to use it', 'Caveats'] as const;
export type BodySection = (typeof BODY_SECTIONS)[number];
type Card = { label: BodySection; content: RootContent[] };

/** "When to use it:" or "caveats" -> its canonical label; anything else -> null. */
function sectionLabel(text: string): BodySection | null {
  const t = text.trim().replace(/:$/, '').trim().toLowerCase();
  return BODY_SECTIONS.find((l) => l.toLowerCase() === t) ?? null;
}

const text = (n: RootContent | ElementContent): string =>
  n.type === 'text' ? n.value : 'children' in n ? n.children.map(text).join('') : '';
const blank = (n: RootContent | ElementContent) => n.type === 'text' && !n.value.trim();
const el = (tagName: string, className: string, children: ElementContent[], props: Element['properties'] = {}): Element => ({
  type: 'element',
  tagName,
  properties: { ...(className && { className: className.split(' ') }), ...props },
  children,
});

/** The paragraph's label, when it is a labelled paragraph. */
function labelOf(n: RootContent): BodySection | null {
  if (n.type !== 'element' || n.tagName !== 'p') return null;
  const first = n.children.find((c) => !blank(c));
  return first?.type === 'element' && first.tagName === 'strong' ? sectionLabel(text(first)) : null;
}

/**
 * Drops the ": " the label left behind and upper-cases the first letter, but only when the text
 * opens with plain words (or words in em/strong): code, a link or anything else is left as written.
 */
function capitalise(nodes: ElementContent[]): ElementContent[] {
  const i = nodes.findIndex((n) => n.type !== 'text' || n.value.replace(/^[\s:]+/, ''));
  if (i < 0) return [];
  const [first, ...rest] = nodes.slice(i);
  if (first.type === 'text') {
    const value = first.value.replace(/^[\s:]+/, '');
    return [{ ...first, value: value[0].toUpperCase() + value.slice(1) }, ...rest];
  }
  if (first.type === 'element' && (first.tagName === 'em' || first.tagName === 'strong'))
    return [{ ...first, children: capitalise(first.children) }, ...rest];
  return [first, ...rest];
}

/**
 * The body's top-level nodes, read once for both readers: `intro` is everything before the first
 * labelled paragraph; each labelled paragraph opens a card (its text without the label, plus any
 * unlabelled nodes up to the next label).
 */
function readBody(nodes: readonly RootContent[]): { intro: RootContent[]; cards: Card[] } {
  const intro: RootContent[] = [];
  const cards: Card[] = [];
  for (const n of nodes) {
    if (blank(n)) continue;
    const label = labelOf(n);
    if (label && n.type === 'element') {
      const strong = n.children.findIndex((c) => c.type === 'element');
      const rest = capitalise(n.children.slice(strong + 1));
      cards.push({ label, content: rest.length ? [{ ...n, children: rest }] : [] });
    } else (cards.at(-1)?.content ?? intro).push(n);
  }
  return { intro, cards };
}

/** What `check` reports for a Markdown body: a label missing, repeated, or with nothing after it. */
export function bodyProblems(markdown: string): string[] {
  const { cards } = readBody((markdownToHast(markdown) as Root).children);
  return BODY_SECTIONS.flatMap((label) => {
    const mine = cards.filter((c) => c.label === label);
    if (!mine.length) return [`body has no **${label}:** paragraph`];
    return [
      ...(mine.length > 1 ? [`body has ${mine.length} **${label}:** paragraphs; keep one`] : []),
      ...(mine.some((c) => !c.content.map(text).join('').trim()) ? [`body's **${label}:** paragraph is empty`] : []),
    ];
  });
}

const ICONS: Record<BodySection, string> = {
  'When to use it': '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.5 2.5L16 9.5"/>',
  Caveats: '<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17.2v.1"/>',
};
const slug = (label: string) => label.toLowerCase().replace(/\s+/g, '-');

/**
 * The body regrouped for the page: "What it is" (the intro), then one card per label, its heading
 * the label without the colon. A body missing a label has one card fewer; a body with none is all
 * "What it is". The output carries class hooks only; global.css styles them.
 */
export function splitBody(nodes: readonly RootContent[]): RootContent[] {
  const { intro, cards } = readBody(nodes);
  const out: RootContent[] = [];
  if (intro.length)
    out.push(
      el('section', 'writeup', [
        el('h2', '', [{ type: 'text', value: 'What it is' }], { id: 'what-it-is' }),
        el('div', 'prose', intro as ElementContent[]),
      ], { ariaLabelledBy: ['what-it-is'] }),
    );
  if (cards.length)
    out.push(
      el('div', 'writeup-cards', cards.map(({ label, content }) => {
        const icon = { type: 'raw', value: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[label]}</svg>` } as unknown as ElementContent;
        return el('section', `writeup-card ${slug(label)}`, [
          el('h2', '', [icon, { type: 'text', value: label }], { id: slug(label) }),
          el('div', 'card-text', content as ElementContent[]),
        ], { ariaLabelledBy: [slug(label)] });
      })),
    );
  return out;
}

/** splitBody as a Sätteri hast plugin (markdown.processor in astro.config.mjs, which also keys
 *  Astro's content cache to this file so a change here re-renders every body). */
export const splitBodyPlugin: HastPluginDefinition = {
  name: 'tooldex-split-body',
  after(root, ctx) {
    ctx.replaceNode(root, { ...root, children: splitBody(root.children) } as Root);
  },
};
