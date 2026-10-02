---
name: "AI Job Search"
tagline: "A Claude Code workflow for job hunting: builds your profile, scores postings for fit, tailors your CV, drafts cover letters and preps you for interviews."
category: careers
tags: [skill, subagents, free, claude-code, job-search, cv, cover-letters]
repo: https://github.com/MadsLorentzen/ai-job-search
thumbnail: ./thumb.webp
icon: ./icon.png
added: 2026-09-27
---

AI Job Search turns Claude Code into a job application assistant that runs on your own machine. You start by building a profile from your CV, a LinkedIn export and other documents, or through an interview with the agent. From there, it searches job portals, rates the matches against your profile and, for a posting you pick, evaluates the fit before drafting anything.

Applications go through a drafter and reviewer loop: one agent writes a tailored CV and cover letter in LaTeX, another critiques them, and the draft is revised before you see it. There's also interview preparation for the roles you pursue. The author built it for their own search and encodes common career guidance, such as forward-looking cover letters and structured fit criteria.

**When to use it:** an active job search where you're sending many tailored applications, deciding which postings are worth your time, or preparing for interviews with your own history at hand.

**Caveats:** setup is real work: Python, Bun and a LaTeX install alongside Claude Code, which needs a paid plan or API credits. The built-in job portal searches target the Danish market, so elsewhere you'll adapt them to your local boards. Your personal data lives in the repository's files, so keep your copy private. Review every application before you send it.
