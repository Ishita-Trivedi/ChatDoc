require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { askDocuments } = require('../services/ragService');

const datasetPath = process.argv[2] || path.join(__dirname, '..', 'evals', 'dataset.json');
const ownerId = process.env.EVAL_OWNER_ID || 'local-development-user';

const scoreCase = (testCase, result) => {
  const answer = result.answer.toLowerCase();
  const expectedTerms = testCase.expectedAnswerTerms || [];
  const answerScore = expectedTerms.length
    ? expectedTerms.filter((term) => answer.includes(term.toLowerCase())).length / expectedTerms.length : 1;
  const citedPages = new Set(result.citations.map((citation) => citation.page));
  const expectedPages = testCase.expectedPages || [];
  const citationRecall = expectedPages.length
    ? expectedPages.filter((page) => citedPages.has(page)).length / expectedPages.length : 1;
  return { answerScore, citationRecall, citationCount: result.citations.length };
};

const run = async () => {
  if (!fs.existsSync(datasetPath)) throw new Error(`Evaluation dataset not found: ${datasetPath}`);
  const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
  const results = [];
  for (const testCase of dataset) {
    const startedAt = Date.now();
    try {
      const answer = await askDocuments({ ownerId, question: testCase.question, documentIds: testCase.documentIds });
      results.push({ question: testCase.question, ...scoreCase(testCase, answer), latencyMs: Date.now() - startedAt });
    } catch (error) {
      results.push({ question: testCase.question, error: error.message, answerScore: 0, citationRecall: 0, latencyMs: Date.now() - startedAt });
    }
  }
  const passed = results.filter((result) => !result.error);
  const average = (field) => passed.length
    ? passed.reduce((sum, result) => sum + result[field], 0) / passed.length : 0;
  console.table(results);
  console.log(JSON.stringify({
    cases: results.length,
    successful: passed.length,
    averageAnswerTermCoverage: Number(average('answerScore').toFixed(3)),
    averageCitationRecall: Number(average('citationRecall').toFixed(3)),
    averageLatencyMs: Math.round(average('latencyMs')),
  }, null, 2));
  if (passed.length !== results.length) process.exitCode = 1;
};

run().catch((error) => { console.error(error); process.exitCode = 1; });
