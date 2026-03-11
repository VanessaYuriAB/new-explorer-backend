// Esse arquivo é o controlador de artigos

const Articles = require('../models/article');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const {
  msgOfErrorNotFoundArticle,
  msgOfErrorForbidden,
} = require('../utils/errorsMsgs');
const handleAsync = require('../utils/asyncHandlerControllers');

// O manipulador de solicitação getUserArticles
// Retorna todos os artigos salvos pelo usuário
const getUserArticles = async (req, res) => {
  // Busca, no banco, todos os artigos cujo campo 'owner' contém o ID do usuário
  // Como 'owner' é um array de ObjectIds, o MongoDB retorna qualquer documento
  // cujo array contenha req.user._id - porém, campo owner não retorna na resposta, está
  // como select: false no schema
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
// Exclui o artigo armazenado pelo _id
const deleteUserArticles = async (req, res) => {
  // Como definido na rota '/:articleId'
  // const { articleId } = req.params;

  const articleToUnsave = await Articles.findById(req.params.articleId)
    .select('+owner') // para o campo retornar neste find
    .orFail(() => {
      throw new NotFoundError(`${msgOfErrorNotFoundArticle}`);
    });

  // Verifica se o usuário atual é um salvador do artigo atual para poder prosseguir os
  // próximos passos do controlador

  // articleToUnsave.owner é um array de ObjectId (Mongoose) e req.user._id é string,
  // portanto podemos converter a lista de owner para string, com
  // 'const isOwner = articleToUnsave.owner.some((id) => String(id) === userId);' ou
  // utilizar o método '.equals()' pq ObjectId.equals() aceita string e compara pelo
  // valor do id

  // O método .equals() é da classe ObjectId do MongoDB, exposta no Node.js via driver
  // oficial do MongoDB e Mongoose
  // No caso, ele vem de mongoose.Types.ObjectId ou, internamente, do ObjectId retornado
  // pelo Mongoose quando lê um documento
  // Pode ser usado sem importar nada porque articleToUnsave.owner já contém instâncias
  // de ObjectId, então cada id dentro do array já tem o método .equals() disponível

  // id.equals(req.user._id) funciona mesmo quando req.user._id é string pq compara o
  // valor do ObjectId, não a referência do objeto - então, isso funciona:
  // 'ObjectId('abc').equals('abc') // true' e isso tbm:
  // 'ObjectId('abc').equals(ObjectId('abc')) // true'
  // Enquanto não funciona com os métodos '===' ou 'includes'

  const isOwner = articleToUnsave.owner.some((id) => {
    return id.equals(req.user._id);
  });

  if (!isOwner) {
    throw new ForbiddenError(`${msgOfErrorForbidden}`);
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
    { $pull: { owner: req.user._id } }, // mongoose faz casting da string, mas pode ser
    // padronizado na autenticação, com: req.user._id = new mongoose.Types.ObjectId
    // (payload._id);
    { new: true, runValidators: true },
  );
  return res.send({ unsavedArticle });
};

module.exports = {
  getUserArticles: handleAsync(getUserArticles),
  postUserArticles: handleAsync(postUserArticles),
  deleteUserArticles: handleAsync(deleteUserArticles),
};
