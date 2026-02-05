const express = require('express');

const cors = require('cors');

const mongoose = require('mongoose');

const { getUser } = require('./controllers/users');
const articlesRouter = require('./routes/articles');

const handleError = require('./middlewares/errorHandler');

const ForbiddenError = require('./errors/ForbiddenError');

// Pacote dotenv só lê .env., mas é possível especificar qual arquivo carregar
// Ao rodar scripts (ou comandos), o Express vai pegar variáveis do NODE_ENV definido
// Ex: npm run dev vai pegar variáveis do .env.development.
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

// Cria um aplicativo Express
const app = express();

// CORS

// '.split(',')' para transformar a string em array
// '.map()' com 'trim()' para remover qlqr espaço em branco que possa ter
const allowedCors = process.env.CORS_ORIGIN.split(',').map((url) => url.trim());

// Configuração com opções específicas
const corsOptions = {
  // O callback é uma função fornecida pelo middleware cors para indicar se a origem
  // é permitida
  // Espera dois parâmetros: callback(error, allow)
  // error: null se não houve erro ou um objeto Error para bloquear
  // allow: true se a origem é permitida ou false se não

  origin: (origin, callback) => {
    // Se não houver origin (Postman, curl, apps mobile), permite
    if (!origin) {
      return callback(null, true);
    }

    // Se houver origin e estiver na lista, permite
    if (allowedCors.includes(origin)) {
      return callback(null, true);
    }

    // Caso contrário, bloqueia

    // Cria um erro customizado com name
    const corsError = new ForbiddenError(
      `Origem não permitida pelo CORS, ${origin}`,
    );
    return callback(corsError);
  }, // origens permitidas e tratamento com msg de erro, caso não

  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // permite envio de cookies/autenticação (caso o projeto use
  // cookies httpOnly, ao invés do armazenamento do JWT token no localStorage)
};

// Aplica CORS com opções específicas
app.use(cors(corsOptions));

// Trata requisições preflight (OPTIONS) para qualquer rota
// Regex /.*/ para qlqr caminho, evita erro path-to-regex que ocorre com '*' ou '(.*)'
// em versões recentes do Express
app.options(/.*/, cors(corsOptions));

// Para analisar application/json
app.use(express.json());

// --------
// Rotas
// --------

// Rotas privadas

// Usuário logado: GET - '/users/me' (não usa roteamento)
app.get('/users/me', getUser);

// Roteamento para o prefixo '/articles'
app.use('/articles', articlesRouter);

// ----------------------
// Tratamento de erros
// ----------------------

// Tratamento centralizado de erros
app.use(handleError);

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
