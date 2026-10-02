// The facet vocabulary (src/content/facets.json) is the only place that knows which tags are
// kinds or hosts. Everything else derives from it. Pure, so the site, the island and the CLI share it.
import facets from '../content/facets.json' with { type: 'json' };

export type Facet = { tag: string; label: string };

export const KINDS: Facet[] = facets.kinds;
export const HOSTS: Facet[] = facets.hosts;

const kindTags = new Set(KINDS.map((f) => f.tag));
const hostTags = new Set(HOSTS.map((f) => f.tag));
const labels = new Map([...KINDS, ...HOSTS].map((f) => [f.tag, f.label]));

/** A tool's tags split into kinds (what it is), hosts (where it runs) and topics (everything else), in tag order. */
export function splitTags(tags: string[]) {
  return {
    kinds: tags.filter((t) => kindTags.has(t)),
    hosts: tags.filter((t) => hostTags.has(t)),
    topics: tags.filter((t) => !kindTags.has(t) && !hostTags.has(t)),
  };
}

/** Kind and host tags: they say what a tool is or where it runs, not what it does. */
export const GENERIC_TAGS = new Set([...kindTags, ...hostTags]);

/** Tags are lowercase kebab-case (CLAUDE.md › Tags). */
export const isTag = (tag: string) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(tag);

/** "mcp" -> "MCP"; a topic tag is its own label. */
export const facetLabel = (tag: string) => labels.get(tag) ?? tag;
