const mongoose = require('mongoose');
const validator = require('validator');

// Cria o esquema para usuário
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: (props) => `${props.value} não é um email válido!`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // o banco de dados não devolve esse campo (hash de senha) por padrão
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    match: /^[^<>]+$/, // regex para segurança básica, '<' e '>' não são permitidos
  },
});

// Cria o modelo a partir do esquema e exporta-o
module.exports = mongoose.model('user', userSchema);
