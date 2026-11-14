# Contributing a new lesson to the shared database

A lesson written for one user becomes available to everyone once the maintainer has reviewed it. Offer this once after the user has their lesson; go ahead only on a clear yes.

Run `node scripts/ld.mjs status` to see the shared repo address. If it says "(not published yet)", there is nowhere to submit: tell the user the lesson is saved locally and stop.

## Claude Code, with `git` and `gh` signed in

Work in the clone at `~/.learning-database/repo` (the lesson and graph change should already be there if you ran the tool from that clone; otherwise copy the lesson file and apply the same graph change).

1. `node .claude/skills/learning-database/scripts/ld.mjs check` must pass.
2. Create a branch `lesson/<conceptId>-<slug>`, commit only the lesson file(s) and `db/graph.json`.
3. Fork if needed (`gh repo fork --remote`), push the branch, and open a pull request with `gh pr create`. In the description list: the concept id and title, the sources cited, and what was checked against them and how.
4. Give the user the pull request link.

Never include anything from the user's personal state (`~/.learning-database/user.json`, artifact links, progress) in the commit.

## Claude chat, or no `git`

Give the user the lesson file and the changed concept entries from `db/graph.json` as downloadable files, and tell them they can submit them through the repo's "Add file" page or an issue. Say plainly that you cannot submit it for them from here.

## What review looks for

The rigor standard (`rigor.md`): derived from governing laws, depends only on written prerequisites, no inexact analogies, correct units and numbers, standard textbook sources with sections, interactives that compute the real physics, and a passing `check`.
