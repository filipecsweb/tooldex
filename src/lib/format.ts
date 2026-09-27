// Display helpers shared by Astro pages and React components.

/** "https://github.com/o/r/" -> "github.com/o/r"; "https://www.site.com/" -> "site.com". */
export function accessLabel(url: string): string {
  const u = new URL(url);
  return `${u.hostname.replace(/^www\./, '')}${u.pathname}`.replace(/\/$/, '');
}

/** What the primary button says. */
export const ctaLabel = (hasWebsite: boolean) => (hasWebsite ? 'Visit the website' : 'View the repository');
