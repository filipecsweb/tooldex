import { useEffect, useMemo, useRef, useState } from 'react';
import { facetCounts, facetOptions, filterTools, readQuery, writeQuery, type Filters } from '../lib/filter';
import { HOSTS, KINDS, facetLabel, type Facet } from '../lib/facets';
import { accessLabel } from '../lib/format';
import { setSlash as storeSlash, slashOn } from '../lib/slash';
import type { IndexTool } from '../lib/tool-index';
import ArrowOut from './ArrowOut';

type Section = { id: string; name: string; count: number };
type Order = 'newest' | 'name';
const PAGE = 48;
const FOLD = 8; // past this many options a group shows its top SHOWN and folds the rest
const SHOWN = 6;
const EMPTY: Filters = { q: '', section: '', hosts: [], kinds: [] };

/**
 * The catalog's finding aid: search, sections, hosts and kinds, order, mirrored to the URL.
 * With `scope` (a section id) it is that section's page: `tools` holds only its tools, the sections
 * become links to their pages, and rows drop the section name they would all share.
 */
export default function Directory({ tools, sections, scope }: { tools: IndexTool[]; sections: Section[]; scope?: string }) {
  const [f, setF] = useState<Filters>(EMPTY);
  const [order, setOrder] = useState<Order>('newest');
  const [limit, setLimit] = useState(PAGE);
  const [ready, setReady] = useState(false);
  const [slash, setSlash] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const run = useRef<HTMLUListElement>(null);

  const hostOptions = useMemo(() => facetOptions(HOSTS, tools, (t) => t.hosts), [tools]);
  const kindOptions = useMemo(() => facetOptions(KINDS, tools, (t) => t.kinds), [tools]);

  // Any change to what is shown starts again from the first page.
  const update = (next: Partial<Filters>) => {
    setF((prev) => ({ ...prev, ...next }));
    setLimit(PAGE);
  };

  // Read state from the URL once, after hydration (the server render has no URL query).
  useEffect(() => {
    const { order, ...filters } = readQuery(location.search, {
      sections: scope ? [] : sections.map((s) => s.id),
      hosts: hostOptions.map((o) => o.tag),
      kinds: kindOptions.map((o) => o.tag),
    });
    setF(filters);
    setOrder(order);
    setReady(true);
  }, []);

  // The list now shows the URL's filter; release the hold set by the inline script in Catalog.astro.
  useEffect(() => {
    if (ready) delete document.documentElement.dataset.filtering;
  }, [ready]);

  // Mirror state to the URL so a filtered view can be shared and survives back/forward.
  useEffect(() => {
    if (!ready) return;
    const qs = writeQuery(f, order);
    history.replaceState(history.state, '', qs ? `?${qs}` : location.pathname);
  }, [f, order, ready]);

  // On phones the section run scrolls sideways; bring the chosen section into view (horizontally only).
  useEffect(() => {
    const ul = run.current;
    const b = ul?.querySelector('[aria-pressed="true"], [aria-current="page"]');
    if (!ul || !b || !(f.section || scope) || ul.scrollWidth <= ul.clientWidth) return;
    ul.scrollLeft += b.getBoundingClientRect().left - ul.getBoundingClientRect().left - 16;
  }, [f.section, ready]);

  // The "/" shortcut itself is site-wide (src/lib/slash.ts, wired in Base.astro); this field is the
  // page's main search, and the switch below turns the shortcut off (WCAG 2.1.4).
  useEffect(() => {
    setSlash(slashOn());
  }, []);
  const toggleSlash = () => {
    storeSlash(!slash);
    setSlash(!slash);
  };

  const counts = useMemo(() => facetCounts(tools, f), [tools, f]);
  const results = useMemo(() => {
    const r = filterTools(tools, f);
    return order === 'name' ? [...r].sort((a, b) => a.name.localeCompare(b.name)) : r;
  }, [tools, f, order]);

  const query = f.q.trim();
  const facetsOn = f.hosts.length + f.kinds.length;
  const filtered = Boolean(query || f.section || facetsOn);
  const scopeName = scope && sections.find((s) => s.id === scope)?.name;
  const sectionName = scopeName || sections.find((s) => s.id === f.section)?.name;
  const noun = (n: number) => (n === 1 ? 'tool' : 'tools');
  const where = sectionName ? ` in ${sectionName}` : '';
  const summary = !filtered
    ? `${tools.length === 1 ? '' : 'All '}${tools.length} ${noun(tools.length)}${where}`
    : `${results.length} of ${tools.length} ${noun(tools.length)}${query ? ` for “${query}”` : ''}${where}`;
  const catalogSize = sections.reduce((n, s) => n + s.count, 0);
  const clear = () => { update(EMPTY); input.current?.focus(); };
  const toggle = (group: 'hosts' | 'kinds', tag: string) =>
    update({ [group]: f[group].includes(tag) ? f[group].filter((x) => x !== tag) : [...f[group], tag] });

  return (
    <div>
      <div className="max-w-[760px]">
        <div className="flex h-14 items-center gap-3 rounded-sheet border border-line-strong bg-surface px-4 transition-[border-color,box-shadow] duration-150 focus-within:border-accent focus-within:shadow-halo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="flex-none text-meta">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <label htmlFor="find" className="sr-only">{scopeName ? `Search ${scopeName}` : 'Search the catalog'}</label>
          <input
            ref={input}
            id="find"
            type="search"
            value={f.q}
            onChange={(e) => update({ q: e.target.value })}
            onKeyDown={(e) => {
              // Enter or ↓ moves to the first result, past the filters (not while an input method is composing).
              if ((e.key !== 'Enter' && e.key !== 'ArrowDown') || e.nativeEvent.isComposing) return;
              const first = document.querySelector<HTMLElement>('#results a[data-row]');
              if (first) { e.preventDefault(); first.focus(); }
            }}
            data-main-search
            placeholder={scopeName ? `Search within ${scopeName}…` : 'Search by tool, job or harness: diagrams, security, codex…'}
            autoComplete="off"
            spellCheck={false}
            className="h-full min-w-0 flex-1 text-ellipsis border-0 bg-transparent text-lead text-ink outline-none [&::-webkit-search-cancel-button]:cursor-pointer"
          />
          <kbd aria-hidden="true" className="slash-key flex-none rounded-key border border-line-strong bg-ground px-2 py-0.5 text-micro text-ink-4">/</kbd>
        </div>
        <p className="mt-1.5 flex justify-end">
          <button type="button" onClick={toggleSlash} className="rounded-key text-micro text-meta underline decoration-line-strong underline-offset-2 hover:text-ink hover:decoration-current pointer-coarse:py-3.5">
            {slash ? 'Turn off the / shortcut' : 'Turn on the / shortcut'}
          </button>
        </p>
      </div>

      <div className="mt-5 grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:mt-6 lg:grid-cols-[224px_minmax(0,1fr)] lg:gap-10">
        <aside className="flex flex-col gap-4 lg:gap-7">
          <nav aria-labelledby="sections-h">
            <h2 id="sections-h" className={`${groupHead} max-lg:px-0`}>Sections</h2>
            <ul ref={run} className="flex gap-0.5 max-lg:-mx-4 max-lg:overflow-x-auto max-lg:px-4 max-lg:pb-1 max-lg:[scrollbar-width:none] lg:flex-col">
              {scope ? (
                // A section page: every section is a page of its own, counted across the whole catalog.
                [{ id: '', name: 'All tools', count: catalogSize }, ...sections].map((s) => (
                  <li key={s.id} className="flex-none">
                    <a href={s.id ? `/categories/${s.id}` : '/'} aria-current={s.id === scope ? 'page' : undefined} className={`${sectionItem} no-underline`}>
                      <span>{s.name}</span>
                      <span className={count}>{s.count}</span>
                    </a>
                  </li>
                ))
              ) : (<>
              <li className="flex-none">
                <button type="button" aria-pressed={!f.section} onClick={() => update({ section: '' })} className={sectionItem}>
                  <span>All tools</span>
                  <span className={count}>{[...counts.sections.values()].reduce((a, b) => a + b, 0)}</span>
                </button>
              </li>
              {sections.map((s) => (
                <li key={s.id} className="flex-none">
                  <button
                    type="button"
                    aria-pressed={f.section === s.id}
                    onClick={() => update({ section: f.section === s.id ? '' : s.id })}
                    className={sectionItem}
                    data-zero={!counts.sections.get(s.id) || undefined}
                  >
                    <span>{s.name}</span>
                    <span className={count}>{counts.sections.get(s.id) ?? 0}</span>
                  </button>
                </li>
              ))}
              </>)}
            </ul>
          </nav>

          <button
            type="button"
            aria-expanded={filtersOpen}
            aria-controls="facets"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex h-11 items-center justify-between gap-3 rounded-control border border-line-strong bg-surface px-3.5 text-ui font-medium text-ink-2 hover:bg-fill lg:hidden"
          >
            <span>
              Filters{facetsOn > 0 && <span className="ml-1.5 rounded-key bg-accent-tint px-1.5 py-px font-mono text-micro text-accent-deep">{facetsOn} on</span>}
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`text-meta transition-transform duration-150 ${filtersOpen ? 'rotate-180' : ''}`}>
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          <div id="facets" className={`flex-col gap-6 lg:flex lg:gap-7 ${filtersOpen ? 'flex' : 'hidden'}`}>
            <FacetGroup legend="Works with" options={hostOptions} counts={counts.hosts} selected={f.hosts} onToggle={(t) => toggle('hosts', t)} />
            <FacetGroup legend="Kind" options={kindOptions} counts={counts.kinds} selected={f.kinds} onToggle={(t) => toggle('kinds', t)} />
          </div>
        </aside>

        <div className="min-w-0">
          <h2 className="sr-only">Tools</h2>
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pb-3">
            <div className="flex flex-wrap items-baseline gap-x-3">
              <p aria-live="polite" className="text-ui font-semibold text-ink">{summary}</p>
              {filtered && (
                <button type="button" onClick={clear} className="rounded-key text-caption text-accent underline decoration-accent/40 underline-offset-2 hover:text-accent-deep hover:decoration-current pointer-coarse:py-3.25">
                  Clear all
                </button>
              )}
            </div>
            {results.length > 0 && <div role="group" aria-label="Order" className="inline-flex gap-0.5 rounded-control border border-line-strong bg-surface p-0.5">
              {(['newest', 'name'] as const).map((o) => (
                <button
                  key={o}
                  type="button"
                  aria-pressed={order === o}
                  onClick={() => { setOrder(o); setLimit(PAGE); }}
                  className="rounded-row px-3 py-1.5 text-caption font-medium text-ink-3 transition-colors duration-150 hover:text-ink aria-pressed:bg-ink aria-pressed:text-surface pointer-coarse:min-h-11"
                >
                  {o === 'newest' ? 'Newest' : 'A–Z'}
                </button>
              ))}
            </div>}
          </div>

          {results.length ? (
            <ul id="results" className="overflow-hidden rounded-sheet border border-line bg-surface">
              {results.slice(0, limit).map((t, i) => <Row key={t.slug} tool={t} eager={i < 12} section={!scope} />)}
            </ul>
          ) : (
            <div className="rounded-sheet border border-line bg-surface px-5 py-8 md:px-8">
              <p className="text-title text-ink">
                No tools match{query ? ` “${query}”` : ''}{sectionName ? ` in ${sectionName}` : ''}{facetsOn ? ` with ${facetsOn === 1 ? 'this filter' : 'these filters'}` : ''}.
              </p>
              <p className="mt-1.5 max-w-copy text-row text-ink-4">
                Try a broader word or a harness name like “codex”, or clear the search and filters to see the whole {scope ? 'section' : 'catalog'}.
              </p>
              <button type="button" onClick={clear} className="mt-5 rounded-control bg-accent px-4 py-2.5 pointer-coarse:min-h-11 text-ui font-medium text-surface transition-colors duration-150 hover:bg-accent-deep">
                Clear search and filters
              </button>
            </div>
          )}

          {results.length > limit && (
            <div className="mt-6 flex justify-center">
              <button type="button" onClick={() => setLimit((l) => l + PAGE)} className="rounded-control border border-line-strong bg-surface px-4 py-2.5 pointer-coarse:min-h-11 text-ui font-medium text-ink-2 transition-colors duration-150 hover:bg-fill">
                Show {Math.min(PAGE, results.length - limit)} more
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const groupHead = 'mb-2 px-2.5 text-label uppercase text-meta';
const count = 'font-mono text-micro text-meta';
const sectionItem =
  'flex w-full items-baseline justify-between gap-3 whitespace-nowrap rounded-row px-2.5 py-1.5 text-left text-ui text-ink-2 transition-colors duration-150 hover:bg-fill focus-visible:-outline-offset-2 aria-pressed:bg-accent-tint aria-pressed:font-semibold aria-pressed:text-accent-deep aria-[current=page]:bg-accent-tint aria-[current=page]:font-semibold aria-[current=page]:text-accent-deep data-zero:text-meta pointer-coarse:min-h-11 pointer-coarse:items-center';

function FacetGroup({ legend, options, counts, selected, onToggle }: {
  legend: string; options: Facet[]; counts: Map<string, number>; selected: string[]; onToggle: (tag: string) => void;
}) {
  const fold = options.length > FOLD;
  const top = fold ? options.slice(0, SHOWN) : options;
  const rest = fold ? options.slice(SHOWN) : [];
  const more = useRef<HTMLDetailsElement>(null);
  // A picked option inside the fold (from a shared URL) opens it, so the choice is never hidden.
  useEffect(() => {
    if (more.current && rest.some((o) => selected.includes(o.tag))) more.current.open = true;
  }, [selected]);

  const option = (o: Facet) => {
    const n = counts.get(o.tag) ?? 0;
    return (
      <label key={o.tag} data-zero={!n || undefined} className="flex cursor-pointer items-center gap-2.5 rounded-row px-2.5 py-1.5 text-ui text-ink-2 transition-colors duration-150 hover:bg-fill data-zero:text-meta pointer-coarse:min-h-11">
        <input type="checkbox" checked={selected.includes(o.tag)} onChange={() => onToggle(o.tag)} className="size-4 flex-none cursor-pointer accent-accent" />
        <span className="min-w-0 flex-1">{o.label}</span>
        <span className={count}>{n}</span>
      </label>
    );
  };

  return (
    <fieldset className="min-w-0">
      <legend className={groupHead}>{legend}</legend>
      <div className="flex flex-col gap-0.5">{top.map(option)}</div>
      {rest.length > 0 && (
        <details ref={more} className="group">
          <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-row px-2.5 py-1.5 text-caption font-medium text-accent hover:text-accent-deep focus-visible:-outline-offset-2 pointer-coarse:min-h-11 [&::-webkit-details-marker]:hidden">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform duration-150 group-open:rotate-90">
              <path d="m9 6 6 6-6 6" />
            </svg>
            <span className="group-open:hidden">{rest.length} more</span>
            <span className="hidden group-open:inline">Fewer</span>
          </summary>
          <div className="flex flex-col gap-0.5">{rest.map(option)}</div>
        </details>
      )}
    </fieldset>
  );
}

/** One tool: icon, name and section, the tagline, and its source one click away. */
function Row({ tool, eager, section }: { tool: IndexTool; eager: boolean; section: boolean }) {
  const access = accessLabel(tool.url);
  return (
    <li className="grid grid-cols-[36px_minmax(0,1fr)] gap-x-3.5 gap-y-2 border-t border-line-soft px-4 py-4 transition-colors duration-150 first:border-t-0 hover:bg-fill-soft md:grid-cols-[40px_minmax(0,1fr)_minmax(0,220px)] md:gap-x-4 md:px-5">
      {tool.icon ? (
        <img src={tool.icon} alt="" width={40} height={40} loading={eager ? 'eager' : 'lazy'} decoding="async" className="size-9 rounded-control border border-line bg-fill object-cover md:size-10" />
      ) : (
        <span aria-hidden="true" className="grid size-9 place-items-center rounded-control border border-line bg-fill text-title text-ink-4 md:size-10">{tool.name[0]}</span>
      )}
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2.5">
          <h3 className="text-title">
            <a data-row href={`/tools/${tool.slug}`} className="text-ink no-underline hover:text-ink hover:underline pointer-coarse:relative pointer-coarse:py-3">{tool.name}</a>
          </h3>
          {section && <span className="text-caption text-meta">{tool.categoryName}</span>}
        </div>
        <p className="mt-0.75 line-clamp-2 text-row text-ink-4">{tool.tagline}</p>
      </div>
      <div className="col-start-2 min-w-0 md:col-start-3 md:pt-0.5 md:text-right">
        <a href={tool.url} rel="noopener" aria-label={`Visit ${tool.name} at ${access}`} className="relative inline-flex max-w-full items-center gap-1 font-mono text-data no-underline hover:underline pointer-coarse:-my-3.25 pointer-coarse:py-3.25">
          <span className="truncate">{access}</span>
          <ArrowOut className="size-3 flex-none" />
        </a>
        {tool.kinds.length > 0 && (
          <p className="mt-1.25 font-mono text-micro text-meta">{tool.kinds.map(facetLabel).join(' · ')}</p>
        )}
      </div>
    </li>
  );
}
