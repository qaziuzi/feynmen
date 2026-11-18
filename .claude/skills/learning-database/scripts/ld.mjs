#!/usr/bin/env node
// Learning Database: the learner's own cards. No dependencies.
// Data lives in $LEARNING_DB_HOME (default ~/.learning-database): cards/<id>.md, maps/<topic>.json, state.json, build/.
//
//   status | list [field] | find <words> | save <card.md> | due | reviewed <id> ok|again
//   prime <data.json> [--out FILE] | savemap <map.json> | maps
//   notebook [--out DIR] [--cards DIR] | artifact <url>
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const skill = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2), cmd = argv[0], opts = {}, args = [];
for (let i = 1; i < argv.length; i++) { if (argv[i].startsWith('--')) opts[argv[i].slice(2)] = argv[++i]; else args.push(argv[i]); }

const home = process.env.LEARNING_DB_HOME || path.join(os.homedir(), '.learning-database');
const cardsDir = opts.cards ? path.resolve(opts.cards) : path.join(home, 'cards');
const statePath = path.join(home, 'state.json');
const STEPS = [1, 3, 7, 21, 60];
const today = () => new Date().toISOString().slice(0, 10);
const addDays = (d, n) => { const t = new Date(d + 'T00:00:00Z'); t.setUTCDate(t.getUTCDate() + n); return t.toISOString().slice(0, 10); };

function loadState() {
  let s = {};
  try { s = JSON.parse(fs.readFileSync(statePath, 'utf8')); } catch (e) {
    try { const old = JSON.parse(fs.readFileSync(path.join(home, 'user.json'), 'utf8')); s.notebook = old.artifacts && old.artifacts.home; } catch (e2) {}
  }
  return { notebook: s.notebook || null, reviews: s.reviews || {} };
}
function saveState() { fs.mkdirSync(home, { recursive: true }); fs.writeFileSync(statePath, JSON.stringify(state, null, 2) + '\n'); }
const state = loadState();

// ---- card files ----
function parseCard(src, file) {
  const m = src.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`${file}: must start with a --- front matter block`);
  const meta = {};
  for (const line of m[1].split('\n')) { const k = line.match(/^([a-z_]+):\s*(.*)$/); if (k) meta[k[1]] = k[2].trim(); }
  // Text and visuals alternate: <!-- widget --> ... <!-- /widget -->. A last widget may omit the closing tag.
  const chunks = m[2].split('<!-- widget -->'), parts = [];
  if (chunks[0].trim()) parts.push({ md: chunks[0].trim() });
  for (const ch of chunks.slice(1)) {
    const [w, after = ''] = ch.split('<!-- /widget -->');
    parts.push({ w: w.trim() });
    if (after.trim()) parts.push({ md: after.trim() });
  }
  const list = (v) => (v || '').split(',').map((x) => x.trim()).filter(Boolean);
  const card = { ...meta, group: meta.group || 'Ungrouped', builds_on: list(meta.builds_on), links: list(meta.links), leads_to: list(meta.leads_to), parts, text: parts.filter((p) => p.md).map((p) => p.md).join(String.fromCharCode(10, 10)), widgets: parts.filter((p) => p.w).length };
  for (const k of ['id', 'title', 'field', 'recall']) if (!card[k]) throw new Error(`${file}: front matter needs "${k}"`);
  if (!/^[a-z0-9][a-z0-9-]*$/.test(card.id)) throw new Error(`${file}: id must be lowercase letters, digits and hyphens`);
  if (!card.widgets) throw new Error(`${file}: no "<!-- widget -->" section`);
  return card;
}
function cards() {
  if (!fs.existsSync(cardsDir)) return [];
  return fs.readdirSync(cardsDir).filter((f) => f.endsWith('.md')).map((f) => {
    const c = parseCard(fs.readFileSync(path.join(cardsDir, f), 'utf8'), f);
    c.date = c.date || fs.statSync(path.join(cardsDir, f)).mtime.toISOString().slice(0, 10);
    return c;
  }).sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.title.localeCompare(b.title)));
}
const line = (c) => `${c.id.padEnd(24)} ${c.field.padEnd(18)} ${c.date}  ${c.title}${c.builds_on.length ? '  (builds on ' + c.builds_on.join(', ') + ')' : ''}`;

