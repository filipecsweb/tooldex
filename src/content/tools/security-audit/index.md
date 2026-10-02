---
name: "Cloudflare security-audit"
tagline: "Cloudflare's coding-agent skill for multi-phase security audits: isolated hunters find bugs, fresh agents try to disprove them, and verified findings remain."
category: security
tags: [skill, code-audit, vulnerability, owasp]
repo: https://github.com/cloudflare/security-audit-skill
icon: ./icon.png
added: 2026-09-27
thumbnail: ./thumb.webp
---

security-audit turns a coding agent into a structured security auditor for a single codebase. It's the skill Cloudflare started from before building its larger vulnerability-discovery system. You ask your agent for a security audit and it runs a fixed process: map the architecture, trust boundaries and inputs; send isolated hunter agents through a coverage ledger of what has and hasn't been checked; hand every candidate finding to a fresh agent that tries to disprove it; then verify the surviving records again before writing the report.

Findings come out as machine-readable records, checked against a schema by bundled validators, sorted into confirmed, needs-validation and rejected, with a readable report derived from them. Attack-class guides cover web, auth, client-side, cloud, supply chain, native code and LLM-backed targets. Repeat runs build on earlier ledgers to fill gaps rather than starting over.

**When to use it:** auditing your own code before a release or a formal review, hunting vulnerabilities in a codebase you're responsible for, or learning how a rigorous, verification-first audit is structured.

**Caveats:** it needs an agent and model that support tool use and parallel sub-agents, and a full audit uses a lot of tokens. It asks for an OS-level sandbox with networking disabled before running the target's builds or tests; don't skip that. Coverage improves across runs, so one run won't find everything.
