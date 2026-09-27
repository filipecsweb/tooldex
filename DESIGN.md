---
name: tooldex
description: Agent tooling, explained plainly. A catalog in the manner of "access to tools", set on grey newsprint.
colors:
  paper: "#e9eae7"
  paper-2: "#dcddd9"
  ink: "#16150f"
  ink-2: "#45443c"
  ink-3: "#5f5e55"
  spot: "#1f55a6"
  spot-deep: "#163f7d"
typography:
  display:
    fontFamily: "Libre Franklin Variable, Franklin Gothic Medium, Arial Narrow, sans-serif"
    fontSize: "clamp(3.75rem, 13vw, 6rem)"
    fontWeight: 900
    lineHeight: 0.82
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Libre Franklin Variable, Franklin Gothic Medium, Arial Narrow, sans-serif"
    fontSize: "clamp(2.75rem, 7vw, 5.25rem)"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Libre Franklin Variable, Franklin Gothic Medium, Arial Narrow, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 850
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  title-lead:
    fontFamily: "Libre Franklin Variable, Franklin Gothic Medium, Arial Narrow, sans-serif"
    fontSize: "clamp(1.75rem, 3vw, 2.75rem)"
    fontWeight: 850
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  wordmark:
    fontFamily: "Libre Franklin Variable, Franklin Gothic Medium, Arial Narrow, sans-serif"
    fontSize: "2.125rem"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.045em"
  note:
    fontFamily: "Libre Franklin Variable, Franklin Gothic Medium, Arial Narrow, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 850
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  search:
    fontFamily: "Libre Franklin Variable, Franklin Gothic Medium, Arial Narrow, sans-serif"
    fontSize: "1.625rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "-0.01em"
  lead:
    fontFamily: "Literata Variable, Georgia, serif"
    fontSize: "clamp(1.25rem, 2.2vw, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.4
  body:
    fontFamily: "Literata Variable, Georgia, serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.62
  body-sm:
    fontFamily: "Literata Variable, Georgia, serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Libre Franklin Variable, Franklin Gothic Medium, Arial Narrow, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 700
    lineHeight: 1.5
  count:
    fontFamily: "Libre Franklin Variable, Franklin Gothic Medium, Arial Narrow, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.5
  access-label:
    fontFamily: "Libre Franklin Variable, Franklin Gothic Medium, Arial Narrow, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 900
    letterSpacing: "0.08em"
  data:
    fontFamily: "Courier Prime, Courier New, monospace"
    fontSize: "0.9375rem"
    fontWeight: 400
rounded:
  none: "0px"
spacing:
  gutter: "1rem"
  gutter-sm: "1.5rem"
  column-gap: "2.5rem"
  entry-gap: "3.5rem"
  container: "1320px"
components:
  access-cta:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1rem"
  access-cta-hover:
    backgroundColor: "{colors.spot}"
    textColor: "{colors.paper}"
  access-box:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "1.25rem"
  access-line:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.spot}"
    typography: "{typography.data}"
    rounded: "{rounded.none}"
    padding: "0.375rem 0.625rem"
  button-solid:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.375rem 0.75rem"
  button-outline:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.375rem 0.75rem"
  button-outline-hover:
    backgroundColor: "{colors.paper-2}"
  search-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.5rem 0"
  index-item:
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
  index-item-current:
    textColor: "{colors.ink}"
  plate:
    backgroundColor: "{colors.paper-2}"
    rounded: "{rounded.none}"
---

# Design System: tooldex

## Overview

**Creative North Star: "Access to Tools"**

tooldex is a catalog you read, not a feed you scroll. The world is a pasted-up newsprint catalog in the manner of the Whole Earth Catalog: grey paper, warm black ink, one Earth-blue spot colour, and heavy black rules that cut the page into blocks. Every tool is a reviewed entry: a printed plate, a bold name, the tagline as its lead, a plain review in a book serif, and a boxed Access line that sends the reader to the source.

Depth is not simulated; it is printed. Pictures arrive as real halftone plates, multiplied into the paper, and "develop" to their colour original only when the reader reaches for them. Hierarchy is carried by rule weight and type weight, never by cards, shadows or tint washes. The system is light-only by owner decision: there is no dark theme and no toggle, and nothing in it should be designed to invert.

Density is editorial rather than dashboard: a 1320px sheet, three columns of entries on desktop, generous 3.5rem gaps between entries, and prose held to a 66ch measure.

**Key Characteristics:**
- Grey newsprint ground, warm black ink, one spot blue.
- Heavy paste-up rules (4px section, 2px block, 3px boxes); square corners everywhere.
- Libre Franklin black for names and mastheads, Literata for reading, Courier Prime only for access data.
- Halftone plates that develop to colour on hover, focus, and on the entry page.
- A boxed Access line on every entry; the Access box is the primary action on every tool page.
- Light theme only.

