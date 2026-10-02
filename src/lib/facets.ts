// The facet vocabulary (src/content/facets.json) is the only place that knows which tags are kinds,
// hosts or pricing. Everything else derives from it. Pure, so the site, the island and the CLI share it.
import facets from '../content/facets.json' with { type: 'json' };

export type Facet = { tag: string; label: string };
/** A facet group: what a tool is, where it runs, what it costs. */
export type FacetGroup = keyof typeof facets;

export const VOCABULARY: Record<FacetGroup, Facet[]> = facets;
/** The groups in vocabulary order, which is the order the directory shows them in. */
export const FACET_GROUPS = Object.keys(VOCABULARY) as FacetGroup[];

/** One value per facet group, from `fn`. */
export const byGroup = <T>(fn: (g: FacetGroup) => T) => Object.fromEntries(FACET_GROUPS.map((g) => [g, fn(g)])) as Record<FacetGroup, T>;

const groupOf = new Map(FACET_GROUPS.flatMap((g) => VOCABULARY[g].map((f) => [f.tag, g] as const)));
const labels = new Map(FACET_GROUPS.flatMap((g) => VOCABULARY[g].map((f) => [f.tag, f.label] as const)));

/** A tool's tags split by facet group, and topics (everything else), in tag order. */
export function splitTags(tags: string[]) {
  const out = { ...byGroup((): string[] => []), topics: [] as string[] };
  for (const t of tags) out[groupOf.get(t) ?? 'topics'].push(t);
  return out;
}

/** The tags a tool shows as badges after its section: its kinds, then its price. */
export function badges(tags: string[]) {
  const { kinds, pricing } = splitTags(tags);
  return [...kinds, ...pricing];
}

/** Facet tags: they say what a tool is, where it runs or what it costs, not what it does. */
export const GENERIC_TAGS = new Set(groupOf.keys());

/** Tags are lowercase kebab-case (CLAUDE.md › Tags). */
export const isTag = (tag: string) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(tag);

/** What `check` reports for a tool's tags (CLAUDE.md › Tags): one not kebab-case or listed twice, no
 *  kind, or not exactly one pricing tag. */
export function tagProblems(tags: unknown[]): string[] {
  const { kinds, pricing } = splitTags([...new Set(tags.filter((t) => typeof t === 'string'))]);
  return [
    ...tags.filter((t) => typeof t !== 'string' || !isTag(t)).map((t) => `tag "${t}" is not lowercase kebab-case`),
    ...new Set(tags.filter((t, i) => tags.indexOf(t) !== i).map((t) => `tag "${t}" is listed more than once`)),
    ...(kinds.length ? [] : [`no kind tag (one of ${VOCABULARY.kinds.map((k) => k.tag).join(', ')}; see src/content/facets.json)`]),
    ...(pricing.length === 1 ? [] : [`needs exactly one pricing tag (${VOCABULARY.pricing.map((p) => p.tag).join(', ')}; see CLAUDE.md › Tags), has ${pricing.length}`]),
  ];
}

/** "mcp" -> "MCP"; a topic tag is its own label. */
export const facetLabel = (tag: string) => labels.get(tag) ?? tag;
