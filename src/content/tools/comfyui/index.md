---
name: "ComfyUI"
tagline: "A node-graph engine for generating images, video, audio and 3D with open models, running on your own hardware or in the cloud."
category: media
tags: [app, api, image-generation, video-generation, local-models, node-graph]
repo: https://github.com/Comfy-Org/ComfyUI
website: https://www.comfy.org/
thumbnail: ./thumb.webp
icon: ./icon.png
added: 2026-09-27
---

ComfyUI is a visual engine for generative media. Instead of a single prompt box, you build a workflow as a graph of nodes: load a model, add conditioning, sample, upscale, mask, composite and save. Every step and parameter is visible and adjustable, and workflows save as JSON you can share or reuse as templates. It supports a wide range of open image, video, audio and 3D models, with optional nodes for some closed ones.

It's built to run well on consumer hardware and can work fully offline. A local API lets you queue workflows from your own code, which is how it fits into agent setups: an agent or script can drive a saved workflow to produce assets. Custom nodes from the community extend it in almost every direction, and there's a desktop app and a paid cloud version.

**When to use it:** generating or editing images and video with open models when you want fine control over each step, building repeatable asset pipelines, or giving an agent a local image generator to call through the API.

**Caveats:** it's a creative application, not agent tooling in itself; connecting it to an agent is up to you. The node graph has a learning curve, and serious use wants a capable GPU. Custom nodes are third-party code, so vet them before you install.
