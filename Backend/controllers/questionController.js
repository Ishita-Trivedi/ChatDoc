// Import the OpenAI service
const { getAnswer } = require('../services/openAIService');

// Controller to handle user's question and communicate with OpenAI
const handleUserQuestion = async (req, res) => {
  const { question, fileContent } = req.body;

  if (!question || !fileContent) {
    console.error("Invalid request: Missing question or fileContent");
    return res.status(400).send("Invalid request: Missing question or fileContent");
  }

  try {
    // Fetch the answer using the OpenAI service
    // console.log('the file content PASSED TO model is',fileContent);
    const answer = await getAnswer(question, fileContent);

    // Respond with the answer from OpenAI
    res.json({ answer });
  } catch (error) {
    console.error("Error fetching answer from OpenAI:", error);
    res.status(500).send("Error processing the question");
  }
};

module.exports = { handleUserQuestion };
