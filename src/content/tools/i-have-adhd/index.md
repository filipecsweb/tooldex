---
name: "i-have-adhd"
tagline: "An output-style skill that makes your coding agent lead with the next action, number its steps and drop the preamble, recaps and tangents."
category: writing
tags: [skill, plugin, claude-code, codex, cursor, gemini-cli, opencode, copilot, antigravity, grok, hermes, kimi-code, pi, oh-my-pi, qwen-code, zed, amp, astronclaw, output-style, focus]
repo: https://github.com/ayghri/i-have-adhd
icon: ./icon.png
added: 2026-09-27
thumbnail: ./thumb.webp
---

i-have-adhd changes how your coding agent talks to you, not what it does. Agents tend to bury the answer under "Great question!", a tour of the codebase and a friendly sign-off. This skill replaces that with a short set of rules: lead with the next action, number multi-step tasks, cut tangents, restate where things stand each turn, give concrete time estimates and end with one clear next step.

The rules are loosely adapted from an adult ADHD self-help book and rewritten for how a model should respond. You don't need an ADHD diagnosis to want them; they suit anyone who scans agent output rather than reading every word. It ships as a plugin for several coding agents, and you can fork it to tune the rules to taste.

**When to use it:** long working sessions where you keep scrolling past filler to find the command to run, debugging where you want one step at a time, or any time the agent's answers feel longer than the work.

**Caveats:** it trades explanation for brevity, so switch it off when you want the agent to teach or reason out loud. Terse output can hide nuance you'd otherwise have seen. It's a style skill; it won't make the agent's answers more correct.
