// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Canonicals, sitemap and OG URLs. Swap for the custom domain when there is one.
  site: 'https://tooldex.workers.dev',
  // Static site: no sessions, so no KV namespace gets provisioned on deploy.
  session: false,
  trailingSlash: 'never',
  build: { format: 'file' },
  adapter: cloudflare({ imageService: 'compile' }),
  integrations: [react(), sitemap()],
  server: { port: 4401 },
  vite: {
    plugins: [tailwindcss()],
    server: { allowedHosts: ['.test'] },
  },
});
