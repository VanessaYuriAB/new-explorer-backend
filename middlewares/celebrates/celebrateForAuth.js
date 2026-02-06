const { celebrate, Joi } = require('celebrate');

const celebrateForAuth = celebrate({
  headers: Joi.object()
    .keys({
      authorization: Joi.string()
        .required()
        .pattern(/^Bearer\s[\w-]+\.[\w-]+\.[\w-]+$/), // regex para formato JWT
    })
    // Permite campos que não estão listados no objeto de validação (outros headers não
    // presentes aqui)
    .unknown(true),
});

export default celebrateForAuth;
