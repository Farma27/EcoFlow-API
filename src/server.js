require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');

const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const { JWT_SECRET_KEY } = require('./config');

const init = async () => {
  const server = Hapi.server({
    port: 8080,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    }
  });

  await server.register([Jwt, Inert]);

  server.auth.strategy('jwt', 'jwt', {
    keys: JWT_SECRET_KEY, 
    verify: {
      aud: false,
      iss: false,
      sub: false,
      nbf: true,
      exp: true,
      maxAgeSec: 3600, // 1 hour
      timeSkewSec: 15
    },
    validate: (artifacts, request, h) => {
      return {
        isValid: true,
        credentials: { user: artifacts.decoded.payload }
      };
    }
  });

  server.auth.default('jwt');

  // Centralized error handling
  server.ext('onPreResponse', (request, h) => {
    const response = request.response;
    if (response.isBoom) {
      const error = response;
      const statusCode = error.output.statusCode;
      const errorMessage = error.message;

      // Log the error
      console.error(`Error: ${errorMessage}, Status Code: ${statusCode}`);

      // Customize error response
      return h.response({
        status: 'fail',
        message: errorMessage,
        error: error.data || null
      }).code(statusCode);
    }
    return h.continue;
  });

  server.route([...userRoutes, ...uploadRoutes]);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init();