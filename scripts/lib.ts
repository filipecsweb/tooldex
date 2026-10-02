// Pure helpers for scripts/tool.ts. No I/O here, so it is easy to test.
import { crc32 } from 'node:zlib';

export const THUMB = { width: 1600, height: 840 }; // ~1.91:1, the og:image shape
export const ICON_SIZE = 128;
export const TOOL_FILES = new Set(['index.md', 'thumb.webp', 'thumb.webp.json', 'icon.png']);
/** Key impeccable's provenance scanner reads (PNG tEXt chunk; WebP uses a .json sidecar). */
export const PROVENANCE_KEY = 'impeccable:prompt';
export const BODY_PLACEHOLDER = 'TODO(tooldex): write the body.';

/** Paragraphs every write-up has, each opening with `**Label:**` (CLAUDE.md › Write-up style). The
 *  rule lives with the tool page's splitter, so `check` passes exactly the bodies the page can split. */
export { bodyProblems } from '../src/lib/body.ts';

export type Repo = { owner: string; name: string };

/** github.com/<owner>/<repo>[/anything] -> { owner, name }; anything else -> null. */
export function parseGithubRepo(url: string): Repo | null {
  let u: URL;
  try { u = new URL(url); } catch { return null; }
  if (u.hostname !== 'github.com' && u.hostname !== 'www.github.com') return null;
  const [owner, name] = u.pathname.split('/').filter(Boolean);
  const reserved = ['orgs', 'sponsors', 'topics', 'features', 'marketplace', 'apps', 'settings', 'login'];
  if (!owner || !name || reserved.includes(owner)) return null;
  return { owner, name: name.replace(/\.git$/, '') };
}

export const repoUrl = (r: Repo) => `https://github.com/${r.owner}/${r.name}`;

/**
 * A repo's "homepage" is a website only when it is a real site root:
 * a domain root, or a GitHub Pages project root. Deep pages become links.
 */
export function classifyHomepage(url: string): { kind: 'website' } | { kind: 'link'; label: string } {
  const u = new URL(url);
  const parts = u.pathname.split('/').filter(Boolean);
  if (u.hostname.endsWith('github.io') && parts.length <= 1) return { kind: 'website' };
  if (u.hostname !== 'github.com' && parts.length === 0) return { kind: 'website' };
  if (u.hostname.startsWith('docs.') || parts.includes('docs')) return { kind: 'link', label: 'Docs' };
  if (/^(p|blog|posts?|articles?|news)$/.test(parts[0] ?? '')) return { kind: 'link', label: 'Article' };
  return { kind: 'link', label: 'Homepage' };
}

