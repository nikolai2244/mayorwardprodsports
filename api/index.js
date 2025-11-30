// Vercel Serverless Function Handler
// This wraps the Express app from server.js for Vercel deployment

const app = require('../server.js');

module.exports = app;
