const tf = require('@tensorflow/tfjs-node');

class RandomFlip extends tf.layers.Layer {
  constructor(config) {
    super(config);
    this.mode = config.mode || 'horizontal';
  }

  call(inputs, kwargs) {
    return tf.tidy(() => {
      const input = inputs[0];
      if (this.mode === 'horizontal' || this.mode === 'horizontal_and_vertical') {
        const flipped = tf.image.flipLeftRight(input);
        return flipped;
      }
      if (this.mode === 'vertical' || this.mode === 'horizontal_and_vertical') {
        const flipped = tf.image.flipUpDown(input);
        return flipped;
      }
      return input;
    });
  }

  static get className() {
    return 'RandomFlip';
  }
}

tf.serialization.registerClass(RandomFlip);