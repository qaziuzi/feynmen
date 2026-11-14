# Concept cards

A card teaches one idea in three to five minutes. Example: `examples/coulomb.md`.

## Why cards look like this

- **One idea.** Working memory holds about four chunks; a card that teaches two ideas teaches neither well. If you need a second idea, it is the next card.
- **Start from what they know.** The big-picture lines link the new idea to cards the learner already has. New knowledge sticks when it attaches to old.
- **Words and a picture together.** The text gives the causal story; the visual lets them see and steer it. Never put the explanation inside the visual.
- **Predict, then see.** Asking for a guess before the slider moves makes the answer memorable, right or wrong.
- **Recall later, not now.** Each card has one recall question, asked once days later. Retrieval after a gap is what makes knowledge last. Keep it to one optional line.
- **Short.** The learner has little time. A card that respects that gets opened again.

## Text (in the reply)

1. **The question.** One or two sentences: a concrete puzzle the idea answers.
2. **Big picture.** Two or three sentences: where this sits, why it matters, which of their cards it builds on.
3. **How it works.** Four to seven short bullets: the physical cause-and-effect chain from first principles, in plain words. No equations. Proportional statements in words are fine ("twice as far, a quarter of the force").
4. **Predict first.** One question about what the visual will show.
5. *(the visual)*
6. **Takeaway.** One sentence.
7. **Sources.** One line, chapter or section.

About 200 to 350 words of text in total.

## Rules that make cards trustworthy

- **First principles.** Explain from the governing physical laws (charge and fields, Newton, conservation of energy and momentum, thermodynamics). Say when something is an experimental fact rather than a consequence.
- **Correct before simple.** Simplify by leaving things out, never by saying something false. No statement that later has to be unlearned.
- **No analogies unless exact.** No water pipes or "think of it like". A shared mathematical form (gravity and electric force are both inverse-square) may be pointed out because it is exact.
- **Precise words.** Use the real term, define it once in plain words, then keep using it.
- **Authoritative sources.** Standard university texts and courses: Feynman Lectures, Purcell & Morin, Griffiths, MIT OCW, Horowitz & Hill, Sedra & Smith, Erickson & Maksimović, Sze, Kleppner & Kolenkow, Lynch & Park, Åström & Murray, Sutton, Curtis, Strang, Goodfellow et al. (see `fields.md`). Never blogs or forums.
- **Check numbers.** Recompute every number in the text and in the visual.
- **Maths on request.** When asked, derive step by step in the reply. Do not add the derivation to the card.

## The visual

One interactive visual that lets the learner operate the mechanism: a slider that changes the cause, and the effect visibly responding.

- Follow the inline visual tool's design rules (its `read_me`): flat, sentence case, CSS variables for every colour, dark mode works, 680 px wide SVG viewBox.
- It computes the real physics in real units. If something is not to scale, say so in a short label.
- Readouts: at most three small stat tiles. No paragraphs inside the visual.
- End with buttons using `sendPrompt`, class `ld-ask`: "Show me the maths ↗", "Next: <next concept> ↗", "Quiz me ↗". Plus a local Reset if there are sliders.
- **So it also works in the notebook page:** prefix every element id with the card id (`cl-` for coulomb), wrap the script in a function, use only these variables: `--text-primary --text-secondary --text-muted --border --border-strong --surface-1 --surface-2 --bg-accent --text-accent --radius --font-sans`, only the SVG classes `t ts th box arr leader` and `c-gray c-teal c-coral c-blue c-amber c-purple`, fixed hex colours only for physical meaning, and never read element sizes in script (use viewBox coordinates).

## Card file (saved to the learner's database)

```
---
id: coulomb                     short, lowercase, hyphens; unique
title: Coulomb's law
field: electronics              one of the fields in fields.md, or a new one
builds_on: superposition, electric-field    ids of the learner's cards it rests on (may be empty)
leads_to: electric-field        ids or plain names of natural next concepts
recall: the one recall question
answer: its answer, one or two sentences
sources: one line
---
(the card text, in Markdown, exactly as shown in the reply)

<!-- widget -->
(the visual's code, exactly as shown)
```
