// Assemble artifacts from the repo.
//   node tools/build.mjs <field>   -> tracks/<field>/dist/index.html  (+ preview.html for local viewing)
//   node tools/build.mjs home      -> home/index.html                 (+ preview.html)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const write = (p, s) => { fs.mkdirSync(path.dirname(path.join(root, p)), { recursive: true }); fs.writeFileSync(path.join(root, p), s); };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fill = (tpl, map) => tpl.replace(/%%([A-Z_]+)%%/g, (m, k) => (k in map ? String(map[k]) : m));

const graph = JSON.parse(read('graph/concepts.json'));
const trackOf = (id) => graph.tracks.find((t) => t.id === id);
const conceptOf = (id) => graph.concepts.find((c) => c.id === id);
const baseCss = read('shared/base.css');

// The publish step wraps the page in a document skeleton; preview.html imitates it for local viewing.
const preview = (body) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>:root{color-scheme:light}body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>
</head><body>
${body}
</body></html>
`;

// A reference to another concept: a real link if that lesson is built and its field is published, plain text otherwise.
function ref(id, fromTrack) {
  const c = conceptOf(id);
  if (!c) throw new Error('Unknown concept id in link: ' + id);
  const t = trackOf(c.track);
  const label = `${esc(t.name)} ${c.n}: ${esc(c.title)}`;
  if (c.status === 'built') {
    if (c.track === fromTrack) return `<a href="#l${c.n}">${label}</a>`;
    if (t.artifactUrl) return `<a href="${esc(t.artifactUrl)}#l${c.n}">${label}</a>`;
  }
  return `<span class="planned">${label} (not built yet)</span>`;
}

function buildTrack(trackId) {
  const track = trackOf(trackId);
  if (!track) throw new Error('Unknown field: ' + trackId);
  const dir = `tracks/${trackId}/lessons`;
  const files = fs.existsSync(path.join(root, dir)) ? fs.readdirSync(path.join(root, dir)).filter((f) => /^\d+.*\.html$/.test(f)).sort() : [];
  const concepts = graph.concepts.filter((c) => c.track === trackId).sort((a, b) => a.n - b.n);

  const lessons = files.map((f) => {
    const src = read(`${dir}/${f}`);
    const m = src.match(/^\s*<!--lesson\s+(\{[\s\S]*?\})\s*-->/);
    if (!m) throw new Error(`${f}: missing <!--lesson {...}--> meta comment`);
    const meta = JSON.parse(m[1]);
    const body = src.slice(m[0].length).replace(/\{\{link:([a-z0-9]+)\}\}/g, (_, id) => ref(id, trackId));
    return { ...meta, body };
  }).sort((a, b) => a.n - b.n);
  if (!lessons.length) throw new Error('No lessons found in ' + dir);

  const tabs = lessons.map((l) =>
    `      <a class="tab" href="#l${l.n}" data-id="l${l.n}" title="${esc(l.title)}"><span class="n"><span>${l.n}</span></span>${esc(l.short)}</a>`).join('\n');

  const views = lessons.map((l) => {
    const nextBuilt = lessons.find((x) => x.n === l.n + 1);
    const nextPlanned = concepts.find((c) => c.n === l.n + 1);
    const next = nextBuilt
      ? `<a href="#l${nextBuilt.n}">Next: ${esc(nextBuilt.title)}</a>`
      : nextPlanned
        ? `Next in this field: <strong>${esc(nextPlanned.title)}</strong>. It is built when you ask for the next ${esc(track.name)} lesson.`
        : 'This is the last lesson on the roadmap.';
    return `  <article class="view lesson" id="view-l${l.n}" hidden>
