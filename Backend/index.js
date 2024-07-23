const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();
const userRoutes = require('./routes/user');
const fileRoutes = require('./routes/file');

// Will change port later
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));

// This is used to serve static files like css, js, images
app.use(express.static(path.join(__dirname, 'public')));

// Enable CORS
app.use(cors());

// app.use('/user', userRoutes);
app.use('/file', fileRoutes);
app.use('/', (req, res, next) => {
    console.log('This always runs');
    next();
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