// ---- notebook page ----
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function md(src) {
  const inline = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>').replace(/`(.+?)`/g, '<code>$1</code>');
  return src.split(/\n{2,}/).map((b) => {
    if (/^\s*- /.test(b)) return '<ul>' + b.split(/\n(?=\s*- )/).map((li) => `<li>${inline(li.replace(/^\s*- /, '').replace(/\n/g, ' '))}</li>`).join('') + '</ul>';
    const h = b.match(/^#{1,4} (.*)/); if (h) return `<h3>${inline(h[1])}</h3>`;
    return `<p>${inline(b.replace(/\n/g, ' '))}</p>`;
  }).join('\n');
}
// Chunk map: each field is a region, each group (front matter "group") a box of cards.
// Solid lines: "builds on". Dashed accent lines: lateral "links", often across fields.
function mapSvg(list) {
  if (!list.length) return '';
  const W = 680, COLS = 3, GAP = 12, BW = (W - 40 - GAP * (COLS - 1)) / COLS, RH = 26, pos = {};
  const regions = [], boxes = [];
  let y = 8;
  for (const f of [...new Set(list.map((c) => c.field))]) {
    const fc = list.filter((c) => c.field === f), groups = [...new Set(fc.map((c) => c.group))];
    const top = y; y += 30;
    for (let r = 0; r < groups.length; r += COLS) {
      const row = groups.slice(r, r + COLS);
      const rowH = Math.max(...row.map((g) => 34 + fc.filter((c) => c.group === g).length * (RH + 4)));
      row.forEach((g, i) => {
        const x = 20 + i * (BW + GAP), members = fc.filter((c) => c.group === g);
        boxes.push({ x, y, w: BW, h: rowH, name: g, n: members.length });
        members.forEach((c, k) => { pos[c.id] = { x: x + 8, y: y + 30 + k * (RH + 4), w: BW - 16 }; });
      });
      y += rowH + GAP;
    }
    regions.push({ y: top, h: y - top, name: f });
    y += 10;
  }
  const out = [];
  regions.forEach((r) => out.push(`<rect x="6" y="${r.y}" width="${W - 12}" height="${r.h}" rx="12" style="fill:none;stroke:var(--border-strong);stroke-width:0.5;stroke-dasharray:5 4"/><text class="th" x="20" y="${r.y + 18}" dominant-baseline="central">${esc(r.name)}</text>`));
  boxes.forEach((b) => out.push(`<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="8" style="fill:var(--surface-1);stroke:var(--border);stroke-width:0.5"/><text class="ts" x="${b.x + 10}" y="${b.y + 15}" dominant-baseline="central">${esc(b.name).slice(0, 28)}</text>`));
  const curve = (a, t, style) => {
    const ax = a.x + a.w / 2, ay = a.y + RH / 2, tx = t.x + t.w / 2, ty = t.y + RH / 2;
    return `<path d="M${ax} ${ay} C${ax} ${(ay + ty) / 2} ${tx} ${(ay + ty) / 2} ${tx} ${ty}" style="fill:none;${style}"/>`;
  };
  const drawn = new Set();
  for (const c of list) {
    for (const b of c.builds_on) if (pos[b]) out.push(curve(pos[b], pos[c.id], 'stroke:var(--text-muted);stroke-width:1'));
    for (const l of c.links) {
      const key = [c.id, l].sort().join('|');
      if (pos[l] && !drawn.has(key)) { drawn.add(key); out.push(curve(pos[c.id], pos[l], 'stroke:var(--text-accent);stroke-width:1.5;stroke-dasharray:5 4')); }
    }
  }
  for (const c of list) {
    const p = pos[c.id], max = Math.floor((p.w - 16) / 7.4), t = c.title.length > max ? c.title.slice(0, max - 1) + '…' : c.title;
    out.push(`<a href="#${c.id}"><g class="c-teal"><rect x="${p.x}" y="${p.y}" width="${p.w}" height="${RH}" rx="6" stroke-width="0.5"/><text class="t" x="${p.x + 8}" y="${p.y + RH / 2}" dominant-baseline="central" style="font-size:13px">${esc(t)}</text></g></a>`);
  }
  return `<svg width="100%" viewBox="0 0 ${W} ${y}" role="img"><title>Your concept map</title><desc>Fields as regions, groups of cards as boxes; solid lines show what a card builds on and dashed lines show links between ideas.</desc>${out.join('')}</svg>`;
}

// ---- priming maps (the learner's own structure, compared with an expert one) ----
const mapsDir = opts.maps ? path.resolve(opts.maps) : path.join(home, 'maps');
function checkPrime(d, file) {
  if (!d.topic || !Array.isArray(d.terms) || !d.expert || !Array.isArray(d.expert.groups)) throw new Error(`${file}: needs topic, terms[], expert.groups[]`);
  if (d.terms.length < 6 || d.terms.length > 24) throw new Error(`${file}: use 6 to 24 terms`);
  if (d.expert.groups.length > 6) throw new Error(`${file}: at most 6 expert groups (the board has 6 boxes)`);
  const seen = new Set();
  d.expert.groups.forEach((g) => {
    if (g.terms.length < 2 || g.terms.length > 4) throw new Error(`${file}: expert group "${g.name}" has ${g.terms.length} terms; use 2 to 4`);
    g.terms.forEach((t) => { if (!d.terms.includes(t)) throw new Error(`${file}: "${t}" is in an expert group but not in terms`); if (seen.has(t)) throw new Error(`${file}: "${t}" is in two expert groups`); seen.add(t); });
  });
  d.terms.forEach((t) => { if (!seen.has(t)) throw new Error(`${file}: term "${t}" is in no expert group`); });
  (d.expert.links || []).forEach((l) => { if (!d.expert.groups[l[0]] || !d.expert.groups[l[1]] || !l[2]) throw new Error(`${file}: each expert link is [groupIndex, groupIndex, "why"]`); });
  d.expert.links = d.expert.links || [];
}
function mapsHtml() {
  if (!fs.existsSync(mapsDir)) return '';
  const maps = fs.readdirSync(mapsDir).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(fs.readFileSync(path.join(mapsDir, f), 'utf8'))).sort((a, b) => (a.date < b.date ? 1 : -1));
  if (!maps.length) return '';
  const col = (title, groups, links) => `<div class="mcol"><h3>${title}</h3><div class="mg">${groups.map((g) => `<div><b>${esc(g.name)}</b>${g.terms.map(esc).join(', ')}</div>`).join('')}</div>${links.length ? `<ul>${links.map((l) => `<li>${l.map(esc).join(' ↔ ')}</li>`).join('')}</ul>` : ''}</div>`;
  return `<section style="display:flex;flex-direction:column;gap:10px"><h2>Your priming maps</h2><p class="sub" style="margin:0">How you structured each topic before learning it, beside the expert structure.</p>${maps.map((m) => {
    const exLinks = m.expert.links.map((l) => [m.expert.groups[l[0]].name, m.expert.groups[l[1]].name + ': ' + l[2]]);
    return `<details class="card"><summary><span class="f">${esc(m.field || 'map')}</span><span class="ti">${esc(m.topic)}</span><span class="d">${m.date}</span></summary><div class="cb"><div class="mcols">${col('Your map', m.learner.groups, m.learner.links || [])}${col('Expert map', m.expert.groups, exLinks)}</div>${m.notes ? `<p class="src">${esc(m.notes)}</p>` : ''}</div></details>`;
  }).join('')}</section>`;
}
function notebook() {
  const list = cards(), newest = [...list].reverse();
  const body = newest.map((c, i) => `<details class="card" id="${c.id}"${i === 0 ? ' open' : ''}>
<summary><span class="f">${esc(c.field)}</span><span class="ti">${esc(c.title)}</span><span class="d">${c.date}</span></summary>
<div class="cb">
${c.parts.map((p) => (p.md ? `<div class="prose">${md(p.md)}</div>` : `<div class="widget">
${p.w}
</div>`)).join(String.fromCharCode(10))}
<details class="recall"><summary>Recall: ${esc(c.recall)}</summary><p>${esc(c.answer || '')}</p></details>
${c.sources ? `<p class="src">Sources: ${esc(c.sources)}</p>` : ''}
</div>
</details>`).join('\n');
  const fields = new Set(list.map((c) => c.field)).size;
  const tpl = fs.readFileSync(path.join(skill, 'shared/notebook.html'), 'utf8');
  return tpl.replace('%%COUNT%%', `${list.length} card${list.length === 1 ? '' : 's'} across ${fields} field${fields === 1 ? '' : 's'}`)
    .replace('%%MAP%%', () => mapSvg(list) || '<p class="empty">Your map grows as you learn. Ask Claude about any concept to add your first card.</p>')
    .replace('%%MAPS%%', () => mapsHtml())
    .replace('%%CARDS%%', () => body);
}

