# tooldex — plan

A public directory of **AI agent tooling**: skills, plugins, subagents, MCP servers and CLIs for Claude Code, Codex and similar harnesses. Astro 7 + `@astrojs/cloudflare` v14, fully prerendered, deployed as a Cloudflare Worker with static assets. One content collection of tools, one React island for search, thumbnails through `astro:assets`, `<ClientRouter />`. SEO is the traffic source.

The per-tool workflow (add, edit, rename, delete, check) is a first-class feature. §6 specifies it.

Status: approved 2026-09-26 with the answers in §13. All six steps of §11 are done. Live at **https://tooldex.hellofilipe.dev** (Workers custom domain; personal Cloudflare account, `account_id` pinned in `wrangler.jsonc`). This file stays the source of truth and reflects what was built.

---

## 1. Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | Astro 7, `output: 'static'` (default) | Every route prerendered. |
| Adapter | `@astrojs/cloudflare` v14, `imageService: 'compile'`, `session: false` | A fully static build deploys as an assets-only Worker (no Worker code); sharp runs at build time. Sessions are off so deploy doesn't provision an unused KV namespace. |
| UI island | `@astrojs/react`, one island | Decided. |
| Styling | Tailwind v4 via `@tailwindcss/vite`, tokens in CSS `@theme` | Same classes work in `.astro` and the React island. **Light theme only**: no dark mode, no toggle. |
| Design | [impeccable](https://github.com/pbakaus/impeccable), project-local in `.claude/`, committed | Owner pinned direction **A · Index**: a dense, filterable index you operate (white list sheet on a near-white ground, 1px lines, one indigo accent, icon rows, no thumbnails in lists). It replaced the site's first design. `PRODUCT.md`, `DESIGN.md` and `.impeccable/surfaces/` record the decisions. |
| Fonts | Geist (everything), Geist Mono (access data only: URLs, kinds, counts, keys), self-hosted via `@fontsource-variable`, latin files preloaded, metric-matched local fallbacks | No third-party font request, no shift on the swap. |
| SEO plumbing | `@astrojs/sitemap` | Meta and JSON-LD hand-written. |
| URLs | `trailingSlash: 'never'` + `build.format: 'file'` | Emits `tools/gstack.html`; Cloudflare's default `auto-trailing-slash` serves `/tools/gstack`. Dev and prod agree. |
| Redirects | `public/_redirects` | Native to Workers static assets. Written by the rename/delete commands. Sources match exactly, so each rule is written for both `/path` and `/path/`. |
| Tool scripts | `scripts/tool.ts`, run by plain `node` (Node 24 strips TS) | One file, subcommands `add`, `thumbs`, `mv`, `rm`, `check`. |
| Screenshots | `playwright` (dev dep, Chromium only) + sharp | Local only, never in the Worker. |
| YAML | `yaml` (dev dep) | Scripts read and rewrite frontmatter. |
| Wrangler | `wrangler@4` dev dep | No global install. |
| Tests | `node --test` | Zero deps. Pure logic only: search matcher, filters and facet counts, facet vocabulary, write-up split, category guess, site-root test for a repo's homepage, redirect rewriting and validation. |

Not added: Fuse/MiniSearch, Pagefind, MDX, CMS, D1, icon library, state library, analytics code (§13.7), CI, submissions.

## 2. Data model

### Layout on disk: one folder per tool

```
src/content/
  tools/
    <slug>/
      index.md      # frontmatter + body copy
      thumb.webp       # ≤1600x840 (1.91:1, the og:image shape), optional
      thumb.webp.json  # provenance sidecar for the thumbnail
      icon.png         # 128x128, provenance in a PNG text chunk
  categories.json   # array of categories
```

Why a folder per tool: everything about a tool lives in one place. Delete is `rm -r` of one folder, rename is one `mv`, and assets cannot be orphaned in a shared directory. The collection's `generateId` takes the folder name, so **folder name = slug = URL**.

### Tool schema (`tools`, `glob({ pattern: '*/index.md' })`)

```ts
schema: ({ image }) => z.object({
  name: z.string(),
  tagline: z.string().max(160),              // row copy + meta description
  category: reference('categories'),         // typo fails the build
  tags: z.array(z.string()).default([]),     // kinds + hosts (vocabulary in src/content/facets.json) + topics
  repo: z.url().optional(),                  // source repository
  website: z.url().optional(),               // ONLY a real product/landing site
  links: z.array(z.object({ label: z.string(), url: z.url() })).default([]), // only what the repo and website don't reach
  thumbnail: image().optional(),             // ./thumb.webp
  icon: image().optional(),                  // ./icon.png
  featured: z.boolean().default(false),
  added: z.coerce.date(),
  updated: z.coerce.date().optional(),
}).refine(t => t.repo || t.website, { message: 'A tool needs a repo, a website, or both' })
```

Rules:
- **Primary CTA** goes to `website` if present, else `repo`.
- `website` is a real product or landing site (archify's GitHub Pages, claude-ads.md).
- `links` holds docs, articles or papers only when neither the website nor the repository reaches them (`CLAUDE.md` › Links), so most tools have none.
- **Kinds and hosts** are tags, not fields. `src/content/facets.json` is the vocabulary: which tags are kinds (`skill`, `plugin`, `subagents`, `mcp`, `cli`, `library`, `app`), which are hosts (`claude-code`, `codex`, …), and their labels. Every other tag is a topic. Every tool needs at least one kind (`check` enforces it); the bars a kind or host tag must clear are in `CLAUDE.md`.
- `pricing` from the draft plan is dropped: every tool in this niche is open source so far, so it would not discriminate. Re-add with a filter when paid tools arrive.

### Category schema (`categories`, `file('src/content/categories.json')`)

```ts
z.object({
  id: z.string(),              // slug, route /categories/<id>
  name: z.string(),
  description: z.string(),     // the category page's SEO paragraph
  keywords: z.array(z.string()), // drives the category guess in `tool add`
})
```

The chosen design needs no per-category presentation fields (categories are typographic sections, not colour-coded). Adding a category is one object in `categories.json`.

Categories derived from the seven seeds, grouped by what the tool does:

| id | name | seed |
|---|---|---|
| dev-workflow | Dev workflow | gstack |
| research | Research | last30days |
| marketing | Marketing | Claude Ads |
| design | Design & diagrams | Archify |
| writing | Writing | No AI Slop |
| security | Security | SkillSpector |
| agent-teams | Agent teams | The Agency |

## 3. Everything derives from the collection

Nothing per tool is hardcoded outside its folder. `src/lib/data.ts` is the only place pages read content from:

- `getTools()` sorted (featured first, then newest).
- `getCategories()` returns **only categories with at least one tool**, each with its count. Category pages, the categories hub, the directory's sidebar, the footer and the sitemap all use it, so an empty category renders nothing.
- `relatedTools(tool)` ranks other tools by same category (+10) plus shared topic tags (+1 each), top 6 with score > 0. Kind and host tags (the vocabulary in `facets.json`) don't count: nearly every tool has them, so they made unrelated tools "related". Fewer, or none, is fine.
- Site-wide counts come from these arrays.

## 4. Routes and layouts

| Route | Content |
|---|---|
| `/` | Hero (the tagline as `h1`, one lead sentence, the search field), then the directory island: sections, "Works with" and "Kind" filters in a sidebar beside one list of icon rows, the first page of rows SSR'd before hydration. |
| `/tools/[slug]` | Breadcrumb · icon · name · tagline · section and kind chips · "What it is" · "When to use it" and "Caveats" cards · the screenshot when there is one · related tools; a sticky aside with the primary button, the repository button when both exist, and the details (links, hosts, topic tags, dates) · JSON-LD `SoftwareApplication` + `BreadcrumbList`. |
| `/categories` | Sections with tools: name, description, count and a few tool names. |
| `/categories/[slug]` | Breadcrumb · name · description · the same directory island scoped to the section (sections become links) · JSON-LD `ItemList` + `BreadcrumbList`. Unpaginated. |
| `/tools.json` | Prerendered index in the island's shape (§5). Nothing fetches it yet. |
| `/404` | A search field pre-filled from the dead address, a link to the sections. |
| `/sitemap-index.xml`, `/robots.txt` | Sitemap integration; robots in `public/`. |

Components: `Base.astro` (head, `<ClientRouter />`, header with a compact search on every page but home, footer), `Seo.astro` (rendered by `Base.astro` in the head: title, description, canonical, OG/Twitter, JSON-LD; a noindex page, the 404, gets no canonical or `og:url`, since it is served at whatever address was dead), `Directory.tsx` (the island; `Catalog.astro` mounts it on home and, scoped, on section pages), `ToolActions.astro` and `ToolDetails.astro` (the tool page's buttons and details). `src/lib/body.ts` splits the Markdown write-up at AST level into "What it is" and the two cards; `check` reads bodies with the same rule. `src/site.ts` holds the site's product strings (name, description, tagline, lead, footer note), the only file with them.

Lists show icons, never thumbnails. A tool without a thumbnail simply has no screenshot on its page, and its social share falls back to the site default `public/og.png` (made from `scripts/og.html`).

## 5. Search and filter

`Directory.tsx`, `client:load`.

- **Data.** The island gets the full list inline as props, and the server renders the first page of rows. The same shape is served at `/tools.json`. Fetching it instead of inlining is the plan past ~200 tools (a scaling ceiling, §10), not built.
- **State.** `q`, `section`, `host` and `kind` (comma lists), `order` (newest, the default featured-then-newest order, or A to Z), mirrored to the URL with `history.replaceState` and read once after hydration; unknown values are ignored. The mirror writes the whole query string from that state, so parameters it doesn't own (`utm_*` and the like) are dropped once the island hydrates: by design, the URL after load is the canonical address of the view. The fragment is kept. A filtered URL holds the list until the island has applied it, so the whole catalog never flashes.
- **Matching** (`src/lib/match.ts`, tested): normalise (lowercase, strip diacritics); every token must appear in name, tagline, tags or category name; name-prefix hits rank first, then name-contains, then the rest.
- **Filters** (`src/lib/filter.ts`, tested): sections single-select; "Works with" and "Kind" multi-select, OR inside a group, AND between groups and with search and section. Each option's count is what it would give with everything else applied. Options come from the vocabulary, only those in use, ordered by catalog-wide count; past 8 a group folds behind "N more". On phones the sections scroll sideways and the facets sit behind a "Filters" disclosure.
- **Keyboard.** `/` focuses the page's main search from anywhere (one site-wide handler, `src/lib/slash.ts`), with a control to turn it off, remembered in the browser (WCAG 2.1.4); only a device with any fine pointer (`any-pointer: fine`) has the shortcut and the control; a touch-only device has neither. Enter or ↓ in the field moves to the first result.
- Result summary (live region) naming the ticked hosts and kinds, each with a remove control, so a shared link says what it filters; empty state with "Clear search and filters", "Show more" in pages of 48 once there are that many.

## 6. Per-tool workflow

One script, `scripts/tool.ts`, exposed as npm scripts. Every command is idempotent and prints what it changed.

### Add

```
npm run tool add <repo-or-website-url> [<second-url>]
```

1. Classifies each URL: `github.com/<owner>/<repo>` is the repo, anything else is the website.
2. Repo: GitHub REST API (uses `GITHUB_TOKEN` or `gh auth token` when available, else anonymous) for name, description, topics, homepage, default branch, owner avatar. The README's H1 is used as the name when short and clean, else the repo name.
3. The repo's homepage becomes the `website` when it is a real site root (a domain root or a GitHub Pages project root); a deeper page is left out, since the repository already links it.
4. Website only: title, meta description and any GitHub repo link on the page.
5. Category guess: scores each category's `keywords` against topics + description + README. Prints the ranking so the reviewer can overrule it.
6. Slug from the repo or site name, kebab-case. Refuses to overwrite an existing folder.
7. Writes `src/content/tools/<slug>/index.md` with prefilled frontmatter, `added:` the listing time as a UTC timestamp (entries listed before this carry only their day, and sort A to Z within it), and a body placeholder `TODO(tooldex): write the body.`, then runs `thumbs` for it.

What is left for a human or agent: the body copy, the tagline polish, the tags, and the category if the guess is wrong.

### Thumbnails and icons

```
npm run tool thumbs [<slug>…] [--force]
```

Source order. The first that yields an image wins; a file already in the folder always wins unless `--force`.

| Tool has | Thumbnail | Icon |
|---|---|---|
| a website | site `og:image`/`twitter:image` if ≥ 640 px wide with aspect 1.3–2.2, else a Playwright screenshot | site's `apple-touch-icon` / `<link rel=icon>` / `/favicon.ico` (PNGs inside ICOs are extracted), else the owner's avatar |
| a repo only | the repo's **custom** social preview (`repository-images.githubusercontent.com`), else the first large README image (badges excluded, same size/aspect gate) | owner's GitHub avatar |
| nothing usable | none: the tool page shows no screenshot | owner's avatar |

GitHub's auto-generated repo card (`opengraph.githubassets.com`) is never used. Animated sources use their most detailed frame; near-uniform images (blank frames, flat-colour icons) are rejected. All images are normalised with sharp (thumb: centre crop to 1.91:1, ≤1600 px wide, webp q82; icon: 128×128 png) and the frontmatter `thumbnail:`/`icon:` lines are written to match. Each image records its provenance (source URL and date) for impeccable's scan. `--force` refetches but keeps the existing file if nothing new is found. Some thumbnails are screenshots captured by hand with Scrapling (a website's first screen, or a README section as rendered on GitHub), which the automatic sources can't reproduce: `--force` would replace them. A thumbnail must show something of the tool (the screenshot bar in `CLAUDE.md`).

### Edit

Edit `src/content/tools/<slug>/index.md`. Schema validation runs in `astro dev`, `astro check` and `astro build`: a bad URL, unknown category, missing image file or missing repo+website fails loudly with the file and field.

### Rename

```
npm run tool mv <old-slug> <new-slug>
```

Moves the folder and appends `/tools/<old> /tools/<new> 301` to `public/_redirects`, with the same rule for `/tools/<old>/`, rewriting any earlier redirect that pointed at `<old>` so chains never form.

### Delete

```
npm run tool rm <slug>
```

Removes the folder (entry and images together) and appends `/tools/<slug> /categories/<its-category> 301`, with the same rule for `/tools/<slug>/`, so inbound links and search results land somewhere useful. If that category becomes empty, the redirect points at `/` instead.

### Check

```
npm run check            # astro check (schema + types) then tool check
npm run tool check [--offline]
```

`tool check` verifies, for every tool:
- `index.md` exists in each folder, and no folder holds files other than `index.md`, `thumb.webp`, `icon.png` (orphans).
- Referenced images exist and carry provenance; a missing thumbnail is a note, not an error. A missing icon is an error.
- Body is not the `TODO` placeholder, and has exactly one non-empty `**When to use it:**` and one `**Caveats:**` paragraph, each label opening its paragraph (the same reader the tool page splits with).
- Every tag is lowercase kebab-case, and at least one is a kind from `facets.json`.
- Every `_redirects` rule is a static redirect (no splats, placeholders or 200 proxies; status 301, 302, 303, 307 or 308, 302 when left out, as Cloudflare does) and has its twin for the other form of its source (`/path` and `/path/`, same target and status), no source in either form is a live page, and every target is a live page in its bare form (`/x`, not `/x/`) or an off-site `http(s)` URL.
- Every category id referenced exists (also enforced by the schema).
- Unless `--offline`: `repo`, `website` and `links` return < 400 (HEAD, falling back to GET; 8 in parallel; 10 s timeout). A 403 carrying Cloudflare's `cf-mitigated: challenge` is a note ("behind a bot challenge, not verified"), not an error: the site is up but refuses scripts.

Exit code is non-zero on any error. `npm run build` runs `check --offline`, so unwritten bodies, orphans and broken redirects block a build. An unknown category also fails the build (Astro itself only logs it).

### Documentation

`README.md` documents setup, dev, deploy and the workflow above. `CLAUDE.md` has a "Managing tools" section with the exact commands and rules (website vs links, category keywords, body style), so any agent can add, edit or delete tools without reading the code.

## 7. SEO

- Unique title "{name}: {section} tool for AI agents · tooldex" (short enough not to be truncated; the tagline is too long for a title), meta description = tagline, canonical from `Astro.site`, OG/Twitter with the thumbnail (absolute URL) or the site default.
- JSON-LD: `SoftwareApplication` on tools, `ItemList` on categories, `BreadcrumbList` on both, `WebSite` on home.
- Internal linking: breadcrumbs, related tools, category links, footer categories, `/categories` hub.
- Sitemap, robots.txt, real 404 via `not_found_handling: "404-page"`, 301s for renamed and deleted tools.
- Content is static HTML; the island only enhances.
- Known weakness at launch: seven categories with one tool each. The pages are real (description + tool) but thin until more tools arrive.

## 8. Dev, build, deploy

`astro.config.mjs` essentials:

```js
export default defineConfig({
  site: 'https://tooldex.hellofilipe.dev',
  session: false,
  trailingSlash: 'never',
  build: { format: 'file' },
  adapter: cloudflare({ imageService: 'compile' }),
  integrations: [react(), sitemap()],
  server: { port: 4401 },
  vite: {
    cacheDir: process.argv.includes('dev') ? 'node_modules/.vite-dev' : undefined,
    plugins: [tailwindcss()],
    server: { allowedHosts: ['.test'] },
  },
});
```

Dev keeps its own Vite dep cache: `astro check` and `astro build` re-optimise deps into the default `node_modules/.vite/` and would delete chunks a running dev server still imports, so every page 500s until a restart.

`wrangler.jsonc`: `name: tooldex`, pinned personal `account_id`, adapter entrypoint, `nodejs_compat`, custom-domain route `tooldex.hellofilipe.dev` with `workers_dev: true` kept, assets `{ binding: ASSETS, directory: ./dist, not_found_handling: 404-page }`, observability on.

Scripts: `dev`, `build` (`astro check && tool check --offline && astro build`), `preview`, `deploy` (`npm run build && wrangler deploy`), `check`, `tool`, `test`.

Local: `herd proxy tooldex http://localhost:4401 --secure` once, then `npm run dev` serves `https://tooldex.test` (HMR works through the proxy). `npm run preview` runs the build in workerd; use it at `http://localhost:4401`, since its host check is separate from Vite's dev allowlist.

Git: public GitHub repo `filipecsweb/tooldex` (origin), personal gh account only, commits under the GitHub noreply email. Code is MIT; write-ups and data under `src/content/` are all rights reserved (see `LICENSE`). Commits at each step of §11.

Deploy: a push to `main` builds and deploys through Cloudflare Workers Builds (build `npm test && npm run build`, deploy `npx wrangler deploy`, Node from `.node-version`, preview builds off, the auto-created Workers Builds token with its default permissions; settings in README › Deploy). The online link check stays local. Manual fallback: confirm `npx wrangler whoami` matches the pinned `account_id`, then `npm run deploy`.

## 9. Starter-template hygiene

Generic: `astro.config.mjs`, `wrangler.jsonc`, `Base.astro`, `global.css` + `@theme`, `src/site.ts`, `.claude/` (impeccable), README setup sections.
Site-specific: `src/content*`, `src/pages/{tools,categories}`, `src/components/*`, `src/lib/*`, `scripts/tool.ts`, `PRODUCT.md`, `DESIGN.md`.

Nothing is parameterised now; the split is a README section. Copy the repo and delete the second list when the second site arrives.

## 10. Scaling ceilings

The ones that live in code carry a `ponytail:` comment there.

| What | Holds until | Then |
|---|---|---|
| Island gets the list inline as props | ~200 tools | Fetch `/tools.json` on mount (endpoint already exists). |
| In-memory token search | ~5k tools / ~1.2 MB JSON | Prebuilt MiniSearch index, or D1 + server rendering. |
| Unpaginated category pages | ~80 tools per category | Paginate with `paginate()`. |
| Home renders the first 48 rows in the HTML and every tool in the island's props | ~200 tools | Same switch as the inline index: fetch `/tools.json` instead of inlining every tool. |
| Images committed to git (~60 KB per tool) | a few thousand tools | Masters in R2, derived files at build. |
| Workers assets: 20k files, 25 MiB each | ~2.5k tools (≈7 built files per tool: page, icon, 4 screenshot widths, OG) | Move image variants to R2 / Cloudflare Images. |
| `_redirects`: 2,000 static rules, two per redirect (`/path` and `/path/`) | 1,000 renames + deletes | Bulk Redirects in Cloudflare, or prune rules older than a year. |
| Full rebuild on every change | ~2k tools (minutes of sharp) | Astro's image cache already persists in `node_modules/.astro`; then incremental builds. |
| Link check serial-ish (8 parallel) | ~1k links per run | Raise concurrency, cache results for 24 h. |
| GitHub API anonymous (60 req/h) | ~50 adds per hour | Set `GITHUB_TOKEN` (picked up automatically). |

## 11. Build order

1. Scaffold, config, wrangler, git init. Build passes. **Commit.**
2. Install impeccable project-local, run its init from this plan: `PRODUCT.md`, then design decisions in `DESIGN.md` and `global.css`. **Commit.**
3. Content config, `categories.json`, `src/lib/data.ts`, layouts and all pages with the seven tools (bodies written from each README). **Commit.**
4. `scripts/tool.ts` (`add`, `thumbs`, `mv`, `rm`, `check`) + tests; re-create the seven tools through `tool add` to prove it, then write bodies; run `thumbs`. **Commit.**
5. Island, `match.ts` + test, `/tools.json`, SEO (JSON-LD, OG, 404, robots, sitemap), README + CLAUDE.md, impeccable audit/polish pass, Herd proxy check at `https://tooldex.test`. **Commit.**
6. Stop. Owner runs `npx wrangler login`; then `npm run deploy`.

## 12. Seed data

The launch seed was these seven; the owner adds more with `tool add`. Each entry's own folder is the source of truth for its links.

| Tool | Repo |
|---|---|
| gstack | garrytan/gstack |
| last30days | mvanhorn/last30days-skill |
| Claude Ads | AgriciDaniel/claude-ads |
| Archify | tt-a1i/archify |
| No AI Slop | petergyang/no-ai-slop |
| SkillSpector | NVIDIA/SkillSpector |
| The Agency | msitarzewski/agency-agents |

## 13. Decisions (answers to the draft's open questions)

1. **Niche:** AI agent tooling. Categories grouped by what the tool does, derived from the seeds (§2).
2. **Domain:** workers.dev at launch; moved to `tooldex.hellofilipe.dev` (2026-10-01) to tie it to the owner's site.
3. **Seed:** the seven in §12 only.
4. **Thumbnails:** mixed sources per §6; never GitHub's auto-generated card; no image when nothing usable (no fallback card); manual file always wins. Icons: owner avatar for repo-only tools.
5. **Visual:** light theme only. impeccable decides type, colour and layout; the draft's font, hue and emoji choices are void.
6. **Submissions:** none.
7. **Analytics:** Cloudflare Web Analytics (2026-10-02, owner decision; was none). The zone setting injects the beacon at the edge, so nothing in the repo adds or configures it.
8. **Schema:** no extras beyond `repo` + `website` + other `links`, at least one of repo or website required. `pricing` dropped (§2).
9. **Rebuild (2026-10):** the UI was rebuilt in the owner-pinned direction A · Index; the first design and the image pipeline that served only it were deleted. Kept: every entry and URL, `_redirects`, the tool CLI, SEO, deploy, light theme only. Kinds and hosts became a filterable vocabulary (§2, §5), checked against each tool's own README and site.
