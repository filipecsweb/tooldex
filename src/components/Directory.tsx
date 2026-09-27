import { useEffect, useMemo, useRef, useState } from 'react';
import { match } from '../lib/match';
import type { IndexTool } from '../lib/tool-index';
import ToolCard from './ToolCard';

type Section = { id: string; name: string; count: number };
type Order = 'newest' | 'name';
const PAGE = 48;

/** The catalog's finding aid: search, section index and order, mirrored to the URL. */
export default function Directory({ tools, sections }: { tools: IndexTool[]; sections: Section[] }) {
  const [q, setQ] = useState('');
  const [section, setSection] = useState('');
  const [order, setOrder] = useState<Order>('newest');
  const [limit, setLimit] = useState(PAGE);
  const [ready, setReady] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  // Read state from the URL once, after hydration (the server render has no URL query).
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    setQ(p.get('q') ?? '');
    setSection(sections.some((s) => s.id === p.get('section')) ? p.get('section')! : '');
    setOrder(p.get('order') === 'name' ? 'name' : 'newest');
    setReady(true);
  }, []);

  // Mirror state to the URL so a filtered view can be shared and survives back/forward.
  useEffect(() => {
    if (!ready) return;
    const p = new URLSearchParams();
    if (q.trim()) p.set('q', q.trim());
    if (section) p.set('section', section);
    if (order === 'name') p.set('order', 'name');
    const qs = p.toString();
    history.replaceState(history.state, '', qs ? `?${qs}` : location.pathname);
  }, [q, section, order, ready]);

  // "/" jumps to the search field, as on most catalogs and code hosts.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === '/' && !/^(input|textarea|select)$/i.test(t.tagName) && !t.isContentEditable) {
        e.preventDefault();
        input.current?.focus();
      }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => setLimit(PAGE), [q, section, order]);

  const matched = useMemo(() => match(tools, q), [tools, q]);
  const counts = useMemo(() => {
    const c = new Map<string, number>();
    for (const t of matched) c.set(t.category, (c.get(t.category) ?? 0) + 1);
    return c;
  }, [matched]);
  const results = useMemo(() => {
    const r = section ? matched.filter((t) => t.category === section) : matched;
    return order === 'name' ? [...r].sort((a, b) => a.name.localeCompare(b.name)) : r;
  }, [matched, section, order]);

  const sectionName = sections.find((s) => s.id === section)?.name;
  const query = q.trim();
  const summary =
    results.length === tools.length
      ? `All ${tools.length} ${tools.length === 1 ? 'entry' : 'entries'}`
      : `${results.length} of ${tools.length} entries${query ? ` for “${query}”` : ''}${sectionName ? ` in ${sectionName}` : ''}`;

  // The unfiltered catalog reads as a spread: the first entry leads across two columns,
  // and a note on how to read the catalog closes the grid.
  const spread = !query && !section && order === 'newest';

  const chip = (active: boolean) =>
    `inline-flex items-baseline gap-1.5 border-2 px-3 py-1.5 text-label font-bold transition-colors duration-150 ${
      active ? 'border-ink bg-ink text-paper' : 'border-ink bg-transparent text-ink hover:bg-paper-2'
    }`;

  return (
    <div>
      <section aria-label="Find a tool" className="grid gap-5 pb-8 pt-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10">
        <div>
          <label htmlFor="find" className="block text-label font-extrabold">
            Find a tool <span className="font-normal text-ink-3">(press /)</span>
          </label>
          <input
            ref={input}
            id="find"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="diagrams, security, codex…"
            autoComplete="off"
            spellCheck={false}
            className="mt-2 w-full border-0 border-b-[3px] border-ink bg-transparent px-0 py-2 text-search font-semibold tracking-[-0.01em] outline-none focus-visible:border-spot focus-visible:outline-none"
          />
        </div>
        <nav aria-label="Sections" className="self-end">
          <ul className="index-run">
            <li>
              <button type="button" aria-pressed={!section} onClick={() => setSection('')} className="index-item">
                All sections <span className="index-count">{matched.length}</span>
              </button>
            </li>
            {sections.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  aria-pressed={section === s.id}
                  onClick={() => setSection(section === s.id ? '' : s.id)}
                  className="index-item"
                  data-empty={!counts.get(s.id) || undefined}
                >
                  {s.name} <span className="index-count">{counts.get(s.id) ?? 0}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      <div className="rule-4 flex items-baseline justify-between gap-4 pb-6 pt-3">
        <p aria-live="polite" className="text-label font-bold">
          {summary}
        </p>
        <label className="flex items-baseline gap-2 text-label text-ink-2">
          Order
          <select
            value={order}
            onChange={(e) => setOrder(e.target.value as Order)}
            className="border-b-2 border-ink bg-transparent py-0.5 font-bold text-ink"
          >
            <option value="newest">Newest first</option>
            <option value="name">A to Z</option>
          </select>
        </label>
      </div>

      {results.length ? (
        <ul className="grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {results.slice(0, limit).map((t, i) => (
            <li key={t.slug} className={spread && i === 0 ? 'sm:col-span-2 lg:col-span-3' : undefined}>
              <ToolCard tool={t} eager={i < 3} lead={spread && i === 0} />
            </li>
          ))}
          {spread && (
            <li className="rule-2 pt-3">
              <h3 className="text-note">How to read an entry</h3>
              <div className="mt-3 space-y-3 font-serif text-body-sm leading-[1.55] text-ink-2">
                <p>Every entry is written by tooldex: what the tool does, when you would reach for it, and the caveats worth knowing first.</p>
                <p>The Access line goes to the tool's own website or repository. That page stays the source of truth for installation, versions and everything that changes week to week.</p>
              </div>
            </li>
          )}
        </ul>
      ) : (
        <div className="max-w-[60ch] border-2 border-ink p-6">
          <p className="text-note font-extrabold">Nothing in the catalog matches “{query}”{sectionName ? ` in ${sectionName}` : ''}.</p>
          <p className="mt-2 font-serif text-body-sm text-ink-2">
            Try a broader word, a harness name like “codex”, or clear the search to browse every section.
          </p>
          <button type="button" onClick={() => { setQ(''); setSection(''); input.current?.focus(); }} className={`${chip(true)} mt-4`}>
            Clear the search
          </button>
        </div>
      )}

      {results.length > limit && (
        <div className="mt-14 flex justify-center">
          <button type="button" onClick={() => setLimit((l) => l + PAGE)} className={chip(false)}>
            Show {Math.min(PAGE, results.length - limit)} more entries
          </button>
        </div>
      )}
    </div>
  );
}
