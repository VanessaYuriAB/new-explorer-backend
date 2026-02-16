const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { msgOfErrorUnauthorizedToken } = require('../utils/errorsMsgs');

const handleAuth = (req, res, next) => {
  // Primeiro, obtenção do cabeçalho com o token de autorização
  const { authorization } = req.headers;

  // Verificação do cabeçalho é feita pelo Celebrate + joi, antes de chegar aqui

  // Extrai token de authorization com o método replace(), removendo o prefixo 'Bearer '
  // e mantendo apenas o JWT
  const token = authorization.replace('Bearer ', '');

  // Verificação da variával de ambiente JWT_SECRET é feita no início de server.js,
  // logo após carregar o dotenv

  // Se o token e a chave secreta forem válidos, o método jwt.verify() retornará o payload
  // decodificado desse token
  // Se algo der errado com o token, um erro será retornado
  // Para isso, é usado um bloco try/catch, declarando payload em let, para ser implementado
  // fora do bloco, definindo req.user, atribuindo o valor do payload decodificado (_id)

  // Verifica o token
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new UnauthorizedError(`${msgOfErrorUnauthorizedToken}`);
  }

  // Adiciona o payload à propriedade req.user, garantindo que próximos middlewares possam
  // saber para quem a solicitação está sendo executada
  req.user = payload;

  // Autoriza acesso à próximos middlewares
  next();
};

module.exports = handleAuth;
