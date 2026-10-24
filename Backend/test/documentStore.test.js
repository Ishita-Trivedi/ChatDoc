const test = require('node:test');
const assert = require('node:assert/strict');
const {
  saveDocument, findDuplicate, getChunks, listDocuments, deleteDocument,
} = require('../services/documentStore');

test('memory store isolates documents and chunks by embedding identity', async () => {
  const previous = {
    mongo: process.env.MONGODB_URI,
    provider: process.env.AI_PROVIDER,
    openaiModel: process.env.OPENAI_EMBEDDING_MODEL,
  };
  const ownerId = `provider-test-${Date.now()}`;
  const documentId = `document-${Date.now()}`;

  try {
    delete process.env.MONGODB_URI;
    process.env.AI_PROVIDER = 'openai';
    process.env.OPENAI_EMBEDDING_MODEL = 'embedding-a';
    await saveDocument({
      document: {
        documentId, ownerId, name: 'test.txt', checksum: 'same-file',
        pageCount: 1, chunkCount: 1, status: 'ready',
      },
      chunks: [{
        chunkId: `${documentId}:1:0`, documentId, ownerId, fileName: 'test.txt',
        page: 1, text: 'provider-aware evidence', embedding: [1, 0],
      }],
    });

    assert.ok(await findDuplicate(ownerId, 'same-file'));
    assert.equal((await getChunks(ownerId, [documentId])).length, 1);
    assert.equal((await listDocuments(ownerId)).length, 1);

    process.env.OPENAI_EMBEDDING_MODEL = 'embedding-b';
    assert.equal(await findDuplicate(ownerId, 'same-file'), undefined);
    assert.equal((await getChunks(ownerId, [documentId])).length, 0);
    assert.equal((await listDocuments(ownerId)).length, 0);
  } finally {
    await deleteDocument(ownerId, documentId);
    if (previous.mongo === undefined) delete process.env.MONGODB_URI;
    else process.env.MONGODB_URI = previous.mongo;
    if (previous.provider === undefined) delete process.env.AI_PROVIDER;
    else process.env.AI_PROVIDER = previous.provider;
    if (previous.openaiModel === undefined) delete process.env.OPENAI_EMBEDDING_MODEL;
    else process.env.OPENAI_EMBEDDING_MODEL = previous.openaiModel;
  }
});
