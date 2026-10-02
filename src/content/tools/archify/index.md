---
name: "Archify"
tagline: "Turns a plain-language description or a real codebase into interactive architecture, workflow and sequence diagrams, shared as one HTML file."
category: design
tags: [skill, plugin, free, claude-code, codex, cursor, opencode, claude-ai, hermes, deepseek-harness, diagrams, architecture, visualization]
repo: https://github.com/tt-a1i/archify
website: https://tt-a1i.github.io/archify/
thumbnail: ./thumb.webp
icon: ./icon.png
added: 2026-09-26
---

Archify is a skill that makes your coding agent good at diagrams. Describe a system in a sentence, such as "the browser calls the API, the API checks Redis, and a cache miss queries Postgres", or ask it to read a repository, and it produces an architecture, workflow, sequence, data-flow or lifecycle diagram. You then refine it in conversation: add authentication, highlight the cache-miss path, switch to a light theme.

The output is a self-contained HTML file rather than a flat image. It has nodes you can inspect, paths you can follow, guided walkthroughs and motion, plus clean exports for slides and docs. Anyone can open it in a browser without installing anything.

**When to use it:** explaining a system to a new teammate, mapping an unfamiliar codebase, planning a change before you build it, or adding a clear visual to a design doc or pull request.

**Caveats:** a diagram drawn from a repository is only as accurate as the agent's reading of the code, so review it before you treat it as documentation. If you need diagrams-as-code that live in version control and render inside Markdown, Mermaid is the simpler fit.
