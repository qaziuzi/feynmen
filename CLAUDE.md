# Learning Database

A growing set of interactive, first-principles lessons across applied physics and engineering. Each field is one Claude artifact; each lesson is a tab inside it. This repo is the source behind the artifacts and the memory shared by every session.

## The learner

- Learns by reading and by manipulating things visually. Not by video.
- Wants deep understanding built from physical law upward, not surface familiarity.
- Has little time per day: one lesson is 10 to 15 minutes.
- Wants fields connected to each other, so that learning one strengthens the others and suggests things to build.

## When the user names a field or asks for a lesson

Run the `lesson` skill (`.claude/skills/lesson/SKILL.md`). Typical triggers: "electronics", "next robotics lesson", "surprise me", "I feel like astrophysics today".

## Rigor standard (applies to every lesson, no exceptions)

1. **First principles, at the level of the governing laws.** Electronics is taught from electromagnetism: charge, fields, Maxwell's equations, energy in fields. Circuit rules (Kirchhoff, V = IR, component equations) are derived as approximations of the field description, with the conditions under which they hold. Apply the same standard in every field: start from the governing laws (Newton, conservation laws, thermodynamics, Maxwell, quantum mechanics where needed) and derive.
2. **Dependency rule.** A lesson may rely only on laws and results established in earlier lessons (any field) or stated explicitly in its "Starting points" section. If something is an experimental fact rather than a derived result, say so.
3. **No analogy unless it is exact.** No water pipes, no "think of it like". A shared mathematical structure (for example inverse-square laws in gravity and electrostatics) may be pointed out because it is exact. If a comparison would mislead at depth, leave it out.
4. **Precise and general.** Exact definitions, correct SI units, stated assumptions, stated limits of validity. No simplification that later has to be unlearned.
5. **Authoritative sources only.** Anchor content to standard university texts and courses. No blogs, forums, or popular web explainers. Starting list:
   - Electromagnetism: Feynman Lectures Vol. II; Purcell & Morin, *Electricity and Magnetism*; Griffiths, *Introduction to Electrodynamics*; MIT OCW 8.02 course notes.
   - Circuits and electronics: Agarwal & Lang (MIT 6.002); Horowitz & Hill, *The Art of Electronics*; Sedra & Smith, *Microelectronic Circuits*; Razavi (analog); Gray, Hurst, Lewis & Meyer.
   - Power electronics: Erickson & Maksimović, *Fundamentals of Power Electronics*; Kassakian, Schlecht & Verghese.
   - Semiconductors and chips: Sze, *Physics of Semiconductor Devices*; Pierret; Streetman & Banerjee; Plummer, Deal & Griffin (*Silicon VLSI Technology*).
   - Mechanics, robotics, control: Kleppner & Kolenkow; Feynman Vol. I; Lynch & Park, *Modern Robotics*; Åström & Murray, *Feedback Systems*.
   - Astrophysics and rockets: Carroll & Ostlie; Sutton & Biblarz, *Rocket Propulsion Elements*; Curtis, *Orbital Mechanics*.
   - Maths: Strang (linear algebra, MIT 18.06); Apostol or Spivak (calculus); Boas.
   - AI: Goodfellow, Bengio & Courville; Bishop; Stanford CS229 / CS231n / CS224n notes; original papers.
6. **Cited and checked.** Every lesson ends with a Sources section naming chapter and section. Where a source is openly available (Feynman Lectures online, MIT OCW, NIST), check the key claims, formulas and constants against it before publishing. Write in original words; never copy passages.
7. **Say plainly when uncertain.** If a claim could not be checked against a source, either remove it or mark it as unchecked in the lesson.
8. **Interactives compute the real physics.** Real equations, SI units, real magnitudes. If a drawing is not to scale (for example arrows on a log scale), the caption says so.

## Lesson anatomy

1. **Question**: the precise question the lesson answers.
2. **Starting points**: laws and earlier results it rests on.
3. **Derivation**: step by step, each step justified, assumptions stated.
4. **Play**: one or two interactives, with a predict-first prompt before each.
5. **Result**: the idea stated exactly, with its limits of validity.
6. **Connections**: links to lessons already built in any field, and where this leads.
7. **Check yourself**: three questions that test understanding, answers hidden until opened.
8. **Build spark**: one concrete thing to build or measure.
9. **Sources**.

## Writing style

Plain, direct sentences. Define each term once and keep using the same word. No filler, no hype, no decorative metaphors. Units on every number.

## How the repo works

- `graph/concepts.json` is the single source of truth: fields, concepts, order, prerequisites, cross-field links, lesson files, artifact URLs.
- `tracks/<field>/lessons/NN-slug.html` is one lesson (an HTML fragment that starts with a `<!--lesson {...}-->` meta comment and registers its interactives with `LD.register`).
- `node tools/build.mjs <field>` assembles `tracks/<field>/dist/index.html` (published as the field's artifact) and `dist/preview.html` (for local viewing). `node tools/build.mjs home` builds `home/index.html`.
- `shared/base.css`, `shared/shell.html`, `shared/home.html` hold the common look, tab shell and helpers. Change the look there, not per lesson.
- `progress.json` records which lessons were delivered and when. `ideas.md` collects build ideas.
- Artifact-first: every field has exactly one artifact URL, stored in the graph. Always republish to that URL (pass it as `url`); never create a second artifact for the same field.
- Commit after each lesson.
