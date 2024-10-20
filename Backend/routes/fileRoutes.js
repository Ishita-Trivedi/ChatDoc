const express = require('express');
const multer = require('multer');  // For file uploads
const path = require('path');
const fs = require('fs');  // Add fs module for file system operations
const { handleFileUpload } = require('../controllers/fileController');
const router = express.Router();

// Ensure the uploads/ directory exists before handling uploads
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage to use the original filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Folder where files will be saved
  },
  filename: function (req, file, cb) {
    // Can Use the original filename for the saved file
    cb(null, file.originalname);
  }
});

// Initialize multer with the custom storage configuration
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } });  // File size limit added here

router.post('/upload', upload.single('file'), handleFileUpload);

module.exports = router;
