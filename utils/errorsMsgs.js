// Mensagens de erros

const errorsMsgs = {
  msgOfErrorConfig: 'é obrigatório em produção!',
  msgOfErrorUnauthorizedLogin: 'E-mail ou senha incorretos',
  msgOfErrorUnauthorizedToken: 'Autorização necessária, o token é inválido!',
  msgOfErrorConflict: 'Usuário já cadastrado',
  msgOfErrorNotFoundUser: 'Cadastro de usuário não encontrado',
  msgOfErrorNotFoundArticle: 'Cadastro de artigo não encontrado',
  msgOfErrorForbidden:
    'Você não pode des-salvar um artigo que não está salvo por você',
};

module.exports = errorsMsgs;
