// Processes file uploads and extracts data
const fileService = require('../services/fileService'); // Service to extract data from the file

// Controller to handle file upload and content extraction
const handleFileUpload = async (req, res) => {
  try {
    const file = req.file; // Uploaded file in memory
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }

    // Extract data from the file buffer (instead of reading from disk)
    const extractedText = await fileService.extractFileData(file.buffer, file.mimetype);

    // Send the extracted text back to the frontend
    res.json({ text: extractedText });
  } catch (error) {
    console.error('File handling error:', error);
    res.status(500).send('Error processing file.');
  }
};

module.exports = { handleFileUpload };
