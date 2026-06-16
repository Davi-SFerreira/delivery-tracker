// Esse arquivo implementa a classe RelatoriosRepository, responsável por gerar relatórios sobre as entregas e motoristas.

const STATUS_VALIDOS = ['CRIADA', 'EM_TRANSITO', 'ENTREGUE', 'CANCELADA'];

export class RelatoriosRepository {
  constructor(db) {
    this.db = db;
  }

  entregasPorStatus() {
    const rows = this.db.prepare(
      `SELECT status, COUNT(*) AS total FROM entregas GROUP BY status`
    ).all();

    const resultado = Object.fromEntries(STATUS_VALIDOS.map((s) => [s, 0]));
    for (const row of rows) {
      resultado[row.status] = Number(row.total);
    }
    return resultado;
  }

  motoristasAtivos() {
    const rows = this.db.prepare(
      `SELECT m.id          AS motorista_id,
              m.nome        AS nome,
              COUNT(e.id)   AS entregas_em_aberto
       FROM motoristas m
       JOIN entregas e ON e.motorista_id = m.id
       WHERE e.status NOT IN ('ENTREGUE', 'CANCELADA')
       GROUP BY m.id, m.nome
       HAVING COUNT(e.id) > 0
       ORDER BY m.id`
    ).all();

    return rows.map((row) => ({
      motoristaId: row.motorista_id,
      nome: row.nome,
      entregasEmAberto: Number(row.entregas_em_aberto),
    }));
  }
}