#!/usr/bin/env node
// Checks for the DGGSCon 2027 site. No dependencies.
//   node tools/check-site.mjs            run everything
//   node tools/check-site.mjs dates      run checks whose name contains "dates"
// Exits 0 when every check that ran passed, 1 otherwise.

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = join(ROOT, 'docs');
const CFP_SOURCE = 'F:/UCalgary_postdoc/DGGSCON-2027/program/cfp/call-for-participation-draft.md';

const PAGES = ['index.html', 'call-for-participation.html'];
const read = (p) => readFileSync(join(DOCS, p), 'utf8');
const css = () => read('assets/styles.css');

const CMT = 'The Microsoft CMT service was used for managing the peer-reviewing process for this conference. This service was provided for free by Microsoft and they bore all expenses, including costs for Azure cloud services as well as for software development and support.';

const VOID_TAGS = new Set(['meta', 'link', 'img', 'br', 'hr', 'input', 'source', 'area', 'col']);

// Nine milestones, as the CFP states them. [label, date as written in the CFP]
const MILESTONES = [
  ['Paper submission', '16 April 2027'],
  ['Workshop and tutorial proposals', '30 April 2027'],
  ['Notification of acceptance (papers)', '31 May 2027'],
  ['Camera-ready due', '13 August 2027'],
  ['Industry abstract submission', '28 May 2027'],
  ['Notification of acceptance (industry)', '8 June 2027'],
  ['Super early bird closes', '15 June 2027'],
  ['Early bird closes', '15 July 2027'],
  ['Regular registration from', '16 July 2027'],
];

const REQUIRED_ASSETS = [
  'assets/styles.css',
  'assets/dggscon-logo.png',
  'assets/banff-hero.jpg',
  'assets/university-of-calgary-logo-cropped.jpg',
  'assets/university-of-guelph-logo.svg',
];
const FORBIDDEN_ASSETS = ['assets/globe.svg', 'assets/banff-centre-autumn-rita-taylor.jpg'];

const checks = [];
const check = (name, fn) => checks.push({ name, fn });

// --- structure -------------------------------------------------------------

check('html-structure', () => {
  const bad = [];
  for (const page of PAGES) {
    const s = read(page);
    const stack = [];
    const re = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*?(\/?)>/g;
    let m;
    while ((m = re.exec(s))) {
      const [, closing, tag, selfClose] = m;
      if (VOID_TAGS.has(tag.toLowerCase()) || selfClose) continue;
      if (!closing) stack.push(tag);
      else {
        const open = stack.pop();
        if (open !== tag) bad.push(`${page}: expected </${open}>, found </${tag}>`);
      }
    }
    if (stack.length) bad.push(`${page}: unclosed ${stack.join(', ')}`);
  }
  return bad.length ? { ok: false, detail: bad.slice(0, 4).join('; ') } : { ok: true };
});

