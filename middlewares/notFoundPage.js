// Para rotas não encontradas: erro 404

const notFoundPage = (req, res) => {
  res.status(404).send({
    message: 'A página não foi encontrada, é um endereço inexistente.',
  });
};

module.exports = notFoundPage;
