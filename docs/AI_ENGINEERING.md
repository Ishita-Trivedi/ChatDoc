# ChatDoc AI engineering notes

## Request flow

```text
Authenticated upload
  -> validate type and PDF signature
  -> extract text per page
  -> overlap-aware chunking
  -> batched embeddings
  -> persist metadata and chunks

Question
  -> authorize selected document IDs
  -> semantic ranking + exact-term ranking
  -> reciprocal-rank fusion
  -> grounded structured generation
  -> validate returned source IDs
  -> stream progress and cited response
```

## Trust boundaries

- Clerk session identity becomes the storage owner ID; client-supplied owner IDs are never accepted in production.
- Retrieval always filters by both owner and selected document IDs.
- Document text is treated as untrusted evidence, not instructions.
- Model citations are accepted only when their source IDs exist in the retrieved evidence set.
- File extensions are not trusted: PDFs must also contain the PDF magic signature.
- Production refuses to use the development identity fallback when Clerk is not configured.

## Evaluation

`Backend/scripts/evaluate.js` evaluates a JSON dataset against the real retrieval and generation pipeline. It reports answer-term coverage, expected-page citation recall, latency, failures, and per-case citation counts. Add representative questions, unanswerable questions, exact identifiers, cross-document comparisons, and prompt-injection documents before comparing changes to models, chunking, or prompts.

## Current tradeoffs

- MongoDB provides durable storage, while hybrid ranking currently runs in the application process. At larger scale, create Atlas Search and Vector Search indexes and move candidate generation into aggregation pipelines.
- Streaming reports pipeline stages and delivers a final citation-consistent answer. Token-level streaming is intentionally deferred because the response and its citation IDs are generated as one validated JSON object.
- Text-only PDFs and TXT files are supported. Scanned documents return an explicit OCR-required error instead of silently producing poor retrieval results.
- Metrics are process-local and bounded to 500 samples. Export them to an observability backend for horizontally scaled deployment.
