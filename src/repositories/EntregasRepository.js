// Implementação concreta do repositório de entregas usando PostgreSQL via pool de conexões.
import { IEntregasRepository } from './contracts/IEntregasRepository.js';

export class EntregasRepository extends IEntregasRepository {
  constructor(pool) {
    super();
    this.pool = pool;
  }

  async listarTodos(filtros = {}) {
    const condicoes = [];
    const valores = [];

    if (filtros.status) {
      valores.push(filtros.status);
      condicoes.push(`status = $${valores.length}`);
    }

    if (filtros.motoristaId) {
      valores.push(filtros.motoristaId);
      condicoes.push(`motorista_id = $${valores.length}`);
    }

    let query = 'SELECT * FROM entregas';
    if (condicoes.length > 0) {
      query += ` WHERE ${condicoes.join(' AND ')}`;
    }
    query += ' ORDER BY id';

    const { rows } = await this.pool.query(query, valores);
    return Promise.all(rows.map((row) => this._toDomain(row)));
  }

  async buscarPorId(id) {
    const { rows } = await this.pool.query(
      'SELECT * FROM entregas WHERE id = $1',
      [id]
    );

    if (rows.length === 0) return null;
    return this._toDomain(rows[0]);
  }

  async criar(dados) {
    const { rows } = await this.pool.query(
      `INSERT INTO entregas (descricao, origem, destino, status, motorista_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        dados.descricao,
        dados.origem,
        dados.destino,
        dados.status ?? 'CRIADA',
        dados.motoristaId ?? null,
      ]
    );

    const entregaId = rows[0].id;

    const eventosIniciais = dados.historico ?? [
      { descricao: 'Entrega criada', data: null },
    ];

    for (const evento of eventosIniciais) {
      await this._inserirEvento(entregaId, evento.descricao, evento.data ?? null);
    }

    return this.buscarPorId(entregaId);
  }

  async atualizar(id, dados) {
    const campos = [];
    const valores = [];
    let idx = 1;

    if (dados.descricao !== undefined) {
      campos.push(`descricao = $${idx++}`);
      valores.push(dados.descricao);
    }
    if (dados.origem !== undefined) {
      campos.push(`origem = $${idx++}`);
      valores.push(dados.origem);
    }
    if (dados.destino !== undefined) {
      campos.push(`destino = $${idx++}`);
      valores.push(dados.destino);
    }
    if (dados.status !== undefined) {
      campos.push(`status = $${idx++}`);
      valores.push(dados.status);
    }
    if (dados.motoristaId !== undefined) {
      campos.push(`motorista_id = $${idx++}`);
      valores.push(dados.motoristaId);
    }

    if (campos.length > 0) {
      valores.push(id);
      const { rowCount } = await this.pool.query(
        `UPDATE entregas SET ${campos.join(', ')} WHERE id = $${idx}`,
        valores
      );
      if (rowCount === 0) return null;
    } else {
      const existente = await this.buscarPorId(id);
      if (!existente) return null;
    }

    // Novo evento avulso (ex: avanço de status)
    if (dados.novoEvento) {
      await this._inserirEvento(
        id,
        dados.novoEvento.descricao,
        dados.novoEvento.data ?? null
      );
    }

    // Histórico completo passado pelo service (substituição / adição)
    if (Array.isArray(dados.historico)) {
      for (const evento of dados.historico) {
        await this._inserirEvento(id, evento.descricao, evento.data ?? null);
      }
    }

    return this.buscarPorId(id);
  }

  // ---------- helpers privados ----------

  async _inserirEvento(entregaId, descricao, data) {
    await this.pool.query(
      `INSERT INTO eventos_entrega (entrega_id, descricao, data)
       VALUES ($1, $2, COALESCE($3, NOW()))`,
      [entregaId, descricao, data]
    );
  }

  async _toDomain(row) {
    const { rows: eventos } = await this.pool.query(
      `SELECT data, descricao FROM eventos_entrega
       WHERE entrega_id = $1
       ORDER BY data ASC, id ASC`,
      [row.id]
    );

    return {
      id: row.id,
      descricao: row.descricao,
      origem: row.origem,
      destino: row.destino,
      status: row.status,
      motoristaId: row.motorista_id ?? null,
      historico: eventos.map((e) => ({
        data: e.data.toISOString(),
        descricao: e.descricao,
      })),
    };
  }
}