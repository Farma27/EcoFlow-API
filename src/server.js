require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const RateLimit = require('hapi-rate-limit');

const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const articleRoutes = require('./routes/articleRoutes');
const rootRoutes = require('./routes/rootRoutes');
const { JWT_SECRET_KEY, rateLimit } = require('./config');

const init = async () => {
  const server = Hapi.server({
    port: 8000,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    }
  });

  await server.register([
    Jwt,
    Inert,
    {
      plugin: RateLimit,
      options: rateLimit
    }
  ]);

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
      if (!artifacts.decoded.payload.user) {
        return { isValid: false };
      }
      return {
        isValid: true,
        credentials: { user: artifacts.decoded.payload.user }
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
        message: errorMessage === 'Invalid token structure' ? 'Action unauthorized! Please login or register!' : errorMessage,
        error: error.data || null
      }).code(statusCode);
    }
    return h.continue;
  });

  server.route([...rootRoutes, ...userRoutes, ...uploadRoutes, ...articleRoutes]);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init();