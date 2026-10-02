// The directory's filter: search, section and the facet groups. Pure, so it runs in the browser and in tests.
import { FACET_GROUPS, VOCABULARY, byGroup, type FacetGroup } from './facets.ts';
import { match, type Searchable } from './match.ts';

/** Per facet group: its URL parameter, its heading, and whether its options keep the vocabulary's order
 *  (a scale, such as price) instead of going by count. */
export const FACETS: Record<FacetGroup, { param: string; legend: string; scale?: boolean }> = {
  hosts: { param: 'host', legend: 'Works with' },
  kinds: { param: 'kind', legend: 'Kind' },
  pricing: { param: 'price', legend: 'Price', scale: true },
};

export type Filterable = Searchable & { category: string } & Record<FacetGroup, string[]>;
export type Filters = { q: string; section: string } & Record<FacetGroup, string[]>;
type Group = 'section' | FacetGroup;

/** OR inside a group (any picked value), AND between groups. An empty group lets everything through. */
const pass = (t: Filterable, f: Filters, skip?: Group) =>
  (skip === 'section' || !f.section || t.category === f.section) &&
  FACET_GROUPS.every((g) => skip === g || !f[g].length || f[g].some((v) => t[g].includes(v)));

/** The results, in search rank (or input order without a query). */
export function filterTools<T extends Filterable>(tools: T[], f: Filters): T[] {
  return match(tools, f.q).filter((t) => pass(t, f));
}

/**
 * What each option would give: the search and the other groups applied, the option's own group ignored.
 * Sections are single-select, so a section's count is what picking it instead would show.
 */
export function facetCounts(tools: Filterable[], f: Filters) {
  const matched = match(tools, f.q);
  const tally = (skip: Group, values: (t: Filterable) => string[]) => {
    const c = new Map<string, number>();
    for (const t of matched) if (pass(t, f, skip)) for (const v of new Set(values(t))) c.set(v, (c.get(v) ?? 0) + 1);
    return c;
  };
  return { sections: tally('section', (t) => [t.category]), ...byGroup((g) => tally(g, (t) => t[g])) };
}

/**
 * The options a group shows: values some of `tools` have but not all (one every tool has narrows
 * nothing), by catalog-wide count then label, or in vocabulary order for a scale.
 */
export function facetOptions(group: FacetGroup, tools: Filterable[]) {
  const c = new Map<string, number>();
  for (const t of tools) for (const v of new Set(t[group])) c.set(v, (c.get(v) ?? 0) + 1);
  const used = VOCABULARY[group].filter((f) => c.has(f.tag) && c.get(f.tag)! < tools.length);
  return FACETS[group].scale ? used : used.sort((a, b) => c.get(b.tag)! - c.get(a.tag)! || a.label.localeCompare(b.label));
}

/** URL query -> filters and order. A group takes a comma list, repeats, or both; unknown values are dropped. */
export function readQuery(search: string, known: { sections: string[] } & Record<FacetGroup, string[]>) {
  const p = new URLSearchParams(search);
  const list = (key: string, ok: string[]) => [...new Set(p.getAll(key).flatMap((v) => v.split(',')).filter((v) => ok.includes(v)))];
  const section = p.get('section') ?? '';
  return {
    q: p.get('q') ?? '',
    section: known.sections.includes(section) ? section : '',
    ...byGroup((g) => list(FACETS[g].param, known[g])),
    order: p.get('order') === 'name' ? ('name' as const) : ('newest' as const),
  };
}

/** Filters and order -> URL query ("" when nothing is set). */
export function writeQuery(f: Filters, order: 'newest' | 'name') {
  const p = new URLSearchParams();
  if (f.q.trim()) p.set('q', f.q.trim());
  if (f.section) p.set('section', f.section);
  for (const g of FACET_GROUPS) if (f[g].length) p.set(FACETS[g].param, f[g].join(','));
  if (order === 'name') p.set('order', 'name');
  // Commas stay readable in a shared link (?host=claude-code,codex).
  return p.toString().replaceAll('%2C', ',');
}
