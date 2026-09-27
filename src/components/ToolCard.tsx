import type { IndexTool } from '../lib/tool-index';
import AccessLabel from './AccessLabel';
import ArrowOut from './ArrowOut';
import Plate from './Plate';

/** One catalog entry: plate, name, the tagline as its lead, and an Access line. */
export default function ToolCard({ tool, eager = false, lead = false }: { tool: IndexTool; eager?: boolean; lead?: boolean }) {
  const href = `/tools/${tool.slug}`;
  const name = (
    <h3
      className={`font-[850] leading-[1.02] tracking-[-0.03em] group-hover:underline group-focus-visible:underline ${
        lead ? 'text-[clamp(1.75rem,3vw,2.75rem)]' : 'text-[1.75rem]'
      }`}
    >
      {tool.name}
    </h3>
  );
  const details = (
    <>
      <p className={`mt-2 font-serif leading-[1.5] text-ink-2 ${lead ? 'text-[1.25rem]' : 'text-[1.0625rem]'}`}>{tool.tagline}</p>
      <div className="mt-auto pt-4">
        <p className="flex items-baseline gap-2 border-2 border-ink px-2.5 py-1.5 font-mono text-[0.9375rem]">
          <span className="font-sans text-[0.8125rem] font-[850] uppercase tracking-[0.06em] text-spot">Access</span>
          <a href={tool.url} rel="noopener" className="link min-w-0 [overflow-wrap:anywhere]">
            <AccessLabel url={tool.url} />
            <ArrowOut className="ml-1 inline align-baseline" />
          </a>
        </p>
        <p className="mt-2 text-[0.875rem] text-ink-3">
          Filed under{' '}
          <a href={`/categories/${tool.category}`} className="link font-semibold">
            {tool.categoryName}
          </a>
        </p>
      </div>
    </>
  );

  // The lead entry runs across the spread: plate over two columns, text in the third.
  if (lead)
    return (
      <article className="entry rule-2 grid gap-x-10 pt-3 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <a href={href} tabIndex={-1} aria-hidden="true" className="block">
          <Plate tool={tool} eager={eager} />
        </a>
        <div className="flex flex-col pt-4 lg:pt-0">
          <a href={href} className="group block text-ink no-underline">{name}</a>
          {details}
        </div>
      </article>
    );

  return (
    <article className="entry rule-2 flex h-full flex-col pt-3">
      <a href={href} className="group block text-ink no-underline">
        <Plate tool={tool} eager={eager} />
        <div className="mt-4">{name}</div>
      </a>
      {details}
    </article>
  );
}
