# Learning Database

A skill for Claude that teaches physics, engineering, mathematics and AI from first principles, one short concept card at a time, and builds your own learning database from what you ask.

- **Short cards, shown in the chat.** One idea, three to five minutes: a few plain paragraphs on how it really works, and one interactive visual you can operate.
- **First principles, no fluff.** Explained from the governing laws, no misleading analogies, sources from standard university texts. Mathematics only when you ask for it.
- **Your own database.** No fixed curriculum. Every card you learn is saved, connected to the cards it builds on, and collected in your notebook with a concept map.
- **You build the structure.** Before a new topic you sort its key ideas into your own groups and links, then compare with an expert map. Every card takes its place in that map.
- **Made to stick.** Each card links to what you already know, asks you to predict before you see, and comes back days later as one question about how ideas connect.

See an example card at **https://qaziuzi.github.io/feynmen/**.

## Ask in three ways

1. **A deep question.** "Why does a capacitor block DC?" You get the short real answer, then a small map of the two to four foundations behind it. Click one to learn it.
2. **A concept.** "Teach me inductors." You get the card, or a link to it if you already learned it.
3. **The next step.** "Next electronics lesson" or "surprise me." Claude picks the natural next card after what you know.

## Install

**Claude Code.** Clone this repo and copy `.claude/skills/learning-database` into `~/.claude/skills/`. Needs Node.js 18 or newer. Your cards are kept in `~/.learning-database/`.

**Claude chat (claude.ai and the apps).** Download [learning-database.zip](https://qaziuzi.github.io/feynmen/learning-database.zip) and upload it under Settings → Capabilities → Skills. Cards appear in the chat. Chat has no place to keep your database between conversations, so there Claude relies on its memory, if enabled, or on you saying what you have covered.

## Inside

```
.claude/skills/learning-database/
  SKILL.md               how Claude handles each kind of request
  reference/card.md      the card format and the rules that keep cards trustworthy
  reference/fields.md    suggested order of foundations per field, with sources
  scripts/ld.mjs         saves cards, finds them, schedules recall, builds the notebook
  shared/notebook.html   the notebook page
  reference/prime.md     how to run a priming map
  shared/prime.html      the priming-map visual
  examples/              an example card and an example priming map
tools/package.mjs        builds the zip for Claude chat
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

Code is MIT. Card content is CC BY 4.0. See [LICENSE](LICENSE).
