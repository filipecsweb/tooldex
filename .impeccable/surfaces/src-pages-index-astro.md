---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/pages/tools/[slug].astro","src/pages/categories/[slug].astro","src/pages/categories/index.astro"]
---

# Surface brief: tooldex catalog (home, tool entry, category section)

Scope: the whole public site. Home directory is Operate (find a tool); tool entry pages are Read (understand one tool, then leave for its source); category pages are Operate. Build path: code-led (no image generation in this harness).

Audience and job: agent power users arriving mostly from search on a single entry, deciding in under a minute whether a tool is worth installing. Action: follow the Access box to the tool's website or repo. Proof/content: seven real tools, their real thumbnails/avatars, tooldex's own write-ups. Constraints: light theme only, no rotting facts, no invented claims, scales from one tool per category to thousands.

## Direction contract

THESIS: tooldex is a catalog you read, not a feed you scroll: every tool is a reviewed catalog entry with an Access box, in the manner of the Whole Earth Catalog's "access to tools". It refuses the category default of a search hero over identical screenshot cards with pill tags.

OWN-WORLD: grey newsprint ground, warm black ink, one Earth-blue spot colour for links and the Access label only. Heavy black rules (2–4px) cut the page into pasted-up blocks; no hairline soup, no soft cards, no shadows. Libre Franklin at black weight for mastheads and entry names, Literata for review prose, Courier Prime only for access data (URLs, repo paths, tags). Thumbnails print as halftone plates multiplied into the paper; tools without images get a composed plate of their halftoned icon and their name set large.

STORY: the visitor sees at once that this is a catalog of agent tools, scans entries by what they do, reads a plain review, and leaves through Access.

FIRST VIEWPORT: full-width masthead: "tooldex" in Franklin black at display size on the left, the catalog statement and live entry/section counts on the right, a 4px rule under it. Directly below, one "Find" row: search field plus the section index (sections with counts) as the filter. Then the paste-up begins: three columns of entries, each a plate, a bold name, the tagline as the lead, and a boxed Access line, all visible above the fold at 1440px.

FORM: Whole Earth Catalog "Access to Tools" (Impeccable's pick, rank 1 of 7 on the grounded list); seed key dbd5d781. Signature interaction: a plate "develops" from halftone to full colour on hover/focus; on its entry page it is shown developed, after the review.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
