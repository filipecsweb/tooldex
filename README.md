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
| `npm run dev` | Dev server on port 4401. |
| `npm run build` | Type/schema check, offline tool check, then build to `dist/`. |
| `npm run preview` | Serve the build locally in workerd. |
| `npm run deploy` | Build and `wrangler deploy`. Needs `npx wrangler login` once. |
| `npm run check` | Schema check plus full tool check, including live links. |
| `npm test` | Unit tests for the search matcher, the filters, the facet vocabulary, the write-up split and the tool script helpers. |
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

**Refresh images**: `npm run tool -- thumbs <slug> --force` refetches; if no new source is found it keeps the existing file. To use your own image, drop `thumb.webp` (≈1.91:1, e.g. 1600×840) or `icon.png` (square) into the folder and run `npm run tool -- thumbs <slug>`: existing files win unless `--force`, and the command records them as supplied by hand. Some thumbnails are screenshots captured by hand (their sidecar names the source); `--force` would replace them, so leave it off for those. To drop a bad thumbnail, delete `thumb.webp` and `thumb.webp.json` and remove the `thumbnail:` line from `index.md` (`check` fails while it points at a missing file): the tool page then shows no screenshot, and lists only ever show icons.

**Rename**: `npm run tool -- mv <old> <new>`. Moves the folder and adds a 301 in `public/_redirects` for the old URL, with and without a trailing slash.

**Delete**: `npm run tool -- rm <slug>`. Removes the folder and 301s the old URL, with and without a trailing slash, to its category (or `/` if the category is now empty).

**Check**: `npm run tool -- check` validates every tool: folder contents (no orphaned files), frontmatter vs images, image provenance, unwritten bodies, the write-up's "When to use it" and "Caveats" paragraphs, tags (lowercase kebab-case, at least one kind), redirects, and that every link responds. Add `--offline` to skip the network.

**Kinds and hosts**: `src/content/facets.json` says which tags are kinds (skill, plugin, MCP server…) and which are hosts (Claude Code, Codex…), with their labels; every other tag is a topic. The home filters, the tool pages and `check` all read it. `CLAUDE.md` has the bar a tag must clear.

**Categories** live in `src/content/categories.json`. Adding one is one object (`id`, `name`, `description`, `keywords`). `keywords` drive the category guess in `add`. A category with no tools renders no page.

## Deploy

Live at https://tooldex.hellofilipe.dev (a Workers custom domain on the hellofilipe.dev zone, set by `routes` in `wrangler.jsonc`; the old https://tooldex.tooldex.workers.dev still answers and canonicalises to it). The Cloudflare account is pinned by `account_id` in `wrangler.jsonc`.

Every push to `main` deploys to production through Cloudflare Workers Builds (the Worker is connected to this repository in the dashboard, under the Worker's **Settings → Builds**). The build runs on Cloudflare with these settings:

| Setting | Value |
|---|---|
| Root directory | repository root |
| Production branch | `main` |
| Build command | `npm test && npm run build` |
| Deploy command | `npx wrangler deploy` |
| Preview builds | off |
| API token | the token Workers Builds creates, with its default permissions (kept in the dashboard, never in the repository) |

Node comes from `.node-version`. There are no build variables or secrets, and none belong in the repository. The Worker `name` in `wrangler.jsonc` must match the Worker connected in the dashboard. The Cloudflare GitHub app has access to this repository only.

A failed test, type check or content check fails the build and leaves the live site as it was. The online link check (`npm run check`) stays local.

Manual fallback, from a clean `main`:

```bash
npx wrangler whoami    # must be the account pinned in wrangler.jsonc
npm run deploy
```

If the domain changes, update `site` in `astro.config.mjs`, the sitemap line in `public/robots.txt` and the custom-domain route in `wrangler.jsonc`, then deploy.

## Starter-template split

Generic, reusable for the next site: `astro.config.mjs`, `wrangler.jsonc`, `src/layouts/`, `src/styles/`, `src/site.ts`, `.claude/` (impeccable), the Setup and Deploy sections above.
Site-specific: `src/content*`, `src/pages/tools`, `src/pages/categories`, `src/components/`, `src/lib/`, `scripts/`, `PRODUCT.md`, `DESIGN.md`.

## Licence

The code is MIT licensed (Copyright Filipe Seabra). The write-ups and curated data under `src/content/` are all rights reserved: read them here, but don't republish or adapt them without permission. Thumbnails, icons and logos of listed tools belong to their owners and are shown only to identify the tools. The vendored impeccable skill in `.claude/` is Apache-2.0. [LICENSE](LICENSE) has the details.
