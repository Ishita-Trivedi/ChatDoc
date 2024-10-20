const pdfParse = require('pdf-parse'); // For PDF parsing
const { extractTextFromDocx } = require('./docxService'); // Hypothetical docx parser

// Service to extract data from the file
const extractFileData = async (fileBuffer, mimetype) => {
  try {
    let extractedText;

    if (mimetype === 'application/pdf') {
      // Extract text from PDF
      const data = await pdfParse(fileBuffer);
      extractedText = data.text;
    } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // Extract text from DOCX
      extractedText = await extractTextFromDocx(fileBuffer); // Using a function that parses docx from buffer
    } else {
      throw new Error('Unsupported file type');
    }

    return extractedText;
  } catch (error) {
    console.error('Error extracting file data:', error);
    throw error;
  }
};

module.exports = { extractFileData };
