const express = require('express');
const multer = require('multer'); // For file uploads
const { handleFileUpload } = require('../controllers/fileController');
const router = express.Router();

// Configure multer to store the file in memory instead of disk
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // Limit file size to 10MB
});

// Route for handling file uploads
router.post('/upload', upload.single('file'), handleFileUpload);

module.exports = router;
