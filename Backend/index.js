//Main Express app configuration
//Logic
//user->file->handle_FileData_Extraction
//uer->question->generate_ans
//for loading env variables
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { clerkMiddleware } = require('@clerk/express');
//Require path for static file serving
const path = require('path');  
const app = express();

if (process.env.CLERK_SECRET_KEY) app.use(clerkMiddleware());

// Added middleware to parse JSON data
app.use(express.json({ limit: '1mb' }));
// Will change port later/ added fallback port also
const port = process.env.PORT||3000;

// middleware used in Express.js to parse 
//incoming request bodies that are sent as URL-encoded form data
app.use(bodyParser.urlencoded({ extended: false }));

// This is used to serve static files like css, js, images
app.use(express.static(path.join(__dirname, 'public')));

// Enable CORS
const corsOptions = {
  origin: '*',  
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Import the routes
const fileRoutes = require('./routes/fileRoutes');  // You need to require your routes
const questionRoutes = require('./routes/questionRoutes');  // You need to require your routes
const metricsRoutes = require('./routes/metricsRoutes');

//Set of routes
app.use('/file', fileRoutes);
app.use('/question',questionRoutes);
app.use('/metrics', metricsRoutes);

//Update: For localhost to serverless

// Testing route to check if the server is working
app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server is up and running!', aiConfigured: Boolean(process.env.OPENAI_API_KEY) });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(400).json({ error: error.message || 'Invalid request.' });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
