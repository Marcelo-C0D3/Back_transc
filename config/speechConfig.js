// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');

const projectId = 'speechtogo'
const keyFilename = './config/marcelokey.json'

// Creates a client
const client = new speech.SpeechClient({
    projectId, keyFilename
});

module.exports = client