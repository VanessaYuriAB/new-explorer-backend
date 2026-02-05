// Construtor de erro personalizado > Not Found (404)

// Documento não encontrado (DocumentNotFoundError): o Mongoose não localiza o recurso
// solicitado, operações que usam .orFail()

// orFail lança: Não encontrado

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;
