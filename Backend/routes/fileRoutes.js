const express = require('express');
const multer = require('multer');
const { handleFileUpload, handleListFiles, handleDeleteFile } = require('../controllers/fileController');
const { requireApiAuth } = require('../middleware/auth');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 10 },
  fileFilter: (_req, file, callback) => {
    const allowed = ['application/pdf', 'application/x-pdf', 'text/plain'];
    callback(allowed.includes(file.mimetype) ? null : new Error('Only PDF and text files are supported.'), allowed.includes(file.mimetype));
  },
});

router.use(requireApiAuth);
router.get('/', handleListFiles);
router.post('/upload', upload.array('files', 10), handleFileUpload);
router.delete('/:documentId', handleDeleteFile);

module.exports = router;
