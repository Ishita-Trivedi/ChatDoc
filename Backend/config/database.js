const mongoose = require('mongoose');

let connectionPromise;

const connectDatabase = async () => {
  if (!process.env.MONGODB_URI) return false;
  if (mongoose.connection.readyState === 1) return true;
  connectionPromise ||= mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.MONGODB_DB_NAME || 'chatdoc',
    serverSelectionTimeoutMS: 5000,
  }).catch((error) => {
    connectionPromise = undefined;
    throw error;
  });
  await connectionPromise;
  return true;
};

module.exports = { connectDatabase };
