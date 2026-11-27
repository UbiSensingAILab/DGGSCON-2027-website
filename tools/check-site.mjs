#!/usr/bin/env node
// Checks for the DGGSCon 2027 site. No dependencies.
//   node tools/check-site.mjs            run everything
//   node tools/check-site.mjs dates      run checks whose name contains "dates"
// Exits 0 when every check that ran passed, 1 otherwise.
//
// Every check here must be able to FAIL. If you add one, mutate the thing it
// names and confirm it goes red; a check that cannot fail is worse than none.

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = join(ROOT, 'docs');

// The call for participation is the source of record for every date. It lives in
// the private planning repository; override with CFP_SOURCE=<path> elsewhere.
const CFP_SOURCE =
  process.env.CFP_SOURCE ||
  resolve(ROOT, '..', 'DGGSCON-2027', 'program', 'cfp', 'call-for-participation-draft.md');

const PAGES = ['index.html', 'call-for-participation.html'];
const read = (p) => readFileSync(join(DOCS, p), 'utf8');
const css = () => read('assets/styles.css');

const CMT = 'The Microsoft CMT service was used for managing the peer-reviewing process for this conference. This service was provided for free by Microsoft and they bore all expenses, including costs for Azure cloud services as well as for software development and support.';

const VOID_TAGS = new Set(['meta', 'link', 'img', 'br', 'hr', 'input', 'source', 'area', 'col', 'base', 'embed', 'param', 'track', 'wbr']);

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

// ---------------------------------------------------------------- helpers

const stripTags = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const norm = (s) => stripTags(s).toLowerCase().replace(/[.,]$/, '').trim();

function srgb(c) {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}
function luminance(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((x) => x + x).join('') : h;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  return 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
}
function contrast(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}
const stripComments = (sheet) => sheet.replace(/\/\*[\s\S]*?\*\//g, '');

// Remove @media blocks, brace-aware, leaving only rules that apply at all widths.
function baseOnly(sheet) {
  const s = stripComments(sheet);
  let out = '';
  for (let i = 0; i < s.length; ) {
    const at = s.indexOf('@media', i);
    if (at === -1) { out += s.slice(i); break; }
    out += s.slice(i, at);
    let j = s.indexOf('{', at);
    if (j === -1) break;
    let depth = 1;
    for (j++; j < s.length && depth; j++) {
      if (s[j] === '{') depth++;
      else if (s[j] === '}') depth--;
    }
    i = j;
  }
  return out;
}

function matchRules(selector, sheet) {
  // Every rule whose selector list contains this exact selector. A later rule
  // overrides an earlier one at equal specificity, so a check that reads only
  // the first match can be defeated by appending to the file.
  const esc = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(?:^|[};\\n])\\s*(?:[^{};]*,\\s*)?${esc}\\s*(?:,[^{}]*)?\\{([^}]*)\\}`, 'g');
  return [...sheet.matchAll(re)].map((m) => m[0]);
}

// Every rule anywhere, media queries included — for "may this ever happen?".
const rulesFor = (selector, sheet = css()) => matchRules(selector, stripComments(sheet));

// The rule that applies at every width: the last one outside any media query.
function ruleFor(selector, sheet = css()) {
  const all = matchRules(selector, baseOnly(sheet));
  return all.length ? all[all.length - 1] : null;
}
function mediaBlock(maxWidth, sheet = css()) {
  const re = new RegExp(`@media[^{]*max-width\\s*:\\s*${maxWidth}px[^{]*\\{([\\s\\S]*?)\\n\\}`);
  return sheet.match(re)?.[1] || null;
}

// ------------------------------------------------------------- structure

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
      if (!docOrder.includes(id) && id !== 'top' && id !== 'main') bad.push(`index.html: nav item #${id} is not a section`);
    }
  }
  return bad.length ? { ok: false, detail: bad.slice(0, 4).join('; ') } : { ok: true };
});

