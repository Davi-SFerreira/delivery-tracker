import { Router } from 'express';

// 1. Repositories (Prisma)
import { EntregasRepository } from './repositories/EntregasRepository.js';
import { MotoristasRepository } from './repositories/MotoristasRepository.js';

// 2. Services (Regras de negócio)
import { EntregasService } from './services/EntregasService.js';
import { MotoristasService } from './services/MotoristasService.js';

// 3. Controllers da API REST (Respondem JSON)
import { EntregasController as EntregasControllerAPI } from './controllers/api/EntregasController.js';
import { MotoristasController as MotoristasControllerAPI } from './controllers/api/MotoristasController.js';

// 4. Controllers do Painel Administrativo (Respondem res.render EJS)
import { EntregasControllerPainel } from './controllers/painel/EntregasController.js';
import { MotoristasControllerPainel } from './controllers/painel/MotoristasController.js';

const rotas = Router();

// =======================================================
// INJEÇÃO DE DEPENDÊNCIAS
// =======================================================
const entregasRepo = new EntregasRepository();
const motoristasRepo = new MotoristasRepository();

const entregasService = new EntregasService(entregasRepo, motoristasRepo);
const motoristasService = new MotoristasService(motoristasRepo);

// Injetamos os MESMOS services em controllers diferentes [cite: 72]
const entregasControllerAPI = new EntregasControllerAPI(entregasService);
const motoristasControllerAPI = new MotoristasControllerAPI(motoristasService);

const entregasControllerPainel = new EntregasControllerPainel(entregasService);
const motoristasControllerPainel = new MotoristasControllerPainel(motoristasService);


// =======================================================
// ROTAS DA API REST (Intactas - Retornam JSON)
// =======================================================
rotas.get('/api/entregas', (req, res) => entregasControllerAPI.listarTodos(req, res));
rotas.post('/api/entregas', (req, res) => entregasControllerAPI.criar(req, res));
rotas.get('/api/entregas/:id', (req, res) => entregasControllerAPI.buscarPorId(req, res));
rotas.patch('/api/entregas/:id/avancar', (req, res) => entregasControllerAPI.avancar(req, res));
rotas.patch('/api/entregas/:id/cancelar', (req, res) => entregasControllerAPI.cancelar(req, res));
rotas.patch('/api/entregas/:id/atribuir', (req, res) => entregasControllerAPI.atribuir(req, res));

rotas.get('/api/motoristas', (req, res) => motoristasControllerAPI.listarTodos(req, res));
rotas.post('/api/motoristas', (req, res) => motoristasControllerAPI.criar(req, res));
rotas.get('/api/motoristas/:id', (req, res) => motoristasControllerAPI.buscarPorId(req, res));
rotas.get('/api/motoristas/:id/entregas', (req, res) => motoristasControllerAPI.listarEntregas(req, res));


// =======================================================
// ROTAS DO PAINEL ADMINISTRATIVO (EJS - Renderizam HTML)
// =======================================================

// Entregas Painel (Padrão PRG e Method Override) [cite: 44-46, 52-54]
rotas.get('/painel/entregas', (req, res) => entregasControllerPainel.index(req, res));
rotas.get('/painel/entregas/nova', (req, res) => entregasControllerPainel.nova(req, res));
rotas.post('/painel/entregas', (req, res) => entregasControllerPainel.criar(req, res));
rotas.get('/painel/entregas/:id', (req, res) => entregasControllerPainel.detalhe(req, res));
rotas.patch('/painel/entregas/:id/avancar', (req, res) => entregasControllerPainel.avancar(req, res));
rotas.patch('/painel/entregas/:id/cancelar', (req, res) => entregasControllerPainel.cancelar(req, res));

// Motoristas Painel (Listagem e Cadastro) [cite: 55-57]
rotas.get('/painel/motoristas', (req, res) => motoristasControllerPainel.index(req, res));
rotas.get('/painel/motoristas/novo', (req, res) => motoristasControllerPainel.novo(req, res));
rotas.post('/painel/motoristas', (req, res) => motoristasControllerPainel.criar(req, res));

// Redirecionamento da raiz direto para o painel
rotas.get('/', (req, res) => res.redirect('/painel/entregas'));

// Exportação padrão necessária para o app.js ler o arquivo
export default rotas;