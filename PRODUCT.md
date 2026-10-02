# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Agent power users: developers and builders who already run Claude Code, Codex or a similar agent harness and are looking for add-ons (skills, plugins, subagents, MCP servers, CLIs) to extend it. They know what a skill, a plugin and an MCP server are; copy never explains those terms.

They arrive mostly from search, on a single tool page, wanting to know quickly what the tool is and whether it's worth installing. Some browse a category or the home directory to scan what exists for a job (research, security, marketing…).

## Product Purpose

tooldex is a public directory of AI agent tooling. Each entry explains, in plain language, what a tool actually does and when you would reach for it, then sends the visitor to the tool's own website or repository.

Success: a visitor understands a tool in under a minute and clicks through to its source, or finds the tool for a job without opening ten READMEs.

## Positioning

**Explained plainly.** Awesome-lists give a name and a one-liner; marketplaces show the author's own marketing. tooldex writes each entry itself: what the tool is for, how it works at a high level, when to use it, and honest caveats. It does not replace the tool's page; it's the fast, trustworthy summary that decides whether you go there.

## Operating Context

- Entry is usually a tool page reached from search, sometimes a category page or the home directory.
- Visitors are often mid-task in a terminal or editor, switching to the browser to evaluate an add-on.
- One curator (the owner) adds, edits and removes tools constantly via repo scripts; there are no user accounts, submissions, comments or ratings.
- Tools are grouped by the job they do (sections such as dev workflow, research, security or writing; the full list is `src/content/categories.json`), not by harness or by kind.

## Capabilities and Constraints

- Static site: Astro, prerendered, served from a Cloudflare Worker. Content lives in the repo, one Markdown file per tool.
- Per tool: name, tagline, category, tags, repo and/or website, other links, thumbnail (optional; shown on its own page only, never in lists), icon, body copy.
- Search and category filtering on the home directory.
- **Light theme only.** No dark mode, no toggle. (Owner decision.)
- No submissions, no accounts. Analytics is Cloudflare Web Analytics alone, switched on for the zone in the Cloudflare dashboard; the repo carries no analytics code.
- The catalogue starts at seven tools and will grow to hundreds or thousands; every surface must work with one tool in a category and with many.

## Brand Commitments

- Name: **tooldex**, always lowercase.
- Voice of write-ups: **light editorial**. Factual, plus a short "when to use it" and honest caveats (e.g. heavy setup, one harness only). No ratings, no scores, no hype.
- **No rotting facts.** Copy never states star counts, version numbers, counts of features/patterns/platforms, pricing, or install commands. The tool's own page is the source of truth for specifics; tooldex links to it.
- Identity: the lowercase **tooldex** wordmark set in Geist, a mark (a white "t" on an indigo rounded square, the favicon and share image), and the Index visual system recorded in `DESIGN.md`.

## Evidence on Hand

- Real tools with real repositories, READMEs, owner avatars, and in some cases websites, custom social images and screenshots (see `src/content/tools/`).
- No testimonials, user counts, press or partnerships. Never fabricate any.

## Product Principles

1. The explanation is the product. Every entry must say something the README's first paragraph doesn't.
2. Send people to the source. The primary action on every tool is leaving for its website or repo.
3. Durable over detailed. Prefer statements that stay true for a year over precise ones that rot in a week.
4. Scannable at any size. One tool or five thousand, a visitor finds the right one fast.
5. Curated, not crowd-sourced. One editor's consistent standard across every entry.

## Accessibility & Inclusion

WCAG 2.2 AA as the baseline: keyboard-operable search and filters, visible focus, sufficient contrast, meaningful alt text for thumbnails, reduced-motion respected for view transitions.
