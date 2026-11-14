---
name: learning-database
description: Teach physics and engineering from first principles through interactive lesson artifacts drawn from a shared, growing lesson database. Use when the user asks a deep technical "why/how does X work" question in physics, electronics, power electronics, analog design, chips, robotics, astrophysics, rockets, automobiles, mathematics or AI; says they want to learn or understand a concept; or asks for the next lesson in a field ("next electronics lesson", "robotics lesson", "surprise me").
---

# Learning Database

A shared database of 10 to 15 minute interactive lessons, each derived from the governing physical laws and tied to standard university textbooks. Lessons are grouped into fields. A user learns in **their own artifact**: one page per field, one tab per lesson.

The point of the database is that a lesson is written once. If a lesson exists, **assemble it with the script; never rewrite or paraphrase it into the chat**. Write a lesson only when the database does not have it.

## The tool

Everything goes through one script with no dependencies (`<skill>` is the folder this file is in):

```
node <skill>/scripts/ld.mjs status [field]          fields, lessons written, this user's progress and artifact links
node <skill>/scripts/ld.mjs find <words>            search concepts
node <skill>/scripts/ld.mjs chain <conceptId>       prerequisite chain in learning order, with written / done flags
node <skill>/scripts/ld.mjs next <field>            this user's next lesson in a field
node <skill>/scripts/ld.mjs build <field|home|all> [--out DIR] [--start lN]
node <skill>/scripts/ld.mjs done <conceptId...>     record finished lessons
node <skill>/scripts/ld.mjs artifact <field|home> <url>   remember the user's artifact link
node <skill>/scripts/ld.mjs check                   validate graph and lessons
```

Use these commands instead of reading `db/graph.json` or lesson files; their output is short and is all you need to route a request.

**Fresher database (Claude Code, optional).** `status` prints the shared repo address. If it is set and `git` is available, keep a clone at `~/.learning-database/repo` (`git clone` once, `git pull` at most once a day) and run the copy of `ld.mjs` inside that clone; it has the newest lessons. Otherwise use this skill's bundled copy.

## Showing a lesson (always an artifact)

1. `build <field>` writes two files and prints their paths: `index.html` (page content for the Claude Code Artifact tool) and `page.html` (a complete standalone document).
2. **Claude Code:** publish `index.html` with the Artifact tool. If `build` printed an `artifactUrl`, pass it as `url` so the user's existing artifact gains the tab (read the artifact first if this session has not touched it). If it printed `null`, publish new, then run `artifact <field> <url>` to save the link. Point the user at the lesson with `<artifactUrl>#l<N>`.
3. **Claude chat (no Artifact tool):** run `build <field> --start l<N> --out /mnt/user-data/outputs` (or the session's output folder) and present `page.html` to the user as the artifact. `--start` makes it open on the right tab. Do not paste the lesson's HTML into the chat. If the sandbox cannot run Node, say so, and as a last resort assemble the page by hand from `shared/shell.html` and the lesson file.
4. If the field's artifact is already up to date with the lesson the user needs, do not rebuild; just give the link and tab.

## The three kinds of request

### 1. A deep technical question

1. `find` the concept the answer rests on, then `chain <id>`.
2. Reply with a **short direct answer first** (a few sentences, correct, no hand-waving, no analogy).
3. Under it, list the chain as the path to the full answer: lesson number, title, and whether it is ready. Leave out lessons marked done, and ask which of the rest the user already knows.
4. Open the user's artifact at the first lesson they need (see "Showing a lesson"). If lessons in the chain are not written, say how many, and write the first missing one now (see "Writing a missing lesson"); write the others as the user reaches them.
5. You cannot see the "Mark complete" button. When the user says they finished a lesson, run `done <id>`. When they have finished the chain, or ask for it sooner, give the full-depth answer, built on those lessons and referring to them by number.

### 2. "I want to learn X"

1. `find` it.
2. Written: open the artifact at that lesson. Mention, in one line, any prerequisites from `chain` that the user has not done.
3. Planned but not written: write it (below). If prerequisites are also unwritten, say how many and write them in order, one per request unless the user asks for more.
4. Not in the graph: it is a new concept. Add it to the right field with its prerequisites (`reference/authoring.md`), then write it.

### 3. "Next lesson in <field>" or "surprise me"

1. `next <field>`. For "surprise me", pick the field the user has touched least recently that has a lesson ready.
2. If this is Claude chat and there is no saved progress, ask which lesson they finished last, then run `done` for the ones before it.
3. Written: open the artifact at that tab. Not written: write it (below).

## Writing a missing lesson

Read `reference/rigor.md` and `reference/authoring.md` first and follow them exactly; they are the quality bar that makes the database worth sharing. In short: derive from the governing laws, rely only on earlier lessons, no analogies unless exact, real units in interactives, cite standard textbooks by section, and check formulas, constants and worked numbers before publishing. Then `check`, `build`, and show it as above.

After the user has the lesson, offer once to contribute it to the shared database (`reference/contributing.md`). Never submit without the user's yes.

## Tone with the learner

Plain and precise. One lesson at a time. After a lesson, a single question that tests understanding is welcome; a quiz is not.