## Colors

A three-ink newsprint palette: two papers, three ink strengths, and one spot blue with its pressed-deeper variant.

### Primary
- **Earth Spot Blue** (spot): the only colour on the sheet. Content links, the Access label, the focus ring (3px outline, 3px offset), the search caret and search-field focus underline, and the hover fill of the Access button. Nothing decorative is ever printed in it.
- **Pressed Spot Blue** (spot-deep): hover state of spot links.

### Neutral
- **Newsprint Grey** (paper): the page ground and `theme-color`. Also the text colour on solid ink.
- **Plate Grey** (paper-2): the unprinted plate bed behind every image and icon, the outline-button hover, the scrollbar track.
- **Warm Black Ink** (ink): headings, names, body on the masthead, every rule and box border, solid buttons, selection background, and the halftone dot colour itself.
- **Second Ink** (ink-2): taglines, review-adjacent secondary text, counts beside the masthead, index items at rest, plate source line.
- **Third Ink** (ink-3): meta text ("Filed under", captions, breadcrumb separators), index counts, empty sections, placeholders.

### Named Rules
**The One Spot Rule.** Spot blue marks what the reader can act on to leave or move: content links, the Access label, focus and caret, the Access button's hover. Navigation, headings, entry names and index items stay ink and underline instead.

**The Link Ink Rule.** Links inside content are spot with a 45%-spot underline (`color-mix(in oklab, spot 45%, transparent)`, 1.5px, offset 0.2em), deepening to spot-deep with a full underline on hover. Navigation links (masthead, breadcrumbs, footer sections, entry names) are ink with no underline at rest and a plain underline on hover or when current.

## Typography

**Display Font:** Libre Franklin Variable (with Franklin Gothic Medium, Arial Narrow)
**Body Font:** Literata Variable (with Georgia)

The Franklin and Literata latin files are preloaded, and each family falls back first to a local face (Arial, Georgia) resized to its metrics with `size-adjust` and ascent/descent overrides, so the swap moves nothing. The lead entry's plate is fetched at high priority; a colour original hidden under its halftone at low.
**Label/Mono Font:** Courier Prime (with Courier New), 400 only (the only weight access data uses)

**Character:** A black-weight grotesque that shouts like a catalog masthead, set against a patient book serif that does all the reading. Courier is the typewritten access data, nothing else. All numerals are tabular.

### Hierarchy
Every role below is a `--text-<role>` token in `@theme` (`src/styles/global.css`) carrying size, leading, tracking and weight together, used as `text-<role>`: display, headline, wordmark, title, title-lead, note, search, lead, body, body-sm, label, count. The sheet width is `--container-sheet` (`max-w-sheet`). New sizes join the ramp as tokens, never as one-off literals.

- **Display** (900, clamp(3.75rem, 13vw, 6rem), 0.82, -0.045em): the "tooldex" masthead on the home page only.
- **Headline** (900, clamp(2.75rem, 7vw, 5.25rem), 0.9, -0.04em): page H1s: tool name, section name, "Sections", "Not in the catalog".
- **Title** (850, 1.75rem, 1.02, -0.03em): entry names on cards; the lead entry scales to clamp(1.75rem, 3vw, 2.75rem). Section heads such as "See also" and "Other sections" use the same size at 900. Section rows on the sections page use clamp(1.75rem, 3.5vw, 2.5rem) at 900. Smaller heads: the "How to read an entry" note at 1.375rem 850, "See also" names at 1.25rem 800.
- **Lead** (Literata 400, clamp(1.25rem, 2.2vw, 1.5rem), 1.4, max 40ch): the tagline under an entry-page H1. On cards the tagline is body-sm in ink-2 (1.25rem on the lead entry).
- **Body** (Literata 400, 1.1875rem, 1.62, max 66ch): the review. Run-in heads ("When to use it:", "Caveats:") are Franklin 800 at 0.94em, inline.
- **Body-sm** (Literata 400, 1.0625rem, 1.5): taglines on cards, section descriptions, notes.
- **Label** (Franklin 600 to 800, 0.9375rem): navigation, field labels, result summaries, `dt` terms, captions and the card's "Filed under" line; index items (1.0625rem, 700).
- **Count** (Franklin 500, 0.8125rem, ink-3): counts beside section names in the index run and the footer.
- **Access label** (Franklin 900, 0.9375rem, uppercase, 0.08em): the word "Access" heading the Access box, in spot. On the card's Access line it runs at 0.8125rem, 850, 0.06em.
- **Data** (Courier Prime 400, 0.9375rem): URLs, repository paths, tags, and the plate source line.