// ---- commands ----
function main() {
  switch (cmd) {
    case 'status': {
      const list = cards(), due = list.filter((c) => (state.reviews[c.id] || {}).next <= today());
      console.log(`${list.length} cards in ${cardsDir}`);
      const byField = {}; list.forEach((c) => { byField[c.field] = (byField[c.field] || 0) + 1; });
      for (const [f, n] of Object.entries(byField)) console.log(`  ${f}: ${n}`);
      console.log(`notebook artifact: ${state.notebook || '(none yet)'}\ndue for recall: ${due.length}`);
      break;
    }
    case 'list': {
      cards().filter((c) => !args[0] || c.field === args[0]).forEach((c) => console.log(line(c) + `  [group: ${c.group}]${c.links.length ? '  links: ' + c.links.join(', ') : ''}`));
      break;
    }
    case 'prime': {
      const file = path.resolve(args[0] || '');
      const d = JSON.parse(fs.readFileSync(file, 'utf8'));
      checkPrime(d, file);
      const data = JSON.stringify({ topic: d.topic, terms: d.terms, expert: d.expert }).replace(/</g, '\\u003c');
      const widget = fs.readFileSync(path.join(skill, 'shared/prime.html'), 'utf8').replace('/*DATA*/', () => data);
      if (opts.out) { fs.writeFileSync(path.resolve(opts.out), widget); console.log('Wrote ' + path.resolve(opts.out)); } else process.stdout.write(widget);
      break;
    }
    case 'savemap': {
      const file = path.resolve(args[0] || '');
      const d = JSON.parse(fs.readFileSync(file, 'utf8'));
      checkPrime(d, file);
      if (!d.learner || !Array.isArray(d.learner.groups)) throw new Error(`${file}: needs learner.groups[] ({name, terms}) and optional learner.links[] ([name, name])`);
      d.date = d.date || today();
      const slug = d.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      fs.mkdirSync(mapsDir, { recursive: true });
      fs.writeFileSync(path.join(mapsDir, slug + '.json'), JSON.stringify(d, null, 2) + '\n');
      console.log(`Saved map: ${d.topic}`);
      break;
    }
    case 'maps': {
      if (!fs.existsSync(mapsDir)) { console.log('No maps yet.'); break; }
      fs.readdirSync(mapsDir).filter((f) => f.endsWith('.json')).forEach((f) => { const m = JSON.parse(fs.readFileSync(path.join(mapsDir, f), 'utf8')); console.log(`${m.date}  ${m.topic}  (${m.learner.groups.length} groups)`); });
      break;
    }
    case 'find': {
      const words = args.join(' ').toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2);
      const hits = cards().map((c) => { const hay = (c.title + ' ' + c.id + ' ' + c.text).toLowerCase(); return { c, s: words.filter((w) => hay.includes(w)).length + words.filter((w) => c.title.toLowerCase().includes(w)).length * 2 }; })
        .filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 5);
      if (!hits.length) console.log('Not in the learner\'s cards yet.');
      hits.forEach(({ c }) => console.log(line(c)));
      break;
    }
    case 'save': {
      const file = path.resolve(args[0] || '');
      const card = parseCard(fs.readFileSync(file, 'utf8'), file);
      fs.mkdirSync(cardsDir, { recursive: true });
      const dest = path.join(cardsDir, card.id + '.md'), existed = fs.existsSync(dest);
      let src = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
      if (!/^date:/m.test(src.split('\n---\n')[0])) src = src.replace(/^---\n/, `---\ndate: ${today()}\n`);
      fs.writeFileSync(dest, src);
      if (!state.reviews[card.id]) { state.reviews[card.id] = { step: 0, next: addDays(today(), STEPS[0]) }; saveState(); }
      console.log(`${existed ? 'Updated' : 'Saved'} ${card.id}: ${card.title}`);
      break;
    }
    case 'due': {
      const c = cards().filter((x) => (state.reviews[x.id] || {}).next <= today()).sort((a, b) => (state.reviews[a.id].next < state.reviews[b.id].next ? -1 : 1))[0];
      if (!c) { console.log('Nothing due.'); break; }
      console.log(`${c.id}\nQuestion: ${c.recall}\nAnswer: ${c.answer || '(see card)'}`);
      break;
    }
    case 'reviewed': {
      const [id, how] = args; const r = state.reviews[id];
      if (!r || !['ok', 'again'].includes(how)) throw new Error('Usage: reviewed <id> ok|again (id must be a saved card)');
      r.step = how === 'ok' ? r.step + 1 : 0;
      r.next = addDays(today(), r.step < STEPS.length ? STEPS[r.step] : 120);
      saveState(); console.log(`${id}: next recall ${r.next}`);
      break;
    }
    case 'notebook': {
      const out = opts.out ? path.resolve(opts.out) : path.join(home, 'build');
      fs.mkdirSync(out, { recursive: true });
      const page = notebook();
      fs.writeFileSync(path.join(out, 'index.html'), page);
      fs.writeFileSync(path.join(out, 'page.html'), `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>body{margin:0}[hidden]{display:none!important}</style></head><body>\n${page}\n</body></html>\n`);
      console.log(JSON.stringify({ artifactFile: path.join(out, 'index.html'), page: path.join(out, 'page.html'), artifactUrl: state.notebook }, null, 2));
      break;
    }
    case 'artifact': {
      if (!/^https:\/\//.test(args[0] || '')) throw new Error('Usage: artifact <https url>');
      state.notebook = args[0]; saveState(); console.log('Saved notebook link.');
      break;
    }
    default:
      console.log('Commands: status | list [field] | find <words> | save <card.md> | due | reviewed <id> ok|again | prime <data.json> [--out FILE] | savemap <map.json> | maps | notebook [--out DIR] [--cards DIR] | artifact <url>');
      if (cmd) process.exit(1);
  }
}
try { main(); } catch (e) { console.error('ld: ' + e.message); process.exit(1); }
