# Contributing

Improvements to the skill are welcome: the card rules, the field spines, the tool, the notebook page, and example cards.

## Example cards

Example cards live in `.claude/skills/learning-database/examples/` and show what a good card looks like. A new example must follow `reference/card.md`:

- one idea, explained from the governing laws in plain words;
- no analogy unless it is exact; nothing that later has to be unlearned;
- one interactive visual that computes the real physics in real units;
- a recall question and answer;
- sources from standard university texts, by chapter or section.

Check it with:

```bash
node .claude/skills/learning-database/scripts/ld.mjs notebook --cards .claude/skills/learning-database/examples --out build/site
```

then open `build/site/page.html` and confirm the visual works, at phone width and in the dark theme.

## Corrections

If anything in a card is wrong, open an issue or pull request with the correction and the source that supports it. Physics corrections come first.

## Licensing

Code contributions are MIT; card content is CC BY 4.0.
