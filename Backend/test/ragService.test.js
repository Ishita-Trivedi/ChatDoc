const test = require('node:test');
const assert = require('node:assert/strict');
const { __testables } = require('../services/ragService');

test('chunkPage creates overlapping bounded chunks without losing the ending', () => {
  const text = `${'retrieval '.repeat(180)}final evidence`;
  const chunks = __testables.chunkPage(text);
  assert.ok(chunks.length > 1);
  assert.ok(chunks.every((chunk) => chunk.length <= 1100));
  assert.match(chunks.at(-1), /final evidence$/);
});

test('cosineSimilarity ranks aligned vectors above unrelated vectors', () => {
  assert.equal(__testables.cosineSimilarity([1, 0], [1, 0]), 1);
  assert.equal(__testables.cosineSimilarity([1, 0], [0, 1]), 0);
});

test('lexicalScore preserves exact identifiers that semantic search may miss', () => {
  const query = new Set(['invoice-1042', 'total']);
  assert.equal(__testables.lexicalScore(query, 'The total for invoice-1042 is listed below.'), 1);
  assert.equal(__testables.lexicalScore(query, 'A general billing discussion.'), 0);
});

test('reciprocal rank fusion rewards chunks present in both rankings', () => {
  const shared = { chunkId: 'shared' };
  const result = __testables.reciprocalRankFusion(
    [{ chunkId: 'vector-only' }, shared],
    [shared, { chunkId: 'keyword-only' }],
  );
  assert.equal(result[0].chunkId, 'shared');
});
