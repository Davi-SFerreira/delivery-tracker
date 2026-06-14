// Este script é responsável por executar a migração do banco de dados, lendo o arquivo SQL e executando as queries para criar as tabelas e estruturas necessárias para a aplicação. Ele utiliza o pool de conexões do PostgreSQL para se conectar ao banco e executar as queries.
import { readFileSync } from 'fs';
import { pool } from '../src/database/pool.js';

const sql = readFileSync('./migration.sql', 'utf-8');

try {
  await pool.query(sql);
  console.log('✅ Migration executada com sucesso!');
} catch (err) {
  console.error('❌ Erro ao executar migration:', err.message);
} finally {
  await pool.end();
}