# Priming maps

Before learning a topic in detail, the learner sketches how they think its main ideas fit together. They work from what they already know, so the map they make is a hypothesis built on their prior knowledge. Every card that follows tests that hypothesis, which makes each new idea relevant from the start and stops the learner from inheriting the order a textbook happened to use. Expert example: `examples/prime-electronics.json`.

Basis: activating prior knowledge and giving an overview before detail (Ausubel's advance organizers), generating an answer before being taught (generation and pretesting effects), and organising knowledge in connected chunks rather than lists. The specific numbers here (2 to 4 per group, 6 groups) are practical limits for a small board, not research results.

## When

- The first card in a new field, or "I want to learn <topic>".
- A deep question: map the 6 to 12 ideas the answer rests on.
- When the learner asks ("map it first", "let me structure it").

Skip it when the learner wants to go straight to a card.

## Steps

1. **Choose the terms.** 8 to 20 key ideas that span the whole topic, named in the topic's real terms. Include a few the learner may not know yet; they look those up briefly or ask. Not a table of contents: the tool shuffles them.
2. **Build the expert structure.** Up to 6 groups of 2 to 4 terms, each group named by what unites it physically ("Energy stored in fields", not "Chapter 3"). Then the links between groups that matter most, each with a one-line reason. Check it against your sources like any card.
3. **Generate the visual.** Write `{topic, field, terms, expert:{groups:[{name, terms}], links:[[i, j, "why"]]}}` to a JSON file and run `ld.mjs prime <file>`. Show the printed code with the inline visual tool, unchanged. In the reply, above it: one or two sentences on why mapping first helps, and that a different grouping is not wrong if they can say why.
4. **Compare.** The learner's "Compare my map" button sends their groups and links. Reply in the chat:
   - what their map gets right, specifically;
   - each real difference from the expert map, and the physical reason for the expert's choice;
   - differences that are equally valid ways to see it, said plainly;
   - where they could start, given their map. Let them choose.
5. **Save.** `savemap` with the same JSON plus `learner: {groups: [{name, terms}], links: [[name, name]]}` and an optional one-line `notes`. The map appears in the notebook.
6. **Use it.** Group each new card in that field under the learner's own group names where they make sense, and link back to the map in the card's "Where it sits" line.
