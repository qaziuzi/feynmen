# Learning Database (maintainer notes)

This repo is the shared database behind the `learning-database` skill, and the skill itself (`.claude/skills/learning-database/`). For any learning request (a deep question, a concept, "next lesson in X"), use that skill.

## Maintaining

- The skill folder is the product: `SKILL.md`, `reference/`, `scripts/ld.mjs`, `shared/`, `db/`. Change the look in `shared/`, never per lesson.
- `db/graph.json` is the single source of truth for concepts. A concept counts as written when a lesson file carries its id; there is no status field to keep in sync.
- Personal state (artifact links, progress, build ideas) lives in `~/.learning-database/`, never in the repo.
- After any change: `node .claude/skills/learning-database/scripts/ld.mjs check`.
- Local preview of the public site: `ld.mjs site --out build/site`, then the `learning-db` preview server (`.claude/launch.json`).
- Zip for Claude chat: `node tools/package.mjs` → `dist/learning-database.zip`.
- When the repo is published, set `repo` (clone URL) and `site` (Pages URL) in `db/graph.json`.

## Reviewing a contributed lesson

Hold it to `reference/rigor.md`. Recompute its numbers, check its formulas and constants against the cited sources where they are online, run `check`, and open it in the preview at phone width and in the dark theme. Reject loose analogies and uncited claims. Physics corrections take priority over everything else.

## Commits

Commit after each lesson. Nothing is pushed to GitHub without the owner's say-so.
