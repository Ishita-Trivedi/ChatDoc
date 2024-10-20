const pdfParse = require('pdf-parse');  // PDF parsing
const extractFileData = async (file) => {
  const fileType = file.mimetype;

  if (fileType === 'application/pdf' || fileType === 'application/x-pdf') {
    const fileData = await pdfParse(file.buffer);  // Parse buffer directly
    // console.log('Extracted text is:', fileData.text);
    return fileData.text;  // Return extracted text from PDF
  } else if (fileType === 'text/plain') {
    return file.buffer.toString('utf-8');  // Convert buffer to string for text files
  } else {
    throw new Error('Unsupported file type.');
  }
};

module.exports = { extractFileData };
