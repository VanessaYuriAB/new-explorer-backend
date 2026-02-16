// Esse é o arquivo de rotas para artigos

// Cria um roteador ('/articles')
const articlesRouter = require('express').Router();

const {
  getUserArticles,
  postUserArticles,
  deleteUserArticles,
} = require('../controllers/articles');

const celebrateForPost = require('../middlewares/celebrates/articles/celebrateForPost');
const celebrateForDelete = require('../middlewares/celebrates/articles/celebrateForDelete');

// GET - '/articles'
// Retorna todos os artigos salvos pelo usuário
// Rota não usa Celebrate/Joi porque não recebe dados do cliente; utiliza apenas req.user,
// preenchido pelo middleware de autenticação
articlesRouter.get('/', getUserArticles);

// POST - '/articles'
// Cria um artigo com a palavra-chave, título, texto, data, fonte, link, e imagem
// passados no corpo
articlesRouter.post('/', celebrateForPost, postUserArticles);

// DELETE - '/articles/articleId'
// Exclui o artigo armazenado pelo _id
articlesRouter.delete('/:articleId', celebrateForDelete, deleteUserArticles);

module.exports = articlesRouter;
