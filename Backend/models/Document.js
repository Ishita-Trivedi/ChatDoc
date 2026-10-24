const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  documentId: { type: String, required: true, unique: true, index: true },
  ownerId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  mimeType: String,
  checksum: { type: String, required: true },
  embeddingProvider: { type: String, required: true, enum: ['openai', 'gemini'] },
  embeddingModel: { type: String, required: true },
  pageCount: { type: Number, required: true },
  chunkCount: { type: Number, required: true },
  status: { type: String, enum: ['processing', 'ready', 'failed'], default: 'ready' },
}, { timestamps: true });

documentSchema.index(
  { ownerId: 1, checksum: 1, embeddingProvider: 1, embeddingModel: 1 },
  { unique: true },
);

module.exports = mongoose.models.Document || mongoose.model('Document', documentSchema);
