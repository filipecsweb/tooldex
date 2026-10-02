// Display helpers shared by Astro pages and React components.

/** "https://github.com/o/r/" -> "github.com/o/r"; "https://www.site.com/" -> "site.com". */
export function accessLabel(url: string): string {
  const u = new URL(url);
  return `${u.hostname.replace(/^www\./, '')}${u.pathname}`.replace(/\/$/, '');
}

/** What the primary button says. */
export const ctaLabel = (hasWebsite: boolean) => (hasWebsite ? 'Visit the website' : 'View the repository');

const SOURCES = new Map<string, { caption: string; on: 'website' | 'repository' }>([
  ['website og:image', { caption: "The project's own preview image", on: 'website' }],
  ['website screenshot', { caption: "The project's website", on: 'website' }],
  ['repository screenshot', { caption: "The project's README", on: 'repository' }],
  ['repo social preview', { caption: "The repository's social preview", on: 'repository' }],
  ['README image', { caption: "From the project's README", on: 'repository' }],
]);

/** Where an entry's screenshot came from (its caption, and whether it's from the website or the repository),
 *  read from the thumbnail's provenance note: "Sourced, not generated: <source> (<url>)…", written by
 *  scripts/tool.ts or by hand in the same form. Null when the note names no known source. */
export function thumbSource(provenance: string | undefined) {
  const from = provenance?.match(/^Sourced, not generated: ([^(]+) \(/)?.[1]?.trim();
  return SOURCES.get(from ?? '') ?? null;
}
