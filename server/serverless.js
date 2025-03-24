// serverless.js - Vercel serverless entrypoint
const dotenv = require('dotenv');
dotenv.config();

// Import the express app (which now includes MongoDB connection)
const app = require('./index');

// Export the serverless handler
module.exports = app; 