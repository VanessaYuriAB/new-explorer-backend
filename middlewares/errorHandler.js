const handleError = (err, req, res, next) => {
  // Verifica erros específicos do Mongoose (CastError e ValidationError) e retorna 400
  // (Bad Request)

  // Quando o Mongoose não consegue converter um valor para o tipo esperado no schema
  if (err.name === 'CastError') {
    return res.status(400).send({ message: '_id inválido ou incompleto' });
  }

  // Quando os dados enviados não atendem às regras definidas no schema do Mongoose
  if (err.name === 'ValidationError') {
    return res
      .status(400)
      .send({ message: 'Dado(s) inválido(s) ou inexistente(s)' });
  }

  // Verifica erro de configuração em ambiente de produção
  // Como o status HTTP é, tbm, 500, como o InternalServer, é feita a verificação por
  // err.name

  // Quando variáveis de ambiente não são configuradas no ambiente de produção
  if (err.name === 'ConfigError') {
    return res
      .status(500)
      .send({ message: `Erro de configuração do servidor: ${err.message}` });
  }

  // Para erros definidos pelas classes personalizadas: unauthorized, forbidden, not found,
  // conflict e ratelimit
  // Se não tiver statusCode definido, assume 500: erro do servidor, com status e mensagem
  // padrões definidos
  const { statusCode = 500, message = 'Ocorreu um erro no servidor' } = err;

  return res.status(statusCode).send({ message });
};

module.exports = handleError;
