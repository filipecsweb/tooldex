// Per-tool workflow: add, thumbs, mv, rm, check. Run with `npm run tool <command>`.
// Every tool lives in src/content/tools/<slug>/ (index.md, thumb.webp, icon.png).
import { existsSync, readdirSync, readFileSync, rmSync, renameSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import sharp from 'sharp';
import YAML from 'yaml';
import {
  BODY_PLACEHOLDER, ICON_SIZE, THUMB, TOOL_FILES, classifyHomepage, clip, cropBox, goodThumb,
  guessCategory, normalizeRedirects, parseGithubRepo, parseRedirects, pickName, pngFromIco,
  readmeH1, readmeImages, repoUrl, serializeRedirects, slugify, type Repo,
} from './lib.ts';

const ROOT = new URL('..', import.meta.url).pathname;
const TOOLS = join(ROOT, 'src/content/tools');
const CATEGORIES = join(ROOT, 'src/content/categories.json');
const REDIRECTS = join(ROOT, 'public/_redirects');
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140 Safari/537.36 tooldex';

// ---------- files ----------

type Entry = { slug: string; dir: string; data: Record<string, any>; body: string; doc: YAML.Document };

function readTool(slug: string): Entry {
  const dir = join(TOOLS, slug);
  const text = readFileSync(join(dir, 'index.md'), 'utf8');
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error(`${slug}/index.md has no frontmatter`);
  const doc = YAML.parseDocument(m[1]);
  return { slug, dir, data: doc.toJS() ?? {}, body: m[2], doc };
}

function writeTool(e: Entry) {
  writeFileSync(join(e.dir, 'index.md'), `---\n${e.doc.toString({ lineWidth: 0 }).trimEnd()}\n---\n${e.body}`);
}

const slugs = () =>
  readdirSync(TOOLS, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort();

const categories = (): { id: string; name: string; keywords: string[] }[] => JSON.parse(readFileSync(CATEGORIES, 'utf8'));

const readRedirects = () => (existsSync(REDIRECTS) ? parseRedirects(readFileSync(REDIRECTS, 'utf8')) : []);

/** Live pages as the site will build them: tool pages and non-empty category pages. */
function livePaths() {
  const live = new Set(['/', '/categories']);
  for (const s of slugs()) {
    if (!existsSync(join(TOOLS, s, 'index.md'))) continue;
    live.add(`/tools/${s}`);
    try { live.add(`/categories/${readTool(s).data.category}`); } catch {}
  }
  return live;
}

function saveRedirects(rules: ReturnType<typeof readRedirects>) {
  const live = livePaths();
  writeFileSync(REDIRECTS, serializeRedirects(normalizeRedirects(rules, (p) => live.has(p))));
}

// ---------- network ----------

let token: string | undefined;
function githubToken() {
  if (token !== undefined) return token;
  token = process.env.GITHUB_TOKEN ?? '';
  if (!token) try { token = execFileSync('gh', ['auth', 'token'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch {}
  return token;
}

async function get(url: string, init: RequestInit = {}, timeout = 15000) {
  return fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(timeout), ...init, headers: { 'user-agent': UA, ...init.headers } });
}

async function gh(path: string, accept = 'application/vnd.github+json') {
  const t = githubToken();
  const res = await get(`https://api.github.com/${path}`, { headers: { accept, ...(t ? { authorization: `Bearer ${t}` } : {}) } });
  if (!res.ok) throw new Error(`GitHub API ${path}: ${res.status}`);
  return accept.includes('raw') ? res.text() : res.json();
}

async function html(url: string) {
  const res = await get(url, { headers: { accept: 'text/html' } });
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  return { text: await res.text(), url: res.url };
}

async function bytes(url: string) {
  const res = await get(url);
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  const len = Number(res.headers.get('content-length') ?? 0);
  if (len > 20e6) throw new Error(`${url}: too large`);
  return new Uint8Array(await res.arrayBuffer());
}

const meta = (page: string, ...keys: string[]) => {
  for (const k of keys) {
    const re = new RegExp(`<meta[^>]+(?:property|name)=["']${k}["'][^>]*>`, 'i');
    const tag = page.match(re)?.[0];
    const content = tag?.match(/content=["']([^"']*)["']/i)?.[1];
    if (content) return content.replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').trim();
  }
};

// ---------- images ----------

async function toThumb(buf: Uint8Array) {
  const { width = 0, height = 0, pages = 1 } = await sharp(buf, { density: 200 }).metadata();
  if (!goodThumb(width, height)) return null;
  // Animated GIF/WebP: the first frame is often a blank fade-in, so keep the most detailed of 8 samples.
  let page = 0, best = -1;
  for (let i = 0; i < Math.min(pages, 8); i++) {
    const p = Math.floor((i * pages) / Math.min(pages, 8));
    const { entropy } = await sharp(buf, { page: p }).stats();
    if (entropy > best) { best = entropy; page = p; }
  }
  if (best < 2) return null; // blank or near-blank image
  const img = sharp(buf, { density: 200, page });
  return img
    .extract(cropBox(width, height))
    .resize({ width: Math.min(THUMB.width, width) })
    .webp({ quality: 82 })
    .toBuffer();
}

async function toIcon(buf: Uint8Array) {
  const png = pngFromIco(buf);
  const img = sharp(png ?? buf, { density: 300 });
  const { width = 0, height = 0 } = await img.metadata();
  if (Math.min(width, height) < 48) return null;
  // A flat single-colour square (some apple-touch-icons) is not an icon.
  if ((await img.clone().stats()).entropy < 1) return null;
  return img.resize(ICON_SIZE, ICON_SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
}

async function firstOk<T>(label: string, tries: [string, () => Promise<T | null | undefined>][]): Promise<{ from: string; value: T } | null> {
  for (const [from, fn] of tries) {
    try {
      const value = await fn();
      if (value) return { from, value };
    } catch (e) {
      console.log(`    ${label}: ${from} failed (${(e as Error).message})`);
    }
  }
  return null;
}

async function screenshot(url: string) {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 672 }, deviceScaleFactor: 2, userAgent: UA });
    await page.goto(url, { waitUntil: 'load', timeout: 30000 });
    await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(800);
    return await page.screenshot({ type: 'png' });
  } finally {
    await browser.close();
  }
}

