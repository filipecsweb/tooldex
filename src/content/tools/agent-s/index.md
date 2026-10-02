---
name: "Agent S"
tagline: "An open-source framework for agents that use a real desktop like a person: they read the screen, then click, type and scroll to finish a task."
category: computer-use
tags: [library, cli, free, gui-agents, desktop-automation, python]
repo: https://github.com/simular-ai/Agent-S
icon: ./icon.png
added: 2026-10-02T14:36:00Z
---

Agent S is a research framework for computer-use agents from Simular. You give it a task in plain language; it takes a screenshot, decides on the next step and carries it out with the mouse and keyboard in ordinary desktop and web applications, with no per-app integration or scripting. It runs on macOS, Windows and Linux, as a command-line agent or as a Python library to build on.

It splits the work between two models: a main model, from a provider you choose, that plans and reasons, and a separate grounding model that turns an instruction like "click Save" into exact screen coordinates. A reflection step reviews progress as it goes, and an optional local coding environment lets it run Python and shell commands when a task is easier done in code than through the interface. Simular's hosted agent builds on the same research.

**When to use it:** research on desktop agents, automating work in applications that have no API, or experimenting with computer use on your own machine with models you pick.

**Caveats:** it controls your real mouse and keyboard, and with the coding environment switched on it runs code on your machine, so give it a spare machine or a virtual one. Setup is heavy: API keys for the main model, a grounding model you host or rent, and a few system dependencies. Like any computer-use agent, it's slower and less predictable than a direct integration.
