# tooldex — plan

A public directory of **AI agent tooling**: skills, plugins, subagents, MCP servers and CLIs for Claude Code, Codex and similar harnesses. Astro 7 + `@astrojs/cloudflare` v14, fully prerendered, deployed as a Cloudflare Worker with static assets. One content collection of tools, one React island for search, thumbnails through `astro:assets`, `<ClientRouter />`. SEO is the traffic source.

The per-tool workflow (add, edit, rename, delete, check) is a first-class feature. §6 specifies it.

Status: approved 2026-09-26 with the answers in §13. All six steps of §11 are done. Live at **https://tooldex.tooldex.workers.dev** (personal Cloudflare account, `account_id` pinned in `wrangler.jsonc`). This file stays the source of truth and reflects what was built.

---

## 1. Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | Astro 7, `output: 'static'` (default) | Every route prerendered. |
| Adapter | `@astrojs/cloudflare` v14, `imageService: 'compile'`, `session: false` | A fully static build deploys as an assets-only Worker (no Worker code); sharp runs at build time. Sessions are off so deploy doesn't provision an unused KV namespace. |
| UI island | `@astrojs/react`, one island | Decided. |
| Styling | Tailwind v4 via `@tailwindcss/vite`, tokens in CSS `@theme` | Same classes work in `.astro` and the React card. **Light theme only**: no dark mode, no toggle. |
| Design | [impeccable](https://github.com/pbakaus/impeccable) v4.3.1, project-local in `.claude/`, committed | Owner chose the **Access to Tools** direction (Whole Earth Catalog: grey newsprint, heavy rules, halftone plates, Access boxes). `PRODUCT.md`, `DESIGN.md` and `.impeccable/surfaces/` record the decisions. |
| Fonts | Libre Franklin (display/UI), Literata (review prose), Courier Prime (access data only), self-hosted via `@fontsource*` | No third-party font request. |
| SEO plumbing | `@astrojs/sitemap` | Meta and JSON-LD hand-written. |
| URLs | `trailingSlash: 'never'` + `build.format: 'file'` | Emits `tools/gstack.html`; Cloudflare's default `auto-trailing-slash` serves `/tools/gstack`. Dev and prod agree. |
| Redirects | `public/_redirects` | Native to Workers static assets. Written by the rename/delete commands. |
| Tool scripts | `scripts/tool.ts`, run by plain `node` (Node 24 strips TS) | One file, subcommands `add`, `thumbs`, `mv`, `rm`, `check`. |
| Screenshots | `playwright` (dev dep, Chromium only) + sharp | Local only, never in the Worker. |
| Halftone plates | `scripts/plates.ts` (sharp + a small AM-screen routine) → `src/generated/plates/` (gitignored) | The design prints every image as a real halftone; derived files regenerate before dev/build and after tool commands. |
| YAML | `yaml` (dev dep) | Scripts read and rewrite frontmatter. |
| Wrangler | `wrangler@4` dev dep | No global install. |
| Tests | `node --test` | Zero deps. Pure logic only: search matcher, category guess, homepage classifier. |

Not added: Fuse/MiniSearch, Pagefind, MDX, CMS, D1, icon library, state library, analytics, CI, submissions.

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
  tagline: z.string().max(160),              // card copy + meta description
  category: reference('categories'),         // typo fails the build
  tags: z.array(z.string()).default([]),     // kind (skill, plugin, subagents, mcp, cli) + hosts (claude-code, codex…) + topics
  repo: z.url().optional(),                  // source repository
  website: z.url().optional(),               // ONLY a real product/landing site
  links: z.array(z.object({ label: z.string(), url: z.url() })).default([]), // docs, articles, anything else
  thumbnail: image().optional(),             // ./thumb.webp
  icon: image().optional(),                  // ./icon.png
  featured: z.boolean().default(false),
  added: z.coerce.date(),
  updated: z.coerce.date().optional(),
}).refine(t => t.repo || t.website, { message: 'A tool needs a repo, a website, or both' })
```

Rules:
- **Primary CTA** goes to `website` if present, else `repo`.
- `website` is a real product or landing site (archify's GitHub Pages, claude-ads.md). A repo "homepage" that is a blog post or docs page goes in `links`.
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
- `getCategories()` returns **only categories with at least one tool**, each with its count. Category pages, the categories hub, the home strip, the footer and the sitemap all use it, so an empty category renders nothing.
- `relatedTools(tool)` ranks other tools by same category (+10) plus shared topic tags (+1 each), top 6 with score > 0. Kind and harness tags (`skill`, `mcp`, `claude-code`, `codex`…) don't count: nearly every tool has them, so they made unrelated tools "related". Fewer, or none, is fine.
- Site-wide counts come from these arrays.

## 4. Routes and layouts

| Route | Content |
|---|---|
| `/` | Hero (what tooldex is, count, search box), category strip, the directory island with every tool SSR'd as static cards first. |
| `/tools/[slug]` | Breadcrumb · icon · name · tagline · category · tags · primary CTA + repo/other links · thumbnail or fallback card · body · related tools · JSON-LD `SoftwareApplication` + `BreadcrumbList`. |
| `/categories` | Categories with tools, with counts and descriptions. |
| `/categories/[slug]` | Header (name, description, count) · grid of its tools · other categories · JSON-LD `ItemList`. Unpaginated. |
| `/tools.json` | Prerendered index for the island (§5). |
| `/404` | Search box + categories. |
| `/sitemap-index.xml`, `/robots.txt` | Sitemap integration; robots in `public/`. |

Components: `Base.astro` (head, canonical, OG/Twitter, JSON-LD, `<ClientRouter />`, header, footer), `ToolCard.tsx` (one card, rendered statically by Astro and by the island), `Thumb` (image or designed fallback card), `Directory.tsx` (island). `src/site.ts` holds the site name, URL, description and nav, the only file with product strings.

The **fallback** for tools without a thumbnail is a composed plate in HTML/CSS (halftoned icon, the name set large, the repo path), used on cards. Entry pages skip the plate in that case because the header already shows icon and name. Social shares fall back to the site default `public/og.png`.

## 5. Search and filter

`Directory.tsx`, `client:load`.

- **Data.** SSR'd with the full list as props while the list is small. The same shape is served at `/tools.json`; the island switches to fetching it once the inline payload grows past ~200 tools.
- **State.** `q`, `section`, `order` (newest, the default featured-then-newest order, or A to Z), mirrored to the URL with `history.replaceState`. `/` focuses the search field.
- **Matching** (`src/lib/match.ts`, tested): normalise (lowercase, strip diacritics); every token must appear in name, tagline, tags or category name; name-prefix hits rank first, then name-contains, then the rest.
- Category chips with counts, result count, grid, empty state. "Show more" in pages of 48 once there are that many.

## 6. Per-tool workflow

One script, `scripts/tool.ts`, exposed as npm scripts. Every command is idempotent and prints what it changed.

### Add

```
npm run tool add <repo-or-website-url> [<second-url>]
```

1. Classifies each URL: `github.com/<owner>/<repo>` is the repo, anything else is the website.
2. Repo: GitHub REST API (uses `GITHUB_TOKEN` or `gh auth token` when available, else anonymous) for name, description, topics, homepage, default branch, owner avatar. The README's H1 is used as the name when short and clean, else the repo name.
3. Homepage classifier: a domain root or a GitHub Pages project root is a `website`; a deep path (blog post, docs page) becomes a `links` entry labelled Docs or Article.
4. Website only: title, meta description and any GitHub repo link on the page.
5. Category guess: scores each category's `keywords` against topics + description + README. Prints the ranking so the reviewer can overrule it.
6. Slug from the repo or site name, kebab-case. Refuses to overwrite an existing folder.
7. Writes `src/content/tools/<slug>/index.md` with prefilled frontmatter, `added: today`, and a body placeholder `TODO(tooldex): write the body.`, then runs `thumbs` for it.

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
| nothing usable | none: the designed fallback card renders | owner's avatar |

GitHub's auto-generated repo card (`opengraph.githubassets.com`) is never used. Animated sources use their most detailed frame; near-uniform images (blank frames, flat-colour icons) are rejected. All images are normalised with sharp (thumb: centre crop to 1.91:1, ≤1600 px wide, webp q82; icon: 128×128 png) and the frontmatter `thumbnail:`/`icon:` lines are written to match. Each image records its provenance (source URL and date) for impeccable's scan. `--force` refetches but keeps the existing file if nothing new is found.

### Edit

Edit `src/content/tools/<slug>/index.md`. Schema validation runs in `astro dev`, `astro check` and `astro build`: a bad URL, unknown category, missing image file or missing repo+website fails loudly with the file and field.

### Rename

```
npm run tool mv <old-slug> <new-slug>
```

Moves the folder and appends `/tools/<old> /tools/<new> 301` to `public/_redirects`, rewriting any earlier redirect that pointed at `<old>` so chains never form.

### Delete

```
npm run tool rm <slug>
```

Removes the folder (entry and images together) and appends `/tools/<slug> /categories/<its-category> 301` so inbound links and search results land somewhere useful. If that category becomes empty, the redirect points at `/` instead.

### Check

```
npm run check            # astro check (schema + types) then tool check
npm run tool check [--offline]
```

`tool check` verifies, for every tool:
- `index.md` exists in each folder, and no folder holds files other than `index.md`, `thumb.webp`, `icon.png` (orphans).
- Referenced images exist and carry provenance; a missing thumbnail is reported as "uses fallback", not an error. A missing icon is an error.
- Body is not the `TODO` placeholder.
- Every `_redirects` source is not a live page, and every target resolves to a live page or category.
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
  site: 'https://tooldex.tooldex.workers.dev',
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

`wrangler.jsonc`: `name: tooldex`, pinned personal `account_id`, adapter entrypoint, `nodejs_compat`, assets `{ binding: ASSETS, directory: ./dist, not_found_handling: 404-page }`, observability on.

Scripts: `dev`, `build` (`astro check && tool check --offline && astro build`), `preview`, `deploy` (`npm run build && wrangler deploy`), `check`, `tool`, `test`.

Local: `herd proxy tooldex http://localhost:4401 --secure` once, then `npm run dev` serves `https://tooldex.test` (HMR works through the proxy). `npm run preview` runs the build in workerd; use it at `http://localhost:4401`, since its host check is separate from Vite's dev allowlist.

