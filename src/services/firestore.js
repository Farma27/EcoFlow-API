const { Firestore } = require('@google-cloud/firestore');
const path = require('path'); 

const firestore = new Firestore();

module.exports = firestore;