# Contributing

The database is only useful if every lesson can be trusted. Contributions are welcome and are reviewed against one standard.

## Adding a lesson

The easy way is to let the skill do it: ask Claude for a concept the database lacks, and accept when it offers to submit the lesson. By hand:

1. Read the [rigor standard](.claude/skills/learning-database/reference/rigor.md) and the [authoring guide](.claude/skills/learning-database/reference/authoring.md).
2. Add or update the concept in `db/graph.json`, and add `db/lessons/<field>/NN-slug.html`.
3. Run `node .claude/skills/learning-database/scripts/ld.mjs check`.
4. Preview: `node .claude/skills/learning-database/scripts/ld.mjs site --out build/site`, then `node tools/serve.mjs` and open http://localhost:4173.
5. Open a pull request. In the description give the sources cited and what you checked against them.

## What review checks

- The result is derived from governing laws or from lessons listed as prerequisites, and experimental facts are labelled as such.
- No analogy unless it is mathematically exact.
- Definitions, units and limits of validity are stated; every worked number recomputes.
- Sources are standard textbooks or university course notes, cited by chapter and section.
- Interactives compute the real equations in SI units, and captions say what is not to scale.
- The text is original wording, not copied from the sources.
- `ld.mjs check` passes and the lesson works at phone width and in both themes.

## Corrections

If you find an error in a lesson, open an issue or a pull request with the correction and the source that supports it. Corrections to physics take priority over everything else.

## Licensing of contributions

By contributing you agree that your code is released under MIT and your lesson content under CC BY 4.0.
