const { Storage } = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');

const storage = new Storage({
  projectId: 'ecoflow-442316',
  keyFilename: path.resolve(__dirname, '../../config/ecoflow.json')
});

const bucketName = 'ecoflow-uploaded-image';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const uploadImageHandler = async (request, h) => {
  const { image } = request.payload;

  if (!image) {
    return h.response({
      status: 'fail',
      message: 'Tidak ada file gambar yang dipilih!'
    }).code(400);
  }

  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
  const mimeType = image.hapi.headers['content-type'];

  if (!allowedMimeTypes.includes(mimeType)) {
    return h.response({
      status: 'fail',
      message: 'Jenis file tidak valid! Hanya JPEG, PNG, dan GIF yang diperbolehkan.'
    }).code(400);
  }

  if (image._data.length > MAX_FILE_SIZE) {
    return h.response({
      status: 'fail',
      message: 'Ukuran file terlalu besar! Maksimal ukuran file adalah 5 MB.'
    }).code(400);
  }

  const filePath = path.join(__dirname, '../temp', image.hapi.filename);
  const fileStream = fs.createWriteStream(filePath);

  return new Promise((resolve, reject) => {
    image.pipe(fileStream);

    fileStream.on('error', (err) => {
      reject(h.response({
        status: 'fail',
        message: 'Gagal menyimpan gambar secara lokal!',
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
          message: 'Gambar berhasil diunggah!',
          data: {
            filename: image.hapi.filename,
            url: `https://storage.googleapis.com/${bucketName}/images/${image.hapi.filename}`
          }
        }).code(200));
      } catch (error) {
        reject(h.response({
          status: 'fail',
          message: 'Gagal mengunggah gambar!',
          error: error.message
        }).code(500));
      }
    });
  });
};

module.exports = { uploadImageHandler };