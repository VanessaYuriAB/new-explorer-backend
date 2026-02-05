// Esse arquivo é o controlador de artigos

const handleAsync = require('../utils/ControllersAsyncHandler');

// O manipulador de solicitação getUserArticles
const getUserArticles = async () => {};

// O manipulador de solicitação postUserArticles
const postUserArticles = async () => {};

// O manipulador de solicitação deleteUserArticles
const deleteUserArticles = async () => {};

module.exports = {
  getUserArticles: handleAsync(getUserArticles),
  postUserArticles: handleAsync(postUserArticles),
  deleteUserArticles: handleAsync(deleteUserArticles),
};
