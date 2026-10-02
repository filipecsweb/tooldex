---
name: "PaddleOCR"
tagline: "An open-source OCR and document parsing toolkit that turns PDFs and images into structured Markdown or JSON ready for LLMs and RAG pipelines."
category: data
tags: [library, cli, mcp, skill, free, openclaw, python, ocr, document-parsing, pdf, rag]
repo: https://github.com/PaddlePaddle/PaddleOCR
website: https://www.paddleocr.com
icon: ./icon.png
added: 2026-09-27
thumbnail: ./thumb.webp
---

PaddleOCR reads text out of images and documents. At its simplest it's a multilingual OCR engine that finds and recognises text in scans, photos, screenshots and real-world scenes. On top of that sit document-parsing pipelines that understand layout, tables, formulas, charts and reading order, and turn a whole PDF into clean Markdown or JSON.

That structured output is what makes it useful around AI: documents become text that a language model, a search index or a retrieval pipeline can work with, instead of images it can't read. It ships small specialised models alongside a lightweight vision-language model for document parsing, runs on CPUs and GPUs, and is already built into several popular LLM application platforms. It can also translate documents and export parsed results to Word.

**When to use it:** feeding scanned or complex PDFs into a RAG system or an agent, extracting tables and fields from invoices, forms and reports, or digitising documents in many languages.

**Caveats:** it's a machine-learning toolkit, not an agent integration; you call it from Python, a CLI or a server you run, and wire it into your agent yourself. Setup and hardware choices take some care, and the larger models want a GPU. Check the output on your own documents; accuracy varies with scan quality and layout.
