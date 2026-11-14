#!/usr/bin/env node
// Learning Database tool. No dependencies. The database it works on is the skill folder this script sits in.
//
//   node ld.mjs status [field]             fields, lessons written, the user's progress
//   node ld.mjs find <words...>            search concepts by title and keywords
//   node ld.mjs chain <conceptId>          prerequisite chain for a concept, in learning order
//   node ld.mjs next <field>               the next lesson for this user in a field
//   node ld.mjs build <field|home|all> [--out DIR] [--start lN]
//   node ld.mjs site --out DIR             static website of every field (GitHub Pages)
//   node ld.mjs done <conceptId...>        record lessons the user finished
//   node ld.mjs artifact <field|home> <url>  remember the user's artifact link for a field
//   node ld.mjs check                      validate the graph and lesson files
//
// Personal state (artifact links, progress) lives outside the database, in
// $LEARNING_DB_HOME/user.json (default ~/.learning-database/user.json).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const skill = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const cmd = argv[0];
const opts = {}; const args = [];
for (let i = 1; i < argv.length; i++) {
  if (argv[i].startsWith('--')) { opts[argv[i].slice(2)] = argv[i + 1]; i++; } else args.push(argv[i]);
}

const home = process.env.LEARNING_DB_HOME || path.join(os.homedir(), '.learning-database');
const statePath = opts.state ? path.resolve(opts.state) : path.join(home, 'user.json');
const outDir = opts.out ? path.resolve(opts.out) : path.join(home, 'build');

const read = (p) => fs.readFileSync(path.join(skill, p), 'utf8');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fill = (tpl, map) => tpl.replace(/%%([A-Z_]+)%%/g, (m, k) => (k in map ? String(map[k]) : m));
const writeOut = (p, s) => { const f = path.join(outDir, p); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, s); return f; };

const graph = JSON.parse(read('db/graph.json'));
const trackOf = (id) => graph.tracks.find((t) => t.id === id);
const conceptOf = (id) => graph.concepts.find((c) => c.id === id);
const conceptsIn = (trackId) => graph.concepts.filter((c) => c.track === trackId).sort((a, b) => a.n - b.n);

function loadState() {
  let s = {};
  try { s = JSON.parse(fs.readFileSync(statePath, 'utf8')); } catch (e) { /* no state yet */ }
  return { artifacts: s.artifacts || {}, progress: s.progress || {} };
}
function saveState(s) { fs.mkdirSync(path.dirname(statePath), { recursive: true }); fs.writeFileSync(statePath, JSON.stringify(s, null, 2) + '\n'); }
const state = loadState();

// ---- lessons on disk: a concept is "written" when a lesson file carries its id ----
const lessonCache = {};
function lessonsIn(trackId) {
  if (lessonCache[trackId]) return lessonCache[trackId];
  const dir = path.join(skill, 'db/lessons', trackId);
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /^\d+.*\.html$/.test(f)).sort() : [];
  const out = files.map((f) => {
    const src = fs.readFileSync(path.join(dir, f), 'utf8');
    const m = src.match(/^\s*<!--lesson\s+(\{[\s\S]*?\})\s*-->/);
    if (!m) throw new Error(`${trackId}/${f}: missing <!--lesson {...}--> meta comment`);
    return { ...JSON.parse(m[1]), file: f, body: src.slice(m[0].length) };
  }).sort((a, b) => a.n - b.n);
  return (lessonCache[trackId] = out);
}
const written = (c) => lessonsIn(c.track).some((l) => l.id === c.id);
const done = (c) => Boolean(state.progress[c.id]);
const tag = (c) => `${trackOf(c.track).name} ${c.n}`;

