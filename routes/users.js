// Esse é o arquivo de rotas para usuários

// Cria um roteador ('/users')
const usersRouter = require('express').Router();

const getUser = require('../controllers/users');

// GET - /users/me
// Retorna informações sobre o usuário logado (e-mail e nome)
usersRouter.get('/me', getUser);

export default usersRouter;
