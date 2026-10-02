---
name: "PPT Master"
tagline: "An agent skill that turns documents or a topic into a natively editable PowerPoint deck, with real shapes, charts and tables instead of flat images."
category: design
tags: [skill, plugin, claude-code, codex, cursor, copilot, cline, gemini-cli, windsurf, zed, trae, codebuddy, slides, powerpoint, presentations]
repo: https://github.com/hugohe3/ppt-master
website: https://hugohe3.github.io/ppt-master-examples/
thumbnail: ./thumb.webp
icon: ./icon.png
added: 2026-09-27
---

PPT Master is a workflow you run inside an AI coding agent to make PowerPoint decks. Ask it to make a deck from a PDF, a report or just a topic, and it runs a pipeline on your machine that plans the content, designs the slides and exports a `.pptx` file.

What sets it apart is that the result is real PowerPoint, not pictures of slides: slide masters, native shapes and connectors, charts and tables backed by data, transitions and animations, all editable like a deck you built by hand. Beyond new decks, it can extract reusable brand, layout or deck templates from reference files and fill an existing presentation with new content while keeping its design. Apart from calls to the AI model, everything runs locally.

**When to use it:** turning reports, papers or notes into a first-draft deck you'll keep editing, producing on-brand decks from a template, or anyone who needs slides that colleagues can open and change in PowerPoint.

**Caveats:** it needs Python and an agent-capable AI tool, and quality depends heavily on the model; the author recommends a large-context model plus an image generation model. Expect a strong first draft, not a finished deck. The README carries sponsor and affiliate links.
