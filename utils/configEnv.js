const crypto = require('crypto');
const ConfigError = require('../errors/ConfigError');

const configEnv = () => {
  // Define fallbacks para variáveis em ambiente de desenvolvimento
  // Para app rodar mesmo sem arquivo .env
  if (process.env.NODE_ENV === 'development') {
    process.env.PORT = process.env.PORT || 3001;
    process.env.MONGODB_URI =
      process.env.MONGODB_URI || 'mongodb://localhost:27017';
    process.env.DB_NAME = process.env.DB_NAME || 'newsexplorerdb';
    process.env.CORS_ORIGIN =
      process.env.CORS_ORIGIN || 'http://localhost:3000';
    process.env.JWT_SECRET =
      process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
    process.env.CSP_CONNECT_SRC =
      process.env.CSP_CONNECT_SRC ||
      'http://localhost:3001,https://newsapi.org';
    process.env.RATE_LIMIT_MAX = process.env.RATE_LIMIT_MAX || 1000;
  }

  // Verifica variáveis em ambiente de produção
  if (process.env.NODE_ENV === 'production') {
    const requiredEnvVars = [
      'CORS_ORIGIN',
      'MONGODB_URI',
      'DB_NAME',
      'PORT',
      'JWT_SECRET',
      'CSP_CONNECT_SRC',
      'RATE_LIMIT_MAX',
    ];

    requiredEnvVars.forEach((varName) => {
      if (!process.env[varName]) {
        throw new ConfigError(`${varName} é obrigatório em produção!`);
      }
    });
  }
};

module.exports = configEnv;
