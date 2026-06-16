// src/database/db.js
// Esse arquivo é responsável por criar a conexão com o banco de dados SQLite e configurar as opções necessárias para o funcionamento da aplicação.
import { DatabaseSync } from 'node:sqlite';
import 'dotenv/config';

const db = new DatabaseSync(process.env.DATABASE_PATH ?? './database.sqlite');

db.exec('PRAGMA foreign_keys = ON;');
db.exec('PRAGMA journal_mode = WAL;');

export { db };