// Display helpers shared by Astro pages and React components.

/** "https://github.com/o/r/" -> "github.com/o/r"; "https://www.site.com/" -> "site.com". */
export function accessLabel(url: string): string {
  const u = new URL(url);
  return `${u.hostname.replace(/^www\./, '')}${u.pathname}`.replace(/\/$/, '');
}

/** What the primary button says. */
export const ctaLabel = (hasWebsite: boolean) => (hasWebsite ? 'Visit the website' : 'View the repository');

/** Every link off the site opens in a new tab, and its accessible name ends with NEW_TAB to say so. */
export const OFFSITE = { target: '_blank', rel: 'noopener' } as const;
export const NEW_TAB = '(opens in a new tab)';

/** OFFSITE plus the accessible name, `name`, for a link whose visible text can't be its name. */
export const outbound = (name: string) => ({ ...OFFSITE, 'aria-label': `${name} ${NEW_TAB}` });

/** The name of a link that shows a tool's URL as host/path pieces. */
export const visitName = (tool: string, url: string) => `Visit ${tool} at ${accessLabel(url)}`;
