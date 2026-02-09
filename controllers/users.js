// Esse arquivo é o controlador de usuários

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const handleAsync = require('../utils/ControllersAsyncHandler');

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
    password: hash, // adiciona senha em hash ao banco de dados
    name: req.body.name,
  });

  return res.status(201).send({ user });
};

// O manipulador de solicitação loginUser
// Verifica o e-mail e a senha passados no corpo e retorna um JWT
const loginUser = async (req, res) => {
  // const { email, password } = req.body;

  // Verifica dados do usuário com método do mongoose personalizado definido no schema
  const isUserInDB = await User.findUserByCredentials(
    req.body.email,
    req.body.password,
  );

  // Verificação da variável de ambiente JWT_SECRET para a chave secreta do método .sign()
  // é feita no início de server.js, logo após carregar o dotenv

  // Se ok, gera o token (JWT) para manter usuários logados após autenticação
  // O token expirará em sete dias
  const token = jwt.sign({ _id: isUserInDB._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  // Retorna o token (JWT)
  res.send({ token });
};

// O manipulador de solicitação getUser
// Retorna informações sobre o usuário logado (e-mail e nome)
const getUser = async (req, res) => {
  // const { _id } = req.user;

  // Sem verificação pois a rota só é chamada, caso esteja logado
  // O middleware de autenticação já garante que req.user exista, incluindo o campo _id

  const user = await User.findById(req.user._id).orFail(() => {
    throw new NotFoundError('Cadastro de usuário não encontrado');
  });

  res.send({ user });
};

// Exporta envolto na função wrapper utilitária para o fluxo de tratamento de erros
// Envia o erro para o middleware de tratamento centralizado
module.exports = {
  createUser: handleAsync(createUser),
  loginUser: handleAsync(loginUser),
  getUser: handleAsync(getUser),
};
