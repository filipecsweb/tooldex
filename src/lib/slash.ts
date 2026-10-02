// The "/" shortcut to search. One rule for every page: "/" focuses the page's main search field
// (marked data-main-search: the directory's on home and section pages, the 404's) when it has one,
// else the header's.
// A one-character shortcut can be fired by speech input or a stray key, so the reader can turn it
// off (WCAG 2.1.4); the choice is remembered in this browser under SLASH_OFF. Base.astro sets
// data-slash on <html> before first paint while it is on; the key hints (.slash-key) follow it.
export const SLASH_OFF = 'tooldex:slash-off';

const NOT_TEXT = /^(checkbox|radio|button|submit|reset|range|color|file|image)$/;
/** Where "/" is a character being typed: text-entry inputs, textarea, select, contenteditable. */
const typing = (t: HTMLElement) =>
  t instanceof HTMLInputElement ? !NOT_TEXT.test(t.type) : /^(textarea|select)$/i.test(t.tagName) || t.isContentEditable;

/** True when this keydown is a bare "/" outside a text field (Ctrl, Cmd and Alt combos are left alone). */
export const isSlash = (e: KeyboardEvent) =>
  e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey && !typing(e.target as HTMLElement);

/** Whether the shortcut exists here at all: only on a device with a fine pointer (mouse or trackpad),
 *  where a keyboard is likely; a touch-only device gets neither the shortcut nor its switch.
 *  Base.astro's head script applies the same rule and marks <html> with data-slash-available. */
export const SLASH_MEDIA = '(any-pointer: fine)';
export const slashAvailable = () => matchMedia(SLASH_MEDIA).matches;

/** Whether "/" is live: available here and not turned off by the reader (storage blocked counts as on). */
export function slashOn() {
  if (!slashAvailable()) return false;
  try { return localStorage.getItem(SLASH_OFF) === null; } catch { return true; }
}

const shown = (el: HTMLElement) => el.getClientRects().length > 0;

/** The field "/" focuses on this page: its visible main search, else the visible header search. */
export function slashTarget(): HTMLElement | null {
  const main = [...document.querySelectorAll<HTMLElement>('[data-main-search]')].find(shown);
  const header = document.getElementById('site-q');
  return main ?? (header && shown(header) ? header : null);
}

/** Reflects the choice on the page: the <html> flag the hints follow, and aria-keyshortcuts on the
 *  one field "/" actually focuses. */
export function applySlash(on = slashOn()) {
  document.documentElement.toggleAttribute('data-slash', on);
  for (const f of document.querySelectorAll('[data-main-search], #site-q')) f.removeAttribute('aria-keyshortcuts');
  if (on) slashTarget()?.setAttribute('aria-keyshortcuts', '/');
}

/** Turns the shortcut on or off, remembers it, and updates the page. */
export function setSlash(on: boolean) {
  try { on ? localStorage.removeItem(SLASH_OFF) : localStorage.setItem(SLASH_OFF, '1'); } catch { /* this visit only */ }
  applySlash(on);
}
