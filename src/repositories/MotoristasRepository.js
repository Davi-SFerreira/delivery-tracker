// Esse arquivo implementa a classe MotoristasRepository.

import { IMotoristasRepository } from './contracts/IMotoristasRepository.js';
import { CpfDuplicadoError } from '../utils/errors.js';

export class MotoristasRepository extends IMotoristasRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  listarTodos() {
    return this.db.prepare('SELECT * FROM motoristas ORDER BY id').all().map(this._toDomain);
  }

  buscarPorId(id) {
    const row = this.db.prepare('SELECT * FROM motoristas WHERE id = ?').get(id);
    return row ? this._toDomain(row) : null;
  }

  buscarPorCPF(cpf) {
    const row = this.db.prepare('SELECT * FROM motoristas WHERE cpf = ?').get(cpf);
    return row ? this._toDomain(row) : null;
  }

  criar(dados) {
    try {
      const info = this.db.prepare(
        `INSERT INTO motoristas (nome, cpf, placa_veiculo, status)
         VALUES (?, ?, ?, ?)`
      ).run(dados.nome, dados.cpf, dados.placaVeiculo, dados.status ?? 'ATIVO');

      return this.buscarPorId(info.lastInsertRowid);
    } catch (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        throw new CpfDuplicadoError(dados.cpf);
      }
      throw err;
    }
  }

  atualizar(id, dados) {
    const campos = [];
    const valores = [];

    if (dados.nome         !== undefined) { campos.push('nome = ?');          valores.push(dados.nome); }
    if (dados.cpf          !== undefined) { campos.push('cpf = ?');           valores.push(dados.cpf); }
    if (dados.placaVeiculo !== undefined) { campos.push('placa_veiculo = ?'); valores.push(dados.placaVeiculo); }
    if (dados.status       !== undefined) { campos.push('status = ?');        valores.push(dados.status); }

    if (campos.length === 0) return this.buscarPorId(id);

    valores.push(id);

    try {
      const info = this.db
        .prepare(`UPDATE motoristas SET ${campos.join(', ')} WHERE id = ?`)
        .run(...valores);

      return info.changes > 0 ? this.buscarPorId(id) : null;
    } catch (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        throw new CpfDuplicadoError(dados.cpf);
      }
      throw err;
    }
  }

  _toDomain(row) {
    return {
      id: row.id,
      nome: row.nome,
      cpf: row.cpf,
      placaVeiculo: row.placa_veiculo,
      status: row.status,
    };
  }
}