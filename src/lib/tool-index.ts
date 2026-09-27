// The directory's data shape: what the island and /tools.json get per tool.
// Server-only (getImage runs at build time).
import { getImage } from 'astro:assets';
import type { Category, Tool } from './data';
import { primaryUrl } from './data';
import { inkFor } from './plates';

export type IndexTool = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  categoryName: string;
  tags: string[];
  url: string;
  /** "owner/repo" for repos, the host for websites. Set on composed plates. */
  source: string;
  thumb: { src: string; width: number; height: number } | null;
  icon: string | null;
  /** Halftone plates (null until scripts/plates.ts has run). */
  ink: string | null;
  iconInk: string | null;
};

export async function toIndex(tools: Tool[], categories: Category[]): Promise<IndexTool[]> {
  const names = new Map(categories.map((c) => [c.id, c.data.name]));
  return Promise.all(
    tools.map(async (t) => {
      const thumb = t.data.thumbnail
        ? await getImage({ src: t.data.thumbnail, width: 800, format: 'webp' })
        : null;
      const icon = t.data.icon ? await getImage({ src: t.data.icon, width: 128, format: 'webp' }) : null;
      return {
        slug: t.id,
        name: t.data.name,
        tagline: t.data.tagline,
        category: t.data.category.id,
        categoryName: names.get(t.data.category.id) ?? t.data.category.id,
        tags: t.data.tags,
        url: primaryUrl(t),
        source: t.data.repo ? new URL(t.data.repo).pathname.slice(1) : new URL(t.data.website!).hostname,
        thumb: thumb
          ? { src: thumb.src, width: Number(thumb.attributes.width), height: Number(thumb.attributes.height) }
          : null,
        icon: icon?.src ?? null,
        ink: thumb ? inkFor(t.id, 'thumb') : null,
        iconInk: icon ? inkFor(t.id, 'icon') : null,
      };
    }),
  );
}
