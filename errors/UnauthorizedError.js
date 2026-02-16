// Construtor de erro personalizado > Unauthorized (401)

// Erro de autorização

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.name = 'Unauthorized';
  }
}

module.exports = UnauthorizedError;
