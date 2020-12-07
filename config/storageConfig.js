const { Storage } = require('@google-cloud/storage');
const bucketName = 'gonna';

const projectId = 'speechtogo'
const keyFilename = './config/marcelokey.json'
// Instantiate a storage client
const storage = new Storage({
    projectId,
    keyFilename
});

const buck = storage.bucket(bucketName) // should be your bucket name


module.exports = buck