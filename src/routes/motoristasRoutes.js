// Este arquivo define as rotas para os motoristas, mapeando as requisições HTTP para os métodos correspondentes no controlador de motoristas.
import { Router } from 'express';

export function motoristasRoutes(motoristasController) {
  const router = Router();

  router.get('/',               motoristasController.listarTodos);
  router.get('/:id',            motoristasController.buscarPorId);
  router.get('/:id/entregas',   motoristasController.listarEntregas);
  router.post('/',              motoristasController.criar);

  return router;
}