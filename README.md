# Learning Database

A skill for Claude that teaches physics and engineering from first principles, through interactive lessons, and a shared database of those lessons that grows as people use it.

- **Lessons are derived, not asserted.** Each one starts from the governing laws, relies only on earlier lessons, uses no loose analogies, computes real numbers in its interactives, and cites standard university textbooks by section.
- **You learn in your own artifact.** One page per field, one tab per lesson, 10 to 15 minutes each.
- **A lesson is written once.** If the database has it, Claude assembles it for you from the stored file. If not, Claude writes it to the same standard and can offer it back to the database for review.

Fields so far: electronics, power electronics, analog design, chip making, robotics, astrophysics, rockets, automobiles, mathematics, how AI works.

## Three ways to ask

1. **A deep question.** "Why does a capacitor block DC but pass AC?" You get a short direct answer, then the chain of lessons the full answer rests on. Work through them, say you are done, and get the full-depth answer.
2. **A concept.** "I want to understand Gauss's law." Claude opens that lesson.
3. **The next lesson.** "Next electronics lesson." Claude opens the one after the last you finished.

## Install

**Claude Code.** Copy the folder `.claude/skills/learning-database` into `~/.claude/skills/` (for all your projects) or into a project's `.claude/skills/`. Needs Node.js 18 or newer.

**Claude chat (claude.ai and the apps).** Download `learning-database.zip` from the releases page, or build it with `node tools/package.mjs`, and upload it under Settings → Capabilities → Skills. Code execution must be enabled.

What differs in Claude chat: progress is not remembered between chats (tell Claude where you are), new shared lessons arrive when you install a newer zip, and Claude cannot submit a lesson for you.

## How it is organised

```
.claude/skills/learning-database/
  SKILL.md                 what Claude does for each kind of request
  reference/               rigor standard, lesson authoring guide, contribution steps
  scripts/ld.mjs           the tool: search, prerequisite chains, page assembly, validation
  shared/                  page shell and styles
  db/graph.json            every concept, its field, prerequisites and cross-field links
  db/lessons/<field>/      one HTML file per lesson
tools/package.mjs          builds the zip for Claude chat
tools/serve.mjs            local preview of the public site
```

Your own artifact links and progress are kept outside the database, in `~/.learning-database/user.json`.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Every lesson is reviewed against the [rigor standard](.claude/skills/learning-database/reference/rigor.md) before it joins the database.

## License

Code is MIT. Lesson content is CC BY 4.0. See [LICENSE](LICENSE).
