// Cria um roteador para a rota principal
const router = require('express').Router();

const celebrateForSignup = require('../middlewares/celebrates/celebrateForSignup');
const celebrateForSignin = require('../middlewares/celebrates/celebrateForSignin');
const celebrateForAuth = require('../middlewares/celebrates/celebrateForAuth');

const handleAuth = require('../middlewares/authHandler');

const { getUser, createUser, loginUser } = require('../controllers/users');
const articlesRouter = require('./articles');

// Esse é o arquivo para todas as rotas do app

// ----------------
// Rotas públicas
// ----------------

// Registro: POST - '/signup' (não usa roteamento)
router.post('/signup', celebrateForSignup, createUser);

// Login: POST - '/signin' (não usa roteamento)
router.post('/signin', celebrateForSignin, loginUser);

// -------------------------
// Validação e autorização
// -------------------------

// Middleware de autorização com persistência do login
// Recupera e verifica tokens, bem como protege rotas de usuários não autorizados
// Se um token válido for apresentado, a solicitação continuará para o processamento
// adicional
// Caso contrário, a solicitação irá para um controlador que retornará uma mensagem de
// erro para o cliente
// Aplicado diretamente em cada rota privada para não interferir em rotas públicas
// quando usuários não estiverem autenticados

// -------------------------------------------
// Rotas privadas (protegidas pelo middleware
// 'authHandler' e seu celebrate)
// -------------------------------------------

// Usuário logado: GET - '/users/me' (não usa roteamento)
// Rota não usa Celebrate/Joi porque não recebe dados do cliente; utiliza apenas req.user,
// preenchido pelo middleware de autenticação
router.get('/users/me', celebrateForAuth, handleAuth, getUser);

// Roteamento para o prefixo '/articles'
router.use('/articles', celebrateForAuth, handleAuth, articlesRouter);

// Exporta o roteador para a rota principal, importado como 'routes'
module.exports = router;
