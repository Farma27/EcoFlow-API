const { Firestore } = require('@google-cloud/firestore');
const path = require('path'); 

const firestore = new Firestore({
  projectId: 'ecoflow-442316',
  keyFilename: path.resolve(__dirname, '../../config/ecoflow.json')
});

module.exports = firestore;