const mongoose = require('mongoose');

const chunkSchema = new mongoose.Schema({
  chunkId: { type: String, required: true, unique: true, index: true },
  documentId: { type: String, required: true, index: true },
  ownerId: { type: String, required: true, index: true },
  fileName: { type: String, required: true },
  page: { type: Number, required: true },
  text: { type: String, required: true },
  embeddingProvider: { type: String, required: true, enum: ['openai', 'gemini'] },
  embeddingModel: { type: String, required: true },
  embedding: { type: [Number], required: true, select: true },
}, { timestamps: true });

chunkSchema.index({ ownerId: 1, documentId: 1, embeddingProvider: 1, embeddingModel: 1 });
chunkSchema.index({ text: 'text' });

module.exports = mongoose.models.Chunk || mongoose.model('Chunk', chunkSchema);
