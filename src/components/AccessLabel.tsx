import { accessLabel } from '../lib/format';

/** A URL shown as host/path. Lines break after a "/"; a segment wider than the line wraps inside itself. */
export default function AccessLabel({ url }: { url: string }) {
  const parts = accessLabel(url).split('/');
  return (
    <>
      {parts.map((p, i) => (
        // Atomic boxes break between each other, i.e. after the slash; inline-block drops the link's underline, so inherit it.
        <span key={i} className="inline-block max-w-full [text-decoration:inherit]">
          {p}
          {i < parts.length - 1 && '/'}
        </span>
      ))}
    </>
  );
}
