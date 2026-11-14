#!/usr/bin/env node
// Learning Database: the learner's own cards. No dependencies.
// Data lives in $LEARNING_DB_HOME (default ~/.learning-database): cards/<id>.md, state.json, build/.
//
//   status | list [field] | find <words> | save <card.md> | due | reviewed <id> ok|again
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
  const card = { ...meta, builds_on: list(meta.builds_on), leads_to: list(meta.leads_to), parts, text: parts.filter((p) => p.md).map((p) => p.md).join(String.fromCharCode(10, 10)), widgets: parts.filter((p) => p.w).length };
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
function mapSvg(list) {
  if (!list.length) return '';
  const fields = [...new Set(list.map((c) => c.field))], pos = {}, W = 132, H = 40, PER = 4;
  let y = 24; const labels = [];
  for (const f of fields) {
    const fc = list.filter((c) => c.field === f);
    labels.push(`<text class="ts" x="20" y="${y + 24}">${esc(f)}</text>`);
    fc.forEach((c, i) => { pos[c.id] = { x: 130 + (i % PER) * (W + 14), y: y + Math.floor(i / PER) * (H + 18) }; });
    y += Math.ceil(fc.length / PER) * (H + 18) + 14;
  }
  const edges = [];
  for (const c of list) for (const b of c.builds_on) if (pos[b]) {
    const a = pos[b], t = pos[c.id];
    edges.push(`<path d="M${a.x + W / 2} ${a.y + H} C${a.x + W / 2} ${a.y + H + 30} ${t.x + W / 2} ${t.y - 30} ${t.x + W / 2} ${t.y}" fill="none" stroke="var(--text-muted)" stroke-width="1"/>`);
  }
  const nodes = list.map((c) => { const p = pos[c.id], t = c.title.length > 18 ? c.title.slice(0, 17) + '…' : c.title;
    return `<a href="#${c.id}"><g class="c-teal"><rect x="${p.x}" y="${p.y}" width="${W}" height="${H}" rx="6" stroke-width="0.5"/><text class="t" x="${p.x + W / 2}" y="${p.y + H / 2}" text-anchor="middle" dominant-baseline="central">${esc(t)}</text></g></a>`; });
  return `<svg width="100%" viewBox="0 0 680 ${y + 10}" role="img"><title>Your concept map</title><desc>Each box is a card; lines show what each card builds on.</desc>${labels.join('')}${edges.join('')}${nodes.join('')}</svg>`;
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
    case 'list': { cards().filter((c) => !args[0] || c.field === args[0]).forEach((c) => console.log(line(c))); break; }
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
      console.log('Commands: status | list [field] | find <words> | save <card.md> | due | reviewed <id> ok|again | notebook [--out DIR] [--cards DIR] | artifact <url>');
      if (cmd) process.exit(1);
  }
}
try { main(); } catch (e) { console.error('ld: ' + e.message); process.exit(1); }
