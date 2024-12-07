const {
  registerHandler,
  getAllUsers,
  loginHandler,
  logoutHandler,
  updateUserHandler,
  deleteUserHandler
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
  }
];

module.exports = userRoutes;