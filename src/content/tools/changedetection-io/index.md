---
name: "changedetection.io"
tagline: "Self-hosted website change monitoring: watch pages for edits, price drops and restocks, and get alerts, with optional AI rules and summaries."
category: data
tags: [app, freemium, self-hosted, web-monitoring, change-detection, price-tracking, notifications]
repo: https://github.com/dgtlmoon/changedetection.io
website: https://changedetection.io
thumbnail: ./thumb.webp
icon: ./icon.png
added: 2026-09-27
---

changedetection.io watches web pages for you and tells you when they change. You give it a list of URLs, it checks them on a schedule, and when something differs it shows you exactly what changed, down to the word, and sends a notification to email, chat apps, webhooks and many other channels. It handles product pages, JSON APIs and PDFs as well as ordinary pages.

For pages that need interaction, a real browser can log in, click and fill forms before each check, and a visual selector lets you watch only the part of the page you care about. Price and restock tracking pulls structured product data out of the page. Optionally, you can connect a language model, hosted or local, to write plain-language summaries of each change or to alert you only when a change matches a rule you wrote in English.

**When to use it:** tracking prices and restocks, watching government, legal or policy pages that change without notice, following release notes and security advisories, or feeding page changes into your own automations.

**Caveats:** it's a monitoring service you self-host or pay for, not agent tooling as such; the AI features are an optional layer. The browser-based features need a Playwright fetcher alongside the main app. If you turn on AI, the content of the pages you watch goes to the model provider you choose. Respect the terms of the sites you monitor.
