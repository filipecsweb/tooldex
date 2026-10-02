---
name: "SkillSpector"
tagline: "NVIDIA's scanner for agent skills: checks a skill before you install it for prompt injection, data exfiltration and supply-chain risks."
category: security
tags: [cli, mcp, skill, claude-code, codex, gemini-cli, opencode, pi, prompt-injection, supply-chain, scanner]
repo: https://github.com/NVIDIA/SkillSpector
icon: ./icon.png
added: 2026-09-26
thumbnail: ./thumb.webp
---

SkillSpector answers one question: is this skill safe to install? Agent skills run with a lot of implicit trust, since they can read files, run commands and call tools on your behalf, yet most are installed straight from a repository with no review. SkillSpector scans a skill from a Git repo, a URL, a zip or a local folder and reports what it finds with a risk score and a clear recommendation.

It pairs fast static analysis for known vulnerability patterns, like prompt injection, data exfiltration, privilege escalation and risky dependencies, with an optional LLM pass that judges intent. Reports come out in the terminal or as JSON, Markdown or SARIF for CI, and you can baseline accepted findings so re-scans only show what's new. NVIDIA uses it to vet the skills it publishes.

**When to use it:** before installing any third-party skill, as a CI gate on a repository of skills your team shares, or to audit what's already installed on your machine.

**Caveats:** it's a Python command-line tool rather than a skill you call in chat, though it can also run as an MCP server. The LLM pass needs a model API key. A clean report lowers your risk; it doesn't prove a skill is safe.
