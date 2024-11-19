const Hapi = require('@hapi/hapi');
// const routes = require('./routes');

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    }
  });

  // server.routes(routes);

  // await server.start();
  console.log('Server running on %s', server.info.uri);
};

init();