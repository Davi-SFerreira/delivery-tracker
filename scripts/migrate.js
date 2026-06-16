// scripts/migrate.js
import { db } from '../src/database/database.js';

db.exec(`
  CREATE TABLE IF NOT EXISTS motoristas (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    nome          TEXT NOT NULL,
    cpf           TEXT NOT NULL UNIQUE,
    placa_veiculo TEXT NOT NULL,
    status        TEXT NOT NULL DEFAULT 'ATIVO'
                  CHECK (status IN ('ATIVO', 'INATIVO'))
  );

  CREATE TABLE IF NOT EXISTS entregas (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    descricao    TEXT NOT NULL,
    origem       TEXT NOT NULL,
    destino      TEXT NOT NULL,
    status       TEXT NOT NULL DEFAULT 'CRIADA'
                 CHECK (status IN ('CRIADA', 'EM_TRANSITO', 'ENTREGUE', 'CANCELADA')),
    motorista_id INTEGER REFERENCES motoristas(id)
  );

  CREATE TABLE IF NOT EXISTS eventos_entrega (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    entrega_id INTEGER NOT NULL REFERENCES entregas(id),
    data       TEXT    NOT NULL DEFAULT (datetime('now')),
    descricao  TEXT    NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_entregas_status    ON entregas(status);
  CREATE INDEX IF NOT EXISTS idx_entregas_motorista ON entregas(motorista_id);
  CREATE INDEX IF NOT EXISTS idx_eventos_entrega_id ON eventos_entrega(entrega_id);
`);

console.log('Migration executada com sucesso!');