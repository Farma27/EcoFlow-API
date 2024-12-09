const {
  registerHandler,
  getAllUsers,
  loginHandler,
  logoutHandler,
  updateUserHandler,
  deleteUserHandler,
  getUserByIdHandler
} = require('../handlers/userHandler');

const userRoutes = [
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
    path: '/users/all',
    options: {
      auth: 'jwt'
    },
    handler: getAllUsers
  },
  {
    method: 'GET',
    path: '/user/{id}',
    options: {
      auth: 'jwt'
    },
    handler: getUserByIdHandler
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
    options: {
      auth: 'jwt'
    },
    handler: logoutHandler
  },
  {
    method: 'PUT',
    path: '/user/edit/{id}',
    options: {
      auth: 'jwt'
    },
    handler: updateUserHandler
  },
  {
    method: 'DELETE',
    path: '/user/delete/{id}',
    options: {
      auth: 'jwt'
    },
    handler: deleteUserHandler
  }
];

module.exports = userRoutes;