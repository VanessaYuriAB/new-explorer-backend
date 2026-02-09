const { celebrate, Joi } = require('celebrate');

const celebrateForPost = celebrate({
  body: Joi.object().keys({
    // Celebrate é configurado de acordo com as propriedades do obj que são definidas no
    // front-end e não no schema do backend
    tag: Joi.string()
      .required()
      .pattern(/^[^<>]+$/), // regex para segurança básica, '<' e '>' não são permitidos
    title: Joi.string().allow(null).optional(),
    description: Joi.string().allow(null).optional(),
    publishedAt: Joi.date().allow(null).optional(),
    source: Joi.string().allow(null).optional(),
    url: Joi.string().uri().required(),
    urlToImage: Joi.string().uri().allow(null).optional(),
  }),
});

module.exports = celebrateForPost;
