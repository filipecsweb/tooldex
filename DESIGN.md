---
name: tooldex
description: A dense, filterable index of agent tooling: one ruled list of icon rows on a white sheet, with the source one click away.
colors:
  ground: "#fafaf9"
  surface: "#ffffff"
  ink: "#111113"
  ink-2: "#24242a"
  ink-3: "#3a3a42"
  ink-4: "#5a5a63"
  meta: "#6a6a74"
  line: "#e5e5e2"
  line-soft: "#ecece9"
  line-strong: "#d6d6d2"
  fill: "#f1f1ef"
  fill-soft: "#f8f8f6"
  accent: "#2b37d6"
  accent-deep: "#1c258f"
  accent-tint: "#e9ebfd"
  halo: "#e3e6fd"
  caveat: "#9a4a00"
typography:
  display:
    fontFamily: "Geist Variable, Geist Fallback, system-ui, sans-serif"
    fontSize: "clamp(2.125rem, 1.5rem + 2.6vw, 2.75rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  wordmark:
    fontFamily: "Geist Variable, Geist Fallback, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.03em"
  tagline:
    fontFamily: "Geist Variable, Geist Fallback, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.45
  lead:
    fontFamily: "Geist Variable, Geist Fallback, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  heading:
    fontFamily: "Geist Variable, Geist Fallback, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  prose:
    fontFamily: "Geist Variable, Geist Fallback, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.7
  title:
    fontFamily: "Geist Variable, Geist Fallback, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Geist Variable, Geist Fallback, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "\"tnum\""
  row:
    fontFamily: "Geist Variable, Geist Fallback, system-ui, sans-serif"
    fontSize: "0.90625rem"
    fontWeight: 400
    lineHeight: 1.45
  ui:
    fontFamily: "Geist Variable, Geist Fallback, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.45
  caption:
    fontFamily: "Geist Variable, Geist Fallback, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "Geist Variable, Geist Fallback, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.07em"
  data:
    fontFamily: "Geist Mono Variable, Geist Mono Fallback, ui-monospace, monospace"
    fontSize: "0.78125rem"
    fontWeight: 400
    lineHeight: 1.45
  micro:
    fontFamily: "Geist Variable, Geist Fallback, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  sheet: "12px"
  control: "9px"
  row: "7px"
  key: "5px"
spacing:
  gutter-touch: "16px"
  gutter: "32px"
  row-y: "16px"
  row-x: "20px"
  sheet-pad: "20px"
  header: "64px"
  sidebar: "224px"
  sidebar-gap: "40px"
  aside: "320px"
  sheet-max: "1280px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.surface}"
    typography: "{typography.ui}"
    rounded: "{rounded.control}"
    padding: "10px 16px"
  button-primary-hover:
    backgroundColor: "{colors.accent-deep}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-2}"
    typography: "{typography.ui}"
    rounded: "{rounded.control}"
    padding: "10px 16px"
  button-secondary-hover:
    backgroundColor: "{colors.fill}"
  search-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.lead}"
    rounded: "{rounded.sheet}"
    padding: "0 16px"
    height: "56px"
  search-field-compact:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    typography: "{typography.ui}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "40px"
  nav-link:
    textColor: "{colors.ink-3}"
    typography: "{typography.ui}"
    rounded: "{rounded.control}"
    padding: "8px 12px"
  nav-link-current:
    backgroundColor: "{colors.fill}"
    textColor: "{colors.ink}"
  section-item:
    textColor: "{colors.ink-2}"
    typography: "{typography.ui}"
    rounded: "{rounded.row}"
    padding: "6px 10px"
  section-item-selected:
    backgroundColor: "{colors.accent-tint}"
    textColor: "{colors.accent-deep}"
  filter-chip:
    backgroundColor: "{colors.accent-tint}"
    textColor: "{colors.accent-deep}"
    typography: "{typography.caption}"
    rounded: "{rounded.row}"
    padding: "2px 8px"
  filter-chip-hover:
    backgroundColor: "{colors.halo}"
  tag-chip:
    backgroundColor: "{colors.fill}"
    textColor: "{colors.ink-3}"
    rounded: "{rounded.key}"
    padding: "2px 7px"
  kind-badge:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-3}"
    typography: "{typography.caption}"
    rounded: "{rounded.row}"
    padding: "0 10px"
    height: "28px"
  order-switch-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    typography: "{typography.caption}"
    rounded: "{rounded.row}"
    padding: "6px 12px"
  list-sheet:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.sheet}"
  list-row:
    backgroundColor: "{colors.surface}"
    padding: "16px 20px"
  list-row-hover:
    backgroundColor: "{colors.fill-soft}"
  key:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink-4}"
    typography: "{typography.micro}"
    rounded: "{rounded.key}"
    padding: "2px 8px"
