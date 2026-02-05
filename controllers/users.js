// Esse arquivo é o controlador de usuários

const handleAsync = require('../utils/ControllersAsyncHandler');

// O manipulador de solicitação getUser
// Retorna informações sobre o usuário logado (e-mail e nome)
const getUser = async () => {};

export default { getUser: handleAsync(getUser) };