### Named Rules
**The Typewriter Rule.** Courier Prime is only for access data: URLs (shown as host/path, breaking after a slash; a segment wider than its line wraps inside itself), repository paths, and tags. It never sets prose, headings, counts, dates or UI labels.

**The Weight Carries It Rule.** Names and heads are Franklin at 850 to 900 with tight negative tracking; there is no light or regular display. Reading text is never Franklin.

## Layout

One 1320px sheet, centred, with 1rem side gutters (1.5rem from 640px). The home masthead splits on a 12-column grid at 1024px: name in six columns, catalog statement and live counts in the other six. The Find row sits under it: search field over five fractions, the section index run over seven.

Entries paste up in a grid of one, two (640px) and three (1024px) columns with 2.5rem column gaps and 3.5rem row gaps. In the unfiltered catalog and on every section page the first entry leads across the full row, plate over two columns and text in the third; on the home page a "How to read an entry" note closes the grid. Entry pages use 12 columns: header, review and then the picture in eight, the Access box in four on the right, sticky from 1.5rem, spanning both rows. The explanation is the product, so the review comes before the picture. Below 1024px everything stacks in reading order: the header, then the Access box holding only its label and button, then the review and the picture, then the rest of the Access list (links, section, tags, date) as a block on a 2px rule headed "Details". The review starts on the first phone screen. Every grid declares `minmax(0, 1fr)` columns so a long URL or name can never widen the page; headings break a word wider than their column.

The first entry on a section rule sits directly on that 4px rule (0.75rem above its plate) and draws no 2px rule of its own, so a section never opens on a double rule. Section lists everywhere (index run, sections page, footer, 404, "Other sections") run A to Z by name; the footer's two columns read down, not across.

Rhythm is set by rules, not boxes: a section starts on a 4px rule with a small pad above its heading (0.75 to 1rem); a block inside it starts on a 2px rule with 0.75rem above. Larger breaks (4 to 5rem) sit before "See also" and "Other sections". Pagination adds entries 48 at a time.

## Elevation & Depth

Flat. There are no shadows anywhere, no tint washes, and no layering beyond the printed plate. Depth comes from printing: halftone ink multiplied over the colour original on a plate-grey bed. Navigation between pages is the router's plain cross-fade; nothing is carried across. (Plates used to fly from their card into the entry page; that ended when the entry-page picture moved below the review, where the flight would land off screen.)

### Named Rules
**The Printed Not Lifted Rule.** Nothing floats. Separation is a rule, a 2 to 3px ink box, or a change of paper (paper to paper-2); never a shadow, blur or rounded card.

## Shapes

Square everywhere (0 radius): buttons, fields, boxes, plates, icon frames. Borders are ink at deliberate weights that carry hierarchy: 4px for sections and the masthead base, 3px for the Access box and the search field underline, 2px for blocks, entry boxes, chips, the order select underline and icon frames. The hover underline in the index run is 3px.

### Named Rules
**The Paste-Up Rule.** Rule weight is the hierarchy: 4px opens a section, 2px opens a block, 3px frames the one box that matters (Access). Rules are ink at full strength; don't add grey hairlines to separate content.

## Components

### Plates (signature)
Every picture is a plate: a 1600:840 frame on plate grey, clipped, with the image anchored to its top.
- **How the material is made:** `scripts/plates.ts` runs before dev and build. Each thumbnail (at 840px, cropped to the card aspect keeping the top) and each icon (at 240px, uncropped) is flattened on white, greyscaled, tone-mapped for newsprint (2nd percentile to solid ink, 98th to bare paper, gamma 0.9; an image whose mean tone is under 0.4, such as a dark-UI screenshot, has its darkest tone lifted off solid ink by the shortfall, so it prints as an open screen instead of a black slab), blurred to half a cell, then screened as an amplitude-modulated halftone: 5px cells on a 45-degree screen, dot area tracking tone. Dots are printed in the ink colour (22, 21, 15) as alpha, saved as a 4-colour PNG (the screen needs no more; 16 cost 2.4 times the bytes) carrying a "Derived, not generated" provenance note.
- **How it sits:** the colour original is multiplied into the paper beneath; the halftone plate sits on top. While a plate exists, the colour original is hidden.
- **Developing:** on hover of the entry, or hover or focus of the link that wraps the plate, the halftone fades out and the colour comes up (opacity, 0.6s, `cubic-bezier(0.16, 1, 0.3, 1)`; instant under reduced motion). On entry pages the picture is already developed: a thumbnailed entry shows its colour image multiplied into the paper with no halftone; a composed plate is marked developed.

