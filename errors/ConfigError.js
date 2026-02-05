// Construtor de erro personalizado > Config (500)

// Erro de configuração de variáveis de ambiente no servidor

class ConfigError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
    this.name = 'ConfigError';
  }
}

module.exports = ConfigError;
