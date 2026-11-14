---
name: lesson
description: Build the next lesson in a field of the Learning Database and publish it as a new tab in that field's artifact. Use when the user names a field ("electronics", "robotics", "AI"), asks for the next lesson, or says "surprise me".
---

# Build the next lesson

Follow `CLAUDE.md` (rigor standard, lesson anatomy, writing style) throughout.

## 1. Choose the concept

1. Read `graph/concepts.json` and `progress.json`.
2. Resolve the field from the user's words. For "surprise me", pick the field with the oldest last-delivered date that has a concept ready.
3. Pick the lowest-numbered concept in that field with `status: "planned"` whose `prereqs` are all `built`.
4. If the field has only seed concepts (no detailed roadmap yet), first write its roadmap: an ordered list built upward from the governing laws, with prerequisites (including concepts in other fields), add it to the graph and to `tracks/<field>/track.md`, and show the user the roadmap in two or three lines before building lesson 1.
5. If a prerequisite lives in another field and is not built, say so and offer to build that one first.

## 2. Find the connections

List concepts already `built` in any field that this lesson uses or sheds light on. These become real links in the Connections section (`<artifactUrl>#l<n>`). Concepts that are planned but not built are listed as plain text, not links.

## 3. Write the lesson

- Copy the structure of an existing lesson, e.g. `tracks/electronics/lessons/01-coulomb.html`.
- File: `tracks/<field>/lessons/NN-slug.html`, starting with `<!--lesson {"n":N,"id":"<conceptId>","short":"<tab label>","title":"<full title>","minutes":M}-->`.
- Maths: put TeX inside `<span class="tex">` (inline) or `<div class="tex display">` (display). Escape `<` and `&`.
- Interactives: `<figure class="bench">` with canvases and controls; logic inside `LD.register('l<N>', function(root){...})`. Use `LD.canvas`, `LD.drag`, `LD.arrow`, `LD.fmt`, `LD.css`. Prefix every element id with `l<N>-`. Compute with real equations in SI units.
- Put a predict-first `<details class="predict">` before each interactive and three `<details class="check">` questions near the end.
- Check every formula, constant and numerical example: recompute the numbers, and verify against the cited sources where they are openly available (use the web-fetch agent on feynmanlectures.caltech.edu, ocw.mit.edu, physics.nist.gov).

## 4. Build, test, publish

1. `node tools/build.mjs <field>`.
2. Open `tracks/<field>/dist/preview.html` through the `learning-db` preview server (`.claude/launch.json`), check the new tab: interactives respond, no console errors, phone width, dark theme.
3. Publish `tracks/<field>/dist/index.html` with the Artifact tool. If the field already has an `artifactUrl` in the graph, pass it as `url` (read the artifact first if this session has not touched it). If not, publish new and save the returned URL in the graph.
4. For each older lesson this one connects to, add a forward link in that lesson's Connections section, rebuild and republish the fields touched.
5. Set the concept to `built` with its `lesson` path, append to `progress.json`, run `node tools/build.mjs home` and republish the Home artifact.
6. `git add -A && git commit`.

## 5. Tell the user

Give the artifact link with the tab hash, one sentence on what the lesson establishes, and what comes next in that field.
