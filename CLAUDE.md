# Learning Database (maintainer notes)

This repo is the `learning-database` skill (`.claude/skills/learning-database/`). For any learning request (a deep question, a concept, "next lesson in X"), use that skill.

## Maintaining

- The skill folder is the product: `SKILL.md`, `reference/card.md`, `reference/fields.md`, `scripts/ld.mjs`, `shared/notebook.html`, `examples/`.
- Learners' cards and review schedule live in `~/.learning-database/`, never in the repo.
- Preview the example notebook: `ld.mjs notebook --cards .claude/skills/learning-database/examples --out build/site`, copy `page.html` to `index.html`, then the `learning-db` preview server.
- Zip for Claude chat: `node tools/package.mjs` → `dist/learning-database.zip`.

## Commits

Nothing is pushed to GitHub without the owner's say-so.
