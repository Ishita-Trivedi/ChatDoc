const pdfParse = require('pdf-parse');

const normalizeText = (text) => text.replace(/\s+/g, ' ').trim();

const renderPage = async (pageData) => {
  const content = await pageData.getTextContent({ normalizeWhitespace: true });
  return content.items.map((item) => item.str).join(' ');
};

const extractFileData = async (file) => {
  if (file.mimetype === 'application/pdf' || file.mimetype === 'application/x-pdf') {
    if (file.buffer.subarray(0, 5).toString() !== '%PDF-') throw new Error('The uploaded file is not a valid PDF.');
    const pages = [];
    await pdfParse(file.buffer, {
      pagerender: async (pageData) => {
        const text = normalizeText(await renderPage(pageData));
        pages.push({ page: pages.length + 1, text });
        return text;
      },
    });
    const extracted = pages.filter((page) => page.text);
    if (!extracted.length) throw new Error('No text was found. Scanned PDFs require OCR before upload.');
    return extracted;
  }
  if (file.mimetype === 'text/plain') {
    return [{ page: 1, text: normalizeText(file.buffer.toString('utf-8')) }];
  }
  throw new Error('Only PDF and plain-text files are supported.');
};

module.exports = { extractFileData };
