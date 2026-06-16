// Este arquivo é o ponto de entrada da aplicação, onde as dependências são compostas e o servidor Express é configurado e iniciado. Ele importa os repositórios, serviços, controladores e rotas, e os conecta para criar a aplicação funcional.
import express from 'express';
import 'dotenv/config';

import { db } from './database/database.js';

// Repositories pg
import { EntregasRepository }   from './repositories/EntregasRepository.js';
import { MotoristasRepository } from './repositories/MotoristasRepository.js';
import { RelatoriosRepository } from './repositories/RelatoriosRepository.js';

// Services
import { EntregasService }   from './services/EntregasService.js';
import { MotoristasService } from './services/MotoristasService.js';

// Controllers
import { EntregasController }   from './controllers/EntregasController.js';
import { MotoristasController } from './controllers/MotoristasController.js';
import { RelatoriosController } from './controllers/RelatoriosController.js';

// Rotas
import { entregasRoutes }   from './routes/entregasRoutes.js';
import { motoristasRoutes } from './routes/motoristasRoutes.js';
import { relatoriosRoutes } from './routes/relatoriosRoutes.js';

// ── Composição de dependências (único ponto) ─────────────────────────────────
const entregasRepo   = new EntregasRepository(db);
const motoristasRepo = new MotoristasRepository(db);
const relatoriosRepo = new RelatoriosRepository(db);

const entregasService   = new EntregasService(entregasRepo, motoristasRepo);
const motoristasService = new MotoristasService(motoristasRepo);

const entregasController   = new EntregasController(entregasService);
const motoristasController = new MotoristasController(motoristasService, entregasService);
const relatoriosController = new RelatoriosController(relatoriosRepo);

// ── App ───────────────────────────────────────────────────────────────────────
const app = express();
app.use(express.json());

app.use('/api/entregas',   entregasRoutes(entregasController));
app.use('/api/motoristas', motoristasRoutes(motoristasController));
app.use('/api/relatorios', relatoriosRoutes(relatoriosController));

// Middleware de erro global
app.use((err, req, res, next) => {
  const status = err.statusCode ?? 500;
  res.status(status).json({ erro: err.message });
});

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;