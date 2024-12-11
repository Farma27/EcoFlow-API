const tf = require('@tensorflow/tfjs-node');
require('dotenv').config();
const { MODEL_URL_1, MODEL_URL_2 } = require('../config');

require('../layers/RandomFlip'); // Ensure the custom layer is registered
require('../layers/RandomRotation'); // Ensure the custom layer is registered
require('../layers/RandomZoom'); // Ensure the custom layer is registered

let model1, model2;

const loadModel = async (modelNumber) => {
  if (modelNumber === 1 && !model1) {
    if (!MODEL_URL_1) {
      throw new Error('MODEL_URL_1 is not defined in the environment variables');
    }
    model1 = await tf.loadLayersModel(MODEL_URL_1);
  } else if (modelNumber === 2 && !model2) {
    if (!MODEL_URL_2) {
      throw new Error('MODEL_URL_2 is not defined in the environment variables');
    }
    model2 = await tf.loadLayersModel(MODEL_URL_2);
  }
  return modelNumber === 1 ? model1 : model2;
};

module.exports = loadModel;