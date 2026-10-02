---
name: "Google Maps Scraper"
tagline: "Scrapes Google Maps business listings into CSV or JSON, with an agent skill that turns a plain-language request for leads into a full local scrape."
category: data
tags: [skill, cli, app, claude-code, codex, cursor, copilot, web-scraping, lead-generation, google-maps]
repo: https://github.com/gosom/google-maps-scraper
thumbnail: ./thumb.webp
icon: ./icon.png
added: 2026-10-02T14:35:12Z
---

Google Maps Scraper collects business listings from Google Maps: names, addresses, phone numbers, websites, ratings, coordinates and reviews, plus email addresses found by visiting each business's website if you ask for them. You give it search queries such as "dentists in Berlin", it drives a headless browser through the results, and it writes them to CSV, JSON, a Postgres database or another output. It runs as a command-line tool, as a local web interface with a REST API, or as a multi-user service you host yourself, and it can spread large jobs across machines.

Its agent skill is the easiest way in. You ask your coding agent for leads in plain language; the agent plans the searches, runs a small test scrape, starts the full job in Docker, monitors it and then helps you filter and export the results. Proxy credentials go into a masked prompt in your terminal, not into the chat.

**When to use it:** building a list of local businesses for sales prospecting or market research, enriching existing records with public listing data, or letting a non-technical teammate get leads by asking their coding agent.

**Caveats:** Google's terms don't permit scraping Maps, and large crawls usually need proxies; the README and the skill both promote sponsored proxy providers, though you can bring your own or use none. Emails and reviews can be personal data, and cold outreach is covered by privacy and anti-spam law, so check what applies where you operate. The skill needs Docker and Node.js.
