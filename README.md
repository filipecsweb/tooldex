# tooldex

A public directory of AI agent tooling: skills, plugins, subagents, MCP servers and CLIs for Claude Code, Codex and similar harnesses, each explained plainly.

Astro 7, fully prerendered, served by a Cloudflare Worker (static assets only). `PLAN.md` is the source of truth for decisions; `PRODUCT.md` and `DESIGN.md` hold product and design context for impeccable.

## Setup

```bash
npm install
npx playwright install chromium   # only needed for website screenshots in `tool -- thumbs`
herd proxy tooldex http://localhost:4401 --secure   # once
npm run dev                       # https://tooldex.test (or http://localhost:4401)
```

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Generates halftone plates, then the dev server on port 4401. |
| `npm run build` | Generates plates, type/schema check, offline tool check, then build to `dist/`. |
| `npm run preview` | Serve the build locally in workerd. |
| `npm run deploy` | Build and `wrangler deploy`. Needs `npx wrangler login` once. |
| `npm run check` | Schema check plus full tool check, including live links. |
| `npm test` | Unit tests for the search matcher and the tool script helpers. |
| `npm run tool -- <cmd>` | Per-tool workflow, below. |

## Managing tools

Each tool is one folder: `src/content/tools/<slug>/` with `index.md` (frontmatter + write-up), `thumb.webp` (optional) plus its provenance sidecar `thumb.webp.json`, and `icon.png` (provenance embedded in the file). The folder name is the slug and the URL, `/tools/<slug>`. Nothing about a tool lives anywhere else: counts, category pages, related tools and the search index all derive from these folders.

**Add**

```bash
npm run tool -- add https://github.com/owner/repo
npm run tool -- add https://github.com/owner/repo https://product-site.com   # repo + website
npm run tool -- add https://product-site.com                                  # website only
# options: --slug <slug>  --category <id>
```

It prefills name, tagline, tags, links and a category guess from the GitHub API (uses `GITHUB_TOKEN` or `gh auth token` if present), then fetches the thumbnail and icon. Then:

1. Replace the `TODO(tooldex)` body with the write-up (see the style rules in `CLAUDE.md`).
2. Tighten the tagline, prune tags, confirm the category.
3. `npm run check`.

**Edit**: edit `index.md`. Mistakes (bad URL, unknown category, missing image, no repo and no website) fail `npm run check` and `npm run build`.

**Refresh images**: `npm run tool -- thumbs <slug> --force` refetches; if no new source is found it keeps the existing file. To use your own image, drop `thumb.webp` (≈1.91:1, e.g. 1600×840) or `icon.png` (square) into the folder and run `npm run tool -- thumbs <slug>`: existing files win unless `--force`, and the command records them as supplied by hand. To drop a bad thumbnail in favour of the fallback card, delete `thumb.webp` and `thumb.webp.json`.

**Rename**: `npm run tool -- mv <old> <new>`. Moves the folder and adds a 301 in `public/_redirects`.

**Delete**: `npm run tool -- rm <slug>`. Removes the folder and 301s the old URL to its category (or `/` if the category is now empty).

**Check**: `npm run tool -- check` validates every tool: folder contents (no orphaned files), frontmatter vs images, image provenance, unwritten bodies, redirects, and that every link responds. Add `--offline` to skip the network.

**Halftone plates**: the catalog prints every thumbnail and icon as a halftone. `scripts/plates.ts` derives them into `src/generated/plates/` (gitignored). They regenerate automatically before `dev` and `build` and after `thumbs`, `mv` and `rm`, so there is nothing to maintain by hand.

**Categories** live in `src/content/categories.json`. Adding one is one object (`id`, `name`, `description`, `keywords`). `keywords` drive the category guess in `add`. A category with no tools renders no page.

## Deploy

```bash
npx wrangler login     # once, interactive
npm run deploy         # -> https://tooldex.<account>.workers.dev
```

After the first deploy, set `site` in `astro.config.mjs` and `public/robots.txt` to the real URL and deploy again.

## Starter-template split

Generic, reusable for the next site: `astro.config.mjs`, `wrangler.jsonc`, `src/layouts/`, `src/styles/`, `src/site.ts`, `.claude/` (impeccable), the Setup and Deploy sections above.
Site-specific: `src/content*`, `src/pages/tools`, `src/pages/categories`, `src/components/`, `src/lib/`, `scripts/`, `PRODUCT.md`, `DESIGN.md`.
