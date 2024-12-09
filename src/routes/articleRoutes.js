const {
  addArticleHandler,
  editArticleHandler,
  getAllArticlesHandler,
  getArticleByIdHandler,
  deleteArticleHandler
} = require('../handlers/articleHandler');

const articleRoutes = [
  {
    method: 'POST',
    path: '/article',
    options: {
      auth: 'jwt'
    },
    handler: addArticleHandler
  },
  {
    method: 'PUT',
    path: '/article/edit/{id}',
    options: {
      auth: 'jwt'
    },
    handler: editArticleHandler
  },
  {
    method: 'GET',
    path: '/articles/all',
    handler: getAllArticlesHandler
  },
  {
    method: 'GET',
    path: '/article/{id}',
    handler: getArticleByIdHandler
  },
  {
    method: 'DELETE',
    path: '/article/delete/{id}',
    options: {
      auth: 'jwt'
    },
    handler: deleteArticleHandler
  }
];

module.exports = articleRoutes;