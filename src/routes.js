const { registerHandler, getAllUsers, loginHandler, updateUserHandler, deleteUserHandler } = require('./handler/userHandler');

const routes = [
  {
    method: 'POST',
    path: '/register',
    options: {
      auth: false
    },
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
    options: {
      auth: false
    },
    handler: loginHandler
  },
  {
    method: 'PUT',
    path: '/users/{id}',
    handler: updateUserHandler
  },
  {
    method: 'DELETE',
    path: '/users/{id}',
    handler: deleteUserHandler
  },
];

module.exports = routes;