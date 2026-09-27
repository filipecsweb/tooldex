/** A colour image with its halftone plate printed over it; the plate fades out when the image "develops". */
export default function Ink({ src, ink, className = '', width, height, eager = false }: {
  src: string; ink: string | null; className?: string; width: number; height: number; eager?: boolean;
}) {
  const loading = eager ? 'eager' : 'lazy';
  return (
    <span className={`ink ${className}`} data-ink={ink ? '' : undefined}>
      <img className="ink-colour" src={src} width={width} height={height} alt="" loading={loading} decoding="async" />
      {ink && <img className="ink-plate" src={ink} width={width} height={height} alt="" loading={loading} decoding="async" />}
    </span>
  );
}
