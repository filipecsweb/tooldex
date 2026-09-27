---
name: "Comp AI CRM"
tagline: "An open-source CRM built around an autonomous agent that reads your team's email and meetings, researches contacts and records only what it can prove."
category: sales
tags: [crm, self-hosted, sales, enrichment, agents]
repo: https://github.com/trycompai/crm
website: https://trycrm.ai
thumbnail: ./thumb.webp
icon: ./icon.png
added: 2026-09-27
---

Comp AI CRM starts from the idea that the agent shouldn't be a chat box bolted onto a CRM; the CRM should be where the agent keeps its notes. A research agent runs as its own long-lived deployment, working through a queue on its own schedule: it decides who to look at next, reads your team's email threads, meetings and signature blocks, enriches companies and contacts, and books its own follow-ups, within a research budget.

Its central rule is that nothing about a person is guessed. Tools report what they observed rather than a confidence score, strong evidence is written to the record, and weak evidence becomes a suggestion for a person to settle. It works with no outside data sources at all, reading only your own history; each optional API key opens one more place to look. The agent's commands run in a sandbox with outbound network access blocked.

**When to use it:** a small sales or founder-led team that wants contact and company records kept current without manual data entry, or anyone exploring what an agent-first business application looks like.

**Caveats:** it's a full application to deploy, built around Vercel's platform and Postgres, with sign-in through Google, Microsoft or your own identity provider. It reads your team's email and researches real people, so check data protection rules and your colleagues' consent before switching it on.
