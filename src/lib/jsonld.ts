// schema.org builders. URLs are absolute, built from Astro.site.
import type { Tool } from './data';
import { primaryUrl } from './data';
import { SITE } from '../site';

const abs = (path: string, site: URL) => new URL(path, site).href;

export const websiteLd = (site: URL) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE.name,
  url: site.href,
  description: SITE.description,
});

export const breadcrumbLd = (site: URL, trail: [name: string, path: string][]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(path, site) })),
});

export const toolLd = (site: URL, t: Tool, categoryName: string, image?: string) => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: t.data.name,
  description: t.data.tagline,
  url: abs(`/tools/${t.id}`, site),
  sameAs: [t.data.website, t.data.repo].filter(Boolean),
  applicationCategory: 'DeveloperApplication',
  applicationSubCategory: categoryName,
  keywords: t.data.tags.join(', '),
  ...(image && { image: abs(image, site) }),
  downloadUrl: primaryUrl(t),
});

export const itemListLd = (site: URL, tools: Tool[]) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: tools.map((t, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/tools/${t.id}`, site), name: t.data.name })),
});