/** Page icons, best first: apple-touch-icon, then sized <link rel=icon>, then /favicon.ico. */
function iconCandidates(page: string, base: string) {
  const links = [...page.matchAll(/<link[^>]+>/gi)].map((m) => m[0]).filter((l) => /rel=["'][^"']*icon/i.test(l));
  const scored = links.map((l) => {
    const href = l.match(/href=["']([^"']+)["']/i)?.[1];
    const size = Number(l.match(/sizes=["'](\d+)/i)?.[1] ?? 0);
    const score = (/apple-touch-icon/i.test(l) ? 1000 : 0) + (/\.svg/i.test(href ?? '') ? 500 : 0) + size;
    return { href, score };
  });
  return [...scored.filter((s) => s.href).sort((a, b) => b.score - a.score).map((s) => new URL(s.href!, base).href), new URL('/favicon.ico', base).href];
}

async function thumbs(slug: string, force: boolean) {
  const e = readTool(slug);
  const repo = e.data.repo ? parseGithubRepo(e.data.repo) : null;
  const thumbPath = join(e.dir, 'thumb.webp');
  const iconPath = join(e.dir, 'icon.png');
  let site: { text: string; url: string } | null = null;
  if (e.data.website) site = await html(e.data.website).catch(() => null);
  console.log(`• ${slug}`);

  // Thumbnail
  if (existsSync(thumbPath) && !force) {
    console.log('    thumb: kept existing file');
  } else {
    const tries: [string, () => Promise<Buffer | null>][] = [];
    if (e.data.website) {
      tries.push(['website og:image', async () => {
        const src = site && meta(site.text, 'og:image', 'twitter:image', 'og:image:url');
        return src ? toThumb(await bytes(new URL(src, site!.url).href)) : null;
      }]);
      tries.push(['website screenshot', async () => toThumb(await screenshot(e.data.website))]);
    } else if (repo) {
      tries.push(['repo social preview', async () => {
        const page = await html(repoUrl(repo));
        const src = meta(page.text, 'og:image');
        // GitHub's auto-generated card is the same for every repo; only a custom upload counts.
        return src && src.includes('repository-images.githubusercontent.com') ? toThumb(await bytes(src)) : null;
      }]);
      tries.push(['README image', async () => {
        const md = (await gh(`repos/${repo.owner}/${repo.name}/readme`, 'application/vnd.github.raw')) as string;
        for (const src of readmeImages(md, repo).slice(0, 6)) {
          const out = await toThumb(await bytes(src)).catch(() => null);
          if (out) return out;
        }
        return null;
      }]);
    }
    const hit = await firstOk('thumb', tries);
    if (hit) {
      writeFileSync(thumbPath, hit.value);
      console.log(`    thumb: ${hit.from}`);
    } else {
      rmSync(thumbPath, { force: true });
      console.log('    thumb: none usable, the fallback card will render');
    }
  }

  // Icon
  if (existsSync(iconPath) && !force) {
    console.log('    icon: kept existing file');
  } else {
    const tries: [string, () => Promise<Buffer | null>][] = [];
    if (site) for (const src of iconCandidates(site.text, site.url)) tries.push([`site icon ${src}`, async () => toIcon(await bytes(src))]);
    if (repo) tries.push(['owner avatar', async () => toIcon(await bytes(`https://github.com/${repo.owner}.png?size=256`))]);
    const hit = await firstOk('icon', tries);
    if (hit) {
      writeFileSync(iconPath, hit.value);
      console.log(`    icon: ${hit.from}`);
    } else {
      console.log('    icon: none found. Add src/content/tools/' + slug + '/icon.png by hand');
    }
  }

  // Keep frontmatter in step with the files.
  existsSync(thumbPath) ? e.doc.set('thumbnail', './thumb.webp') : e.doc.delete('thumbnail');
  existsSync(iconPath) ? e.doc.set('icon', './icon.png') : e.doc.delete('icon');
  writeTool(e);
}

// ---------- commands ----------

async function add(urls: string[], opts: { slug?: string; category?: string }) {
  if (!urls.length) throw new Error('Usage: npm run tool add <repo-or-website-url> [<second-url>] [--slug s] [--category id]');
  let repo: Repo | null = null;
  let website: string | undefined;
  for (const u of urls) {
    const r = parseGithubRepo(u);
    if (r) repo = r;
    else website = new URL(u).href;
  }

  let name = '', description = '', topics: string[] = [], text = '';
  const links: { label: string; url: string }[] = [];

  if (website && !repo) {
    // Website only: read the page, and pick up a repo link if it has one.
    const page = await html(website);
    const found = [...page.text.matchAll(/href=["'](https:\/\/github\.com\/[^"'#?]+)["']/gi)].map((m) => parseGithubRepo(m[1])).find(Boolean);
    if (found) repo = found;
    name = meta(page.text, 'og:site_name') ?? page.text.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.split(/[|–—-]/)[0].trim() ?? new URL(website).hostname;
    description = meta(page.text, 'og:description', 'description') ?? '';
    text = description;
  }

  if (repo) {
    const r: any = await gh(`repos/${repo.owner}/${repo.name}`);
    repo = { owner: r.owner.login, name: r.name };
    const md = (await gh(`repos/${repo.owner}/${repo.name}/readme`, 'application/vnd.github.raw').catch(() => '')) as string;
    name = pickName(readmeH1(md), r.name);
    description = r.description || description;
    topics = r.topics ?? [];
    text = `${r.description ?? ''} ${md.slice(0, 4000)}`;
    if (r.homepage && !website) {
      const kind = classifyHomepage(r.homepage);
      if (kind.kind === 'website') website = r.homepage;
      else links.push({ label: kind.label, url: r.homepage });
    }
  }

  const slug = opts.slug ?? slugify(name);
  if (!slug) throw new Error('Could not derive a slug; pass --slug');
  const dir = join(TOOLS, slug);
  if (existsSync(dir)) throw new Error(`src/content/tools/${slug} already exists. Edit it, or pass --slug`);

  const cats = categories();
  const ranking = guessCategory(cats, topics, text);
  const category = opts.category ?? ranking[0].id;
  if (!cats.some((c) => c.id === category)) throw new Error(`Unknown category "${category}"`);

  const data: Record<string, unknown> = {
    name,
    tagline: clip(description || name, 160),
    category,
    tags: topics.slice(0, 8),
    ...(repo && { repo: repoUrl(repo) }),
    ...(website && { website }),
    ...(links.length && { links }),
    added: new Date().toISOString().slice(0, 10),
  };
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.md'), `---\n${YAML.stringify(data, { lineWidth: 0 }).trimEnd()}\n---\n\n${BODY_PLACEHOLDER}\n`);

  console.log(`Created src/content/tools/${slug}/index.md`);
  console.log(`  category: ${category}   (ranking: ${ranking.slice(0, 3).map((r) => `${r.id} ${r.score}`).join(', ')})`);
  await thumbs(slug, false);
  console.log(`\nLeft for you: write the body, tighten the tagline (no counts or versions), review tags and category.`);
}

function mv(from: string, to: string) {
  if (!from || !to) throw new Error('Usage: npm run tool mv <old-slug> <new-slug>');
  if (to !== slugify(to)) throw new Error(`"${to}" is not a clean slug; try "${slugify(to)}"`);
  if (!existsSync(join(TOOLS, from))) throw new Error(`No tool "${from}"`);
  if (existsSync(join(TOOLS, to))) throw new Error(`"${to}" already exists`);
  renameSync(join(TOOLS, from), join(TOOLS, to));
  saveRedirects([...readRedirects(), { from: `/tools/${from}`, to: `/tools/${to}`, status: '301' }]);
  console.log(`Moved ${from} -> ${to}; /tools/${from} now redirects.`);
}

function rm(slug: string) {
  if (!slug || !existsSync(join(TOOLS, slug))) throw new Error(`No tool "${slug}"`);
  let category: string | undefined;
  try { category = readTool(slug).data.category; } catch {}
  rmSync(join(TOOLS, slug), { recursive: true });
  // Send old links to the tool's category; normalizeRedirects falls back to "/" if that is now empty.
  saveRedirects([...readRedirects(), { from: `/tools/${slug}`, to: category ? `/categories/${category}` : '/', status: '301' }]);
  console.log(`Removed ${slug} and its images; /tools/${slug} now redirects.`);
}

async function check(offline: boolean) {
  const errors: string[] = [];
  const notes: string[] = [];
  const cats = new Set(categories().map((c) => c.id));
  const urls = new Map<string, string>(); // url -> slug

  for (const f of readdirSync(TOOLS, { withFileTypes: true })) {
    if (!f.isDirectory()) errors.push(`tools/${f.name}: stray file, tools must be folders`);
  }
  for (const slug of slugs()) {
    const where = `tools/${slug}`;
    if (slug !== slugify(slug)) errors.push(`${where}: folder name is not a clean slug`);
    const files = readdirSync(join(TOOLS, slug));
    for (const f of files) if (!TOOL_FILES.has(f)) errors.push(`${where}/${f}: orphaned file (only index.md, thumb.webp, icon.png belong here)`);
    if (!files.includes('index.md')) { errors.push(`${where}: missing index.md`); continue; }
    let e: Entry;
    try { e = readTool(slug); } catch (err) { errors.push(`${where}: ${(err as Error).message}`); continue; }
    const d = e.data;
    if (!cats.has(d.category)) errors.push(`${where}: unknown category "${d.category}"`);
    if (!d.repo && !d.website) errors.push(`${where}: needs a repo or a website`);
    if (e.body.includes(BODY_PLACEHOLDER) || !e.body.trim()) errors.push(`${where}: body not written yet`);
    for (const [key, file] of [['thumbnail', 'thumb.webp'], ['icon', 'icon.png']] as const) {
      const has = files.includes(file);
      if (d[key] && !has) errors.push(`${where}: ${key} is set but ${file} is missing`);
      if (has && d[key] !== `./${file}`) errors.push(`${where}: ${file} exists but ${key} is not "./${file}"`);
    }
    if (!files.includes('icon.png')) errors.push(`${where}: no icon (run npm run tool thumbs ${slug})`);
    if (!files.includes('thumb.webp')) notes.push(`${where}: no thumbnail, uses the fallback card`);
    for (const u of [d.repo, d.website, ...(d.links ?? []).map((l: any) => l.url)]) if (u) urls.set(u, slug);
  }

  const live = livePaths();
  const seen = new Set<string>();
  for (const r of readRedirects()) {
    if (!r.from?.startsWith('/') || !r.to) { errors.push(`_redirects: malformed rule "${r.from} ${r.to}"`); continue; }
    if (seen.has(r.from)) errors.push(`_redirects: duplicate source ${r.from}`);
    seen.add(r.from);
    if (live.has(r.from)) errors.push(`_redirects: ${r.from} is a live page but still redirects`);
    if (!live.has(r.to) && !/^https?:/.test(r.to)) errors.push(`_redirects: ${r.from} -> ${r.to}, which is not a live page`);
  }

  if (!offline) {
    const list = [...urls.keys()];
    let i = 0;
    await Promise.all(Array.from({ length: 8 }, async () => {
      while (i < list.length) {
        const u = list[i++];
        try {
          const res = await get(u, { headers: { accept: 'text/html,*/*' } }, 10000);
          await res.body?.cancel();
          if (res.status >= 400) errors.push(`tools/${urls.get(u)}: ${u} returned ${res.status}`);
          else if (new URL(res.url).hostname === 'github.com' && res.url.replace(/\/$/, '').toLowerCase() !== u.replace(/\/$/, '').toLowerCase())
            notes.push(`tools/${urls.get(u)}: ${u} now redirects to ${res.url}`);
        } catch (err) {
          errors.push(`tools/${urls.get(u)}: ${u} unreachable (${(err as Error).message})`);
        }
      }
    }));
  }

  for (const n of notes) console.log(`note   ${n}`);
  for (const e of errors) console.log(`ERROR  ${e}`);
  console.log(`\n${slugs().length} tools checked${offline ? ' (offline)' : `, ${urls.size} links`}: ${errors.length} error(s), ${notes.length} note(s).`);
  if (errors.length) process.exitCode = 1;
}

// ---------- CLI ----------

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    force: { type: 'boolean', default: false },
    offline: { type: 'boolean', default: false },
    slug: { type: 'string' },
    category: { type: 'string' },
  },
});
const [cmd, ...args] = positionals;

try {
  if (cmd === 'add') await add(args, values);
  else if (cmd === 'thumbs') for (const s of args.length ? args : slugs()) await thumbs(s, values.force);
  else if (cmd === 'mv') mv(args[0], args[1]);
  else if (cmd === 'rm') rm(args[0]);
  else if (cmd === 'check') await check(values.offline);
  else {
    console.log(`Usage:
  npm run tool add <repo-or-website-url> [<second-url>] [--slug s] [--category id]
  npm run tool thumbs [<slug>...] [--force]
  npm run tool mv <old-slug> <new-slug>
  npm run tool rm <slug>
  npm run tool check [--offline]`);
    if (cmd) process.exitCode = 1;
  }
} catch (e) {
  console.error(`error: ${(e as Error).message}`);
  process.exitCode = 1;
}
