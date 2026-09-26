// Search used by the directory island. Pure, so it runs in the browser and in tests.

export type Searchable = { name: string; tagline: string; tags: string[]; categoryName: string };

export const normalize = (s: string) =>
  s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase();

/**
 * Every query token must appear in name, tagline, tags or category name.
 * Ranking: name starts with the query, then name contains a token, then the rest.
 * Ties keep the input order (featured, then newest).
 */
// ponytail: linear scan over the in-memory list; fine to ~5k tools, then a prebuilt index (MiniSearch) or D1.
export function match<T extends Searchable>(items: T[], query: string): T[] {
  const q = normalize(query).trim();
  if (!q) return items;
  const tokens = q.split(/\s+/);
  return items
    .map((item, i) => {
      const name = normalize(item.name);
      const hay = `${name} ${normalize(item.tagline)} ${normalize(item.tags.join(' '))} ${normalize(item.categoryName)}`;
      if (!tokens.every((t) => hay.includes(t))) return null;
      const rank = name.startsWith(q) ? 0 : tokens.some((t) => name.includes(t)) ? 1 : 2;
      return { item, rank, i };
    })
    .filter((x): x is { item: T; rank: number; i: number } => x !== null)
    .sort((a, b) => a.rank - b.rank || a.i - b.i)
    .map((x) => x.item);
}
