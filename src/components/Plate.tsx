import type React from 'react';
import type { IndexTool } from '../lib/tool-index';

type PlateTool = Pick<IndexTool, 'slug' | 'name' | 'thumb' | 'icon' | 'source'>;

/** A tool's picture: its thumbnail as a halftone plate, or a composed plate when it has none. */
export default function Plate({ tool, developed = false, eager = false }: { tool: PlateTool; developed?: boolean; eager?: boolean }) {
  return (
    <div className="plate" data-developed={developed || undefined} style={{ viewTransitionName: `plate-${tool.slug}` }}>
      {tool.thumb ? (
        <img
          className="plate-img"
          src={tool.thumb.src}
          width={tool.thumb.width}
          height={tool.thumb.height}
          alt=""
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
        />
      ) : (
        <div className="plate-composed">
          {tool.icon ? <img className="plate-icon" src={tool.icon} width={128} height={128} alt="" loading="lazy" decoding="async" /> : <span />}
          <span className="plate-name" style={{ '--len': Math.max(6, ...tool.name.split(/\s+/).map((w) => w.length)) } as React.CSSProperties}>
            {tool.name}
          </span>
          <span className="plate-source">{tool.source}</span>
        </div>
      )}
    </div>
  );
}
