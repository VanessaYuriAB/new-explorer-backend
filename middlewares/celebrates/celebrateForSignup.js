const { celebrate, Joi } = require('celebrate');

const celebrateForSignup = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string()
      .required()
      .min(8)
      .pattern(/^[^<>]+$/), // regex para segurança básica, '<' e '>' não são permitidos
    name: Joi.string()
      .required()
      .min(2)
      .max(30)
      .pattern(/^[^<>]+$/), // regex para segurança básica, '<' e '>' não são permitidos
  }),
});

export default celebrateForSignup;