Git: public GitHub repo `filipecsweb/tooldex` (origin), personal gh account only, commits under the GitHub noreply email. Code is MIT; write-ups and data under `src/content/` are all rights reserved (see `LICENSE`). Commits at each step of §11.

Deploy: a push to `main` builds and deploys through Cloudflare Workers Builds (build `npm test && npm run build`, deploy `npx wrangler deploy`, Node from `.node-version`, preview builds off, the auto-created Workers Builds token with its default permissions; settings in README › Deploy). The online link check stays local. Manual fallback: confirm `npx wrangler whoami` matches the pinned `account_id`, then `npm run deploy`.

## 9. Starter-template hygiene

Generic: `astro.config.mjs`, `wrangler.jsonc`, `Base.astro`, `global.css` + `@theme`, `src/site.ts`, `.claude/` (impeccable), README setup sections.
Site-specific: `src/content*`, `src/pages/{tools,categories}`, `Directory.tsx`, `ToolCard.tsx`, `src/lib/*`, `scripts/tool.ts`, `PRODUCT.md`, `DESIGN.md`.

Nothing is parameterised now; the split is a README section. Copy the repo and delete the second list when the second site arrives.

## 10. Scaling ceilings

The ones that live in code carry a `ponytail:` comment there.

| What | Holds until | Then |
|---|---|---|
| Island gets the list inline as props | ~200 tools | Fetch `/tools.json` on mount (endpoint already exists). |
| In-memory token search | ~5k tools / ~1.2 MB JSON | Prebuilt MiniSearch index, or D1 + server rendering. |
| Unpaginated category pages | ~80 tools per category | Paginate with `paginate()`. |
| Home renders every card in the HTML (48 shown, "Show more") | ~200 tools | Same switch as the inline index: fetch `/tools.json`, SSR only the first page. |
| Images committed to git (~60 KB per tool) | a few thousand tools | Masters in R2, derived files at build. |
| Workers assets: 20k files, 25 MiB each | ~2.5k tools (≈7 built files per tool: page, card thumb, icon, 4 hero widths, OG) | Move image variants to R2 / Cloudflare Images. |
| `_redirects`: 2,000 static rules | 2,000 renames + deletes | Bulk Redirects in Cloudflare, or prune rules older than a year. |
| Halftone generation (≈0.1 s per tool, skipped when up to date) | ~5k tools on a clean checkout | Cache plates in CI or move them to R2 with the images. |
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

