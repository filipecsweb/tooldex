---
name: "sherpa-onnx"
tagline: "An offline speech toolkit that runs speech-to-text, text-to-speech, voice activity detection and speaker diarization locally, from servers to phones."
category: speech
tags: [library, free, speech-to-text, text-to-speech, local-models, on-device]
repo: https://github.com/k2-fsa/sherpa-onnx
icon: ./icon.png
added: 2026-09-30T21:20:04Z
thumbnail: ./thumb.webp
---

sherpa-onnx is a speech toolkit from the next-gen Kaldi project that runs entirely on your own hardware, with no internet connection. It handles speech recognition in both streaming and batch modes, text-to-speech, voice activity detection, speaker identification and diarization, keyword spotting, spoken-language identification, punctuation, speech enhancement and source separation. Models run through ONNX Runtime, and you choose from a large catalogue of pretrained open models covering many languages.

It's built to run almost anywhere: servers and desktops, Android and iOS, single-board computers, NPU accelerators and the browser through WebAssembly, with bindings for most mainstream programming languages and a WebSocket server. For agent builders, that makes it the speech layer of a local voice assistant: detect when someone is talking, transcribe it, hand the text to your model and speak the reply, without sending audio to a cloud API. Browser demos let you try the main features before installing anything.

**When to use it:** giving an agent or app a voice interface that has to work offline or keep audio private, transcribing or subtitling recordings locally, adding wake words or speaker labels, or running speech on phones and embedded boards where a cloud service isn't an option.

**Caveats:** it's a speech library, not an agent integration or an LLM; microphone capture, turn-taking and calling your model are yours to wire up. Picking the right model for your language and hardware takes some reading, and the docs are thorough but dense. Accuracy and voice quality depend on the model, so test it on your own audio.
