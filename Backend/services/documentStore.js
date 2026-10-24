const Document = require('../models/Document');
const Chunk = require('../models/Chunk');
const { connectDatabase } = require('../config/database');

const memoryDocuments = new Map();

const keyFor = (ownerId, documentId) => `${ownerId}:${documentId}`;

const saveDocument = async ({ document, chunks }) => {
  if (await connectDatabase()) {
    await Document.create(document);
    try {
      await Chunk.insertMany(chunks, { ordered: false });
    } catch (error) {
      await Document.deleteOne({ documentId: document.documentId, ownerId: document.ownerId });
      throw error;
    }
    return;
  }
  memoryDocuments.set(keyFor(document.ownerId, document.documentId), { ...document, chunks });
};

const findDuplicate = async (ownerId, checksum) => {
  if (await connectDatabase()) {
    return Document.findOne({ ownerId, checksum, status: 'ready' }).lean();
  }
  return [...memoryDocuments.values()].find((document) => document.ownerId === ownerId && document.checksum === checksum);
};

const getChunks = async (ownerId, documentIds) => {
  if (await connectDatabase()) {
    return Chunk.find({ ownerId, documentId: { $in: documentIds } }).lean();
  }
  return documentIds.flatMap((id) => memoryDocuments.get(keyFor(ownerId, id))?.chunks || []);
};

const listDocuments = async (ownerId) => {
  if (await connectDatabase()) {
    return Document.find({ ownerId, status: 'ready' }).sort({ createdAt: -1 }).lean();
  }
  return [...memoryDocuments.values()].filter((document) => document.ownerId === ownerId);
};

const deleteDocument = async (ownerId, documentId) => {
  if (await connectDatabase()) {
    const result = await Document.deleteOne({ ownerId, documentId });
    if (result.deletedCount) await Chunk.deleteMany({ ownerId, documentId });
    return Boolean(result.deletedCount);
  }
  return memoryDocuments.delete(keyFor(ownerId, documentId));
};

module.exports = { saveDocument, findDuplicate, getChunks, listDocuments, deleteDocument };