### Composed plate (fallback)
For tools without a thumbnail.
- **Card variant:** a grid inside the plate frame, padded 7% of its width: the halftoned icon (24% of the frame width) at left, the tool name set large at right in Franklin 900 (fitted to the longest word, max 5rem, 0.92 line height, -0.035em), and the source (repo path or host) in Courier across the foot on a 2px ink rule, in ink-2.
- **Quiet variant (entry page):** the H1 already carries the name, so the plate drops its fixed aspect and becomes a band: the icon at clamp(7rem, 22%, 11rem) on the left, the source line set on its rule beside it, aligned to the bottom. No name.

### Access
- **Access line (cards):** a 2px ink box, 0.375rem by 0.625rem, holding the spot "Access" label and the URL in Courier as a spot link with an outbound arrow drawn to Franklin's stroke weight. Below it, "Filed under" in ink-3 plus the section as a spot link at 600; omitted on a section's own page, where every card would repeat it.
- **Access box (entry page):** a 3px ink box, 1.25rem padding, sticky on desktop. "Access" heads it in spot capitals. Then the primary action: a full-width solid ink bar (Franklin 800, 1.0625rem, paper text, 0.75rem by 1rem) reading "Visit the website" or "View the repository" with the outbound arrow, turning spot on hover (0.15s). Below, a definition list: Website, Repository and other links in Courier; Filed under; Tags in Courier linking to a search; Listed date in ink-2.

### Buttons
- **Shape:** square, 2px ink border.
- **Solid:** ink ground, paper text, Franklin 700 at 0.9375rem (used for "Clear the search").
- **Outline:** transparent ground, ink text; hover fills plate grey (used for "Show more entries").
- **Focus:** the global 3px spot outline, 3px offset.

### Search field
Borderless except a 3px ink underline; Franklin 600 at 1.625rem, -0.01em. On focus the underline turns spot and no outline is drawn. The caret is spot; the placeholder ink-3. Its label is Franklin 800 with a light "(press /)" hint; "/" focuses it from anywhere. The hint is hidden from screen readers (the field carries `aria-keyshortcuts="/"`) and on touch screens; "/" ignores Ctrl, Cmd and Alt. Because a one-character shortcut can be fired by speech input or a stray key, a small "Turn off the / shortcut" button (count size, ink-3, underlined) sits at the right of the label row; the choice is remembered in this browser (WCAG 2.1.4). Enter or ↓ in the field moves focus to the first result, past the section filters, which form a labelled group ("Filter by section").

### Section index run
A typeset run of section names with counts that doubles as the filter (buttons with `aria-pressed` on home; links elsewhere, `aria-current` where applicable). Items wrap as whole names (never inside one) with 0.35rem by 1.5rem gaps; on phones (below 640px) the home filter run is a single line that scrolls sideways, bleeding to the screen edge, so the first screen reaches the entries, and the chosen section scrolls into view at 1.0625rem Franklin 700 in ink-2, counts at 0.8125rem 500 in ink-3. Hover: ink text over a 3px ink-3 underline. Current: ink text over a 3px ink underline. Empty sections drop to ink-3 at 500. It is reused as "Other sections". The 404 page does not repeat it (the footer already lists every section); it offers a search field instead, pre-filled from the dead address.

### Navigation
On touch screens (`pointer: coarse`) small text links (nav, breadcrumbs, Access list links and tags) get 0.5rem of vertical hit padding without changing the layout, and tag rows open to 0.75rem gaps.

Masthead: full on home (tagline and nav above a 2px rule, then the display name and statement, then a 4px rule), compact everywhere else (Franklin 900 name at 2.125rem left, nav right, 4px rule). Nav links are Franklin 700 ink, underlined on hover and when current. Breadcrumbs are ink links at 600, underlined on hover, with ink-3 slashes. The footer repeats the name, a Literata note and the section list with counts.

## Do's and Don'ts

### Do:
- **Do** open every section on a 4px ink rule and every block on a 2px ink rule.
- **Do** print every picture as a plate on paper-2 and let it develop to colour only on hover, focus, or its own entry page.
- **Do** give every tool without a thumbnail the composed plate: halftoned icon, name set large on cards, source in Courier on a 2px rule; the quiet band on its entry page.
- **Do** end every entry in an Access line or Access box, with the URL in Courier as host/path.
- **Do** keep spot blue for content links, the Access label, focus (ring and search underline), caret and the Access button's hover.
- **Do** set reading text in Literata at a 66ch measure; set names and heads in Franklin 850 to 900 with negative tracking.

### Don't:
- **Don't** use shadows, rounded corners, soft cards or tinted panels.
- **Don't** set anything but URLs, repository paths and tags in Courier Prime.
- **Don't** add colour beyond the single spot blue; images carry their own colour only once developed.
- **Don't** colour navigation, headings or entry names with the spot; they stay ink.
- **Don't** add a dark theme, a theme toggle, or colours chosen to survive inversion.
- **Don't** replace the section index run with pill tags or a dropdown.
