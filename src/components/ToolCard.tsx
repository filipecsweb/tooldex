import type { IndexTool } from '../lib/tool-index';
import { accessLabel } from '../lib/format';
import ArrowOut from './ArrowOut';
import Plate from './Plate';

/** One catalog entry: plate, name, the tagline as its lead, and an Access line. */
export default function ToolCard({ tool, eager = false }: { tool: IndexTool; eager?: boolean }) {
  return (
    <article className="rule-2 flex h-full flex-col pt-3">
      <a href={`/tools/${tool.slug}`} className="group block text-ink no-underline">
        <Plate tool={tool} eager={eager} />
        <h3 className="mt-4 text-[1.75rem] font-[850] leading-[1.02] tracking-[-0.03em] group-hover:underline group-focus-visible:underline">
          {tool.name}
        </h3>
      </a>
      <p className="mt-2 font-serif text-[1.0625rem] leading-[1.5] text-ink-2">{tool.tagline}</p>
      <div className="mt-auto pt-4">
        <p className="flex items-baseline gap-2 border-2 border-ink px-2.5 py-1.5 font-mono text-[0.9375rem]">
          <span className="font-sans text-[0.8125rem] font-[850] uppercase tracking-[0.06em] text-spot">Access</span>
          <a href={tool.url} rel="noopener" className="min-w-0 break-all text-ink underline decoration-ink-3 hover:text-spot">
            {accessLabel(tool.url)}
            <ArrowOut className="ml-1 inline align-baseline" />
          </a>
        </p>
        <p className="mt-2 text-[0.875rem] text-ink-3">
          Filed under{' '}
          <a href={`/categories/${tool.category}`} className="font-semibold text-ink-2 underline decoration-ink-3 hover:text-spot">
            {tool.categoryName}
          </a>
        </p>
      </div>
    </article>
  );
}
