require('dotenv').config();

module.exports = {
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  bucketName: 'ecoflow-uploaded-image',
  MAX_FILE_SIZE: 5 * 1024 * 1024 // 5 MB
};