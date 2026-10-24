const Document = require('../models/Document');
const Chunk = require('../models/Chunk');
const { connectDatabase } = require('../config/database');
const { getEmbeddingIdentity } = require('../config/aiProvider');

const memoryDocuments = new Map();

const keyFor = (ownerId, documentId) => `${ownerId}:${documentId}`;

const resolveIdentity = (value = {}) => {
  const active = getEmbeddingIdentity();
  return {
    embeddingProvider: value.embeddingProvider || active.embeddingProvider,
    embeddingModel: value.embeddingModel || active.embeddingModel,
  };
};

const saveDocument = async ({ document, chunks }) => {
  const identity = resolveIdentity(document);
  const storedDocument = { ...document, ...identity };
  const storedChunks = chunks.map((chunk) => ({ ...chunk, ...identity }));
  if (await connectDatabase()) {
    await Document.create(storedDocument);
    try {
      await Chunk.insertMany(storedChunks, { ordered: false });
    } catch (error) {
      await Document.deleteOne({ documentId: storedDocument.documentId, ownerId: storedDocument.ownerId });
      throw error;
    }
    return;
  }
  memoryDocuments.set(
    keyFor(storedDocument.ownerId, storedDocument.documentId),
    { ...storedDocument, chunks: storedChunks },
  );
};

const findDuplicate = async (ownerId, checksum, requestedIdentity = {}) => {
  const identity = resolveIdentity(requestedIdentity);
  if (await connectDatabase()) {
    return Document.findOne({ ownerId, checksum, status: 'ready', ...identity }).lean();
  }
  return [...memoryDocuments.values()].find((document) => (
    document.ownerId === ownerId
    && document.checksum === checksum
    && document.embeddingProvider === identity.embeddingProvider
    && document.embeddingModel === identity.embeddingModel
  ));
};

const getChunks = async (ownerId, documentIds, requestedIdentity = {}) => {
  const identity = resolveIdentity(requestedIdentity);
  if (await connectDatabase()) {
    return Chunk.find({ ownerId, documentId: { $in: documentIds }, ...identity }).lean();
  }
  return documentIds.flatMap((id) => {
    const document = memoryDocuments.get(keyFor(ownerId, id));
    if (!document
      || document.embeddingProvider !== identity.embeddingProvider
      || document.embeddingModel !== identity.embeddingModel) return [];
    return document.chunks;
  });
};

const listDocuments = async (ownerId, requestedIdentity = {}) => {
  const identity = resolveIdentity(requestedIdentity);
  if (await connectDatabase()) {
    return Document.find({ ownerId, status: 'ready', ...identity }).sort({ createdAt: -1 }).lean();
  }
  return [...memoryDocuments.values()].filter((document) => (
    document.ownerId === ownerId
    && document.embeddingProvider === identity.embeddingProvider
    && document.embeddingModel === identity.embeddingModel
  ));
};

const deleteDocument = async (ownerId, documentId) => {
  if (await connectDatabase()) {
    const result = await Document.deleteOne({ ownerId, documentId });
    if (result.deletedCount) await Chunk.deleteMany({ ownerId, documentId });
    return Boolean(result.deletedCount);
  }
  return memoryDocuments.delete(keyFor(ownerId, documentId));
};

module.exports = {
  saveDocument,
  findDuplicate,
  getChunks,
  listDocuments,
  deleteDocument,
  __testables: { resolveIdentity },
};
