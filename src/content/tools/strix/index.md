---
name: "Strix"
tagline: "Open-source AI penetration testing: teams of agents probe your app, validate findings with working proofs of concept and suggest fixes."
category: security
tags: [cli, skill, claude-code, codex, cursor, pentesting, owasp, ci]
repo: https://github.com/usestrix/strix
website: https://strix.ai
thumbnail: ./thumb.webp
icon: ./icon.png
added: 2026-09-27
---

Strix is an autonomous penetration tester. You point it at a codebase, a repository or a running web app, and a group of AI agents works through it the way a human tester would: mapping the attack surface, running the code, intercepting traffic, driving a browser and writing exploits in a sandbox. Findings come with a working proof of concept, which is the point: fewer of the false positives that static scanners produce.

It covers the usual web application risks, from access control and injection to server-side and business logic flaws, and it reports each issue with remediation advice. It runs from the command line or in CI to check pull requests, and a set of agent skills lets Claude Code, Codex, Cursor and similar agents launch scans and fix what they find. A hosted and an enterprise version sit alongside the open-source one.

**When to use it:** security testing your own application before a release, adding a vulnerability gate to CI, or getting a first pass on a codebase before a formal pentest or bug bounty work.

**Caveats:** it needs Docker and an LLM API key, and a thorough scan spends real tokens. It runs actual attacks, so only point it at systems you own or are authorised to test. Treat it as a strong first pass, not a replacement for an expert review.