---

# Design System: tooldex

## Overview

**Creative North Star: "The Index"**

tooldex is a dense, filterable index you operate, not a magazine you scroll. Every surface is built from the same few parts: a near-white ground, white sheets ruled by 1px warm-grey lines, near-black ink stepped down through four greys, and one indigo accent that only ever means "you can act here" or "this is chosen". The reader's eye runs down a list of icon rows by name, section and tagline, and the way out to the tool's own site sits at the end of every row in mono.

Density is the point, not a side effect. Rows are compact, counts sit beside every facet, and the page answers "what would I get" as you type and tick, mirrored to a shareable URL. Decoration is refused: no gradients, no shadows except the focus halo, no screenshot-card grid with pill tags. Colour screenshots appear only on a tool's own page, framed in the same ruled sheet as everything else.

The theme is light only, by owner decision. There is no dark mode and no surface should assume one.

**Key Characteristics:**
- One white list sheet of ruled icon rows on a near-white ground.
- One indigo accent, reserved for links, the primary action, selection and focus.
- Geist for everything; Geist Mono only for access data.
- Flat: 1px lines and tonal fills carry all structure; the focus halo is the only shadow.
- Four radii, each tied to a scale of object (sheet, control, row, key).
- Every target is at least 44px on touch screens.

## Colors

A cool-neutral greyscale with a faint warm cast in the lines, and a single saturated indigo.

### Primary
- **Index Indigo** (accent): links, the primary button, the text caret, the focus ring, checked checkboxes, the halo border on a focused search field.
- **Deep Indigo** (accent-deep): hover state for every accent element; the text colour on accent-tint selections and on `::selection`.
- **Indigo Wash** (accent-tint): the background of a selected section, an active filter chip, the section badge on a tool page, the "N on" count on the mobile Filters button, and text selection.
- **Halo Indigo** (halo): the 3px focus halo around search fields; also the hover background of accent-tint chips.

### Tertiary
- **Caveat Amber** (caveat): only the warning-triangle icon on the "Caveats" card. It is never text, never a fill, never a second accent.

### Neutral
- **Near-White Ground** (ground): the page, the browser chrome (theme-color reads it from the token), the compact header search and key caps.
- **Sheet White** (surface): the header, footer, list sheets, cards, aside, controls; also text on accent and ink fills.
- **Near-Black Ink** (ink): headlines, row names, current nav item.
- **Ink 2** (ink-2): the write-up prose, facet option text, the text of the "Show more" and Filters buttons.
- **Ink 3** (ink-3): navigation, breadcrumbs, quiet controls, card text, tag chips.
- **Ink 4** (ink-4): taglines, the lead, the empty-state help line, key-cap glyphs.
- **Meta Grey** (meta): counts, group labels, field placeholders, search icons, captions, zero-result options. This is the lightest text colour allowed.
- **Line** (line): sheet and card borders, the header and footer rules, icon frames, the write-up's top rule.
- **Soft Line** (line-soft): the rules between rows inside a sheet.
- **Strong Line** (line-strong): borders on interactive fields and controls (search fields, secondary buttons, the order switch, key caps), and the scrollbar thumb.
- **Fill** (fill): hover background for nav, options and buttons; icon wells; tag chips; inline `code`.
- **Soft Fill** (fill-soft): the hover background of a list row.

### Named Rules
**The One Voice Rule.** Indigo means "act here" or "chosen", nothing else. It is never decoration, never a heading colour, never a background panel.

