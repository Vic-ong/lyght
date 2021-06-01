const dotenv = require('dotenv');

dotenv.config();

const { google } = require('googleapis');

const identityToolkit = google.identitytoolkit({
  auth: process.env.GCP_API_KEY,
  version: 'v3',
});

module.exports = identityToolkit;
