// Definição da interface para o repositório de entregas

/**
 * @interface IEntregasRepository
 *
 * @method listarTodos
 * @param {{ status?: string, motoristaId?: number }} [filtros]
 * @returns {Promise<Entrega[]>}
 *
 * @method buscarPorId
 * @param {number} id
 * @returns {Promise<Entrega|null>}
 *
 * @method criar
 * @param {{ descricao: string, origem: string, destino: string, status?: string, motoristaId?: number, historico?: Array }} dados
 * @returns {Promise<Entrega>}
 *
 * @method atualizar
 * @param {number} id
 * @param {object} dados
 * @returns {Promise<Entrega|null>}
 */
export class IEntregasRepository {
  async listarTodos(filtros) { throw new Error('Not implemented'); }
  async buscarPorId(id)      { throw new Error('Not implemented'); }
  async criar(dados)         { throw new Error('Not implemented'); }
  async atualizar(id, dados) { throw new Error('Not implemented'); }
}