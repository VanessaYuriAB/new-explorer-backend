const rateLimit = require('express-rate-limit');

// Limita o número de solicitações de um endereço IP por vez

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // em 15 minutos
  max: process.env.RATE_LIMIT_MAX, // permite, no máximo, a qtdd de solicitações
  // especificadas, a partir de um IP
});

module.exports = limiter;
