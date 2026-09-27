---
name: "Hypit"
tagline: "A video skill for coding agents: clone a reference video or describe one, and your agent builds an editable, re-runnable workflow to make variants."
category: media
tags: [skill, cli, claude-code, codex, video-generation, short-form-video, ads]
repo: https://github.com/hypit-ai/hypit
website: https://hypit.ai
thumbnail: ./thumb.webp
icon: ./icon.png
added: 2026-09-27
---

Hypit gives coding agents a way to make video. You hand your agent a reference video, and it rebuilds it as a complete workflow: footage, captions, B-roll and effects, all anchored to words in the script rather than to timestamps. You can also start from a template or just describe the video you want, and the agent writes the workflow from scratch.

The result is a composition you can edit and run again, not a one-off render. Change the host, the hook, the product or the language, and only the changed parts are regenerated while the timing reflows around the new words. The agent drives a local Hypit executable and calls the image, video and voice models you connect, or renders code-driven visuals without any generation calls at all.

**When to use it:** producing short-form social videos, ad variants for testing, localised versions of the same clip, or talking-head and podcast cuts, when you'd rather describe changes to an agent than edit a timeline.

**Caveats:** generation runs on model services you pay for separately, and quality depends on the models you choose. It's pitched hard at cloning viral videos and ads; copying someone else's video, face or voice raises copyright, consent and platform-policy questions that are yours to answer. It's released under its own licence rather than a standard one, so read it before building on it.
