// The directory's data shape: what the island and /tools.json get per tool.
// Server-only (getImage runs at build time).
import { getImage } from 'astro:assets';
import type { Category, Tool } from './data';
import { primaryUrl } from './data';

export type IndexTool = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  categoryName: string;
  tags: string[];
  url: string;
  thumb: { src: string; width: number; height: number } | null;
  icon: string | null;
};

export async function toIndex(tools: Tool[], categories: Category[]): Promise<IndexTool[]> {
  const names = new Map(categories.map((c) => [c.id, c.data.name]));
  return Promise.all(
    tools.map(async (t) => {
      const thumb = t.data.thumbnail
        ? await getImage({ src: t.data.thumbnail, width: 800, format: 'webp' })
        : null;
      const icon = t.data.icon ? await getImage({ src: t.data.icon, width: 64, format: 'webp' }) : null;
      return {
        slug: t.id,
        name: t.data.name,
        tagline: t.data.tagline,
        category: t.data.category.id,
        categoryName: names.get(t.data.category.id) ?? t.data.category.id,
        tags: t.data.tags,
        url: primaryUrl(t),
        thumb: thumb
          ? { src: thumb.src, width: Number(thumb.attributes.width), height: Number(thumb.attributes.height) }
          : null,
        icon: icon?.src ?? null,
      };
    }),
  );
}