**The Meta Floor Rule.** Meta Grey is the lightest text on the site, chosen to hold 4.5:1 on every ground including Indigo Wash. No text goes lighter, even for de-emphasis; dim with size or weight instead.

**The Lines Before Fills Rule.** Containers are white with a 1px line. Interactive borders step up to Strong Line; dividers inside a sheet step down to Soft Line. Fills are for hover, wells and chips.

## Typography

**Display Font:** Geist Variable (with Geist Fallback, then system-ui)
**Body Font:** Geist Variable (with Geist Fallback, then system-ui)
**Label/Mono Font:** Geist Mono Variable (with Geist Mono Fallback, then ui-monospace)

**Character:** One neutral grotesque at every size, tightened as it grows, so the hierarchy comes from size, weight and tracking rather than from a second voice. Mono is reserved for the data a reader would copy or count.

Both fonts are self-hosted through Fontsource and the latin files are preloaded. **Geist Fallback** (local Arial, Liberation Sans or Helvetica at 105.85% size-adjust, 94.94% ascent, 27.87% descent, 0 line gap) and **Geist Mono Fallback** (local Courier New, Liberation Mono or Courier at 100% size-adjust, 100.5% ascent, 29.5% descent, 0 line gap) are metric-matched local faces, so text painted before the web fonts arrive takes the same space and the swap shifts nothing. They are part of the system: any new font stack names its fallback face second.

Numerals are tabular site-wide, so counts line up in their columns. Headings balance their lines and break long single-word names anywhere rather than overflow.

### Hierarchy
- **Display** (600, fluid 34 to 44px, 1.05, -0.035em): the one h1 per page: the home tagline, a section name, a tool name.
- **Wordmark** (700, 20px, 1, -0.03em): the site name in the header; the footer repeats its tracking at caption size.
- **Tagline** (400, 20px, 1.45): a tool's tagline under its h1, in Ink 4, at most 60ch.
- **Lead** (400, 17px, 1.55): the one-sentence intro under a home, section or 404 h1, in Ink 4, at most 62ch; also the main search field's text.
- **Heading** (600, 20px, 1.3, -0.02em): section heads below the fold ("What it is", "Related tools") and section names on the sections index.
- **Prose** (400, 17px, 1.7): the write-up, at most 68ch.
- **Title** (600, 16px, 1.5, -0.01em): tool names in rows; the empty-state message.
- **Body** (400, 15px, 1.5): the page default; card text; the primary button.
- **Row** (400, 14.5px, 1.45): taglines inside rows, clamped to two lines.
- **UI** (14px, 1.45; the role sets no weight, so 400 unless the element adds one): facet options at 400; nav and buttons at 500; the result summary at 600.
- **Caption** (400, 13px, 1.45): section names beside row titles, breadcrumbs, chips, the details list, figure captions, the footer.
- **Label** (600, 12px, 0.07em, uppercase): names of a group of controls or a details box ("Sections", "Works with", "Kind", "Price", "Details"). It names the group it sits on; it is never a kicker above a headline.
- **Data** (Mono 400, 12.5px, 1.45): access links (host/path) and section tool counts.
- **Micro** (400, 12px, 1.4; the role sets size only): in Geist Mono (with `font-mono`, or a `kbd`) for facet counts, kinds and price under a row's link, topic tags and the "/" key; in Geist for the "Turn off the / shortcut" switch.

### Named Rules
**The Mono Means Data Rule.** Geist Mono sets only what a reader would copy, count or type: URLs, counts, kinds and price, tags, the "/" key and inline code. Never headings, never prose, never buttons.

**The Fallback Face Rule.** Every font stack carries its metric-matched local fallback face second. A new face without one is incomplete.

## Layout

