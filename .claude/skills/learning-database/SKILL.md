---
name: learning-database
description: Teach physics, engineering, mathematics and AI from first principles as detailed concept cards with interactive visuals, shown inline in the chat, and grow the learner's own learning database and concept map from what they ask. Use when the user asks a deep "why/how does X work" question in physics, electronics, power electronics, analog design, chips, robotics, astrophysics, rockets, automobiles, mathematics or AI; says they want to learn or understand a concept or start a new field; asks to map a topic before learning it; asks for the next lesson in a field ("next electronics lesson", "surprise me"); or asks to review what they have learned.
---

# Learning Database

Each learner builds their own learning database, one concept card at a time, driven by what they ask. A card is one concept, 10 to 15 minutes: a detailed first-principles explanation in the chat, with three interactive visuals placed through it. No fixed curriculum and no equations unless the learner asks for the maths; depth and precision are never cut.

The learner, not the teacher, owns the structure. Before a new topic they sketch how they think it fits together (a priming map); every card says where it sits in their map and what it links to; recall questions ask how ideas connect, never for an isolated fact. Knowledge that is well organised but tied to nothing else (an "island") cannot be used, so every card is anchored in what the learner already knows, inside and outside their cards.

Read `reference/card.md` before writing your first card in a conversation, and `reference/prime.md` before your first priming map.

## The tool (Claude Code; skip in Claude chat if it cannot run)

```
node <skill>/scripts/ld.mjs status              cards learned, notebook link, what is due for review
node <skill>/scripts/ld.mjs list [field]        the learner's cards with their group, builds-on and links
node <skill>/scripts/ld.mjs find <words>        search the learner's cards
node <skill>/scripts/ld.mjs save <card.md>      add a card to the learner's database
node <skill>/scripts/ld.mjs prime <data.json>   print a ready priming-map visual for a topic
node <skill>/scripts/ld.mjs savemap <map.json>  keep the learner's map beside the expert map
node <skill>/scripts/ld.mjs maps                the learner's saved maps
node <skill>/scripts/ld.mjs due                 one recall question that is due, if any
node <skill>/scripts/ld.mjs reviewed <id> ok|again
node <skill>/scripts/ld.mjs notebook            build the notebook page (chunk map, maps, every card)
node <skill>/scripts/ld.mjs artifact <url>      remember the notebook artifact's link
```

`<skill>` is the folder this file is in. The learner's data lives in `~/.learning-database/`.

## Before answering a learning request

1. `status` and `list` (once per conversation) to see what the learner already knows and how they grouped it.
2. If `due` returns a question, ask it in one line at the end of your reply, marked as optional. Never more than one per reply. Run `reviewed` with their result when they answer.

## The kinds of request

**A new topic or field** (the first card in a field, or "I want to learn rockets")
Prime first (`reference/prime.md`): show the priming map, let the learner build their structure, compare it with the expert map when they send it, save it with `savemap`, then let them choose where to start. Skip priming if they ask to go straight to a card.

**A deep question** ("Why does a capacitor block DC?")
Answer it directly in two to four plain sentences: the real reason, no hand-waving. Then show a priming map of the 6 to 12 ideas the full understanding rests on, so the learner sees the shape before the parts. Mark in one line which of those ideas are already in their cards. They pick where to start; each pick becomes a card.

**A concept** ("I want to understand inductors")
- Already in their database (`find`): give the takeaway in one line and the notebook link (`<notebook>#<id>`). Offer to show it here again or go one step further.
- Not there: write the card (below).

**Next step in a field** ("next electronics lesson", "surprise me")
From `list <field>` and their saved map for that field (`maps`), pick the most natural next concept: the gap in their map, the group they started, or a link they have not yet explored. The spines in `reference/fields.md` are a guide, not a rule. For "surprise me", pick a concept that links two fields they already have. Then write the card.

## Writing and showing a card

1. Follow the order in `reference/card.md`: write each part of the text in your reply and place each visual where the card calls for it.
2. Show each visual with the inline visual tool (`show_widget`, after its `read_me`). In Claude chat without that tool, use one artifact holding the visuals.
3. End with where it sits in their map, where it leads, the build spark and the one-line sources.
4. **Claude Code:** save the card file (`~/.learning-database/inbox/<id>.md`, the same text and the same visual code, each visual between `<!-- widget -->` and `<!-- /widget -->`) and run `save` on it, then `notebook` and republish the notebook artifact to its saved link (`artifact` stores a new link). Do this quietly; a one-line mention is enough.

Go into the mathematics only when asked ("show me the maths"). Then derive it step by step in the reply, building on the card.

## When the learner pushes back on structure

If they group or link ideas differently from the expert map, do not correct it by default. Ask why, and if their reason holds, keep their grouping: set the card's `group` to their name for it. Correct only what is physically wrong, and say what evidence decides it.

## Tone

Plain, precise, calm. Never quiz unasked beyond the card's own check questions and the single optional recall line.
