const { predictHandler } = require('../handlers/predictionHandler');

const predictionRoutes = [
  {
    method: 'POST',
    path: '/predict',
    options: {
      auth: 'jwt',
      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data',
        multipart: true
      }
    },
    handler: predictHandler
  }
];

module.exports = predictionRoutes;