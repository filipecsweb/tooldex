// The directory's data shape: what the island, related rows and /tools.json get per tool.
// Only what a row shows and the filter reads. Server-only (getImage runs at build time).
import { getImage } from 'astro:assets';
import type { Category, Tool } from './data';
import { primaryUrl } from './data';
import { splitTags } from './facets';

export type IndexTool = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  categoryName: string;
  tags: string[];
  /** Kind, host and pricing tags (src/content/facets.json), in tag order. */
  kinds: string[];
  hosts: string[];
  pricing: string[];
  url: string;
  icon: string | null;
};

export async function toIndex(tools: Tool[], categories: Category[]): Promise<IndexTool[]> {
  const names = new Map(categories.map((c) => [c.id, c.data.name]));
  return Promise.all(
    tools.map(async (t) => {
      const icon = t.data.icon ? await getImage({ src: t.data.icon, width: 128, format: 'webp' }) : null;
      const { kinds, hosts, pricing } = splitTags(t.data.tags);
      return {
        slug: t.id,
        name: t.data.name,
        tagline: t.data.tagline,
        category: t.data.category.id,
        categoryName: names.get(t.data.category.id) ?? t.data.category.id,
        tags: t.data.tags,
        kinds,
        hosts,
        pricing,
        url: primaryUrl(t),
        icon: icon?.src ?? null,
      };
    }),
  );
}
