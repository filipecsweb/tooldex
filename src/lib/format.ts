// Display helpers shared by Astro pages and React components.

/** "https://github.com/o/r/" -> "github.com/o/r"; "https://www.site.com/" -> "site.com". */
export function accessLabel(url: string): string {
  const u = new URL(url);
  return `${u.hostname.replace(/^www\./, '')}${u.pathname}`.replace(/\/$/, '');
}

/** What the primary button says. */
export const ctaLabel = (hasWebsite: boolean) => (hasWebsite ? 'Visit the website' : 'View the repository');

/** Caption for an entry's screenshot, from the thumbnail's provenance note written by scripts/tool.ts. */
export function captionFor(provenance: string | undefined): string | null {
  if (!provenance) return null;
  if (provenance.startsWith('Supplied by hand')) return null;
  const from = provenance.match(/^Sourced, not generated: ([^(]+) \(/)?.[1]?.trim();
  return (
    {
      'website og:image': "The project's own preview image",
      'website screenshot': "The project's website",
      'repository screenshot': "The project's README",
      'repo social preview': "The repository's social preview",
      'README image': "From the project's README",
    }[from ?? ''] ?? null
  );
}
