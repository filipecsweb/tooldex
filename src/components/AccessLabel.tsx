import { accessLabel } from '../lib/format';

/** A URL shown as host/path, allowed to wrap only after each "/". */
export default function AccessLabel({ url }: { url: string }) {
  const parts = accessLabel(url).split('/');
  return (
    <>
      {parts.map((p, i) => (
        <span key={i} className="whitespace-nowrap">
          {i > 0 && '/'}
          {i > 0 && <wbr />}
          {p}
        </span>
      ))}
    </>
  );
}
