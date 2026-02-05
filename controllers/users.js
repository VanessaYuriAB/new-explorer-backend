// Esse arquivo é o controlador de usuários

const handleAsync = require('../utils/ControllersAsyncHandler');

// O manipulador de solicitação getUser
// Retorna informações sobre o usuário logado (e-mail e nome)
const getUser = async () => {};

// O manipulador de solicitação createUser
// Cria um usuário com o e-mail, senha e nome passados no corpo
const createUser = async () => {};

// O manipulador de solicitação loginUser
// Verifica o e-mail e a senha passados no corpo e retorna um JWT
const loginUser = async () => {};

export default {
  getUser: handleAsync(getUser),
  createUser: handleAsync(createUser),
  loginUser: handleAsync(loginUser),
};
