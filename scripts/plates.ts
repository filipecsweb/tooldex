// Derived halftone "plates" for every tool image, written to src/generated/plates (gitignored).
// Runs before dev and build (npm pre-scripts) and after `tool thumbs`; skips files that are up to date.
import { existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { PROVENANCE_KEY, cropBox, halftone, pngWithText, toneMap } from './lib.ts';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const TOOLS = join(ROOT, 'src/content/tools');
const OUT = join(ROOT, 'src/generated/plates');
const INK = [22, 21, 15]; // --color-ink

const JOBS = [
  { from: 'thumb.webp', suffix: '', width: 840, cell: 5 }, // card plates display at up to ~420 CSS px
  { from: 'icon.png', suffix: '-icon', width: 240, cell: 5 },
];

async function plate(src: string, out: string, width: number, cell: number) {
  const img = sharp(src).flatten({ background: '#ffffff' });
  const { width: w0 = 1, height: h0 = 1 } = await img.metadata();
  const box = src.endsWith('icon.png') ? { left: 0, top: 0, width: w0, height: h0 } : cropBox(w0, h0);
  const height = Math.round((width * box.height) / box.width);
  const gray = await img.extract(box).resize(width, height).grayscale().extractChannel(0).raw().toBuffer();
  const mapped = await sharp(toneMap(new Uint8Array(gray)), { raw: { width, height, channels: 1 } })
    .blur(cell / 2)
    .extractChannel(0) // sharp widens single-channel raw input to sRGB; keep one channel
    .raw()
    .toBuffer();
  const alpha = halftone(new Uint8Array(mapped), width, height, cell);
  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < alpha.length; i++) rgba.set([...INK, alpha[i]], i * 4);
  const png = await sharp(rgba, { raw: { width, height, channels: 4 } }).png({ palette: true, colours: 16, effort: 8 }).toBuffer();
  const note = `Derived, not generated: 45-degree halftone of ${src.slice(ROOT.length)} by scripts/plates.ts.`;
  writeFileSync(out, pngWithText(png, PROVENANCE_KEY, note));
}

export async function makePlates(only?: string[], force = false) {
  mkdirSync(OUT, { recursive: true });
  const slugs = readdirSync(TOOLS, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
  const wanted = new Set<string>();
  for (const slug of slugs) {
    for (const job of JOBS) {
      const src = join(TOOLS, slug, job.from);
      const out = join(OUT, `${slug}${job.suffix}.png`);
      if (!existsSync(src)) continue;
      wanted.add(out);
      if (only && !only.includes(slug)) continue;
      if (!force && existsSync(out) && statSync(out).mtimeMs >= statSync(src).mtimeMs) continue;
      await plate(src, out, job.width, job.cell);
    }
  }
  // Plates of deleted or renamed tools, or of images that were removed.
  for (const f of readdirSync(OUT)) if (!wanted.has(join(OUT, f))) rmSync(join(OUT, f));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await makePlates(undefined, process.argv.includes('--force'));
