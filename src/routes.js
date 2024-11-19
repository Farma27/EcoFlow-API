const { registerHandler, getAllUsers, loginHandler } = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/register',
    handler: registerHandler
  },
  {
    method: 'GET',
    path: '/users',
    handler: getAllUsers
  },
  {
    method: 'POST',
    path: '/login',
    handler: loginHandler
  },
];

module.exports = routes;