// Esse arquivo é o controlador de artigos

const Articles = require('../models/article');
const handleAsync = require('../utils/ControllersAsyncHandler');

// O manipulador de solicitação getUserArticles
// Retorna todos os artigos salvos pelo usuário
const getUserArticles = async (req, res) => {
  // Busca no banco todos os artigos cujo campo 'owner' contém o ID do usuário
  // Como 'owner' é um array de ObjectIds, o MongoDB retorna qualquer documento
  // cujo array contenha req.user._id
  const userArticles = await Articles.find({ owner: req.user._id });

  // .find() nunca retorna null; se não houver resultados, retorna sempre um array vazio []
  // No front-end:
  // - Se houver artigos: o array contém objetos
  // - Se não houver artigos: o array vem vazio e o front exibe a mensagem adequada
  // com base no estado 'savedNewsUser', que condiciona a renderização do
  // componente SavedNewsCardList

  // .orFail() geraria erro quando o array viesse vazio — comportamento não desejado

  res.send({ userArticles });
};

// O manipulador de solicitação postUserArticles
const postUserArticles = async () => {};

// O manipulador de solicitação deleteUserArticles
const deleteUserArticles = async () => {};

module.exports = {
  getUserArticles: handleAsync(getUserArticles),
  postUserArticles: handleAsync(postUserArticles),
  deleteUserArticles: handleAsync(deleteUserArticles),
};