A single 1280px sheet column, centred, with 16px gutters on phones and 32px from the md breakpoint. A white header at least 64px tall (wordmark left, Catalog and Sections right; on pages with the header search, at about 335px and below, the nav wraps to a second line, 8px below, its text 12px in from the wordmark by the links' own padding) and a white footer are both ruled off the ground by one line. Pages leave 72px below the content.

The directory is two columns from lg: a 224px sidebar (Sections, then the Works with, Kind and Price facets) beside the result column, 40px apart. Below lg the sidebar collapses: the sections become one horizontally scrolling run that brings the chosen section into view, and the facets fold behind a full-width Filters button. Above the list sits one line holding the live summary, any active-filter chips and the Newest / A–Z switch.

A list row is a grid: 40px icon, the name-and-tagline column, then a 220px access column right-aligned on desktop. On phones the icon shrinks to 36px and the access column drops under the text.

A tool page is two columns from lg: the article (header, write-up, screenshot, related tools) beside a 320px sticky aside holding the actions and details, 56px apart. On phones the actions follow the header and the details follow the screenshot, so DOM order is reading order at both sizes.

Measures: prose 68ch, taglines and short copy 60ch, the lead 62ch, the main search 760px wide. Spacing runs on a 4px step; sheets pad 20px, rows 16px by 16 to 20px, group gaps 24 to 28px.

**The 44px Touch Rule.** On coarse pointers every target is at least 44px tall, reached by padding the target or by an invisible `::before` hit area that leaves the visual size unchanged. Desktop density is never inflated to serve touch.

## Elevation & Depth

Flat. Depth comes from the step between the near-white ground and white sheets, from 1px lines, and from tonal hover fills. The only shadow on the site is a solid 3px indigo halo that appears around a search field while it has focus.

### Shadow Vocabulary
- **Focus halo** (`box-shadow: 0 0 0 3px var(--color-halo)`): search fields only, with the border turning Index Indigo, on `:focus-within`.

### Named Rules
**The Halo Only Rule.** No drop shadows, no lifted cards, no gradients. If something needs to stand out, it gets a line, a fill or the accent.

## Shapes

Four radii, each tied to the size of the object, so nested shapes always read concentrically: **sheet** (12px) for list sheets, cards, the aside, the main search field, screenshots and a tool page's large icon; **control** (9px) for buttons, the compact search, nav links, the order switch and row icons; **row** (7px) for sidebar options, filter chips, section and kind badges, and the order switch's inner buttons; **key** (5px) for key caps, topic tags and inline code. Sheets clip their rows (overflow hidden) so the first and last row inherit the corners.

Screenshots are cropped to one aspect (1600 / 840), top-anchored, inside a 12px ruled frame on a Fill well. Icons are always framed by a 1px line on a Fill well; a tool without an icon shows its initial in Ink 4 in the same frame.

Strokes on drawn icons are 2 to 2.25px, round-capped, at Geist's weight. The outbound arrow is one shared mark used on every way out. Every link off the site opens in a new tab, and its accessible name says so.

## Components

### Buttons
Plain, solid and quiet; never more than one primary in view.
- **Shape:** control radius (9px).
- **Primary:** Index Indigo with white text, UI or Body weight 500 to 600. The tool page's "Visit" button is 48px tall with the label left and the outbound arrow right.
- **Hover / Focus:** hover deepens to Deep Indigo over 150ms; focus is the site ring (2px Index Indigo outline, 2px offset).
- **Secondary:** white with a Strong Line border, hover fills with Fill. Ink 2 text on "Show more" and the mobile Filters toggle; Ink text (row size, 500) on the tool page's "View the repository", the second way out.
- **Text action:** underlined caption-size links in accent ("Clear all") or meta (the "/" switch), the underline brightening on hover.

### Chips
- **Filter chip:** Indigo Wash background, Deep Indigo caption text, row radius, a 12px cross; hover to Halo Indigo. One per ticked facet, beside the summary; activating it removes the filter and moves focus to the next chip, else the previous one, else "Clear all", else the summary. On touch screens each chip and "Clear all" sit in a full 44px button with the chip drawn inside, so wrapped lines (4px apart) never share a tap area.
- **Section badge:** the same wash treatment, 28px tall, linking to the section.
- **Kind badge:** white, 1px line, Ink 3, 28px tall; not interactive. The price badge, after the kinds, looks the same.
- **Topic tag:** Fill background, mono micro, key radius; hover to Line. Links to a search.

### Cards / Containers
- **Corner Style:** sheet radius (12px).
- **Background:** Sheet White on the ground.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Border:** 1px Line.
- **Internal Padding:** 20px; the write-up cards 20 by 22px.
- **Write-up cards:** "When to use it" and "Caveats" sit side by side from md, each headed by a 18px drawn icon (indigo check circle; amber triangle) and a UI-size semibold title.

### Inputs / Fields
- **Main search:** 56px, sheet radius, white, Strong Line border, a meta-grey search icon, lead-size text, and the "/" key cap at the right while the shortcut is on.
- **Compact search:** the header's version on every page without a main search, 40px, control radius, on the ground colour; on phones it collapses to a search icon linking to the home search.
- **Focus:** border turns Index Indigo and the 3px halo appears, both over 150ms. The caret is indigo; placeholders are Meta Grey.
- **Facet options:** a native checkbox tinted with the accent, label in Ink 2, count in mono at the right; options with zero results drop to Meta Grey but stay clickable. Groups past eight options show six and fold the rest behind an accent "N more" disclosure.

### Navigation
- **Header nav:** UI weight 500, Ink 3, control radius, 8 by 12px. Hover and the current page both take a Fill background and Ink.
- **Breadcrumbs:** caption size, Ink 3 links separated by meta slashes, the current page in Ink 4.
- **Section list:** row-radius options in Ink 2 with mono counts; the chosen one in Indigo Wash, semibold Deep Indigo. On a section page they are links to each section's page.
- **Order switch:** a segmented control in a Strong Line frame; the selected segment is solid Ink with white text.
- **Skip link:** first in the tab order, appears as a solid Ink control at top left on focus.

### The Index Row (signature)
The unit of the whole site. Icon (a second link to the tool's page for the pointer, which underlines the name on hover; keyboards and screen readers use the name), then the name (title, Ink) with its section in meta caption beside it, then the tagline (row size, Ink 4, two lines max), then at the right the access link in mono indigo (host/path, truncated, with the outbound arrow) and the tool's kinds and price in mono meta beneath. Rows are separated by Soft Line and hover to Soft Fill. Enter or Down from the search moves focus to the first row's name. The empty state is a sheet with a title-size message, one line of help and a primary "Clear search and filters" button.

### The "/" Shortcut
"/" focuses the page's main search, else the header's. It exists only on a device with any fine pointer (`any-pointer: fine`: a mouse or trackpad, so a tablet with a trackpad keeps it); a touch-only device gets neither the shortcut, its hint nor its switch. Where it exists, a meta "Turn off the / shortcut" switch sits under the main search (WCAG 2.1.4), remembered per browser; the key caps show only while it is on. Both are decided before first paint by Base's head script (`data-slash-available`, `data-slash` on `<html>`), so neither flashes.

### Motion
State changes (colour, border, halo, disclosure chevrons) run at 150ms. Under `prefers-reduced-motion: reduce` every transition, animation and view transition is zeroed.

## Do's and Don'ts

### Do:
- **Do** keep the accent for links, the primary action, selection and focus; never use it as decoration.
- **Do** frame every list in one white sheet with 12px corners and 1px lines, rows divided by Soft Line.
- **Do** set URLs, counts, kinds and price, tags and keys in Geist Mono, and everything else in Geist.
- **Do** use the four radii by object size: 12 sheet, 9 control, 7 row, 5 key.
- **Do** give every target 44px on coarse pointers through padding or an invisible hit area.
- **Do** show the focus ring (2px Index Indigo, 2px offset) on every focusable element, inset where a parent would clip it.
- **Do** put a count beside every facet and keep it live.
- **Do** list a metric-matched fallback face second in any font stack.

### Don't:
- **Don't** add drop shadows, gradients or lifted cards; the focus halo is the only shadow.
- **Don't** set any text lighter than Meta Grey.
- **Don't** build a grid of identical screenshot cards with pill tags; the catalog is a ruled list.
- **Don't** use the Caveat Amber for anything but the caveats icon.
- **Don't** put an uppercase label above a heading as a kicker; Label names a group of controls or a box, nothing else.
- **Don't** design a dark theme; the site is light only.
- **Don't** use emoji or text glyphs as icons; draw them as inline SVG at the 2 to 2.25px stroke.
