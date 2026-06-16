import 'dotenv/config'; // <-- ADICIONE ESTA LINHA AQUI!
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import session from 'express-session';
import flash from 'express-flash';

// Importa o arquivo central de rotas que criamos
import rotas from './routes.js'; 

// Declara o app UMA ÚNICA VEZ
const app = express();

// Configuração de diretórios para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =======================================================
// CONFIGURAÇÕES (EJS, Sessão, Flash)
// =======================================================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    secret: 'segredo_do_delivery_tracker',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

// =======================================================
// MIDDLEWARES
// =======================================================
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); // Mantém o suporte para as rotas /api responderem JSON

app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

// =======================================================
// ROTAS
// =======================================================
app.use(rotas);

// =======================================================
// START DO SERVIDOR
// =======================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em: http://localhost:${PORT}`);
});