const { celebrate, Joi } = require('celebrate');

const celebrateForSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string()
      .required()
      .min(8)
      .pattern(/^[^<>]+$/), // regex para segurança básica, '<' e '>' não são permitidos
  }),
});

module.exports = celebrateForSignin;
