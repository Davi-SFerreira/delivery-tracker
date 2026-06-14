// Configuração do pool de conexões com o banco de dados PostgreSQL
import { Pool } from 'pg';
import 'dotenv/config';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function closePool() {
  await pool.end();
}