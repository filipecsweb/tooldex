---
name: "Prompt Master"
tagline: "A Claude skill that writes a tight, tool-specific prompt for whatever AI you're about to use, from coding agents to image and video models."
category: writing
tags: [skill, claude-code, claude-ai, prompt-engineering, prompts]
repo: https://github.com/nidhinjs/prompt-master
icon: ./icon.png
added: 2026-09-27
---

Prompt Master is a skill for writing prompts that you'll paste into another AI tool. Tell Claude what you want to ask Cursor, Claude Code, ChatGPT, Midjourney or a video model, or hand it a prompt that isn't working, and it returns one clean prompt ready to copy, with a one-line note on the approach it took.

Behind that, it works out which tool the prompt is for and shapes it to that tool's conventions: structured specs for coding agents, comma-separated descriptors and parameters for image models, and so on. It pulls out the intent, such as the task, inputs, output, constraints and success criteria, asks a few clarifying questions only when something critical is missing, and then trims every word that doesn't change the result. The aim is sharper prompts, not longer ones.

**When to use it:** before handing a big task to a coding agent, when a prompt keeps giving you the wrong output, or when you're moving between tools and don't know each one's prompting habits.

**Caveats:** it's a Claude skill, used mainly on claude.ai or in Claude Code; the prompts it writes can go anywhere, but the skill itself runs in Claude. It adds a step before every task, which pays off on big or repeated prompts more than quick one-offs. A well-shaped prompt still can't make up for a vague idea of what you want.
