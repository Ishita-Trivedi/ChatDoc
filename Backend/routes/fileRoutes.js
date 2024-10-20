const express = require('express');
const multer = require('multer');
const { handleFileUpload } = require('../controllers/fileController');
const router = express.Router();

// Use memory storage to avoid saving files to disk
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/upload', upload.single('file'), handleFileUpload);

module.exports = router;
