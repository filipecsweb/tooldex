// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import { satteri } from '@astrojs/markdown-satteri';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import YAML from 'yaml';
import { splitBodyPlugin } from './src/lib/body.ts';

// Sitemap <lastmod>: a tool page's `updated` or `added`; a section page, /categories and the home
// page take the newest of the tools they list. Integrations can't see content collections, so
// this reads the frontmatter directly.
const TOOLS = 'src/content/tools';
const tools = readdirSync(TOOLS, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => {
    const fm = YAML.parse(readFileSync(`${TOOLS}/${d.name}/index.md`, 'utf8').split(/^---$/m)[1]);
    return { slug: d.name, category: fm.category, date: new Date(fm.updated ?? fm.added) };
  });
/** @param {typeof tools} list */
const newest = (list) => new Date(Math.max(...list.map((t) => t.date.getTime()))).toISOString();
/** @param {string} path */
function lastmod(path) {
  const [, kind, slug] = path.split('/');
  if (kind === 'tools') return tools.find((t) => t.slug === slug)?.date.toISOString();
  if (kind === 'categories' && slug) return newest(tools.filter((t) => t.category === slug));
  return newest(tools);
}

// The split's output depends on its own source, on the link constants in format.ts and on the Sätteri version
// that parses the Markdown.
const bodyHash = createHash('sha256')
  .update(readFileSync(new URL('./src/lib/body.ts', import.meta.url)))
  .update(readFileSync(new URL('./src/lib/format.ts', import.meta.url)))
  .update(JSON.parse(readFileSync(new URL('./node_modules/satteri/package.json', import.meta.url), 'utf8')).version)
  .digest('hex')
  .slice(0, 12);

export default defineConfig({
  // Canonicals, sitemap and OG URLs.
  site: 'https://tooldex.hellofilipe.dev',
  // Static site: no sessions, so no KV namespace gets provisioned on deploy.
  session: false,
  trailingSlash: 'never',
  build: { format: 'file' },
  adapter: cloudflare({ imageService: 'compile' }),
  // Tool pages show the write-up's "When to use it" and "Caveats" paragraphs as cards. Astro caches
  // rendered Markdown (node_modules/.astro, which CI build caches can restore) and clears it only
  // when the serialised config changes, so the plugin's name carries a hash of its sources: editing
  // src/lib/body.ts or src/lib/format.ts changes the config and re-renders every body.
  markdown: { processor: satteri({ hastPlugins: [{ ...splitBodyPlugin, name: `${splitBodyPlugin.name}@${bodyHash}` }] }) },
  integrations: [react(), sitemap({ serialize: (item) => ({ ...item, lastmod: lastmod(new URL(item.url).pathname) }) })],
  server: { port: 4401 },
  vite: {
    // Dev gets its own dep cache: `astro check`/`build` re-optimise into the default
    // node_modules/.vite and delete chunks a running dev server still imports (500s).
    cacheDir: process.argv.includes('dev') ? 'node_modules/.vite-dev' : undefined,
    plugins: [tailwindcss()],
    server: { allowedHosts: ['.test'] },
  },
});
