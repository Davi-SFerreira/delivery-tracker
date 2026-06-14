// Este arquivo define as rotas para as entregas, mapeando as requisições HTTP para os métodos correspondentes no controlador de entregas.
import { Router } from 'express';

export function entregasRoutes(entregasController) {
  const router = Router();

  router.get('/',                       entregasController.listarTodos);
  router.get('/:id',                    entregasController.buscarPorId);
  router.get('/:id/historico',          entregasController.buscarHistorico);
  router.post('/',                      entregasController.criar);
  router.patch('/:id/avancar',          entregasController.avancarStatus);
  router.patch('/:id/cancelar',         entregasController.cancelar);
  router.patch('/:id/atribuir',         entregasController.atribuirMotorista);

  return router;
}