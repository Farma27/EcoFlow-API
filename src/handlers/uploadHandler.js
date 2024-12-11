const storage = require('../services/storage');
const { bucketName, MAX_FILE_SIZE } = require('../config');

const uploadImageHandler = async (request, h) => {
  try {
    const { user } = request.auth.credentials;
    if (!user) {
      return h.response({
        status: 'fail',
        message: 'Action unauthorized! Please login or register!'
      }).code(401);
    }

    const { image } = request.payload;

    if (!image) {
      return h.response({
        status: 'fail',
        message: 'No image file selected!'
      }).code(400);
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    const mimeType = image.hapi.headers['content-type'];

    if (!allowedMimeTypes.includes(mimeType)) {
      return h.response({
        status: 'fail',
        message: 'Invalid file type! Only JPEG, PNG, JPG, and GIF are allowed.'
      }).code(400);
    }

    if (image._data.length > MAX_FILE_SIZE) {
      return h.response({
        status: 'fail',
        message: 'File size too large! Maximum file size is 5 MB.'
      }).code(400);
    }

    const bucket = storage.bucket(bucketName);
    const fileName = `${Date.now()}-${image.hapi.filename}`;
    const file = bucket.file(fileName);

    const stream = file.createWriteStream({
      metadata: {
        contentType: mimeType
      }
    });

    return new Promise((resolve, reject) => {
      stream.on('error', (err) => {
        console.error('Error uploading file:', err);
        reject(h.response({
          status: 'fail',
          message: 'An error occurred while uploading the image!',
          error: err.message
        }).code(500));
      });

      stream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
        resolve(h.response({
          status: 'success',
          message: 'File uploaded successfully.',
          data: {
            fileName,
            url: publicUrl
          }
        }).code(200));
      });

      image.pipe(stream);
    });
  } catch (error) {
    console.error('Error:', error);
    return h.response({
      status: 'fail',
      message: 'An error occurred while uploading the image!',
      error: error.message
    }).code(500);
  }
};

module.exports = { uploadImageHandler };