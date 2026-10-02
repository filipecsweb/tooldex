---
name: "gstack"
tagline: "Garry Tan's Claude Code setup: role-based skills that plan, review, test and ship your code like a small engineering team."
category: dev-workflow
tags: [skill, free, claude-code, codex, opencode, cursor, factory-droid, kiro, slate, openclaw, hermes, code-review, qa, planning, release]
repo: https://github.com/garrytan/gstack
icon: ./icon.png
added: 2026-09-26
thumbnail: ./thumb.webp
---

gstack packages the way Y Combinator's Garry Tan works with Claude Code into a set of slash-command skills, each playing a role on a product team. A CEO-style reviewer challenges the scope of an idea, an engineering manager locks down the architecture, a designer flags generic AI-looking UI, a reviewer hunts for production bugs, a QA lead drives a real browser against your staging site, and a release manager gets the branch shipped.

The point is structure. Instead of starting every session from a blank prompt, you move each feature through the same sequence: interrogate the idea, plan it, build it, review it, test it, ship it. Every step is opinionated and leaves something you can read before moving on.

**When to use it:** you ship real product with Claude Code and want a repeatable plan, review, QA and ship loop, possibly shared across a team. It also works as a crash course in how an experienced builder structures agent work.

**Caveats:** it's a large, opinionated system with its own setup and preferences; its install, for example, asks you to route web browsing through its own browser skill. Adopt it wholesale or cherry-pick the few skills you need. Claude Code is the primary host; check the repo for how well your other agents are supported.
