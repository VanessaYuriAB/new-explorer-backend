const rateLimit = require('express-rate-limit');
const RateLimitError = require('../errors/RateLimitError');

// Limita o número de solicitações de um endereço IP por vez

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // em 15 minutos
  max: process.env.RATE_LIMIT_MAX, // permite, no máximo, a qtdd de solicitações
  // especificadas, a partir de um IP
  handler: (req, res, next) => {
    next(
      new RateLimitError(
        'Muitas solicitações recebidas, tente novamente mais tarde.',
      ),
    );
  }, // sobrescreve o erro padrão do rate-limit e envia ao tratamento central, para
  // incluir o campo name (para o front-end)
});

module.exports = limiter;
