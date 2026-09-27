/** A colour image with its halftone plate printed over it; the plate fades out when the image "develops". */
export default function Ink({ src, ink, className = '', width, height, eager = false, priority = false }: {
  src: string; ink: string | null; className?: string; width: number; height: number; eager?: boolean; priority?: boolean;
}) {
  const loading = eager || priority ? 'eager' : 'lazy';
  // Under a halftone the colour original is hidden until it develops, so it never outranks the visible plate.
  return (
    <span className={`ink ${className}`} data-ink={ink ? '' : undefined}>
      <img className="ink-colour" src={src} width={width} height={height} alt="" loading={loading} decoding="async" fetchPriority={ink ? 'low' : priority ? 'high' : undefined} />
      {ink && <img className="ink-plate" src={ink} width={width} height={height} alt="" loading={loading} decoding="async" fetchPriority={priority ? 'high' : undefined} />}
    </span>
  );
}
