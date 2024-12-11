const tf = require('@tensorflow/tfjs-node');

class RandomZoom extends tf.layers.Layer {
  constructor(config) {
    super(config);
    this.heightFactor = config.heightFactor || 0.1;
    this.widthFactor = config.widthFactor || 0.1;
  }

  call(inputs, kwargs) {
    return tf.tidy(() => {
      const input = inputs[0];
      const [batch, height, width, channels] = input.shape;
      const zoomHeight = height * (1 + tf.randomUniform([], -this.heightFactor, this.heightFactor));
      const zoomWidth = width * (1 + tf.randomUniform([], -this.widthFactor, this.widthFactor));
      const resized = tf.image.resizeBilinear(input, [zoomHeight, zoomWidth]);
      return tf.image.resizeBilinear(resized, [height, width]);
    });
  }

  static get className() {
    return 'RandomZoom';
  }
}

tf.serialization.registerClass(RandomZoom);