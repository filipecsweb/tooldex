// The directory's filter: search, section, hosts and kinds. Pure, so it runs in the browser and in tests.
import { match, type Searchable } from './match.ts';

export type Filterable = Searchable & { category: string; hosts: string[]; kinds: string[] };
export type Filters = { q: string; section: string; hosts: string[]; kinds: string[] };
type Group = 'section' | 'hosts' | 'kinds';

/** OR inside a group (any picked value), AND between groups. An empty group lets everything through. */
const pass = (t: Filterable, f: Filters, skip?: Group) =>
  (skip === 'section' || !f.section || t.category === f.section) &&
  (skip === 'hosts' || !f.hosts.length || f.hosts.some((h) => t.hosts.includes(h))) &&
  (skip === 'kinds' || !f.kinds.length || f.kinds.some((k) => t.kinds.includes(k)));

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
    for (const t of matched) if (pass(t, f, skip)) for (const v of values(t)) c.set(v, (c.get(v) ?? 0) + 1);
    return c;
  };
  return {
    sections: tally('section', (t) => [t.category]),
    hosts: tally('hosts', (t) => t.hosts),
    kinds: tally('kinds', (t) => t.kinds),
  };
}

/** The options a group shows: values at least one tool uses, by catalog-wide count, then label. */
export function facetOptions<F extends { tag: string; label: string }>(vocabulary: F[], tools: Filterable[], values: (t: Filterable) => string[]) {
  const c = new Map<string, number>();
  for (const t of tools) for (const v of values(t)) c.set(v, (c.get(v) ?? 0) + 1);
  return vocabulary
    .filter((f) => c.has(f.tag))
    .sort((a, b) => c.get(b.tag)! - c.get(a.tag)! || a.label.localeCompare(b.label));
}

/** URL query -> filters and order. Hosts and kinds take a comma list, repeats, or both; unknown values are dropped. */
export function readQuery(search: string, known: { sections: string[]; hosts: string[]; kinds: string[] }) {
  const p = new URLSearchParams(search);
  const list = (key: string, ok: string[]) => [...new Set(p.getAll(key).flatMap((v) => v.split(',')).filter((v) => ok.includes(v)))];
  const section = p.get('section') ?? '';
  return {
    q: p.get('q') ?? '',
    section: known.sections.includes(section) ? section : '',
    hosts: list('host', known.hosts),
    kinds: list('kind', known.kinds),
    order: p.get('order') === 'name' ? ('name' as const) : ('newest' as const),
  };
}

/** Filters and order -> URL query ("" when nothing is set). */
export function writeQuery(f: Filters, order: 'newest' | 'name') {
  const p = new URLSearchParams();
  if (f.q.trim()) p.set('q', f.q.trim());
  if (f.section) p.set('section', f.section);
  if (f.hosts.length) p.set('host', f.hosts.join(','));
  if (f.kinds.length) p.set('kind', f.kinds.join(','));
  if (order === 'name') p.set('order', 'name');
  // Commas stay readable in a shared link (?host=claude-code,codex).
  return p.toString().replaceAll('%2C', ',');
}
