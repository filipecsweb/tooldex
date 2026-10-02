// The provenance note every image carries ("prompt" in a thumbnail's thumb.webp.json, a text chunk in icon.png),
// which impeccable's provenance scan reads. scripts/tool.ts writes it; the tool page reads a thumbnail's note
// for its caption and alt text; `check` holds every thumbnail note to the form the page can read.

/** Key impeccable's provenance scanner reads in a PNG's text chunk (a WebP's note goes in its .json sidecar). */
export const PROVENANCE_KEY = 'impeccable:prompt';

const SOURCED = 'Sourced, not generated:';
const HAND = 'Supplied by hand;';

/** Where a thumbnail can come from (the label its note names): the caption under the picture, and its alt text
 *  after the tool's name. Hand-captured screenshots use the two screenshot labels. */
const SOURCES = {
  'website og:image': { caption: "The project's own preview image", alt: 'its own preview image' },
  'website screenshot': { caption: "The project's website", alt: 'as shown on its website' },
  'repository screenshot': { caption: "The project's README", alt: 'as shown in its README' },
  'repo social preview': { caption: "The repository's social preview", alt: "its repository's social preview" },
  'README image': { caption: "From the project's README", alt: 'an image from its README' },
} as const;
export type ThumbFrom = keyof typeof SOURCES;

/** Note for an image fetched from `src`, `from` naming where (an icon's source has its own labels). */
export const sourcedNote = (from: string, src: string, date: string) =>
  `${SOURCED} ${from} (${src}), fetched ${date} by scripts/tool.ts and resized.`;

/** Note for a fetched thumbnail: its source must be one the tool page can caption. */
export const thumbNote = (from: ThumbFrom, src: string, date: string) => sourcedNote(from, src, date);

/** Note for an image dropped into the folder by hand; it names no source. */
export const handNote = (date: string) => `${HAND} recorded ${date} by scripts/tool.ts.`;

/** The source a thumbnail's note names: `sourcedNote`'s form (label, then a non-empty URL in brackets), also used
 *  for notes written by hand. Null otherwise. */
export function thumbSource(note: unknown) {
  if (typeof note !== 'string' || !note.startsWith(`${SOURCED} `)) return null;
  const from = note.slice(SOURCED.length + 1).match(/^([^(]+) \(\S[^)]*\)/)?.[1].trim();
  return from && Object.hasOwn(SOURCES, from) ? SOURCES[from as ThumbFrom] : null;
}

/** What `check` reports for a thumbnail's sidecar (its raw JSON), or null when the note names a known source
 *  or says the picture was supplied by hand. */
export function thumbNoteProblem(json: string): string | null {
  let note: unknown;
  try { note = JSON.parse(json)?.prompt; } catch { return 'not valid JSON'; }
  if ((typeof note === 'string' && note.startsWith(HAND)) || thumbSource(note)) return null;
  return `"prompt" must read "${SOURCED} <source> (<url>)…" with a source of ${Object.keys(SOURCES).join(', ')}, or start "${HAND}"`;
}
