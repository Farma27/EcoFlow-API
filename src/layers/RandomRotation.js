const tf = require('@tensorflow/tfjs-node');

class RandomRotation extends tf.layers.Layer {
  constructor(config) {
    super(config);
    this.factor = config.factor || 0.2;
  }

  call(inputs, kwargs) {
    return tf.tidy(() => {
      const input = inputs[0];
      const angle = tf.randomUniform([], -this.factor, this.factor).mul(Math.PI);
      return this.rotate(input, angle);
    });
  }

  rotate(image, angle) {
    const [batch, height, width, channels] = image.shape;
    const radian = angle.dataSync()[0];
    const cosVal = Math.cos(radian);
    const sinVal = Math.sin(radian);

    const transformMatrix = [
      cosVal, -sinVal, 0,
      sinVal, cosVal, 0,
      0, 0
    ];

    const transformTensor = tf.tensor2d(transformMatrix, [1, 8]);
    return this.applyTransform(image, transformTensor);
  }

  applyTransform(image, transform) {
    const [batch, height, width, channels] = image.shape;
    const grid = this.createGrid(height, width);
    const transformedGrid = this.transformGrid(grid, transform);
    return this.sampleImage(image, transformedGrid);
  }

  createGrid(height, width) {
    const x = tf.linspace(-1, 1, width);
    const y = tf.linspace(-1, 1, height);
    const [gridX, gridY] = tf.meshgrid(x, y);
    return tf.stack([gridX, gridY], -1).reshape([height * width, 2]);
  }

  transformGrid(grid, transform) {
    const ones = tf.ones([grid.shape[0], 1]);
    const homogenousGrid = tf.concat([grid, ones], 1);
    return tf.matMul(homogenousGrid, transform.transpose()).slice([0, 0], [-1, 2]);
  }

  sampleImage(image, grid) {
    const [batch, height, width, channels] = image.shape;
    const x = grid.slice([0, 0], [-1, 1]).reshape([height, width]);
    const y = grid.slice([0, 1], [-1, 1]).reshape([height, width]);
    return tf.image.resample(image, x, y, 'bilinear');
  }

  static get className() {
    return 'RandomRotation';
  }
}

tf.serialization.registerClass(RandomRotation);