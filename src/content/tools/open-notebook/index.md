---
name: "Open Notebook"
tagline: "A self-hosted, open-source take on NotebookLM: chat with your sources, search them and turn them into podcasts, using the AI models you choose."
category: research
tags: [mcp, claude-desktop, self-hosted, notebooklm, note-taking, podcasts]
repo: https://github.com/lfnovo/open-notebook
website: https://www.open-notebook.ai
thumbnail: ./thumb.webp
icon: ./icon.png
added: 2026-09-27
---

Open Notebook is an open-source alternative to Google's NotebookLM that you run yourself. You collect sources into notebooks, such as PDFs, web pages, videos and audio, and then search them, take notes and chat with an AI that answers from that material. It can also turn a notebook into a multi-speaker podcast with scripts you control.

The difference from NotebookLM is ownership. It runs on your own machine or server, your research stays there, and you pick the model provider, from the big hosted APIs to local models through Ollama or LM Studio. A REST API and an MCP server let you reach the same notebooks from scripts or from an MCP client such as Claude Desktop.

**When to use it:** building a private research library on a topic, studying from a pile of papers and recordings, or wanting NotebookLM-style workflows without sending sensitive material to Google.

**Caveats:** it's an application you host with Docker, not a skill you drop into your agent, so there's setup and upkeep. You bring your own model API keys or local models, and answer quality depends on which you choose. The project itself notes that its citations are less thorough than NotebookLM's.
