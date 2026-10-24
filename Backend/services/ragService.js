const crypto = require('crypto');
const { createEmbeddings, answerFromSources } = require('./openAIService');
const { saveDocument, findDuplicate, getChunks } = require('./documentStore');
const { recordMetric } = require('./metricsService');

const CHUNK_SIZE = 1100;
const CHUNK_OVERLAP = 180;
const CANDIDATE_COUNT = 18;
const TOP_K = 7;

const chunkPage = (text) => {
  if (text.length <= CHUNK_SIZE) return [text];
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    let end = Math.min(start + CHUNK_SIZE, text.length);
    const boundary = end < text.length ? text.lastIndexOf(' ', end) : end;
    if (boundary > start + CHUNK_SIZE / 2) end = boundary;
    chunks.push(text.slice(start, end).trim());
    if (end >= text.length) break;
    start = Math.max(end - CHUNK_OVERLAP, start + 1);
  }
  return chunks.filter(Boolean);
};

const cosineSimilarity = (a, b) => {
  let dot = 0; let normA = 0; let normB = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i]; normA += a[i] ** 2; normB += b[i] ** 2;
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
};

const terms = (text) => new Set(text.toLowerCase().match(/[\p{L}\p{N}_-]{2,}/gu) || []);
const lexicalScore = (queryTerms, text) => {
  const textTerms = terms(text);
  if (!queryTerms.size) return 0;
  let matches = 0;
  queryTerms.forEach((term) => { if (textTerms.has(term)) matches += 1; });
  return matches / queryTerms.size;
};

const reciprocalRankFusion = (vectorRanked, lexicalRanked) => {
  const scores = new Map();
  [vectorRanked, lexicalRanked].forEach((ranking) => ranking.forEach((chunk, index) => {
    scores.set(chunk.chunkId, (scores.get(chunk.chunkId) || 0) + 1 / (60 + index + 1));
  }));
  const byId = new Map([...vectorRanked, ...lexicalRanked].map((chunk) => [chunk.chunkId, chunk]));
  return [...scores.entries()].map(([id, score]) => ({ ...byId.get(id), score }))
    .sort((a, b) => b.score - a.score).slice(0, TOP_K);
};

const indexDocument = async ({ ownerId, fileName, mimeType, checksum, pages }) => {
  const duplicate = await findDuplicate(ownerId, checksum);
  if (duplicate) {
    return {
      id: duplicate.documentId, name: duplicate.name, pageCount: duplicate.pageCount,
      chunkCount: duplicate.chunkCount, duplicate: true,
    };
  }
  const documentId = crypto.randomUUID();
  const chunks = pages.flatMap(({ page, text }) => chunkPage(text).map((chunkText, chunkIndex) => ({
    chunkId: `${documentId}:${page}:${chunkIndex}`, documentId, ownerId, fileName, page, text: chunkText,
  })));
  const embeddings = await createEmbeddings(chunks.map((chunk) => chunk.text));
  chunks.forEach((chunk, index) => { chunk.embedding = embeddings[index]; });
  const document = {
    documentId, ownerId, name: fileName, mimeType, checksum,
    pageCount: pages.length, chunkCount: chunks.length, status: 'ready',
  };
  await saveDocument({ document, chunks });
  return { id: documentId, name: fileName, pageCount: pages.length, chunkCount: chunks.length, duplicate: false };
};

const retrieveSources = async ({ ownerId, question, documentIds }) => {
  const chunks = await getChunks(ownerId, documentIds);
  if (!chunks.length) {
    const error = new Error('None of the selected documents are available for this account.');
    error.status = 404; throw error;
  }
  const [queryEmbedding] = await createEmbeddings([question]);
  const queryTerms = terms(question);
  const scored = chunks.map((chunk) => ({
    ...chunk,
    vectorScore: cosineSimilarity(queryEmbedding, chunk.embedding),
    lexicalScore: lexicalScore(queryTerms, chunk.text),
  }));
  const vectorRanked = [...scored].sort((a, b) => b.vectorScore - a.vectorScore).slice(0, CANDIDATE_COUNT);
  const lexicalRanked = [...scored].sort((a, b) => b.lexicalScore - a.lexicalScore).slice(0, CANDIDATE_COUNT);
  return reciprocalRankFusion(vectorRanked, lexicalRanked)
    .map((chunk, index) => ({ ...chunk, sourceId: `S${index + 1}` }));
};

const askDocuments = async ({ ownerId, question, documentIds, history = [], onProgress = () => {} }) => {
  const startedAt = Date.now();
  try {
    onProgress('retrieving', 'Searching semantic and keyword indexes');
    const sources = await retrieveSources({ ownerId, question, documentIds });
    onProgress('generating', `Drafting from ${sources.length} evidence passages`);
    const generated = await answerFromSources({ question, history, sources });
    const validIds = new Set(Array.isArray(generated.citationIds) ? generated.citationIds : []);
    const citations = sources.filter((source) => validIds.has(source.sourceId)).map(
      ({ sourceId, documentId, fileName, page, text, score, vectorScore, lexicalScore: keywordScore }) => ({
        sourceId, documentId, fileName, page,
        excerpt: text.length > 300 ? `${text.slice(0, 297)}...` : text,
        relevance: Number(score.toFixed(4)),
        vectorScore: Number(vectorScore.toFixed(3)),
        keywordScore: Number(keywordScore.toFixed(3)),
      }),
    );
    const result = { answer: generated.answer || 'I could not find a supported answer.', citations };
    onProgress('verifying', `Validated ${citations.length} source citations`);
    recordMetric({ ownerId, success: true, durationMs: Date.now() - startedAt, citationCount: citations.length, documentCount: documentIds.length });
    return result;
  } catch (error) {
    recordMetric({ ownerId, success: false, durationMs: Date.now() - startedAt, citationCount: 0, error: error.message });
    throw error;
  }
};

module.exports = {
  indexDocument,
  retrieveSources,
  askDocuments,
  __testables: { chunkPage, cosineSimilarity, lexicalScore, reciprocalRankFusion },
};
