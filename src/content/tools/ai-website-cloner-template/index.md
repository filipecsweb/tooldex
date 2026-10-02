---
name: "AI Website Cloner Template"
tagline: "A starter project with a skill that has your coding agent rebuild a live website from its URL as a clean Next.js app."
category: design
tags: [skill, claude-code, codex, cursor, opencode, frontend, nextjs]
repo: https://github.com/JCodesMore/ai-website-cloner-template
thumbnail: ./thumb.webp
icon: ./icon.png
added: 2026-09-27
---

AI Website Cloner Template is a Next.js project set up for one job: point your coding agent at a URL and have it recreate that site as code. You start a copy of the template, open it in an agent with browser access, and run the clone skill with the address of the site you want to rebuild.

The skill works in phases. It first studies the page, taking screenshots, extracting fonts, colours and spacing and trying out the interactions, then writes a detailed spec for each section with the exact styles and states. Builder agents then work on the sections in parallel, each in its own branch, and the results are merged and compared visually against the original. The output uses a standard React, Tailwind and shadcn/ui stack, so you can keep editing it with the agent afterwards.

**When to use it:** moving a site you own off a hosted builder into a codebase, recovering a live site whose source is lost, or studying how a production page achieves its layout and animation.

**Caveats:** it's a template you build inside, not a skill you add to an existing project. A full clone runs many agents and uses a lot of tokens, and results depend heavily on the model. Only clone sites you have the right to reproduce; logos, copy and designs belong to their owners, and copying a site to impersonate it is off limits.
