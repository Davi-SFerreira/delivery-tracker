// Repositório de entregas em memória
import { IEntregasRepository } from './contracts/IEntregasRepository.js';

export class InMemoryEntregasRepository extends IEntregasRepository {
  constructor(database) {
    super();
    this.database = database;
  }

  async listarTodos(filtros = {}) {
    let entregas = this.database.getEntregas();

    if (filtros.status) {
      entregas = entregas.filter((e) => e.status === filtros.status);
    }

    if (filtros.motoristaId) {
      entregas = entregas.filter((e) => e.motoristaId === filtros.motoristaId);
    }

    return entregas;
  }

  async buscarPorId(id) {
    const entrega = this.database.getEntregas().find((e) => e.id === id);
    return entrega ?? null;
  }

  async criar(dados) {
    const novaEntrega = {
      id: this.database.generateEntregaId(),
      descricao: dados.descricao,
      origem: dados.origem,
      destino: dados.destino,
      status: dados.status ?? 'CRIADA',
      motoristaId: dados.motoristaId ?? null,
      historico: dados.historico ?? [],
    };

    this.database.getEntregas().push(novaEntrega);
    return novaEntrega;
  }

  async atualizar(id, dados) {
    const entregas = this.database.getEntregas();
    const index = entregas.findIndex((e) => e.id === id);

    if (index === -1) return null;

    entregas[index] = { ...entregas[index], ...dados };
    return entregas[index];
  }
}