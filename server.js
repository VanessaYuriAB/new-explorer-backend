const express = require('express');

const mongoose = require('mongoose');

const usersRouter = require('./routes/users');
const articlesRouter = require('./routes/articles');

// Pacote dotenv só lê .env., mas é possível especificar qual arquivo carregar
// Ao rodar scripts (ou comandos), o Express vai pegar variáveis do NODE_ENV definido
// Ex: npm run dev vai pegar variáveis do .env.development.
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

// Cria um aplicativo Express
const app = express();

// --------
// Rotas
// --------

// Rotas privadas

// Rota que define o prefixo /users
app.use('/users', usersRouter);

// Rota que define o prefixo /articles
app.use('/articles', articlesRouter);

// Conecta ao servidor Mongo DB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(
      `Conectado ao Mongo DB: o nome do banco de dados é ${process.env.DB_NAME}`,
    );
  })
  .catch((err) => {
    console.log(`Erro ao conectar com Mongo DB: ${err}`);
  });

// Configura porta a ser ouvida
const { PORT } = process.env;

app.listen(PORT, () => {
  console.log(`Aplicativo escutando na porta: ${PORT}`);
});
