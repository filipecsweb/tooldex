---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/pages/tools/[slug].astro","src/pages/categories/[slug].astro","src/pages/categories/index.astro"]
---

# Surface brief: tooldex catalog (home, tool entry, category section)

Scope: the whole public site. Home directory is Operate (find a tool for a job); tool entry pages are Read (understand one tool, then leave for its source); section pages are Operate (the home directory scoped to one section). Build path: code-led; the owner-approved artboards in `.impeccable/redesign/reference/` (home and tool, 1440 and 390) are the critique reference.

Audience and job: agent power users, often mid-task in a terminal, deciding in under a minute whether a tool is worth installing, or scanning what exists for a job. Action: open an entry or leave straight for the tool's site/repo from its row. Proof/content: the real catalog with each tool's icon and colour screenshot, tooldex's own write-ups, the kinds/hosts facet vocabulary. Constraints: light theme only, no rotting facts, no invented claims, scales from one tool per section to thousands.

Replaced the newsprint "Access to Tools" world entirely; DESIGN.md and `.impeccable/design.json` now record the built Index system.

## Direction contract

THESIS: tooldex is a dense, filterable index you operate, not a magazine you scroll: one ruled list of icon rows with the source link always one click away. It refuses the category default of a search hero over a grid of identical screenshot cards with pill tags.

OWN-WORLD: near-white ground (#FAFAF9) under a white list sheet, near-black ink, four grey inks down to a 4.5:1 meta grey, 1px warm-grey lines, one indigo accent (#2B37D6) reserved for links, the primary action, selection and focus. Geist for everything; Geist Mono only for access data (URLs, kinds, counts, the `/` key). Radii 12 containers, 9 to 10 controls, 7 rows and chips, 5 to 6 keys. No shadows but the focus halo; no gradients.

STORY: the visitor reads one sentence of what tooldex is, types or filters by section, host, kind and price, scans rows by name, job and tagline, then opens an entry or follows the mono access link out.

FIRST VIEWPORT: white 64px header (wordmark left, Catalog/Sections right); a 44px tagline H1, one lead sentence, a 56px search field with its `/` key; below, a 224px sidebar (Sections, Works with, Kind, Price) beside the summary line, Newest / A to Z switch and the white list sheet, its first rows above the fold at 1440x900.

FORM: Index (direction A), pinned by the owner on the design canvas; it overrides the roll. Seed key 834ea4fc (concept-seed run only for the key; its assignment is overridden by the owner's pin). Signature interaction: live faceted narrowing, every facet count answering "what would I get" as you type and tick, mirrored to a shareable URL.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

FINISH discharged (2026-10-02): the finish review ran on fresh desktop and touch-phone captures of every template (recapture, then fix with six material fixes, then a verdict pass scoring all six resolved: ship); DESIGN.md and `.impeccable/design.json` written from the build by the documenter; provenance scan over `src/content/tools` and `public` reports 0 missing.
