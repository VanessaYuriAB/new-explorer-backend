const { celebrate, Joi } = require('celebrate');

const celebrateForPost = celebrate({
  body: Joi.object().keys({
    tag: Joi.string()
      .required()
      .pattern(/^[^<>]+$/), // regex para segurança básica, '<' e '>' não são permitidos
    title: Joi.string().required(),
    description: Joi.string().required(),
    publishedAt: Joi.date().required(),
    source: Joi.string().required(),
    url: Joi.string().uri().required(),
    urlToImage: Joi.string().uri().required(),
  }),
});

export default celebrateForPost;
