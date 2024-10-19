// Manages communication with OpenAI API
const OpenAI = require('openai');

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // API Key should be set in your environment variables
});

// Function to get an answer from OpenAI given a question and context (file data)
const getAnswer = async (question, context) => {
  try {
    //  console.log('the file content RECEIVED TO model is',context);
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',  // or 'gpt-4'
      messages: [
  { role: 'system', content: 'ChatDoc is a chat app where users can get answers to their questions based on the content uploaded in the form of a file.' },
  { role: 'user', content: `Context: ${context}\nQuestion: ${question}` }
],
      max_tokens: 200,
    });

    // Return the answer from OpenAI
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error interacting with OpenAI:", error);
    throw error;
  }
};

module.exports = { getAnswer };