check('local-links', () => {
  const bad = [];
  for (const page of PAGES) {
    for (const m of read(page).matchAll(/(?:href|src)="([^"]+)"/g)) {
      const raw = m[1];
      if (/^(https?:|mailto:|#|data:)/.test(raw)) continue;
      const target = raw.split('?')[0].split('#')[0];
      if (target && !existsSync(join(DOCS, target))) bad.push(`${page}: ${target} missing`);
    }
  }
  return bad.length ? { ok: false, detail: [...new Set(bad)].slice(0, 4).join('; ') } : { ok: true };
});

// ------------------------------------------------------------ typography

check('min-font-size', () => {
  const small = [];
  const scan = (text, where) => {
    for (const m of text.matchAll(/font-size\s*:\s*([^;}"']+)/g)) {
      for (const px of m[1].matchAll(/(\d*\.?\d+)px/g)) {
        if (parseFloat(px[1]) < 13) small.push(`${where} ${px[1]}px`);
      }
    }
  };
  scan(css(), 'styles.css');
  // Inline styles bypass the stylesheet entirely.
  for (const page of PAGES) {
    for (const m of read(page).matchAll(/style="([^"]*)"/g)) scan(m[1], `${page} inline`);
  }
  return small.length ? { ok: false, detail: [...new Set(small)].join(', ') } : { ok: true };
});

check('text-contrast', () => {
  // Pairs that are easy to get wrong and invisible in review. WCAG AA needs 4.5
  // for normal text. Values are read from the stylesheet, not hardcoded here.
  const sheet = css();
  const tokenOf = (name) => sheet.match(new RegExp(`--${name}\\s*:\\s*(#[0-9a-f]{3,6})`, 'i'))?.[1];
  const colourIn = (selector) => {
    const rule = ruleFor(selector, sheet);
    if (!rule) return null;
    const raw = rule.match(/(?:^|[;{])\s*color\s*:\s*([^;}]+)/)?.[1]?.trim();
    if (!raw) return null;
    const varName = raw.match(/var\(--([a-z-]+)\)/)?.[1];
    return varName ? tokenOf(varName) : raw.match(/#[0-9a-f]{3,6}/i)?.[0] || null;
  };
  const bad = [];
  const pairs = [
    ['.hosts-label', '#ffffff', 4.5],
    ['.note', '#ffffff', 4.5],
    ['.rows .sub', '#ffffff', 4.5],
  ];
  for (const [selector, bg, need] of pairs) {
    const fg = colourIn(selector);
    if (!fg) { bad.push(`${selector}: no colour found`); continue; }
    const ratio = contrast(fg, bg);
    if (ratio < need) bad.push(`${selector} ${fg} on ${bg} = ${ratio.toFixed(2)}:1, needs ${need}`);
  }
  return bad.length ? { ok: false, detail: bad.join('; ') } : { ok: true };
});

// --------------------------------------------------------------- content

check('cmt-verbatim', () => {
  const bad = [];
  for (const page of PAGES) if (!read(page).includes(CMT)) bad.push(`missing from ${page}`);
  // It is contractually required to stay visible, so no rule may hide it.
  for (const rule of rulesFor('.footer-ack')) {
    if (/display\s*:\s*none|visibility\s*:\s*hidden|font-size\s*:\s*0/.test(rule)) {
      bad.push('.footer-ack is hidden by CSS');
      break;
    }
  }
  return bad.length ? { ok: false, detail: bad.join('; ') } : { ok: true };
});

check('dates-match-cfp', () => {
  if (!existsSync(CFP_SOURCE)) {
    return { ok: false, detail: `CFP source unreachable at ${CFP_SOURCE} — set CFP_SOURCE to check dates` };
  }
  const md = readFileSync(CFP_SOURCE, 'utf8');
  const MONTH = '(?:January|February|March|April|May|June|July|August|September|October|November|December)';
  // Ranges first: the CFP writes "26 to 27 October 2027", the pages "26–27 October 2027".
  const DATE = new RegExp(
    `\\d{1,2}\\s*(?:to|[–-])\\s*\\d{1,2}\\s+${MONTH}\\s+\\d{4}` + `|\\d{1,2}\\s+${MONTH}\\s+\\d{4}`
  );
  const sameDate = (a) => a.replace(/\s*(?:to|[–-])\s*/, '–').replace(/\s+/g, ' ').trim();

  // Source of record: every "| Milestone | Date |" row in section 4.
  const source = new Map();
  const section = md.split(/^## 4\. Important dates/m)[1]?.split(/^## 5\./m)[0] || '';
  for (const line of section.split('\n')) {
    const cells = line.split('|').map((c) => c.trim()).filter(Boolean);
    if (cells.length !== 2) continue;
    const label = norm(cells[0].replace(/\*\*/g, ''));
    if (!label || label === 'milestone') continue;
    const date = cells[1].replace(/\*\*/g, '').match(DATE)?.[0];
    if (date) source.set(label, sameDate(date));
  }
  if (source.size < 11) return { ok: false, detail: `parsed only ${source.size} milestones from the CFP; expected 11` };

  // Each page, parsed the same way: label paired with the date beside it.
  const pageMaps = {
    'index.html': (() => {
      const m = new Map();
      const dates = read('index.html').split(/id="dates"/)[1]?.split(/<\/section>/)[0] || '';
      for (const li of dates.matchAll(/<li>\s*<span>([\s\S]*?)<\/span>\s*<b>([\s\S]*?)<\/b>\s*<\/li>/g)) {
        m.set(norm(li[1].replace(/<span class="sub">[\s\S]*?<\/span>/, '')), stripTags(li[2]).replace(/^From\s+/i, ''));
      }
      return m;
    })(),
    'call-for-participation.html': (() => {
      const m = new Map();
      const page = read('call-for-participation.html');
      for (const row of page.matchAll(/<div><dt>([\s\S]*?)<\/dt><dd>([\s\S]*?)<\/dd><\/div>/g)) {
        const value = row[2].replace(/<span>[\s\S]*?<\/span>/, '');
        m.set(norm(row[1]), stripTags(value).replace(/^From\s+/i, ''));
      }
      return m;
    })(),
  };

  const bad = [];
  for (const [page, map] of Object.entries(pageMaps)) {
    if (map.size === 0) { bad.push(`${page}: no date rows parsed`); continue; }
    for (const [label, date] of source) {
      if (!map.has(label)) { bad.push(`${page}: no row for "${label}"`); continue; }
      const shown = sameDate(map.get(label));
      if (shown !== date) bad.push(`${page}: "${label}" shows ${shown}, CFP says ${date}`);
    }
  }
  return bad.length ? { ok: false, detail: bad.slice(0, 4).join('; ') } : { ok: true };
});

check('no-hedging', () => {
  const bad = [];
  for (const page of PAGES) {
    const s = read(page).toLowerCase();
    for (const w of ['provisional', 'tentative', 'subject to confirmation']) {
      if (s.includes(w)) bad.push(`${page}: "${w}"`);
    }
  }
  return bad.length ? { ok: false, detail: bad.join('; ') } : { ok: true };
});

check('no-ai-tells', () => {
  const bad = [];
  for (const page of PAGES) {
    const s = read(page);
    for (const m of s.matchAll(/>\s*(\d{2}\s*\/\s*[A-Z][A-Z\s&;]+)</g)) bad.push(`${page}: numbered label "${m[1].trim()}"`);
    if (s.includes('✳')) bad.push(`${page}: asterisk band glyph`);
    for (const m of s.matchAll(/<h([123])[^>]*>([\s\S]*?)<\/h\1>/g)) {
      const text = stripTags(m[2]);
      if (/\.$/.test(text)) bad.push(`${page}: heading ends with a period — "${text}"`);
    }
  }
  return bad.length ? { ok: false, detail: bad.slice(0, 4).join('; ') } : { ok: true };
});

// ----------------------------------------------------------------- hero

check('hero-contrast', () => {
  const sheet = css();
  const bad = [];
  const hero = ruleFor('.hero', sheet);
  if (!hero) bad.push('no .hero rule');
  else if (!/background:\s*(var\(--footer\)|#(10|0f)[0-9a-f]{4})/i.test(hero)) {
    bad.push('hero needs an opaque dark background behind the image');
  }
  const after = ruleFor('.hero::after', sheet);
  if (!after) bad.push('no .hero::after gradient');
  else {
    const stops = [...after.matchAll(/rgba\([^)]*,\s*(\.\d+|\d?\.\d+)\s*\)/g)].map((m) => parseFloat(m[1]));
    if (!stops.length || Math.max(...stops) < 0.8) bad.push('gradient must end at >=0.8 alpha');
    // At narrow widths the title wraps and the text block rides up into the
    // thin end of the gradient, so the START of the gradient carries it there.
    const narrow = mediaBlock(860, sheet);
    const narrowAfter = narrow && narrow.match(/\.hero::after\s*\{[^}]*\}/)?.[0];
    if (!narrowAfter) bad.push('no narrow-width .hero::after override');
    else {
      const first = narrowAfter.match(/rgba\([^)]*,\s*(\.\d+|\d?\.\d+)\s*\)/)?.[1];
      if (!first || parseFloat(first) < 0.35) {
        bad.push(`narrow gradient starts at ${first || 'none'}; needs >=0.35 for AA on wrapped text`);
      }
    }
  }
  return bad.length ? { ok: false, detail: bad.join('; ') } : { ok: true };
});

// --------------------------------------------------------- accessibility

check('focus-ring-visible', () => {
  const sheet = css();
  const bad = [];
  const base = sheet.match(/:focus-visible[^{]*\{[^}]*outline\s*:[^}]*\}/)?.[0];
  if (!base) return { ok: false, detail: 'no :focus-visible outline rule' };
  if (/outline\s*:\s*none/.test(base)) bad.push('base focus rule removes the outline');
  // The pine outline is ~1.6:1 on the dark footer and hero — invisible. Dark
  // surfaces need a light ring.
  const darkSurfaces = ['.hero a:focus-visible', '.site-footer a:focus-visible', '.cfp-dates a:focus-visible'];
  const missing = darkSurfaces.filter((sel) => {
    const rule = ruleFor(sel, sheet); // the last one is the one that applies
    return !rule || !/outline(-color)?\s*:[^;}]*(#fff|#ffffff|white)/i.test(rule);
  });
  if (missing.length) bad.push(`no light focus ring on dark surfaces: ${missing.join(', ')}`);
  return bad.length ? { ok: false, detail: bad.join('; ') } : { ok: true };
});

check('cfp-table-keyboard', () => {
  const cfp = read('call-for-participation.html');
  const bad = [];
  const wrapper = cfp.match(/<div class="table-scroll"[^>]*>/);
  if (!wrapper) bad.push('no .table-scroll wrapper');
  else {
    if (!/tabindex="0"/.test(wrapper[0])) bad.push('scroll region not focusable');
    if (!/role="region"/.test(wrapper[0])) bad.push('scroll region has no role');
  }
  const rule = ruleFor('.table-scroll:focus-visible');
  if (!rule) bad.push('no focus style for the scroll region');
  else if (!/outline\s*:\s*\d+px\s+\w+/.test(rule) || /outline\s*:\s*none/.test(rule)) {
    bad.push('.table-scroll:focus-visible does not draw an outline');
  }
  return bad.length ? { ok: false, detail: bad.join('; ') } : { ok: true };
});

check('nav-current-legible', () => {
  const sheet = css();
  const bad = [];
  if (/\.site-header nav \[aria-current="page"\]\s*\{[^}]*color\s*:/.test(sheet)) {
    bad.push('current-page colour rule also applies to the .cta button, hiding its label');
  }
  // No dead rules: a .cta[aria-current] style only earns its place if a page uses it.
  const anyCtaCurrent = PAGES.some((p) => {
    const m = read(p).match(/<a[^>]*aria-current="page"[^>]*>/);
    return m && /class="[^"]*\bcta\b/.test(m[0]);
  });
  const ctaRule = /\.cta\[aria-current="page"\]/.test(sheet);
  if (ctaRule && !anyCtaCurrent) bad.push('.cta[aria-current="page"] rule is dead — no page marks a .cta current');
  if (anyCtaCurrent && !ctaRule) bad.push('a .cta is marked current with no legible style for it');
  return bad.length ? { ok: false, detail: bad.join('; ') } : { ok: true };
});

// ------------------------------------------------------------ responsive

check('responsive-rules', () => {
  const sheet = css();
  const bad = [];
  const collapse = mediaBlock(860, sheet);
  if (!collapse) bad.push('no max-width:860px block');
  else if (!/\.tracks\s*\{[^}]*grid-template-columns\s*:\s*1fr/.test(collapse)) {
    bad.push('860px block does not collapse .tracks to one column');
  }
  if (!/@media\s*\(prefers-reduced-motion\s*:\s*reduce\)[\s\S]*?scroll-behavior\s*:\s*auto/.test(sheet)) {
    bad.push('no reduced-motion rule');
  }
  if (!/\.hero h1\s*\{[^}]*clamp\(/.test(sheet)) bad.push('hero h1 does not use clamp()');
  return bad.length ? { ok: false, detail: bad.join('; ') } : { ok: true };
});

check('narrow-no-overflow', () => {
  const sheet = css();
  const bad = [];
  // .rows b is nowrap so dates stay on one line. Once the row stacks on a
  // phone, the longest value (a street address) cannot wrap and pushes the
  // page wider than the viewport.
  const rowsB = ruleFor('.rows b', sheet);
  if (rowsB && /white-space\s*:\s*nowrap/.test(rowsB)) {
    const narrow = mediaBlock(560, sheet);
    const released = narrow && /\.rows b\s*\{[^}]*white-space\s*:\s*normal/.test(narrow);
    if (!released) bad.push('.rows b keeps white-space:nowrap when rows stack — long values overflow the viewport');
  }
  return bad.length ? { ok: false, detail: bad.join('; ') } : { ok: true };
});

check('toc-no-orphan', () => {
  const sheet = css();
  const rule = ruleFor('.cfp-toc', sheet);
  if (!rule) return { ok: false, detail: 'no .cfp-toc rule' };
  const bad = [];
  if (!/display\s*:\s*grid/.test(rule)) bad.push('.cfp-toc must be a grid, not a wrapping flex row');
  if (!/grid-template-columns\s*:\s*repeat\(/.test(rule)) bad.push('.cfp-toc needs a fixed column count');
  const items = (read('call-for-participation.html').match(/<nav class="cfp-toc"[\s\S]*?<\/nav>/)?.[0].match(/<a /g) || []).length;
  if (items !== 9) bad.push(`table of contents now has ${items} entries, not 9 — revisit the column counts`);
  if (!/\.cfp-toc\s*\{\s*grid-template-columns\s*:\s*repeat\(3\s*,/.test(sheet.replace(/\s*\n\s*/g, ' '))) {
    bad.push('no 3-column rule for mid widths');
  }
  return bad.length ? { ok: false, detail: bad.join('; ') } : { ok: true };
});

check('assets-exist', () => {
  const bad = [];
  for (const a of REQUIRED_ASSETS) if (!existsSync(join(DOCS, a))) bad.push(`missing ${a}`);
  for (const a of FORBIDDEN_ASSETS) if (existsSync(join(DOCS, a))) bad.push(`should be deleted: ${a}`);
  return bad.length ? { ok: false, detail: bad.join('; ') } : { ok: true };
});

// ---------------------------------------------------------------- runner

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
  console.log(`${result.ok ? 'PASS' : 'FAIL'}  ${name}${result.detail ? ` — ${result.detail}` : ''}`);
}

console.log(`\n${selected.length - failed}/${selected.length} checks passed`);
process.exit(failed ? 1 : 0);
