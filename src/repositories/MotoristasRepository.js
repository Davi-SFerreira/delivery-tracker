// Implementação do repositório de motoristas usando PostgreSQL
import { IMotoristasRepository } from './contracts/IMotoristasRepository.js';
import { CpfDuplicadoError } from '../utils/errors.js';

const PG_UNIQUE_VIOLATION = '23505';

export class MotoristasRepository extends IMotoristasRepository {
  constructor(pool) {
    super();
    this.pool = pool;
  }

  async listarTodos() {
    const { rows } = await this.pool.query(
      'SELECT * FROM motoristas ORDER BY id'
    );
    return rows.map(this._toDomain);
  }

  async buscarPorId(id) {
    const { rows } = await this.pool.query(
      'SELECT * FROM motoristas WHERE id = $1',
      [id]
    );
    return rows.length ? this._toDomain(rows[0]) : null;
  }

  async buscarPorCPF(cpf) {
    const { rows } = await this.pool.query(
      'SELECT * FROM motoristas WHERE cpf = $1',
      [cpf]
    );
    return rows.length ? this._toDomain(rows[0]) : null;
  }

  async criar(dados) {
    try {
      const { rows } = await this.pool.query(
        `INSERT INTO motoristas (nome, cpf, placa_veiculo, status)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [dados.nome, dados.cpf, dados.placaVeiculo, dados.status ?? 'ATIVO']
      );
      return this._toDomain(rows[0]);
    } catch (err) {
      if (err.code === PG_UNIQUE_VIOLATION) {
        throw new CpfDuplicadoError(dados.cpf);
      }
      throw err;
    }
  }

  async atualizar(id, dados) {
    const campos = [];
    const valores = [];
    let idx = 1;

    if (dados.nome !== undefined) {
      campos.push(`nome = $${idx++}`);
      valores.push(dados.nome);
    }
    if (dados.cpf !== undefined) {
      campos.push(`cpf = $${idx++}`);
      valores.push(dados.cpf);
    }
    if (dados.placaVeiculo !== undefined) {
      campos.push(`placa_veiculo = $${idx++}`);
      valores.push(dados.placaVeiculo);
    }
    if (dados.status !== undefined) {
      campos.push(`status = $${idx++}`);
      valores.push(dados.status);
    }

    if (campos.length === 0) {
      return this.buscarPorId(id);
    }

    valores.push(id);

    try {
      const { rows } = await this.pool.query(
        `UPDATE motoristas SET ${campos.join(', ')}
         WHERE id = $${idx}
         RETURNING *`,
        valores
      );
      return rows.length ? this._toDomain(rows[0]) : null;
    } catch (err) {
      if (err.code === PG_UNIQUE_VIOLATION) {
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