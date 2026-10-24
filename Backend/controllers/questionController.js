const { z } = require('zod');
const { askDocuments } = require('../services/ragService');

const requestSchema = z.object({
  question: z.string().trim().min(1).max(4000),
  documentIds: z.array(z.string().uuid()).min(1).max(10),
  history: z.array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().max(8000) })).max(20).optional(),
});

const handleUserQuestion = async (req, res) => {
  const parsed = requestSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Provide a question and at least one valid document ID.' });
  try {
    return res.json(await askDocuments({ ...parsed.data, ownerId: req.userId }));
  } catch (error) {
    console.error('Error answering question:', error);
    return res.status(error.status || 500).json({ error: error.message || 'Error processing the question.' });
  }
};

const writeEvent = (res, event, data) => {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
};

const handleStreamingQuestion = async (req, res) => {
  const parsed = requestSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Provide a question and at least one valid document ID.' });
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
  });
  res.flushHeaders();
  try {
    const result = await askDocuments({
      ...parsed.data,
      ownerId: req.userId,
      onProgress: (stage, message) => writeEvent(res, 'progress', { stage, message }),
    });
    writeEvent(res, 'answer', result);
  } catch (error) {
    writeEvent(res, 'error', { error: error.message || 'Unable to answer question.' });
  }
  return res.end();
};

const handleComparison = async (req, res) => {
  const parsed = requestSchema.refine((data) => data.documentIds.length >= 2, {
    message: 'Select at least two documents to compare.',
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Select at least two documents to compare.' });
  const comparisonQuestion = `Compare the selected documents for this request. Organize similarities and differences clearly, and cite every factual claim: ${parsed.data.question}`;
  try {
    return res.json(await askDocuments({ ...parsed.data, question: comparisonQuestion, ownerId: req.userId }));
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message || 'Comparison failed.' });
  }
};

module.exports = { handleUserQuestion, handleStreamingQuestion, handleComparison };
