// Pacote dotenv só lê .env., mas é possível especificar qual arquivo carregar
// Ao rodar scripts (ou comandos), o Express vai pegar variáveis do NODE_ENV definido
// Ex: npm run dev vai pegar variáveis do .env.development.
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

// Cria um aplicativo Express
const express = require('express');

const app = express();

// Configura porta a ser ouvida
const { PORT } = process.env;

app.listen(PORT, () => {
  console.log(`Aplicativo escutando na porta ${PORT}`);
});
