// Esse arquivo implementa a classe EntregasRepository.
import { IEntregasRepository } from './contracts/IEntregasRepository.js';

export class EntregasRepository extends IEntregasRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  listarTodos(filtros = {}) {
    const condicoes = [];
    const valores = [];

    if (filtros.status) {
      condicoes.push('status = ?');
      valores.push(filtros.status);
    }
    if (filtros.motoristaId) {
      condicoes.push('motorista_id = ?');
      valores.push(filtros.motoristaId);
    }

    let query = 'SELECT * FROM entregas';
    if (condicoes.length > 0) {
      query += ` WHERE ${condicoes.join(' AND ')}`;
    }
    query += ' ORDER BY id';

    const rows = this.db.prepare(query).all(...valores);
    return rows.map((row) => this._toDomain(row));
  }

  buscarPorId(id) {
    const row = this.db.prepare('SELECT * FROM entregas WHERE id = ?').get(id);
    return row ? this._toDomain(row) : null;
  }

  criar(dados) {
    const stmt = this.db.prepare(
      `INSERT INTO entregas (descricao, origem, destino, status, motorista_id)
       VALUES (?, ?, ?, ?, ?)`
    );

    const info = stmt.run(
      dados.descricao,
      dados.origem,
      dados.destino,
      dados.status ?? 'CRIADA',
      dados.motoristaId ?? null
    );

    const entregaId = info.lastInsertRowid;

    const eventosIniciais = dados.historico ?? [
      { descricao: 'Entrega criada', data: null },
    ];

    for (const evento of eventosIniciais) {
      this._inserirEvento(entregaId, evento.descricao, evento.data ?? null);
    }

    return this.buscarPorId(entregaId);
  }

  atualizar(id, dados) {
    const campos = [];
    const valores = [];

    if (dados.descricao !== undefined) { campos.push('descricao = ?');    valores.push(dados.descricao); }
    if (dados.origem    !== undefined) { campos.push('origem = ?');       valores.push(dados.origem); }
    if (dados.destino   !== undefined) { campos.push('destino = ?');      valores.push(dados.destino); }
    if (dados.status    !== undefined) { campos.push('status = ?');       valores.push(dados.status); }
    if (dados.motoristaId !== undefined) { campos.push('motorista_id = ?'); valores.push(dados.motoristaId); }

    if (campos.length > 0) {
      valores.push(id);
      const info = this.db
        .prepare(`UPDATE entregas SET ${campos.join(', ')} WHERE id = ?`)
        .run(...valores);

      if (info.changes === 0) return null;
    } else {
      if (!this.buscarPorId(id)) return null;
    }

    if (dados.novoEvento) {
      this._inserirEvento(id, dados.novoEvento.descricao, dados.novoEvento.data ?? null);
    }

    if (Array.isArray(dados.historico)) {
      for (const evento of dados.historico) {
        this._inserirEvento(id, evento.descricao, evento.data ?? null);
      }
    }

    return this.buscarPorId(id);
  }

  // ---------- helpers privados ----------

  _inserirEvento(entregaId, descricao, data) {
    this.db.prepare(
      `INSERT INTO eventos_entrega (entrega_id, descricao, data)
       VALUES (?, ?, COALESCE(?, datetime('now')))`
    ).run(entregaId, descricao, data);
  }

  _toDomain(row) {
    const eventos = this.db
      .prepare(
        `SELECT data, descricao FROM eventos_entrega
         WHERE entrega_id = ?
         ORDER BY data ASC, id ASC`
      )
      .all(row.id);

    return {
      id: row.id,
      descricao: row.descricao,
      origem: row.origem,
      destino: row.destino,
      status: row.status,
      motoristaId: row.motorista_id ?? null,
      historico: eventos.map((e) => ({
        data: e.data,
        descricao: e.descricao,
      })),
    };
  }
}