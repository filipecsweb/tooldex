---
name: "Scrapling"
tagline: "A Python web scraping framework, from single requests to full crawls, with selectors that survive site redesigns and an MCP server and skill for agents."
category: data
tags: [library, cli, mcp, skill, claude-code, claude-desktop, openclaw, cursor, windsurf, web-scraping, crawler, python]
repo: https://github.com/D4Vinci/Scrapling
icon: ./icon.png
added: 2026-09-27
thumbnail: ./thumb.webp
---

Scrapling is a Python framework for getting data out of websites. It covers the whole range, from fetching and parsing a single page to running a crawl across many sites, with plain HTTP requests or real browsers depending on what the site needs. Its parser can remember the elements you selected and find them again after the site changes its layout, so scrapers break less often.

For larger jobs there's a spider framework in the style of Scrapy, with concurrency and per-domain throttling, pause and resume, streaming results, ready-made templates for sitemaps and feeds, and exporters for common formats. It can obey robots.txt, and it backs off automatically when a site starts rate-limiting. For agents, it ships an MCP server and an agent skill, so your agent can fetch and extract pages through it.

**When to use it:** collecting structured data from sites without an API, keeping scrapers alive through redesigns, or giving an agent a dependable way to read and extract from web pages.

**Caveats:** it's a developer library; you write Python or drive it through the MCP server. It advertises fetchers that get past anti-bot protection, which doesn't make scraping a given site allowed: check each site's terms, respect robots.txt and rate limits, and handle personal data lawfully.
