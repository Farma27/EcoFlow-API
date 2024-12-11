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

    const model1 = await loadModel(1);
    const model2 = await loadModel(2);

    const imageBuffer = file._data;
    const imageTensor = tf.node.decodeImage(imageBuffer, 3).toFloat().div(tf.scalar(255)).expandDims();
    const resizedImageTensor = tf.image.resizeBilinear(imageTensor, [244, 244]);

    // Ensure the tensor has the correct shape [batch_size, height, width, channels]
    const inputTensor = resizedImageTensor.reshape([1, 244, 244, 3]);

    // Perform predictions
    const predictions1 = model1.predict(inputTensor);
    const predictions2 = model2.predict(inputTensor);

    const predictedClassIndex1 = predictions1.argMax(-1).dataSync()[0];
    const predictedClassIndex2 = predictions2.argMax(-1).dataSync()[0];

    const predictedClassLabel1 = classLabels[predictedClassIndex1];
    const predictedClassLabel2 = classLabels[predictedClassIndex2];

    return h.response({
      status: 'success',
      predictions: [
        { model: 1, predictedClass: predictedClassLabel1 },
        { model: 2, predictedClass: predictedClassLabel2 }
      ]
    }).code(200);
  } catch (error) {
    return h.response({ status: 'fail', message: error.message }).code(500);
  }
};

module.exports = { predictHandler };