// Prerequisites of a concept in learning order (depth-first, each once), ending with the concept itself.
function chain(id, seen = new Set(), out = []) {
  const c = conceptOf(id);
  if (!c) throw new Error('Unknown concept: ' + id);
  if (seen.has(id)) return out;
  seen.add(id);
  for (const p of c.prereqs || []) chain(p, seen, out);
  out.push(c);
  return out;
}
const line = (c) => `${c.id.padEnd(5)} ${tag(c).padEnd(28)} ${written(c) ? 'written    ' : 'NOT WRITTEN'} ${done(c) ? 'done' : '    '}  ${c.title}`;

// ---- page building ----
const fullDoc = (body) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>:root{color-scheme:light}body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>
</head><body>
${body}
</body></html>
`;

// mode 'artifact': links between fields use the user's own artifact links. mode 'site': relative links.
function fieldHref(trackId, mode) {
  if (mode === 'site') return `../${trackId}/`;
  return state.artifacts[trackId] || null;
}
function homeHref(mode, fromHome) {
  if (mode === 'site') return fromHome ? './' : '../';
  return state.artifacts.home || null;
}
function ref(id, fromTrack, mode) {
  const c = conceptOf(id);
  if (!c) throw new Error('Unknown concept id in {{link:...}}: ' + id);
  const label = `${esc(tag(c))}: ${esc(c.title)}`;
  if (!written(c)) return `<span class="planned">${label} (not written yet)</span>`;
  if (c.track === fromTrack) return `<a href="#l${c.n}">${label}</a>`;
  const href = fieldHref(c.track, mode);
  return href ? `<a href="${esc(href)}#l${c.n}">${label}</a>` : `<span class="planned">${label} (in the ${esc(trackOf(c.track).name)} field)</span>`;
}

function buildTrack(trackId, mode) {
  const track = trackOf(trackId);
  if (!track) throw new Error('Unknown field: ' + trackId + '. Fields: ' + graph.tracks.map((t) => t.id).join(', '));
  const lessons = lessonsIn(trackId);
  if (!lessons.length) throw new Error(`No lessons written yet in "${trackId}".`);
  const concepts = conceptsIn(trackId);

  const tabs = lessons.map((l) =>
    `      <a class="tab" href="#l${l.n}" data-id="l${l.n}" title="${esc(l.title)}"><span class="n"><span>${l.n}</span></span>${esc(l.short)}</a>`).join('\n');

  const views = lessons.map((l) => {
    const body = l.body.replace(/\{\{link:([a-z0-9]+)\}\}/g, (_, id) => ref(id, trackId, mode));
    const nextWritten = lessons.find((x) => x.n === l.n + 1);
    const nextPlanned = concepts.find((c) => c.n === l.n + 1);
    const next = nextWritten
      ? `<a href="#l${nextWritten.n}">Next: ${esc(nextWritten.title)}</a>`
      : nextPlanned
        ? `Next in this field: <strong>${esc(nextPlanned.title)}</strong>. Ask Claude for the next ${esc(track.name)} lesson.`
        : 'This is the last lesson on the roadmap.';
    return `  <article class="view lesson" id="view-l${l.n}" hidden>
