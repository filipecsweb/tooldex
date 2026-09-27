// The only place pages read content from. Counts, category lists and related
// tools all derive from the collections, so nothing per tool lives elsewhere.
import { getCollection, type CollectionEntry } from 'astro:content';

export type Tool = CollectionEntry<'tools'>;
export type Category = CollectionEntry<'categories'> & { count: number };

/** Featured first, then newest, then by name. */
export async function getTools(): Promise<Tool[]> {
  const tools = await getCollection('tools');
  // Astro only logs a broken reference(); fail the build instead.
  const ids = new Set((await getCollection('categories')).map((c) => c.id));
  const broken = tools.filter((t) => !ids.has(t.data.category.id));
  if (broken.length)
    throw new Error(`Unknown category in: ${broken.map((t) => `${t.id} (${t.data.category.id})`).join(', ')}`);
  return tools.sort(
    (a, b) =>
      Number(b.data.featured) - Number(a.data.featured) ||
      b.data.added.getTime() - a.data.added.getTime() ||
      a.data.name.localeCompare(b.data.name),
  );
}

/** Only categories that have at least one tool, A to Z by name (getCollection's order isn't stable). */
export async function getCategories(tools?: Tool[]): Promise<Category[]> {
  const all = tools ?? (await getTools());
  const cats = await getCollection('categories');
  return cats
    .map((c) => ({ ...c, count: all.filter((t) => t.data.category.id === c.id).length }))
    .filter((c) => c.count > 0)
    .sort((a, b) => a.data.name.localeCompare(b.data.name));
}

/** Same category scores 10, each shared tag scores 1. Top `limit` with any overlap. */
export function relatedTools(tool: Tool, all: Tool[], limit = 6): Tool[] {
  const tags = new Set(tool.data.tags);
  return all
    .filter((t) => t.id !== tool.id)
    .map((t) => ({
      t,
      score:
        (t.data.category.id === tool.data.category.id ? 10 : 0) +
        t.data.tags.filter((x) => tags.has(x)).length,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.t.data.name.localeCompare(b.t.data.name))
    .slice(0, limit)
    .map((x) => x.t);
}

/** Where the primary call to action goes: the website if there is one, else the repo. */
export const primaryUrl = (t: Tool) => (t.data.website ?? t.data.repo)!;
