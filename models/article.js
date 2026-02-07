const mongoose = require('mongoose');
const validator = require('validator');

// Cria o esquema para artigos (cards)
const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
    match: /^[^<>]+$/, // regex para segurança básica, '<' e '>' não são permitidos
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: (props) => `${props.value} não é um link válido!`,
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        return validator.isURL(v);
      },
      message: (props) => {
        return `${props.value} não é um link válido!`;
      },
    },
  },
  owner: {
    type: [mongoose.Schema.Types.ObjectId], // _id é gerado pelo próprio Mongo DB, ao
    // salvar um usuário - [] pq pode ser mais de um
    ref: 'user',
    default: [],
    select: false, // o banco de dados não devolve esse campo por padrão
  },
});

// Cria o modelo a partir do esquema e exporta-o
module.exports = mongoose.model('article', articleSchema);
