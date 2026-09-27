import type React from 'react';
import type { IndexTool } from '../lib/tool-index';
import Ink from './Ink';

type PlateTool = Pick<IndexTool, 'slug' | 'name' | 'thumb' | 'icon' | 'ink' | 'iconInk' | 'source'>;

/** A tool's picture: its thumbnail printed as a halftone plate, or a composed plate when it has none. */
export default function Plate({ tool, developed = false, eager = false, quiet = false }: { tool: PlateTool; developed?: boolean; eager?: boolean; quiet?: boolean }) {
  return (
    <div className="plate" data-developed={developed || undefined}>
      {tool.thumb ? (
        <Ink className="plate-full" src={tool.thumb.src} ink={tool.ink} width={tool.thumb.width} height={tool.thumb.height} eager={eager} />
      ) : (
        <div className="plate-composed" data-quiet={quiet || undefined}>
          {tool.icon ? <Ink className="plate-icon" src={tool.icon} ink={tool.iconInk} width={128} height={128} eager={eager} /> : <span />}
          {!quiet && <span className="plate-name" style={{ '--len': Math.max(6, ...tool.name.split(/\s+/).map((w) => w.length)) } as React.CSSProperties}>
            {tool.name}
          </span>}
          <span className="plate-source">{tool.source}</span>
        </div>
      )}
    </div>
  );
}
