const express = require('express');
const router=express.Router();
const multer  = require('multer')
//here 'file' is the key that frontend sends

// Configure multer for disk storage for testing
// const storage = multer.diskStorage();

// Configure multer for memory storage for MongoDB
const storage = multer.memoryStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/'); // Specify the folder to save the uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Save the file with a unique name
    }
});

const upload = multer({ storage: storage });
module.exports = upload;