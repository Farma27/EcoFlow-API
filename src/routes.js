const {
  registerHandler,
  getAllUsers,
  loginHandler,
  logoutHandler,
  updateUserHandler,
  deleteUserHandler
} = require('./handler/userHandler');
const { uploadImageHandler } = require('./handler/uploadHandler.js');

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
    method: 'POST',
    path: '/logout',
    handler: logoutHandler
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
  {
    method: 'POST',
    path: '/upload',
    options: {
      auth: false,
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

module.exports = routes;