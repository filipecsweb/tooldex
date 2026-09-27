# tooldex

Directory of AI agent tooling. Astro 7 static site on a Cloudflare Worker. Read `PLAN.md` for decisions, `PRODUCT.md` for audience and voice, `DESIGN.md` for the visual system.

- Dev server: `npm run dev` on port 4401, proxied at https://tooldex.test.
- Before committing: `npm test` and `npm run check`.
- Local git only; no remote.

## Managing tools

Tools are data, not code. Each tool is `src/content/tools/<slug>/` containing `index.md`, optional `thumb.webp` + `thumb.webp.json` (provenance sidecar), and `icon.png` (provenance in a PNG text chunk). Never put tool-specific facts anywhere else (no hardcoded names, counts or lists in pages or components).

### Commands (always pass `--` after `npm run tool`)

- Add: `npm run tool -- add <repo-url> [<website-url>] [--slug s] [--category id]`
- Refresh images: `npm run tool -- thumbs <slug> [--force]`
- Rename: `npm run tool -- mv <old-slug> <new-slug>` (adds a 301 in `public/_redirects`)
- Delete: `npm run tool -- rm <slug>` (removes folder + images, adds a 301)
- Validate everything: `npm run check` (or `npm run tool -- check --offline` to skip link checks)

Never rename or delete tool folders by hand; use `mv` and `rm` so redirects stay correct. `public/_redirects` may be edited by hand; `check` validates it.

### After `add`, finish the entry

1. **Category**: confirm the guessed `category` is the job the tool does (`src/content/categories.json`). Group by what it does, not by harness or by kind.
2. **Links**: `repo` is the source repository. `website` is only a real product or landing site. A blog post, docs page or article goes in `links` as `{ label, url }` (labels: Docs, Article, Homepage, or something specific). At least one of `repo`/`website` is required. The primary button goes to `website` if set, else `repo`.
3. **Tagline**: one sentence, ≤160 chars, says what the tool does for the user. It is the meta description.
4. **Tags**: lowercase kebab-case. Include the kind (`skill`, `plugin`, `subagents`, `mcp`, `cli`), the hosts it clearly supports (`claude-code`, `codex`, `cursor`, `gemini-cli`, …) and two or three topics. Tags feed search and related tools.
5. **Body**: replace `TODO(tooldex): write the body.` with the write-up.
6. Run `npm run check` and fix anything it reports.

### Write-up style (light editorial)

Read the tool's README and website first. Then write, in this order:

- 1–2 paragraphs: what it is and how it works at a high level, in plain language. The reader knows what skills, plugins and MCP servers are; don't explain those.
- `**When to use it:**` one short paragraph of concrete situations.
- `**Caveats:**` one short paragraph of honest, durable limits (setup weight, single harness, needs API keys, quality varies).

Rules:

- **No rotting facts.** No star counts, version numbers, counts of features/skills/platforms/patterns, prices, benchmarks or install commands. The tool's own page is the source of truth for specifics; say "the major ad platforms", not "12 ad platforms".
- No hype, no ratings, no invented claims or testimonials.
- British or American spelling is fine; be consistent within an entry.
- Use the existing entries in `src/content/tools/` as the reference for length and tone.

### Images

`add`/`thumbs` choose sources in this order; a file already in the folder always wins unless `--force`:

- Tool with a website: its `og:image` (≥640px wide, landscape), else a Playwright screenshot. Icon: the site's apple-touch-icon / icon / favicon, else the GitHub owner's avatar.
- Repo only: the repo's custom social preview (never GitHub's auto-generated card), else the first large README image. Icon: the owner's avatar.
- Nothing usable: no `thumb.webp`; the site renders a designed fallback card. That is fine, not an error.

Every image records where it came from (impeccable's provenance scan: `.claude/skills/impeccable/scripts/impeccable embed-prompt --scan src/content/tools public`); `thumbs` writes it, `check` enforces it. Check any new thumbnail visually: a blank, logo-only or misleading image should be replaced by hand (drop in a file, run `thumbs <slug>`) or deleted together with its `.json` sidecar.
