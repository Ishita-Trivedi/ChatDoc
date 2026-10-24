const fileService = require('../services/fileService');
const { indexDocument } = require('../services/ragService');
const { listDocuments, deleteDocument } = require('../services/documentStore');
const crypto = require('crypto');

const handleFileUpload = async (req, res) => {
  try {
    const files = req.files || [];
    if (!files.length) return res.status(400).json({ error: 'No files uploaded.' });
    const uploaded = [];
    for (const file of files) {
      const pages = await fileService.extractFileData(file);
      if (!pages.length) throw new Error(`${file.originalname} contains no extractable text.`);
      uploaded.push(await indexDocument({
        ownerId: req.userId,
        fileName: file.originalname,
        mimeType: file.mimetype,
        checksum: crypto.createHash('sha256').update(file.buffer).digest('hex'),
        pages,
      }));
    }
    return res.status(201).json({ documents: uploaded });
  } catch (error) {
    console.error('File handling error:', error);
    const status = error.message.includes('supported') || error.message.includes('extractable') ? 400 : 500;
    return res.status(status).json({ error: error.message || 'Error processing files.' });
  }
};

const handleListFiles = async (req, res) => {
  try {
    const documents = await listDocuments(req.userId);
    return res.json({ documents: documents.map((document) => ({
      id: document.documentId, name: document.name, pageCount: document.pageCount,
      chunkCount: document.chunkCount, createdAt: document.createdAt,
      embeddingProvider: document.embeddingProvider, embeddingModel: document.embeddingModel,
    })) });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Could not list documents.' });
  }
};

const handleDeleteFile = async (req, res) => {
  try {
    const deleted = await deleteDocument(req.userId, req.params.documentId);
    return deleted ? res.status(204).send() : res.status(404).json({ error: 'Document not found.' });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Could not delete document.' });
  }
};

module.exports = { handleFileUpload, handleListFiles, handleDeleteFile };
