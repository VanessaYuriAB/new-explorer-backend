// Esse arquivo é o controlador de usuários

const bcrypt = require('bcryptjs');
const User = require('../models/user');
const ConflictError = require('../errors/ConflictError');
const handleAsync = require('../utils/ControllersAsyncHandler');

// O manipulador de solicitação getUser
// Retorna informações sobre o usuário logado (e-mail e nome)
const getUser = async () => {};

// O manipulador de solicitação createUser
// Cria um usuário com o e-mail, senha e nome passados no corpo
const createUser = async (req, res) => {
  // const { email, password, name } = req.body;

  // Verificação de duplicidade de cadastro
  const isEmailDuplicate = await User.findOne({ email: req.body.email });

  if (isEmailDuplicate !== null) {
    throw new ConflictError('Usuário já cadastrado');
  }

  // Codificação de senha em hash
  const hash = await bcrypt.hash(req.body.password, 10);

  const user = await User.create({
    email: req.body.email,
    password: hash, // adiciona se senha em hash ao banco de dado
    name: req.body.name,
  });

  return res.status(201).send({ user });
};

// O manipulador de solicitação loginUser
// Verifica o e-mail e a senha passados no corpo e retorna um JWT
const loginUser = async () => {};

// Exporta envolto na função wrapper utilitária para o fluxo de tratamento de erros
// Envia o erro para o middleware de tratamento centralizado
export default {
  getUser: handleAsync(getUser),
  createUser: handleAsync(createUser),
  loginUser: handleAsync(loginUser),
};
