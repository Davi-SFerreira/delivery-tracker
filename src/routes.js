// src/routes.js
import { Router } from 'express';

// Database
import { prisma } from './database/prisma.js';

// Repositories
import { EntregasRepository } from './repositories/EntregasRepository.js';
import { MotoristasRepository } from './repositories/MotoristasRepository.js';
import { UsuariosRepository } from './repositories/UsuariosRepository.js';
import { RelatoriosRepository } from './repositories/RelatoriosRepository.js';

// Services
import { EntregasService } from './services/EntregasService.js';
import { MotoristasService } from './services/MotoristasService.js';
import { AuthService } from './services/AuthService.js';

// Controllers API
import { EntregasController as EntregasControllerAPI } from './controllers/api/EntregasController.js';
import { MotoristasController as MotoristasControllerAPI } from './controllers/api/MotoristasController.js';
import { AuthController } from './controllers/api/AuthController.js';
import { RelatoriosController } from './controllers/RelatoriosController.js';

// Controllers Painel
import { EntregasControllerPainel } from './controllers/painel/EntregasController.js';
import { MotoristasControllerPainel } from './controllers/painel/MotoristasController.js';

// Middlewares de Segurança
import { autenticar } from './middlewares/autenticar.js';
import { autorizar } from './middlewares/autorizar.js';

const rotas = Router();

// =======================================================
// INJEÇÃO DE DEPENDÊNCIAS
// =======================================================
const entregasRepo = new EntregasRepository(prisma);
const motoristasRepo = new MotoristasRepository(prisma);
const usuariosRepo = new UsuariosRepository(prisma);
const relatoriosRepo = new RelatoriosRepository(prisma);

const entregasService = new EntregasService(entregasRepo, motoristasRepo);
const motoristasService = new MotoristasService(motoristasRepo);
const authService = new AuthService(usuariosRepo);

const entregasControllerAPI = new EntregasControllerAPI(entregasService);
const motoristasControllerAPI = new MotoristasControllerAPI(motoristasService);
const authController = new AuthController(authService);
const relatoriosController = new RelatoriosController(relatoriosRepo);

const entregasControllerPainel = new EntregasControllerPainel(entregasService);
const motoristasControllerPainel = new MotoristasControllerPainel(motoristasService);

// =======================================================
// ROTAS DA API REST
// =======================================================

// Públicas
rotas.post('/api/auth/registrar', (req, res) => authController.registrar(req, res));
rotas.post('/api/auth/login', (req, res) => authController.login(req, res));

// Entregas — qualquer usuário autenticado
rotas.get('/api/entregas', autenticar, (req, res) => entregasControllerAPI.listarTodos(req, res));
rotas.post('/api/entregas', autenticar, (req, res) => entregasControllerAPI.criar(req, res));
rotas.get('/api/entregas/:id', autenticar, (req, res) => entregasControllerAPI.buscarPorId(req, res));
rotas.patch('/api/entregas/:id/avancar', autenticar, (req, res) => entregasControllerAPI.avancar(req, res));
rotas.patch('/api/entregas/:id/atribuir', autenticar, (req, res) => entregasControllerAPI.atribuir(req, res));

// Entregas — apenas GESTOR
rotas.patch('/api/entregas/:id/cancelar', autenticar, autorizar('GESTOR'), (req, res) => entregasControllerAPI.cancelar(req, res));

// Motoristas — qualquer usuário autenticado
rotas.get('/api/motoristas', autenticar, (req, res) => motoristasControllerAPI.listarTodos(req, res));
rotas.get('/api/motoristas/:id', autenticar, (req, res) => motoristasControllerAPI.buscarPorId(req, res));
rotas.get('/api/motoristas/:id/entregas', autenticar, (req, res) => motoristasControllerAPI.listarEntregas(req, res));

// Motoristas — apenas GESTOR
rotas.post('/api/motoristas', autenticar, autorizar('GESTOR'), (req, res) => motoristasControllerAPI.criar(req, res));
rotas.patch('/api/motoristas/:id', autenticar, autorizar('GESTOR'), (req, res) => motoristasControllerAPI.atualizar(req, res));

// Relatórios — apenas GESTOR
rotas.get('/api/relatorios/entregas-por-status', autenticar, autorizar('GESTOR'), (req, res) => relatoriosController.entregasPorStatus(req, res));
rotas.get('/api/relatorios/motoristas-ativos', autenticar, autorizar('GESTOR'), (req, res) => relatoriosController.motoristasAtivos(req, res));

// =======================================================
// ROTAS DO PAINEL ADMINISTRATIVO (usa sessão, não JWT — fora do escopo da Atividade 11)
// =======================================================
rotas.get('/painel/entregas', (req, res) => entregasControllerPainel.index(req, res));
rotas.get('/painel/entregas/nova', (req, res) => entregasControllerPainel.nova(req, res));
rotas.post('/painel/entregas', (req, res) => entregasControllerPainel.criar(req, res));
rotas.get('/painel/entregas/:id', (req, res) => entregasControllerPainel.detalhe(req, res));
rotas.patch('/painel/entregas/:id/avancar', (req, res) => entregasControllerPainel.avancar(req, res));
rotas.patch('/painel/entregas/:id/cancelar', (req, res) => entregasControllerPainel.cancelar(req, res));

rotas.get('/painel/motoristas', (req, res) => motoristasControllerPainel.index(req, res));
rotas.get('/painel/motoristas/novo', (req, res) => motoristasControllerPainel.novo(req, res));
rotas.post('/painel/motoristas', (req, res) => motoristasControllerPainel.criar(req, res));

rotas.get('/', (req, res) => res.redirect('/painel/entregas'));

export default rotas;