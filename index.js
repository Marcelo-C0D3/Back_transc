// Copyright 2017 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const cors = require('cors')
const bodyParser = require('body-parser')

const express = require('express')
const app = express()
const port = process.env.PORT || 3010
const upload = require('../E-ClippingP/backend/uploadConfig')

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/go', function (req, res) {
  //res.send('hello world');
  // const transc = await main()
  // res.send(transc)
  //res.status(200).json(`oie`)
  res.send("not gets")
});

app.use(bodyParser.json({ limit: '500mb' }))
app.use('/files', express.static('public/files'))


app.post('/upload', upload.single('file'), async (req, res) => {

  // The name of the audio file to transcribe
  const fileName = __dirname + '/' + req.file.path
  //res.send("tutui 200")
  const transc = await main(fileName)
  res.send(transc)
})

app.listen(port, () => {
  console.log('Backend executando... Porta ' + port)
})

//[START speech_quickstart]
async function main(fileName) {

  const audioEspc = {
    audio: { transcription: '', confidence: '', words: [] }
  }
  // Instantiates a client. Explicitly use service account credentials by
  // specifying the private key file. All clients in google-cloud-node have this
  // helper, see https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/docs/authentication.md

  const projectId = 'speechtogo'
  const keyFilename = './marcelokey.json'
  // Imports the Google Cloud client library
  
  const fs = require('fs');
  const speech = require('@google-cloud/speech');

  // Creates a client
  const client = new speech.SpeechClient({ projectId, keyFilename });
  // Reads a local audio file and converts it to base64
  const file = fs.readFileSync(fileName);
  const audioBytes = file.toString('base64');
  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
     content: audioBytes,
  };
  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 44100,
    languageCode: 'pt-BR',
    audioChannelCount: 2,
    enableSeparateRecognitionPerChannel: false,
    enableWordTimeOffsets: true,
  };
  const request = {
    audio: audio,
    config: config,
  };
  // Detects speech in the audio file
  const [response] = await client.recognize(request);
  const transc = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
  const conf = response.results
    .map(result => result.alternatives[0].confidence)
    .join('\n');
  const wordSpec = response.results
    .map(result => result.alternatives[0].words)
  
  // console.log(wordSpec)
  audioEspc.audio.transcription = transc
  audioEspc.audio.confidence = conf
  audioEspc.audio.words = wordSpec
  
  return audioEspc

}

// setInterval(() => {
//   findRemoveSync( __dirname + '/public/files', {age: {seconds: 3600}, dir: "*", files: "*.*"})
// }, 360000)