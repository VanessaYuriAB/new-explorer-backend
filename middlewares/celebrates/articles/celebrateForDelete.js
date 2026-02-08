const { celebrate, Joi } = require('celebrate');

const celebrateForDelete = celebrate({
  params: Joi.object().keys({
    // A rota define o parâmetro como articleId, por isso é assim que deve ser validado
    // aqui > No MongoDB, a chave é _id para cd obj de card, e em req.params é tratado
    // como _id
    // .hex() - IDs do MongoDB são hexadecimais: garante que só contenham caracteres
    // válidos (0-9, a-f)
    // .length(): um ObjectId sempre tem 24 caracteres
    articleId: Joi.string().required().hex().length(24),
  }),
});

export default celebrateForDelete;
