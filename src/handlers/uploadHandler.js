const { Storage } = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');
const { bucketName, MAX_FILE_SIZE } = require('../config');

const storage = new Storage();

const uploadImageHandler = async (request, h) => {
  try {
    const { image } = request.payload;

    if (!image) {
      return h.response({
        status: 'fail',
        message: 'No image file selected!'
      }).code(400);
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const mimeType = image.hapi.headers['content-type'];

    if (!allowedMimeTypes.includes(mimeType)) {
      return h.response({
        status: 'fail',
        message: 'Invalid file type! Only JPEG, PNG, and GIF are allowed.'
      }).code(400);
    }

    if (image._data.length > MAX_FILE_SIZE) {
      return h.response({
        status: 'fail',
        message: 'File size too large! Maximum file size is 5 MB.'
      }).code(400);
    }

    const filePath = path.join(__dirname, '../temp', image.hapi.filename);
    const fileStream = fs.createWriteStream(filePath);

    return new Promise((resolve, reject) => {
      image.pipe(fileStream);

      fileStream.on('error', (err) => {
        reject(h.response({
          status: 'fail',
          message: 'Failed to save image locally!',
          error: err.message
        }).code(500));
      });

      fileStream.on('finish', async () => {
        try {
          await storage.bucket(bucketName).upload(filePath, {
            destination: `images/${image.hapi.filename}`,
            metadata: {
              contentType: mimeType
            }
          });

          fs.unlinkSync(filePath);

          resolve(h.response({
            status: 'success',
            message: 'Image uploaded successfully!',
            data: {
              filename: image.hapi.filename,
              url: `https://storage.googleapis.com/${bucketName}/images/${image.hapi.filename}`
            }
          }).code(200));
        } catch (error) {
          reject(h.response({
            status: 'fail',
            message: 'Failed to upload image!',
            error: error.message
          }).code(500));
        }
      });
    });
  } catch (error) {
    return h.response({
      status: 'fail',
      message: 'An error occurred while uploading the image!',
      error: error.message
    }).code(500);
  }
};

module.exports = { uploadImageHandler };