//Processes file uploads, extracts data
const fileService = require('../services/fileService');

// Controller to handle file upload and content extraction
const handleFileUpload = async (req, res) => {
  try {
    const file = req.file;  // Uploaded file
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }

    // Extract data from the file using the service layer
    //Extraction logic is defined in services/fileService->extractFileData
    const extractedText = await fileService.extractFileData(file);

    // Send the extracted text back to the frontend or store it in DB for later
    res.json({ text: extractedText });
  } catch (error) {
    console.error('File handling error:', error);
    res.status(500).send('Error processing file.');
  }
};

module.exports = { handleFileUpload };