check('anchors', () => {
  const bad = [];
  for (const page of PAGES) {
    const s = read(page);
    const ids = new Set([...s.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
    for (const m of s.matchAll(/href="#([^"]+)"/g)) {
      if (!ids.has(m[1])) bad.push(`${page}: #${m[1]} has no target`);
    }
  }
  // The homepage nav must list sections in the order they appear in the page.
  const home = read('index.html');
  const nav = home.match(/<nav[^>]*>[\s\S]*?<\/nav>/);
  if (nav) {
    const navIds = [...nav[0].matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
    const docOrder = [...home.matchAll(/<section[^>]*\bid="([^"]+)"/g)].map((m) => m[1]);
    const navInDoc = navIds.filter((id) => docOrder.includes(id));
    const expected = docOrder.filter((id) => navInDoc.includes(id));
    if (navInDoc.join(',') !== expected.join(',')) {
      bad.push(`index.html: nav order ${navInDoc.join(',')} != page order ${expected.join(',')}`);
    }
    for (const id of navIds) {
      if (!docOrder.includes(id) && id !== 'top' && id !== 'main') {
        bad.push(`index.html: nav item #${id} is not a section`);
      }
    }
  }
  return bad.length ? { ok: false, detail: bad.slice(0, 4).join('; ') } : { ok: true };
});

check('local-links', () => {
  const bad = [];
  for (const page of PAGES) {
    const s = read(page);
    for (const m of s.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const raw = m[1];
      if (/^(https?:|mailto:|#|data:)/.test(raw)) continue;
      const target = raw.split('?')[0].split('#')[0];
      if (!target) continue;
      if (!existsSync(join(DOCS, target))) bad.push(`${page}: ${target} missing`);
    }
  }
  return bad.length ? { ok: false, detail: [...new Set(bad)].slice(0, 4).join('; ') } : { ok: true };
});

// --- typography ------------------------------------------------------------

check('min-font-size', () => {
  const small = [];
  for (const m of css().matchAll(/font-size\s*:\s*([^;}]+)/g)) {
    for (const px of m[1].matchAll(/(\d*\.?\d+)px/g)) {
      const n = parseFloat(px[1]);
      if (n < 13) small.push(`${n}px`);
    }
  }
  return small.length
    ? { ok: false, detail: `below 13px: ${[...new Set(small)].join(', ')}` }
    : { ok: true };
});

// --- content ---------------------------------------------------------------

check('cmt-verbatim', () => {
  const missing = PAGES.filter((p) => !read(p).includes(CMT));
  return missing.length ? { ok: false, detail: `missing from ${missing.join(', ')}` } : { ok: true };
});

check('dates-match-cfp', () => {
  if (!existsSync(CFP_SOURCE)) {
    return { ok: true, detail: 'SKIPPED — CFP source not reachable at ' + CFP_SOURCE };
  }
  const cfp = readFileSync(CFP_SOURCE, 'utf8');
  const bad = [];
  for (const [label, date] of MILESTONES) {
    if (!cfp.includes(date)) bad.push(`${label}: ${date} not in the CFP source`);
    for (const page of PAGES) {
      if (!read(page).includes(date)) bad.push(`${label}: ${date} not on ${page}`);
    }
  }
  return bad.length ? { ok: false, detail: bad.slice(0, 4).join('; ') } : { ok: true };
});

check('no-hedging', () => {
  const words = ['provisional', 'tentative', 'subject to confirmation'];
  const bad = [];
  for (const page of PAGES) {
    const s = read(page).toLowerCase();
    for (const w of words) if (s.includes(w)) bad.push(`${page}: "${w}"`);
  }
  return bad.length ? { ok: false, detail: bad.join('; ') } : { ok: true };
});

check('no-ai-tells', () => {
  const bad = [];
  for (const page of PAGES) {
    const s = read(page);
    for (const m of s.matchAll(/>\s*(\d{2}\s*\/\s*[A-Z][A-Z\s&;]+)</g)) {
      bad.push(`${page}: numbered label "${m[1].trim()}"`);
    }
    if (s.includes('\u2733')) bad.push(`${page}: asterisk band glyph`);
    for (const m of s.matchAll(/<h([12])[^>]*>([\s\S]*?)<\/h\1>/g)) {
      const text = m[2].replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').trim();
      if (/\.$/.test(text)) bad.push(`${page}: heading ends with a period — "${text}"`);
    }
  }
  return bad.length ? { ok: false, detail: bad.slice(0, 4).join('; ') } : { ok: true };
});

check('assets-exist', () => {
  const bad = [];
  for (const a of REQUIRED_ASSETS) if (!existsSync(join(DOCS, a))) bad.push(`missing ${a}`);
  for (const a of FORBIDDEN_ASSETS) if (existsSync(join(DOCS, a))) bad.push(`should be deleted: ${a}`);
  return bad.length ? { ok: false, detail: bad.join('; ') } : { ok: true };
});

// --- runner ----------------------------------------------------------------

const filter = process.argv[2];
const selected = filter ? checks.filter((c) => c.name.includes(filter)) : checks;

if (!selected.length) {
  console.error(`No check matches "${filter}". Available: ${checks.map((c) => c.name).join(', ')}`);
  process.exit(1);
}

let failed = 0;
for (const { name, fn } of selected) {
  let result;
  try {
    result = fn();
  } catch (err) {
    result = { ok: false, detail: `threw: ${err.message}` };
  }
  if (!result.ok) failed++;
  const mark = result.ok ? 'PASS' : 'FAIL';
  console.log(`${mark}  ${name}${result.detail ? ` — ${result.detail}` : ''}`);
}

console.log(`\n${selected.length - failed}/${selected.length} checks passed`);
process.exit(failed ? 1 : 0);
