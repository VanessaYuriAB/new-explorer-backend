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
// Cria um artigo com a palavra-chave, título, texto, data, fonte, link, e imagem
// passados no corpo
const postUserArticles = async (req, res) => {
  const { tag, title, description, publishedAt, source, url, urlToImage } =
    req.body;

  // Verifica se o artigo já existe na coleção de artigos, procurando pelo link do artigo
  // Se sim, apenas adiciona o id do usuário atual ao owner
  const isAlreadySaved = await Articles.findOneAndUpdate(
    { link: url },
    // Adiciona o _id do usuário ao array
    { $addToSet: { owner: req.user._id } },
    { new: true, runValidators: true },
  );

  if (isAlreadySaved) {
    return res.send(isAlreadySaved);
  }

  // Se não, adiciona o novo artigo à coleção com o id do usuário atual em owner
  const savedArticle = await Articles.create({
    keyword: tag,
    title,
    text: description,
    date: publishedAt,
    source,
    link: url,
    image: urlToImage,
    owner: [req.user._id],
  });

  return res.status(201).send(savedArticle);
};

// O manipulador de solicitação deleteUserArticles
const deleteUserArticles = async () => {};

module.exports = {
  getUserArticles: handleAsync(getUserArticles),
  postUserArticles: handleAsync(postUserArticles),
  deleteUserArticles: handleAsync(deleteUserArticles),
};
