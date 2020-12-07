'use strict';

const bodyParser = require('body-parser')
const express = require('express')
const upload = require('./Upload/uploadConfig')
const buck = require('./config/storageConfig')
const client = require('./config/speechConfig')

const app = express()
app.use(bodyParser.json({ limit: '500mb' }))
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Display a form for uploading files.
app.get('/', (req, res) => {
  res.render('not gets');
});

// Process the file upload and upload to Google Cloud Storage.
app.post('/upload', upload.single('file'), async (req, res, next) => {
  if (!req.file) {
    res.status(400).send('No file uploaded.');
    return;
  }
  // Create a new blob in the bucket and upload the file data.
  const blob = buck.file(req.file.originalname);
  const blobStream = blob.createWriteStream();
  
  blobStream.on('error', (err) => {
    next(err);
  });

  blobStream.on('finish', async () => {
    const transc = await main(`gs://${buck.name}/${blob.name}`);
    res.status(200).send(transc);
  });
  
  blobStream.end(req.file.buffer);
});

const port = process.env.PORT || 3010
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
  console.log('Press Ctrl+C to quit.');
});

//[START speech_quickstart]
async function main(publicUrl) {

  const audioEspc = {
    audio: { transcription: '', confidence: '' }
  }

  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    uri: publicUrl,
  };

  const config = {
    encoding: 'MP3',
    sampleRateHertz: 16000,
    languageCode: 'pt-BR',
    audioChannelCount: 1,
    enableWordTimeOffsets: false,
    enableAutomaticPunctuation: true,
  };

  const request = {
    audio: audio,
    config: config,
  };

  // Detects speech in the audio file. This creates a recognition job that you
  // can wait for now, or get its result later.
  const [operation] = await client.longRunningRecognize(request);

  // Get a Promise representation of the final result of the job
  const [response] = await operation.promise();
  const transc = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
  const conf = response.results
    .map(result => result.alternatives[0].confidence)
    .join('\n');
  // const wordSpec = response.results
  //   .map(result => result.alternatives[0].words)

  audioEspc.audio.transcription = transc
  audioEspc.audio.confidence = conf
  //audioEspc.audio.words = wordSpec

  return audioEspc
}