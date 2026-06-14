// Este repositório é responsável por gerar relatórios relacionados às entregas e motoristas.

const STATUS_VALIDOS = ['CRIADA', 'EM_TRANSITO', 'ENTREGUE', 'CANCELADA'];

export class RelatoriosRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async entregasPorStatus() {
    const { rows } = await this.pool.query(
      `SELECT status, COUNT(*)::int AS total
       FROM entregas
       GROUP BY status`
    );

    const resultado = Object.fromEntries(STATUS_VALIDOS.map((s) => [s, 0]));
    for (const row of rows) {
      resultado[row.status] = row.total;
    }

    return resultado;
  }

  async motoristasAtivos() {
    const { rows } = await this.pool.query(
      `SELECT m.id          AS motorista_id,
              m.nome        AS nome,
              COUNT(e.id)::int AS entregas_em_aberto
       FROM motoristas m
       JOIN entregas e ON e.motorista_id = m.id
       WHERE e.status NOT IN ('ENTREGUE', 'CANCELADA')
       GROUP BY m.id, m.nome
       HAVING COUNT(e.id) > 0
       ORDER BY m.id`
    );

    return rows.map((row) => ({
      motoristaId: row.motorista_id,
      nome: row.nome,
      entregasEmAberto: row.entregas_em_aberto,
    }));
  }
}