${body}
    <footer class="lesson-end wide">
      <button type="button" class="done-btn" id="l${l.n}-done" data-done="l${l.n}" aria-pressed="false">Mark lesson complete</button>
      <span class="next">${next}</span>
    </footer>
  </article>`;
  }).join('\n');

  const roadmap = concepts.map((c) => {
    const w = written(c);
    const title = w ? `<a href="#l${c.n}">${esc(c.title)}</a>` : esc(c.title);
    const x = (c.links || []).map((id) => { const o = conceptOf(id); return o ? esc(tag(o)) : ''; }).filter(Boolean);
    return `      <li class="${w ? 'built' : ''}"><span class="n">${String(c.n).padStart(2, '0')}</span><span>${title}${x.length ? `<span class="x">Connects to ${x.join(', ')}</span>` : ''}</span><span class="st">${w ? 'Written' : 'Planned'}</span></li>`;
  }).join('\n');

  const hh = homeHref(mode, false);
  const page = fill(read('shared/shell.html'), {
    BASE_CSS: read('shared/base.css'),
    TRACK_NAME: esc(track.name),
    TRACK_ID: trackId,
    TRACK_SUMMARY: esc(track.summary),
    FIRST_ID: 'l' + lessons[0].n,
    START_ID: opts.start && lessons.some((l) => 'l' + l.n === opts.start) ? opts.start : '',
    HOME_LINK: hh ? `<a href="${esc(hh)}">All fields</a>` : '<span class="sub">Learning Database</span>',
    TABS: tabs, VIEWS: views, ROADMAP: roadmap,
    BUILT_COUNT: lessons.length, TOTAL_COUNT: concepts.length,
  });
  const res = { field: trackId, lessons: lessons.map((l) => `l${l.n} ${l.title}`) };
  if (mode === 'site') res.page = writeOut(`${trackId}/index.html`, fullDoc(page));
  else {
    res.artifactFile = writeOut(`${trackId}/index.html`, page);   // for the Claude Code Artifact tool (it adds the document skeleton)
    res.page = writeOut(`${trackId}/page.html`, fullDoc(page));   // complete standalone document (Claude chat, local viewing)
    res.artifactUrl = state.artifacts[trackId] || null;
  }
  return res;
}

function buildHome(mode) {
  let total = 0;
  const fields = graph.tracks.map((t) => {
    const cs = conceptsIn(t.id), n = lessonsIn(t.id).length;
    total += n;
    const count = t.roadmap === 'detailed' ? `${n} of ${cs.length} lessons` : (n ? `${n} lesson${n === 1 ? '' : 's'}` : 'Roadmap written with the first lesson');
    const pct = cs.length && t.roadmap === 'detailed' ? Math.round((n / cs.length) * 100) : 0;
    const href = n ? (mode === 'site' ? `${t.id}/` : state.artifacts[t.id]) : null;
    const go = href ? `<a href="${esc(href)}">Open</a>` : `<span>${n ? 'Ask Claude to open it' : 'Not started'}</span>`;
    return `      <li><div><div class="name">${esc(t.name)}</div><div class="sum">${esc(t.summary)}</div></div><div class="prog"><div class="count">${count}</div><div class="bar"><i style="width:${pct}%"></i></div></div><div class="go">${go}</div></li>`;
  }).join('\n');

  const seen = new Set(), links = [];
  const side = (c) => {
    const w = written(c);
    const href = w ? (mode === 'site' ? `${c.track}/` : state.artifacts[c.track]) : null;
    const title = href ? `<a href="${esc(href)}#l${c.n}">${esc(c.title)}</a>` : esc(c.title);
    return `<div class="${w ? 'built' : ''}"><span class="f">${esc(tag(c))}${w ? ' · written' : ''}</span>${title}</div>`;
  };
  for (const c of graph.concepts) {
    for (const id of [...(c.links || []), ...(c.prereqs || [])]) {
      const o = conceptOf(id);
      if (!o || o.track === c.track) continue;
      const key = [c.id, o.id].sort().join('|');
      if (seen.has(key)) continue;
      seen.add(key);
      links.push(`      <li>${side(c)}<div class="mid" aria-hidden="true">↔</div>${side(o)}</li>`);
    }
  }
  const page = fill(read('shared/home.html'), {
    BASE_CSS: read('shared/base.css'), FIELDS: fields, LINKS: links.join('\n'),
    BUILT_TOTAL: `${total} lesson${total === 1 ? '' : 's'}`, FIELD_COUNT: graph.tracks.length,
  });
  const res = { field: 'home' };
  if (mode === 'site') res.page = writeOut('index.html', fullDoc(page));
  else {
    res.artifactFile = writeOut('home/index.html', page);
    res.page = writeOut('home/page.html', fullDoc(page));
    res.artifactUrl = state.artifacts.home || null;
  }
  return res;
}

// ---- validation ----
function check() {
  const errs = [];
  const ids = new Set();
  for (const c of graph.concepts) {
    if (ids.has(c.id)) errs.push(`Duplicate concept id ${c.id}`);
    ids.add(c.id);
    if (!trackOf(c.track)) errs.push(`${c.id}: unknown field ${c.track}`);
  }
  for (const c of graph.concepts) {
    for (const p of [...(c.prereqs || []), ...(c.links || [])]) if (!ids.has(p)) errs.push(`${c.id}: refers to unknown concept ${p}`);
  }
  const visiting = new Set(), ok = new Set();
  const walk = (id, trail) => {
    if (ok.has(id) || !ids.has(id)) return;
    if (visiting.has(id)) { errs.push('Prerequisite cycle: ' + [...trail, id].join(' -> ')); return; }
    visiting.add(id);
    for (const p of conceptOf(id).prereqs || []) walk(p, [...trail, id]);
    visiting.delete(id); ok.add(id);
  };
  for (const c of graph.concepts) walk(c.id, []);
  for (const t of graph.tracks) {
    let lessons = [];
    try { lessons = lessonsIn(t.id); } catch (e) { errs.push(e.message); continue; }
    for (const l of lessons) {
      const c = conceptOf(l.id);
      if (!c) { errs.push(`${t.id}/${l.file}: id ${l.id} is not in the graph`); continue; }
      if (c.track !== t.id || c.n !== l.n) errs.push(`${t.id}/${l.file}: meta (n=${l.n}) does not match graph (${c.track} n=${c.n})`);
      for (const k of ['short', 'title', 'minutes']) if (!l[k]) errs.push(`${t.id}/${l.file}: meta is missing "${k}"`);
      for (const p of c.prereqs || []) { const pc = conceptOf(p); if (pc && !written(pc)) errs.push(`${t.id}/${l.file}: prerequisite ${p} (${pc.title}) is not written`); }
      for (const m of l.body.matchAll(/\{\{link:([a-z0-9]+)\}\}/g)) if (!ids.has(m[1])) errs.push(`${t.id}/${l.file}: {{link:${m[1]}}} is not in the graph`);
      if (!l.body.includes(`LD.register('l${l.n}'`) && /<canvas|class="bench"/.test(l.body)) errs.push(`${t.id}/${l.file}: has an interactive but no LD.register('l${l.n}', ...)`);
      if (!/Sources<\/span>/.test(l.body)) errs.push(`${t.id}/${l.file}: no Sources section`);
    }
  }
  return errs;
}

// ---- commands ----
function main() {
  switch (cmd) {
    case 'status': {
      const only = args[0];
      for (const t of graph.tracks) {
        if (only && t.id !== only) continue;
        const cs = conceptsIn(t.id), w = cs.filter(written).length, d = cs.filter(done).length;
        console.log(`${t.id}  "${t.name}"  ${w} written / ${cs.length} planned (${t.roadmap} roadmap), ${d} done by this user${state.artifacts[t.id] ? '  artifact: ' + state.artifacts[t.id] : ''}`);
        if (only) cs.forEach((c) => console.log('  ' + line(c)));
      }
      if (!only) console.log(`\nhome artifact: ${state.artifacts.home || '(none yet)'}\nstate file: ${statePath}\ndatabase: ${skill}\nshared repo: ${graph.repo || '(not published yet)'}`);
      break;
    }
    case 'find': {
      const STOP = new Set('why how what when where does did the and for are was can you not but with from that this its into about work works working mean means really actually explain'.split(' '));
      const words = args.join(' ').toLowerCase().split(/[^a-z0-9']+/).filter((w) => w.length > 2 && !STOP.has(w));
      if (!words.length) throw new Error('Usage: find <words...>');
      const scored = graph.concepts.map((c) => {
        const title = c.title.toLowerCase(), cov = (c.covers || '').toLowerCase();
        let s = 0;
        for (const w of words) { if (title.includes(w)) s += 3; if (cov.includes(w)) s += 2; }
        return { c, s };
      }).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 6);
      if (!scored.length) { console.log('No concept matches. This is a new concept: place it in a field (see reference/authoring.md).'); break; }
      for (const { c } of scored) { console.log(line(c)); console.log(`      covers: ${c.covers || ''}`); }
      console.log('\nRun "chain <id>" on the best match for its prerequisites.');
      break;
    }
    case 'chain': {
      const list = chain(args[0]);
      list.forEach((c, i) => console.log(`${String(i + 1).padStart(2)}. ${line(c)}`));
      const missing = list.filter((c) => !written(c));
      console.log(`\n${list.length} lessons in the chain, ${missing.length} not written yet, ${list.filter(done).length} already done by this user.`);
      break;
    }
    case 'next': {
      const t = trackOf(args[0]);
      if (!t) throw new Error('Unknown field: ' + args[0] + '. Fields: ' + graph.tracks.map((x) => x.id).join(', '));
      const c = conceptsIn(t.id).find((x) => !done(x));
      if (!c) { console.log(`Every planned lesson in ${t.name} is done. Extend the roadmap (reference/authoring.md).`); break; }
      console.log(line(c));
      const miss = chain(c.id).filter((x) => x.id !== c.id && !written(x));
      if (!written(c)) console.log(miss.length ? `Not written, and ${miss.length} prerequisite(s) are also missing: ${miss.map((x) => x.id).join(', ')}. Write those first.` : 'Not written yet: write it (reference/authoring.md).');
      else console.log(`Open tab #l${c.n} of the ${t.name} artifact.`);
      if (t.roadmap === 'seed') console.log('This field has only a seed roadmap: write the detailed roadmap before its first lesson.');
      break;
    }
    case 'build': {
      const target = args[0];
      if (!target) throw new Error('Usage: build <field|home|all> [--out DIR] [--start lN]');
      const res = [];
      if (target === 'home') res.push(buildHome('artifact'));
      else if (target === 'all') { for (const t of graph.tracks) if (lessonsIn(t.id).length) res.push(buildTrack(t.id, 'artifact')); res.push(buildHome('artifact')); }
      else res.push(buildTrack(target, 'artifact'));
      console.log(JSON.stringify(res, null, 2));
      break;
    }
    case 'site': {
      const res = [];
      for (const t of graph.tracks) if (lessonsIn(t.id).length) res.push(buildTrack(t.id, 'site'));
      res.push(buildHome('site'));
      console.log(JSON.stringify(res, null, 2));
      break;
    }
    case 'done': {
      const today = new Date().toISOString().slice(0, 10);
      for (const id of args) { if (!conceptOf(id)) throw new Error('Unknown concept: ' + id); state.progress[id] = state.progress[id] || today; }
      saveState(state); console.log('Recorded: ' + args.join(', '));
      break;
    }
    case 'artifact': {
      if (args[0] !== 'home' && !trackOf(args[0])) throw new Error('Unknown field: ' + args[0]);
      if (!/^https:\/\//.test(args[1] || '')) throw new Error('Usage: artifact <field|home> <https url>');
      state.artifacts[args[0]] = args[1]; saveState(state); console.log(`Saved ${args[0]} -> ${args[1]}`);
      break;
    }
    case 'check': {
      const errs = check();
      if (errs.length) { errs.forEach((e) => console.error('ERROR ' + e)); process.exit(1); }
      console.log(`OK: ${graph.concepts.length} concepts, ${graph.tracks.reduce((n, t) => n + lessonsIn(t.id).length, 0)} lessons.`);
      break;
    }
    default:
      console.log('Commands: status [field] | find <words> | chain <id> | next <field> | build <field|home|all> [--out DIR] [--start lN] | site --out DIR | done <id...> | artifact <field|home> <url> | check');
      if (cmd) process.exit(1);
  }
}
try { main(); } catch (e) { console.error('ld: ' + e.message); process.exit(1); }
