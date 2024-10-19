const express = require('express');
const multer = require('multer');  // For file uploads
const path = require('path');
const { handleFileUpload } = require('../controllers/fileController');
const router = express.Router();

// Configure multer storage to use the original filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Folder where files will be saved
  },
  filename: function (req, file, cb) {
    // Use the original filename for the saved file
    cb(null, file.originalname);
  }
});

// Initialize multer with the custom storage configuration
const upload = multer({ storage: storage });

router.post('/upload', upload.single('file'), handleFileUpload);

module.exports = router;
