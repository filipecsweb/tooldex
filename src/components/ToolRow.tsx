import { facetLabel } from '../lib/facets';
import { accessLabel, outbound, visitName } from '../lib/format';
import type { IndexTool } from '../lib/tool-index';
import ArrowOut from './ArrowOut';

/**
 * One tool in a list: icon, name (and its section, with `section`), the tagline and, with `out`, its
 * source one click away and its kinds. The directory and a tool page's related tools both use it.
 */
export default function ToolRow({ tool, section, out = false, eager = false }: { tool: IndexTool; section: boolean; out?: boolean; eager?: boolean }) {
  const href = `/tools/${tool.slug}`;
  const access = accessLabel(tool.url);
  const box = 'size-9 rounded-control border border-line bg-fill md:size-10';
  return (
    <li className={`grid grid-cols-[--spacing(9)_minmax(0,1fr)] gap-x-3.5 gap-y-2 border-t border-line-soft px-4 py-4 transition-colors duration-150 first:border-t-0 hover:bg-fill-soft md:gap-x-4 md:px-5 ${out ? 'md:grid-cols-[--spacing(10)_minmax(0,1fr)_minmax(0,220px)]' : 'md:grid-cols-[--spacing(10)_minmax(0,1fr)]'}`}>
      {/* The name is the link keyboards and screen readers use; the icon repeats it for the pointer only. */}
      <a href={href} tabIndex={-1} aria-hidden="true" className="peer self-start">
        {tool.icon ? (
          <img src={tool.icon} alt="" width={40} height={40} loading={eager ? 'eager' : 'lazy'} decoding="async" className={`${box} object-cover`} />
        ) : (
          <span className={`grid place-items-center text-title text-ink-4 ${box}`}>{tool.name[0]}</span>
        )}
      </a>
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2.5">
          <h3 className="text-title">
            <a data-row href={href} className="text-ink no-underline hover:text-ink hover:underline [@media(hover:hover)]:in-[.peer:hover~*]:underline pointer-coarse:relative pointer-coarse:py-3">{tool.name}</a>
          </h3>
          {section && <span className="text-caption text-meta">{tool.categoryName}</span>}
        </div>
        {/* Without the source column the tagline runs the row's width, so it keeps to a reading measure. */}
        <p className={`mt-0.75 line-clamp-2 text-row text-ink-4 ${out ? '' : 'max-w-copy'}`}>{tool.tagline}</p>
      </div>
      {out && (
        <div className="col-start-2 min-w-0 md:col-start-3 md:pt-0.5 md:text-right">
          <a href={tool.url} {...outbound(visitName(tool.name, tool.url))} className="relative inline-flex max-w-full items-center gap-1 font-mono text-data no-underline hover:underline pointer-coarse:-my-3.25 pointer-coarse:py-3.25">
            <span className="truncate">{access}</span>
            <ArrowOut className="size-3 flex-none" />
          </a>
          {tool.kinds.length > 0 && (
            <p className="mt-1.25 font-mono text-micro text-meta">{tool.kinds.map(facetLabel).join(' · ')}</p>
          )}
        </div>
      )}
    </li>
  );
}
