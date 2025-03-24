// serverless.js - Vercel serverless entrypoint
const dotenv = require('dotenv');
dotenv.config();

// Pre-load mongoose connection
require('./db/config');

// Import the express app
const app = require('./index');

// Export the serverless handler
module.exports = app; 