Exactly seven, nothing else. The owner adds more with `tool add`.

| Tool | Repo | Website | Other links |
|---|---|---|---|
| gstack | garrytan/gstack | — | — |
| last30days | mvanhorn/last30days-skill | — | — |
| Claude Ads | AgriciDaniel/claude-ads | https://claude-ads.md | — |
| Archify | tt-a1i/archify | https://tt-a1i.github.io/archify/ | — |
| No AI Slop | petergyang/no-ai-slop | — | Article (creatoreconomy.so) |
| SkillSpector | NVIDIA/SkillSpector | — | Docs (docs.nvidia.com) |
| The Agency | msitarzewski/agency-agents | https://agencyagents.app | — |

## 13. Decisions (answers to the draft's open questions)

1. **Niche:** AI agent tooling. Categories grouped by what the tool does, derived from the seeds (§2).
2. **Domain:** workers.dev for now.
3. **Seed:** the seven in §12 only.
4. **Thumbnails:** mixed sources per §6; never GitHub's auto-generated card; designed fallback card last; manual file always wins. Icons: owner avatar for repo-only tools.
5. **Visual:** light theme only. impeccable decides type, colour and layout; the draft's font, hue and emoji choices are void.
6. **Submissions:** none.
7. **Analytics:** none.
8. **Schema:** no extras beyond `repo` + `website` + other `links`, at least one of repo or website required. `pricing` dropped (§2).
