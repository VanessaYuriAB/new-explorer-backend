// Esse arquivo é o controlador de artigos

const Articles = require('../models/article');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const handleAsync = require('../utils/asyncHandlerControllers');

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

  const sourceName = source ? source.name : null; // caso source 'inteiro' seja null, pq
  // o campo é um obj na News Api

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
    source: sourceName,
    link: url,
    image: urlToImage,
    owner: [req.user._id],
  });

  return res.status(201).send(savedArticle);
};

// O manipulador de solicitação deleteUserArticles
// Exclui o artigo armazenado pelo _id
const deleteUserArticles = async (req, res) => {
  // Como definido na rota '/:articleId'
  // const { articleId } = req.params;

  const articleToUnsave = await Articles.findById(req.params.articleId)
    .select('+owner') // para o campo retornar neste find
    .orFail(() => {
      throw new NotFoundError('Cadastro de artigo não encontrado');
    });

  // Verifica se o usuário atual é um salvador do artigo atual para poder prosseguir os
  // próximos passos do controlador
  if (!articleToUnsave.owner.includes(req.user._id)) {
    throw new ForbiddenError(
      'Você não pode des-salvar um artigo que não está salvo por você.',
    );
  }

  // Se o artigo estiver salvo por apenas um usuário, no caso o usuário atual (verificado
  // anteriormente), deleta o recurso todo
  if (articleToUnsave.owner.length === 1) {
    // Deleta o artigo da coleção
    const deletedArticle = await Articles.findByIdAndDelete(
      req.params.articleId,
    );

    return res.send({ deletedArticle });
  }

  // Se houver mais de um salvamento, apenas atualiza o array de id de usuários
  const unsavedArticle = await Articles.findByIdAndUpdate(
    req.params.articleId,
    // Remove o _id do usuário do array owner
    { $pull: { owner: req.user._id } },
    { new: true, runValidators: true },
  );
  return res.send({ unsavedArticle });
};

module.exports = {
  getUserArticles: handleAsync(getUserArticles),
  postUserArticles: handleAsync(postUserArticles),
  deleteUserArticles: handleAsync(deleteUserArticles),
};