export function slugify(s: string): string {
  return s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** README H1 when it reads like a name, else the repo name. */
export function pickName(h1: string | undefined, fallback: string): string {
  if (!h1) return fallback;
  const cleaned = h1
    .replace(/<[^>]+>/g, '')
    .replace(/[\p{Extended_Pictographic}️]/gu, '')
    .replace(/[*_`[\]]/g, '')
    .split(/:| - | — | \| /)[0]
    .replace(/^\/+/, '')
    .trim();
  return cleaned && cleaned.length <= 30 && /\p{L}/u.test(cleaned) ? cleaned : fallback;
}

/** First markdown H1 (`# Title`) outside code fences. */
export function readmeH1(md: string): string | undefined {
  return md.replace(/```[\s\S]*?```/g, '').match(/^#\s+(.+)$/m)?.[1];
}

/** Trim to max chars at a word boundary. */
export function clip(s: string, max: number): string {
  const t = s.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  return t.slice(0, t.lastIndexOf(' ', max - 1)).replace(/[,;:.\s]+$/, '') + '…';
}

export type CategoryLike = { id: string; keywords: string[] };

/** Rank categories: +3 per keyword equal to a topic, +1 per keyword found in the text. */
export function guessCategory(cats: CategoryLike[], topics: string[], text: string) {
  const t = ` ${text.toLowerCase().replace(/[^a-z0-9-]+/g, ' ')} `;
  const tops = new Set(topics.map((x) => x.toLowerCase()));
  return cats
    .map((c) => ({
      id: c.id,
      score: c.keywords.reduce((s, k) => {
        const kw = k.toLowerCase();
        return s + (tops.has(kw) ? 3 : 0) + (t.includes(` ${kw.replace(/[^a-z0-9-]+/g, ' ')} `) ? 1 : 0);
      }, 0),
    }))
    .sort((a, b) => b.score - a.score);
}

const BADGE = /shields\.io|badge|trendshift|star-history|api\.star|contrib\.rocks|\/actions\/workflows|visitor|hits\.|komarev|codecov|img\.youtube/i;

/** Image URLs in README order (markdown and <img>), badges dropped, made absolute. */
export function readmeImages(md: string, repo: Repo, branch = 'HEAD'): string[] {
  const raw = `https://raw.githubusercontent.com/${repo.owner}/${repo.name}/${branch}/`;
  const found: string[] = [];
  const re = /!\[[^\]]*\]\(\s*<?([^)\s>]+)>?[^)]*\)|<img[^>]*?\ssrc=["']([^"']+)["']/gi;
  for (const m of md.replace(/```[\s\S]*?```/g, '').matchAll(re)) {
    const src = (m[1] ?? m[2]).replace(/&amp;/g, '&');
    if (BADGE.test(src)) continue;
    let abs: string;
    if (/^https?:\/\//.test(src)) {
      abs = src.replace(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/(?:blob|raw)\/(.+)$/, 'https://raw.githubusercontent.com/$1/$2/$3');
    } else {
      abs = new URL(src.replace(/^\.?\//, ''), raw).href;
    }
    if (!found.includes(abs)) found.push(abs);
  }
  return found;
}

/** A thumbnail candidate must be big and roughly landscape-card shaped. */
export const goodThumb = (w: number, h: number) => w >= 640 && w / h >= 1.3 && w / h <= 2.2;

/** A link check blocked by a Cloudflare bot challenge: the page is up, we just can't verify it. */
export const botChallenged = (status: number, headers: Headers) => status === 403 && headers.get('cf-mitigated') === 'challenge';

/** Centered crop box with the target aspect ratio. */
export function cropBox(w: number, h: number, aspect = THUMB.width / THUMB.height) {
  if (w / h > aspect) {
    const width = Math.round(h * aspect);
    return { left: Math.round((w - width) / 2), top: 0, width, height: h };
  }
  const height = Math.round(w / aspect);
  return { left: 0, top: 0, width: w, height }; // keep the top: screenshots and banners lead there
}

// ---------- redirects ----------

export type Rule = { from: string; to: string; status: string };

export function parseRedirects(text: string): Rule[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
      const [from, to = '', status = '302'] = l.split(/\s+/); // 302 is Cloudflare's default
      return { from, to, status };
    });
}

/** A path without its trailing slash: the one page or source that `/x` and `/x/` both name. */
const barePath = (path: string) => (path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path);

/** Both forms of a source. Cloudflare matches `_redirects` sources exactly, so every rule is written for each. */
const sourceForms = (path: string) => [barePath(path), `${barePath(path)}/`];

/** Where a rule should point: an off-site URL as written, a live page in its bare form (no extra hop), else the home page. */
const resolveTarget = (to: string, isLive: (path: string) => boolean) =>
  /^https?:\/\//i.test(to) ? to : isLive(barePath(to)) ? barePath(to) : '/';

/** Rules as normalizeRedirects returns them (one per source), each written for both forms. */
export const serializeRedirects = (rules: Rule[]) =>
  '# Managed by `npm run tool -- mv|rm`, which write each rule for both /path and /path/. Edits by hand are fine if they do the same with static redirects only (no splats, placeholders or 200 proxies); `npm run tool -- check` validates them.\n' +
  rules.flatMap((r) => sourceForms(r.from).map((from) => `${from} ${r.to} ${r.status}`)).join('\n') +
  '\n';

/**
 * Keep redirects valid against the live pages:
 * - one rule per bare source: `/x` and `/x/` are the same source, and a later rule replaces an
 *   earlier one (mv and rm append theirs),
 * - drop rules whose source is live again (a slug was reused),
 * - follow chains so every rule points straight at its final destination,
 * - point each at resolveTarget's answer: anything still pointing at a dead page goes to the home page.
 */
export function normalizeRedirects(rules: Rule[], isLive: (path: string) => boolean): Rule[] {
  const map = new Map<string, Rule>();
  for (const r of rules) {
    const from = barePath(r.from);
    if (!isLive(from)) map.set(from, { ...r, from });
  }
  return [...map.values()].map((r) => {
    let to = r.to;
    const seen = new Set([r.from]);
    for (let next = barePath(to); map.has(next) && !seen.has(next); next = barePath(to)) { seen.add(next); to = map.get(next)!.to; }
    return { ...r, to: resolveTarget(to, isLive) };
  });
}

/** What is wrong with a `_redirects` file, one message per problem in file order; `check` reports them. */
export function redirectProblems(rules: Rule[], isLive: (path: string) => boolean): string[] {
  const problems: string[] = [];
  const seen = new Set<string>();
  const lines = new Set(rules.map((r) => `${r.from} ${r.to} ${r.status}`));
  for (const r of rules) {
    if (!r.from?.startsWith('/') || !r.to) { problems.push(`malformed rule "${r.from} ${r.to}"`); continue; }
    if (/\*|\/:/.test(r.from)) { problems.push(`${r.from} is a splat or placeholder rule; only static rules are supported`); continue; }
    if (!['301', '302', '303', '307', '308'].includes(r.status)) problems.push(`${r.from} has status ${r.status}; only redirects (301, 302, 303, 307, 308) are supported`);
    if (seen.has(r.from)) problems.push(`duplicate source ${r.from}`);
    seen.add(r.from);
    for (const form of sourceForms(r.from)) {
      if (!lines.has(`${form} ${r.to} ${r.status}`)) problems.push(`${r.from} has no ${form} twin with the same target and status (Cloudflare matches sources exactly, so each rule is written for both forms)`);
    }
    if (isLive(barePath(r.from))) problems.push(`${r.from} is a live page but still redirects`);
    const to = resolveTarget(r.to, isLive);
    if (to === '/' && r.to !== '/') problems.push(`${r.from} -> ${r.to}, which is not a live page`);
    else if (to !== r.to) problems.push(`${r.from} -> ${r.to}: write the target as ${to}`);
  }
  return problems;
}

// ---------- ICO ----------

/** Largest PNG embedded in an .ico file (modern favicons embed PNGs). */
export function pngFromIco(buf: Uint8Array): Uint8Array | null {
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  if (buf.length < 6 || dv.getUint16(0, true) !== 0 || dv.getUint16(2, true) !== 1) return null;
  let best: { size: number; off: number; len: number } | null = null;
  for (let i = 0; i < dv.getUint16(4, true); i++) {
    const e = 6 + i * 16;
    if (e + 16 > buf.length) break;
    const size = buf[e] || 256;
    const len = dv.getUint32(e + 8, true);
    const off = dv.getUint32(e + 12, true);
    const isPng = buf[off] === 0x89 && buf[off + 1] === 0x50;
    if (isPng && off + len <= buf.length && (!best || size > best.size)) best = { size, off, len };
  }
  return best ? buf.subarray(best.off, best.off + best.len) : null;
}

// ---------- PNG text chunks (provenance) ----------

/** Return the PNG with a tEXt chunk `key\0text` inserted before IEND (replacing an existing one for `key`). */
export function pngWithText(png: Uint8Array, key: string, text: string): Uint8Array {
  const chunks = pngChunks(png).filter((c) => !(c.type === 'tEXt' && c.text?.key === key));
  const data = new TextEncoder().encode(`${key}\0${text.replace(/[^\x20-\x7e\n]/g, '?')}`);
  const head = new Uint8Array(8);
  const dv = new DataView(head.buffer);
  dv.setUint32(0, data.length);
  head.set(new TextEncoder().encode('tEXt'), 4);
  const crc = new Uint8Array(4);
  new DataView(crc.buffer).setUint32(0, crc32(Buffer.concat([head.subarray(4), data])));
  const text_ = Buffer.concat([head, data, crc]);
  const parts = chunks.map((c) => png.subarray(c.start, c.end));
  const iend = parts.pop()!;
  return Buffer.concat([png.subarray(0, 8), ...parts, text_, iend]);
}

/** Text of a tEXt chunk, if present. */
export const pngText = (png: Uint8Array, key: string) =>
  pngChunks(png).find((c) => c.type === 'tEXt' && c.text?.key === key)?.text?.value;

function pngChunks(png: Uint8Array) {
  const dv = new DataView(png.buffer, png.byteOffset, png.byteLength);
  const out: { type: string; start: number; end: number; text?: { key: string; value: string } }[] = [];
  for (let i = 8; i + 12 <= png.length; ) {
    const len = dv.getUint32(i);
    const type = String.fromCharCode(...png.subarray(i + 4, i + 8));
    const end = i + 12 + len;
    const chunk: (typeof out)[number] = { type, start: i, end };
    if (type === 'tEXt') {
      const body = Buffer.from(png.subarray(i + 8, i + 8 + len)).toString('latin1');
      const z = body.indexOf('\0');
      chunk.text = { key: body.slice(0, z), value: body.slice(z + 1) };
    }
    out.push(chunk);
    i = end;
    if (type === 'IEND') break;
  }
  return out;
}
