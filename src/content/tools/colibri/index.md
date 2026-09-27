---
name: "Colibrì"
tagline: "A small inference engine in C that runs very large open mixture-of-experts models on ordinary hardware by streaming experts from disk."
category: infrastructure
tags: [cli, local-models, inference, moe, openai-compatible, self-hosted]
repo: https://github.com/JustVugg/colibri
website: https://justvugg.github.io/colibri
thumbnail: ./thumb.webp
icon: ./icon.png
added: 2026-09-27
---

Colibrì runs frontier-scale open models on machines that could never hold them in memory. It works with mixture-of-experts models, where only a few "experts" are active for each token, and treats GPU memory, RAM and disk as one hierarchy: the experts that matter stay in fast memory, and the rest are streamed from storage when the router picks them. The engine is plain C with no dependencies, with a single file per model family.

You use it from a terminal chat, a web dashboard or an OpenAI-compatible API with tool calling, so agents and other tools can talk to it like any local model server. It's also an open research project on inference: the dashboard shows which experts fire on each turn, and the project promises that running short of fast memory costs speed, never silently changes the model's precision or behaviour.

**When to use it:** running a large open model privately on hardware you already own, experimenting with local models behind your own agent setup, or studying how mixture-of-experts models route and perform.

**Caveats:** it trades speed for access; on modest hardware, expect answers measured in a few tokens per second, not hosted-API pace. The weights are large downloads and want fast storage. It supports a specific set of model families and is a fast-moving research engine, with no guarantees on speed.
