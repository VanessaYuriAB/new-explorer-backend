// Função wrapper utilitária para o fluxo de tratamento de erros

// Para controllers da api, assíncronos: envia o erro para o middleware de tratamento
// centralizado
function handleAsync(controller) {
  return async (req, res, next) => {
    try {
      await controller(req, res);
    } catch (err) {
      next(err);
    }
  };
}

export default handleAsync;