${l.body}
    <footer class="lesson-end wide">
      <button type="button" class="done-btn" id="l${l.n}-done" data-done="l${l.n}" aria-pressed="false">Mark lesson complete</button>
      <span class="next">${next}</span>
    </footer>
  </article>`;
  }).join('\n');

  const roadmap = concepts.map((c) => {
    const built = lessons.some((l) => l.n === c.n);
    const title = built ? `<a href="#l${c.n}">${esc(c.title)}</a>` : esc(c.title);
    const x = (c.links || []).map((id) => { const o = conceptOf(id); return o ? `${esc(trackOf(o.track).name)} ${o.n}` : ''; }).filter(Boolean);
    return `      <li class="${built ? 'built' : ''}"><span class="n">${String(c.n).padStart(2, '0')}</span><span>${title}${x.length ? `<span class="x">Connects to ${x.join(', ')}</span>` : ''}</span><span class="st">${built ? 'Built' : 'Planned'}</span></li>`;
  }).join('\n');

  const page = fill(read('shared/shell.html'), {
    BASE_CSS: baseCss,
    TRACK_NAME: esc(track.name),
    TRACK_ID: trackId,
    TRACK_SUMMARY: esc(track.summary),
    FIRST_ID: 'l' + lessons[0].n,
    HOME_LINK: graph.homeUrl ? `<a href="${esc(graph.homeUrl)}">All fields</a>` : '<span class="sub">Learning Database</span>',
    TABS: tabs,
    VIEWS: views,
    ROADMAP: roadmap,
    BUILT_COUNT: lessons.length,
    TOTAL_COUNT: concepts.length,
  });
  write(`tracks/${trackId}/dist/index.html`, page);
  write(`tracks/${trackId}/dist/preview.html`, preview(page));
  console.log(`Built ${trackId}: ${lessons.length} lesson(s), ${(page.length / 1024).toFixed(0)} KB`);
}

function buildHome() {
  let builtTotal = 0;
  const fields = graph.tracks.map((t) => {
    const cs = graph.concepts.filter((c) => c.track === t.id);
    const built = cs.filter((c) => c.status === 'built').length;
    builtTotal += built;
    const total = t.roadmap === 'detailed' ? `${built} of ${cs.length} lessons` : (built ? `${built} lessons` : 'Roadmap written on first lesson');
    const pct = cs.length && t.roadmap === 'detailed' ? Math.round((built / cs.length) * 100) : 0;
    const go = t.artifactUrl ? `<a href="${esc(t.artifactUrl)}">Open</a>` : '<span>Not started</span>';
    return `      <li><div><div class="name">${esc(t.name)}</div><div class="sum">${esc(t.summary)}</div></div><div class="prog"><div class="count">${total}</div><div class="bar"><i style="width:${pct}%"></i></div></div><div class="go">${go}</div></li>`;
  }).join('\n');

  const seen = new Set();
  const side = (c) => {
    const t = trackOf(c.track);
    const built = c.status === 'built';
    const title = built && t.artifactUrl ? `<a href="${esc(t.artifactUrl)}#l${c.n}">${esc(c.title)}</a>` : esc(c.title);
    return `<div class="${built ? 'built' : ''}"><span class="f">${esc(t.name)} ${c.n}${built ? ' · built' : ''}</span>${title}</div>`;
  };
  const links = [];
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
    BASE_CSS: baseCss, FIELDS: fields, LINKS: links.join('\n'), BUILT_TOTAL: `${builtTotal} lesson${builtTotal === 1 ? '' : 's'}`, FIELD_COUNT: graph.tracks.length,
  });
  write('home/index.html', page);
  write('home/preview.html', preview(page));
  console.log(`Built home: ${graph.tracks.length} fields, ${links.length} cross-field connections`);
}

const target = process.argv[2];
if (!target) { console.error('Usage: node tools/build.mjs <field|home|all>'); process.exit(1); }
if (target === 'home') buildHome();
else if (target === 'all') { for (const t of graph.tracks) { if (fs.existsSync(path.join(root, `tracks/${t.id}/lessons`))) buildTrack(t.id); } buildHome(); }
else buildTrack(target);
