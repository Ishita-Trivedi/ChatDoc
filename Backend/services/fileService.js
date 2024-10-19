//Handles file parsing logic
const pdfParse = require('pdf-parse');  // Example for PDF parsing

// Service to extract data from the uploaded file
const extractFileData = async (file) => {
  const filePath = file.path;
  const fileType = file.mimetype;

  if (fileType === 'application/pdf') {
    const fileData = await pdfParse(filePath);
    // console.log('extrcted text is ', fileData.text);
    return fileData.text;  // Extracted text from PDF
  } else if (fileType === 'text/plain') {
    const fs = require('fs').promises;
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return fileContent;
  }
  //iceboxed: Adding more file types if needed
};

module.exports = { extractFileData };
