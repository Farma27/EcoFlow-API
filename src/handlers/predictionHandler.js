const tf = require('@tensorflow/tfjs-node');
const loadModel = require('../services/tensorflow');
const { createCanvas, loadImage } = require('canvas');

const classLabels = ['cardboard', 'compost', 'glass', 'metal', 'paper', 'plastic', 'trash'];

const predictHandler = async (request, h) => {
  try {
    const { file } = request.payload;
    if (!file) {
      return h.response({ status: 'fail', message: 'No file provided' }).code(400);
    }

    const model = await loadModel();

    const image = await loadImage(file._data);
    const canvas = createCanvas(224, 224);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, 224, 224);

    const imageData = ctx.getImageData(0, 0, 224, 224);
    const input = tf.browser.fromPixels(imageData).toFloat().div(tf.scalar(255)).expandDims();

    const predictions = model.predict(input);
    const predictedClassIndex = predictions.argMax(-1).dataSync()[0];
    const predictedClassLabel = classLabels[predictedClassIndex];

    return h.response({ status: 'success', predictedClass: predictedClassLabel }).code(200);
  } catch (error) {
    return h.response({ status: 'fail', message: error.message }).code(500);
  }
};

module.exports = { predictHandler };