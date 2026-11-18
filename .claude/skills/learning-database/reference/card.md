# Concept cards

A card teaches one concept in 10 to 15 minutes, deeply and precisely, in the chat. Model card: `examples/coulomb.md`. Match its depth, precision and interactivity; never ship something thinner.

## The standard

- **Depth over brevity.** Explain every part of the idea: what it says, why each part is the way it is, how big the effect is in the real world, and where it stops being true. A learner should finish able to explain it to someone else.
- **First principles.** Build from the governing physical laws (charge and fields, Newton, conservation of energy and momentum, thermodynamics). Say plainly when something is an experimental fact rather than a consequence of something deeper.
- **Precise and correct.** Real terms, defined once in plain words. Real numbers with units. Simplify by leaving things out, never by saying something false.
- **No analogies unless exact.** No water pipes, no "think of it like". A shared mathematical form (gravity and electric force are both inverse-square) may be pointed out because it is exact.
- **Maths on request.** No equations in the card. State relationships in precise words ("twice as far, a quarter of the force"; "a straight line of slope −2 on log-log axes"). Each visual has a "Show me the maths ↗" button; when pressed, derive it step by step in the reply.
- **Authoritative sources.** Standard university texts and courses (see `fields.md`), by chapter or section. Never blogs or forums. Check every number you state and every number a visual computes; check claims against the online sources (feynmanlectures.caltech.edu, ocw.mit.edu, physics.nist.gov) when you can, and say which were checked.

## Why it is shaped this way

- **Connect to what they know.** Open by placing the idea among cards the learner already has and in their priming map for the field. New knowledge sticks when it attaches to old.
- **No islands.** Also anchor it in something the learner knows from outside their cards: a device they use, their work, an everyday observation. Knowledge connected only to itself is hard to apply without a prompt.
- **Predict, then see.** Each visual is preceded by a concrete prediction question. A guess made before the answer makes the answer memorable, right or wrong.
- **Words and pictures together.** The text carries the reasoning; the visuals let the learner operate the mechanism. Never move the explanation into the visual.
- **Test, then space.** End with three questions that test understanding, answered by clicking. One recall question comes back days later.
- **Higher-order recall only.** Both the check questions and the recall question ask the learner to compare, apply or connect: two ideas side by side, a real situation, a prediction. Never ask for a definition or a single number on its own.

## Card text and visuals, in order

1. **The question.** A concrete puzzle the concept answers.
2. **Big picture.** Where it sits, why it matters, which of the learner's cards it builds on.
3. **Starting points.** The laws, facts and earlier cards it rests on.
4. **The idea, part by part.** Bullets that take each part of the idea in turn and say why it is so.
5. **Predict first**, then **visual 1**: the main mechanism, with sliders and a live plot or readouts.
6. **Scale and consequences.** Real magnitudes, a surprising consequence, the answer to the prediction.
7. A second aspect of the concept, a **prediction**, then **visual 2**: something the learner drags or builds.
8. **Result.** The idea stated exactly in two or three sentences.
9. **Where it stops being true.** Limits of validity: the situations that break the idea.
10. **Check yourself**, then **visual 3**: three multiple-choice questions with explanations on click.
11. **Where it sits and where it leads.** Its group in the learner's map, the cards and fields it links to, and the next concepts.
12. **Build spark.** One concrete thing to build or measure.
13. **Sources.** One line.

Typically 900 to 1,300 words of text and three visuals.

## The visuals

- Follow the inline visual tool's design rules (its `read_me`): flat, sentence case, CSS variables for colour, dark mode works.
- Make them rich: two linked panels (for example a scene and a live plot), several controls, presets, dragging, stat tiles. A single slider panel is not enough for a main visual.
- They compute the real physics in real units. Anything not to scale says so in one short note line.
- Each ends with buttons that call `sendPrompt`, class `ld-ask`: "Show me the maths ↗" and "Next: <concept> ↗", plus a local Reset.
- **Clickable parts.** Named parts of a visual that a learner might wonder about (a component, a labelled quantity, a region) are clickable and call `sendPrompt('Explain <part> in <card topic>, briefly')` when `sendPrompt` exists. Give them `cursor:pointer` and say so in the note line ("tap a labelled part to ask about it"). Two to five clickable parts per visual, not every label.
- **So they also work in the notebook page:** prefix every element id with a short card prefix (`c1-`, `c2-`…), wrap the script in a function, and use only these variables: `--text-primary --text-secondary --text-muted --text-accent --text-success --text-danger --bg-accent --bg-success --bg-danger --border --border-strong --surface-1 --surface-2 --radius --font-sans`; only the SVG text classes `t ts th`; fixed hex colours only for physical meaning (positive charge `#D85A30`, negative `#378ADD`). Set colours with `style="fill:…;stroke:…"`. Read element sizes only inside event handlers (for example `getScreenCTM` when dragging).

## Card file

```
---
id: coulomb
title: Coulomb's law
field: electronics
group: the group this card belongs to in the learner's map of the field (use their group names)
builds_on: ids of the learner's cards it rests on (comma-separated, may be empty)
links: ids of the learner's cards it connects to sideways, in any field (comma-separated, may be empty)
leads_to: next concepts
recall: one recall question for later, comparing or applying (see above)
answer: its answer, with the reasoning
sources: one line
---
(Markdown text exactly as shown in the reply)

<!-- widget -->
(visual 1 code, exactly as shown)
<!-- /widget -->

(more text)

<!-- widget -->
(visual 2 code)
<!-- /widget -->
...
```
