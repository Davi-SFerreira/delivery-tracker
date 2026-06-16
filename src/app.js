// Este arquivo é o ponto de entrada da aplicação, onde as dependências são compostas e o servidor Express é configurado e iniciado. Ele importa os repositórios, serviços, controladores e rotas, e os conecta para criar a aplicação funcional.
import express from 'express';
import 'dotenv/config';

import { prisma } from './database/prisma.js';

import { EntregasRepository }   from './repositories/EntregasRepository.js';
import { MotoristasRepository } from './repositories/MotoristasRepository.js';
import { RelatoriosRepository } from './repositories/RelatoriosRepository.js';

import { EntregasService }   from './services/EntregasService.js';
import { MotoristasService } from './services/MotoristasService.js';

import { EntregasController }   from './controllers/EntregasController.js';
import { MotoristasController } from './controllers/MotoristasController.js';
import { RelatoriosController } from './controllers/RelatoriosController.js';

import { entregasRoutes }   from './routes/entregasRoutes.js';
import { motoristasRoutes } from './routes/motoristasRoutes.js';
import { relatoriosRoutes } from './routes/relatoriosRoutes.js';

const entregasRepo   = new EntregasRepository(prisma);
const motoristasRepo = new MotoristasRepository(prisma);
const relatoriosRepo = new RelatoriosRepository(prisma);

const entregasService   = new EntregasService(entregasRepo, motoristasRepo);
const motoristasService = new MotoristasService(motoristasRepo);

const entregasController   = new EntregasController(entregasService);
const motoristasController = new MotoristasController(motoristasService, entregasService);
const relatoriosController = new RelatoriosController(relatoriosRepo);

const app = express();
app.use(express.json());

app.use('/api/entregas',   entregasRoutes(entregasController));
app.use('/api/motoristas', motoristasRoutes(motoristasController));
app.use('/api/relatorios', relatoriosRoutes(relatoriosController));

app.use((err, req, res, next) => {
  const status = err.statusCode ?? 500;
  res.status(status).json({ erro: err.message });
});

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;