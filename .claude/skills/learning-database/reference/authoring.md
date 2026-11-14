# Writing a lesson

Read `rigor.md` first. Use `db/lessons/electronics/01-coulomb.html` as the model for structure, markup and interactive code; read it once before writing your first lesson.

## 1. Place the concept in the graph (`db/graph.json`)

- A concept is `{ "id", "track", "n", "title", "covers", "prereqs", "links" }`. `id` is the field's letter prefix plus a two-digit number (`e02`, `r01`). `covers` is a comma-separated list of search keywords, including the questions the lesson answers ("why capacitor blocks dc"). `prereqs` are concept ids, in any field, whose results the lesson uses. `links` are related concepts in other fields.
- A lesson can be written only when all its prerequisites are written. `chain <id>` shows what is missing.
- **Seed fields.** A field marked `"roadmap": "seed"` has only a few placeholder concepts. Before writing its first lesson, replace them with a detailed roadmap: an ordered list built upward from the governing laws, each concept with prerequisites, then set `"roadmap": "detailed"`. Show the user the roadmap in two or three lines.
- **New concept in a detailed field.** Give it the next free number, or insert it and renumber later concepts only if no lesson files exist for them. Never renumber a concept that has a lesson file.

## 2. Lesson file

Path: `db/lessons/<field>/NN-slug.html`. It is an HTML fragment that begins with a meta comment:

```html
<!--lesson {"n":2,"id":"e02","short":"Field and Gauss","title":"The electric field and Gauss's law","minutes":14}-->
```

`short` is the tab label (three words at most). `minutes` is 10 to 15.

### Sections, in this order

Each section is an `<h2><span class="eyebrow">Label</span>Heading</h2>` followed by content.

1. **Question**: the precise question the lesson answers.
2. **Starting points**: laws and earlier results it rests on; name the earlier lessons with `{{link:id}}`.
3. **Derivation**: step by step, each step justified, assumptions stated. Split under several headings if long.
4. **Play**: one or two interactives, each preceded by a predict-first prompt.
5. **Result**: the idea stated exactly in a `<div class="law">`, then `<p class="limits">` with limits of validity.
6. **Connections**: a list of `{{link:id}}` items with one sentence each. The build turns each into a real link when that lesson is written and reachable, and into plain text otherwise.
7. **Check yourself**: three questions that test understanding, not recall.
8. **Build spark**: one concrete thing to build or measure.
9. **Sources**: `<ul class="sources">`, chapter and section for each; say which were checked online and when.

### Markup

- Maths: TeX inside `<span class="tex">…</span>` (inline) or `<div class="tex display">…</div>` (display). It is rendered to MathML by KaTeX. Write `\lt` and `\gt` in place of `<` and `>`, and avoid `&`.
- Predict prompt: `<details class="predict"><summary data-tag="Predict first">question</summary><div class="ans">…</div></details>`.
- Check question: `<details class="check"><summary data-tag="1">question</summary><div class="ans">…</div></details>`.
- Interactive: `<figure class="bench">` containing `<figcaption class="bench-title">`, one or more `<canvas>` (inside `<div class="bench-grid">` when side by side), `<div class="controls">` with `<label class="ctl">` sliders or a `<div class="seg">` of buttons, `<dl class="readout">`, and `<p class="note">` saying what is and is not to scale.
- Prefix every element id with `l<N>-`.

### Interactive code

One `<script>` at the end of the file:

```js
LD.register('l2', function (root) {
  // root is this lesson's <article>. Runs once, the first time the tab is shown.
});
```

Helpers provided by the shell:

- `LD.canvas(canvasEl, draw(ctx, w, h))` returns `{ redraw }`. Sizes for HiDPI and redraws on resize and theme change. Work in CSS pixels.
- `LD.drag(canvasEl, { hit(x, y) -> object | null, move(object, x, y) })` for dragging; add `class="draggable"` to the canvas.
- `LD.arrow(ctx, x1, y1, x2, y2, { color, width, head, dash })`.
- `LD.fmt(value, unit, digits)` formats with SI prefixes (`39.9 µN`).
- `LD.css('--ink')` reads a theme colour: `--ink --muted --line --surface --sunken --accent --pos --neg --ok`. Always take colours from these so both themes work.
- `LD.font(px, weight)` for canvas text.

Rules: compute in SI units from the real equations; put constants at the top with their units; never hard-code a colour; keep the lesson free of external requests.

## 3. Check before showing it

1. Recompute every number in the text and compare the interactive's readouts with a hand calculation for one configuration.
2. Check formulas and constants against the cited sources where they are online.
3. `node scripts/ld.mjs check`, then `build <field>`.
4. If a browser or preview tool is available, open `page.html`: the tab shows, the interactives respond, there are no console errors, and it works at phone width and in the dark theme.
5. For each earlier lesson this one connects to, add a `{{link:id}}` item to that lesson's Connections section.
