import { defineCollection, reference } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

// One folder per tool: src/content/tools/<slug>/{index.md,thumb.webp,icon.png}.
// The folder name is the slug and the URL.
const tools = defineCollection({
  loader: glob({
    pattern: '*/index.md',
    base: './src/content/tools',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: ({ image }) =>
    z
      .object({
        name: z.string().min(1),
        tagline: z.string().min(1).max(160),
        category: reference('categories'),
        tags: z.array(z.string()).default([]),
        repo: z.url().optional(),
        website: z.url().optional(),
        links: z.array(z.object({ label: z.string().min(1), url: z.url() })).default([]),
        thumbnail: image().optional(),
        icon: image().optional(),
        featured: z.boolean().default(false),
        added: z.coerce.date(),
        updated: z.coerce.date().optional(),
      })
      .refine((t) => t.repo || t.website, { message: 'A tool needs a repo, a website, or both' }),
});

const categories = defineCollection({
  loader: file('./src/content/categories.json'),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    // Words matched against a new tool's topics and description by `npm run tool add`.
    keywords: z.array(z.string()),
  }),
});

export const collections = { tools, categories };
