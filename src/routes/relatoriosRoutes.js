// Este arquivo define as rotas para os relatórios, mapeando as requisições HTTP para os métodos correspondentes no controlador de relatórios.
import { Router } from 'express';

export function relatoriosRoutes(relatoriosController) {
  const router = Router();

  router.get('/entregas-por-status', relatoriosController.entregasPorStatus);
  router.get('/motoristas-ativos',   relatoriosController.motoristasAtivos);

  return router;
}