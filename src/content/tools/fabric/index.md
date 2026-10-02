---
name: "Fabric"
tagline: "A command-line tool that runs a large, crowd-sourced library of task prompts, such as summarise or extract key ideas, over any text you pipe in."
category: research
tags: [cli, prompts, prompt-engineering]
repo: https://github.com/danielmiessler/Fabric
thumbnail: ./thumb.webp
icon: ./icon.png
added: 2026-10-02T14:35:23Z
---

Fabric is built around Patterns: prompts written in Markdown, each for one job, such as summarising an article, pulling the key ideas out of a podcast transcript, analysing the claims in a piece of writing or explaining code. You pipe text into `fabric` with the name of a pattern and get the result back on standard output, so it fits into shell pipelines, aliases and note-taking workflows. It can also fetch a YouTube transcript or turn a web page into Markdown before running the pattern.

The patterns are the heart of the project and work on their own: you can paste any of them into whatever chat app you prefer. The CLI adds the plumbing around them: most major model providers and local models, a different model per pattern, prompting strategies such as chain-of-thought that wrap any pattern, private patterns kept alongside the shared ones, and a REST server that can also stand in for an Ollama endpoint.

**When to use it:** you live in the terminal and want repeatable, named prompts for everyday text jobs, or you want a well-organised prompt library to borrow from.

**Caveats:** it's a general-purpose prompt runner, not built around coding agents. It needs a model to talk to, through an API key, a supported subscription or a local runtime. Pattern quality varies, since they come from many contributors.
