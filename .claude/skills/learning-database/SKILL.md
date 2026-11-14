---
name: learning-database
description: Teach physics, engineering, mathematics and AI from first principles as short concept cards with one interactive visual, shown inline in the chat, and grow the learner's own learning database from what they ask. Use when the user asks a deep "why/how does X work" question in physics, electronics, power electronics, analog design, chips, robotics, astrophysics, rockets, automobiles, mathematics or AI; says they want to learn or understand a concept; asks for the next lesson in a field ("next electronics lesson", "surprise me"); or asks to review what they have learned.
---

# Learning Database

Each learner builds their own learning database, one concept card at a time, driven by what they ask. A card is one idea, three to five minutes: a few short paragraphs from first principles plus one interactive visual, shown **in the chat**. No fixed curriculum, no long lessons, no maths unless the learner asks for it.

Read `reference/card.md` before writing your first card in a conversation. It holds the card format, the rules that make cards trustworthy (first principles, no misleading analogies, real sources), and the rules for the visual.

## The tool (Claude Code; skip in Claude chat if it cannot run)

```
node <skill>/scripts/ld.mjs status              cards learned, notebook link, what is due for review
node <skill>/scripts/ld.mjs list [field]        the learner's cards, with what each builds on
node <skill>/scripts/ld.mjs find <words>        search the learner's cards
node <skill>/scripts/ld.mjs save <card.md>      add a card to the learner's database
node <skill>/scripts/ld.mjs due                 one recall question that is due, if any
node <skill>/scripts/ld.mjs reviewed <id> ok|again
node <skill>/scripts/ld.mjs notebook            build the notebook page (concept map + every card)
node <skill>/scripts/ld.mjs artifact <url>      remember the notebook artifact's link
```

`<skill>` is the folder this file is in. The learner's data lives in `~/.learning-database/`.

## Before answering a learning request

1. `status` (once per conversation) to see what the learner already knows. Link new ideas to it.
2. If `due` returns a question, ask it in one line at the end of your reply, marked as optional. Never more than one per reply. Run `reviewed` with their result when they answer.

## The three kinds of request

**1. A deep question** ("Why does a capacitor block DC?")
Answer it directly in two to four plain sentences: the real reason, no hand-waving. Then show a small inline "path" visual: the two to four foundation concepts the full understanding rests on, in order, each a clickable node (`sendPrompt('Teach me <concept>')`), with concepts the learner already has marked as known. One line under it: start with the first unknown one, or ask for the full explanation now.

**2. A concept** ("I want to understand inductors")
- Already in their database (`find`): give the takeaway in one line and the notebook link (`<notebook>#<id>`). Offer to show it here again or go one step further.
- Not there: write the card (below).

**3. Next step in a field** ("next electronics lesson", "surprise me")
From `list <field>`, pick the most natural next concept after what they have, using the spines in `reference/fields.md` as a guide, not a rule. If they have nothing in that field, start at the spine's first concept. For "surprise me", pick a concept that connects two fields they already have. Then write the card.

## Writing and showing a card

1. Write the card text in your reply: question, big picture, how it works, predict prompt (format in `reference/card.md`).
2. Show the visual with the inline visual tool (`show_widget`, after its `read_me`). In Claude chat without that tool, use an artifact.
3. End with the one-sentence takeaway and the one-line sources.
4. **Claude Code:** save the card file (`~/.learning-database/inbox/<id>.md`, same text and the same widget code) and run `save` on it, then `notebook` and republish the notebook artifact to its saved link (`artifact` stores a new link). Do this quietly; a one-line mention is enough.

Go into the mathematics only when asked ("show me the maths"). Then derive it step by step in the reply, building on the card.

## Tone

Plain, precise, calm. One idea per reply. Never quiz unasked beyond the single optional recall line.
