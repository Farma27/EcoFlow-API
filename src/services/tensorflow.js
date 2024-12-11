const tf = require('@tensorflow/tfjs-node');
require('dotenv').config();

let model;

const loadModel = async () => {
  if (!model) {
    const modelUrl = process.env.MODEL_URL;
    if (!modelUrl) {
      throw new Error('MODEL_URL is not defined in the environment variables');
    }
    model = await tf.loadLayersModel(modelUrl);
  }
  return model;
};

module.exports = loadModel;