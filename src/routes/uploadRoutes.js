const { uploadImageHandler } = require('../handlers/uploadHandler');

const uploadRoutes = [
  {
    method: 'POST',
    path: '/upload',
    options: {
      auth: 'jwt',
      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data',
        multipart: true
      }
    },
    handler: uploadImageHandler
  }
];

module.exports = uploadRoutes;