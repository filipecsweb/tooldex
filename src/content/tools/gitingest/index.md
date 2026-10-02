---
name: "Gitingest"
tagline: "Turns a Git repository or a local folder into one text digest, with a file tree and a token estimate, ready to paste into an LLM."
category: dev-workflow
tags: [cli, library, app, codebase-context, python]
repo: https://github.com/coderamp-labs/gitingest
website: https://gitingest.com
thumbnail: ./thumb.webp
icon: ./icon.png
added: 2026-10-02T14:35:26Z
---

Gitingest flattens a codebase into a single plain-text file you can hand to a language model: a short summary, the directory tree and the contents of every included file, with an estimate of how many tokens the whole thing will take. The quickest route is the website: replace "hub" with "ingest" in a GitHub URL, or paste a repository URL, and narrow the digest with include and exclude patterns and a file-size limit.

The same engine comes as a command-line tool and a Python package. Both work on local directories as well as remote repositories, skip whatever `.gitignore` excludes by default, and read private repositories with a GitHub token. The web app can be self-hosted with Docker.

**When to use it:** asking a chat model about a repository it can't browse, giving a model a one-shot overview of an unfamiliar project, or packaging part of a codebase as context for a prompt.

**Caveats:** a digest is a snapshot, and large repositories quickly outgrow a model's context window, so expect to filter. Agents that already read your files directly gain little from it. Using the hosted site on a private repository means giving a third-party service a GitHub token; the CLI keeps that on your machine.
