# Priming maps

Before learning a topic in detail, the learner sketches how they think its main ideas fit together. They work from what they already know, so the map they make is a hypothesis built on their prior knowledge. Every card that follows tests that hypothesis, which makes each new idea relevant from the start and stops the learner from inheriting the order a textbook happened to use. Expert example: `examples/prime-electronics.json`.

Basis: activating prior knowledge and giving an overview before detail (Ausubel's advance organizers), generating an answer before being taught (generation and pretesting effects), and organising knowledge in connected chunks rather than lists. The specific numbers here (2 to 4 per group, 6 groups) are practical limits for a small board, not research results.

## When

Always ask first; the learner may prefer to go straight to a card.

- The first card in a new field, or "I want to learn <topic>".
- A deep question: map the 6 to 12 ideas the answer rests on.
- When the learner asks ("map it first", "let me structure it").

Skip it when the learner wants to go straight to a card.

## Steps

1. **Choose the terms.** 8 to 10 key ideas for a field the learner is new to, up to 16 if they already know its basics. They should span the whole topic and use its real names. Not a table of contents: the tool shuffles them.
   Write a one-line plain meaning for each (`defs`), in everyday words, at most 140 characters. Tapping a term shows it, so a newcomer can make a real guess instead of a random one.
2. **Build the expert structure.** Up to 6 groups of 2 to 4 terms, each group named by what unites it physically ("Energy stored in fields", not "Chapter 3"). Then the links between groups that matter most, each with a one-line reason. Check it against your sources like any card.
3. **Generate the visual.** Write `{topic, field, terms, defs:{term: meaning}, expert:{groups:[{name, terms}], links:[[i, j, "why"]]}}` to a JSON file and run `ld.mjs prime <file>`. Show the printed code with the inline visual tool, unchanged. In the reply, above it, at most three short lines: tap a term to see what it means; group what feels related, a wrong guess still helps; anything unfamiliar goes in "Not sure yet". Naming and linking groups are optional.
4. **Review, briefly.** The "Compare my map" button sends their groups, links and "not sure" terms. Reply in at most about 150 words:
   - one or two things their map gets right, specifically;
   - the one or two biggest differences from the expert map, each with its physical reason in a sentence;
   - where to start: usually the root idea, or the "not sure" term most others depend on. Let them choose.
   Do not list every difference. If the map looks random, say kindly that the terms were probably too unfamiliar, and suggest going straight to the first card.
5. **Save.** `savemap` with the same JSON plus `learner: {groups: [{name, terms}], links: [[name, name]], unsure: [terms]}` and an optional one-line `notes`. The map appears in the notebook.
6. **Use it.** Group each new card in that field under the learner's own group names where they make sense, and link back to the map in the card's "Where it sits" line.
