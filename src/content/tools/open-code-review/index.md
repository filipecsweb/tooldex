---
name: "Open Code Review"
tagline: "Alibaba's AI code review CLI: a deterministic pipeline picks files and rules, an agent reviews them, and comments land on the exact lines."
category: dev-workflow
tags: [cli, plugin, skill, mcp, claude-code, codex, cursor, opencode, code-review]
repo: https://github.com/alibaba/open-code-review
website: https://open-codereview.ai
thumbnail: ./thumb.webp
icon: ./icon.png
added: 2026-09-27
---

Open Code Review is the AI code review tool Alibaba ran internally, released as open source. It reads a Git diff, a branch range, a commit or whole files, and produces structured review comments tied to specific lines. The agent doing the review can read full files, search the codebase and look at other changed files for context.

Its argument is that a general-purpose agent with a review skill cuts corners on large changes, drifts on line numbers and varies with small prompt changes. So the parts that must not go wrong are ordinary code: choosing which files to review, grouping related files into bundles that each get their own sub-agent, matching review rules to each file, and checking comment positions afterwards. The model handles judgement and context gathering. It ships as a CLI, as plugins and skills for the main coding agents, and with a mode where your own agent does the reviewing.

**When to use it:** reviewing your own changes before you open a pull request, adding an automated reviewer to a team's workflow, or getting consistent reviews on large changesets where a chat-driven review skims.

**Caveats:** it needs an LLM provider and API key unless you use the mode that hands the review to your coding agent. It deliberately favours precision over recall, so it reports fewer issues and some real ones will slip through. Treat it as a reviewer alongside people, not a replacement.
