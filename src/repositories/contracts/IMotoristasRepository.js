// Interface para o repositório de motoristas

/**
 * @interface IMotoristasRepository
 *
 * @method listarTodos
 * @returns {Promise<Motorista[]>}
 *
 * @method buscarPorId
 * @param {number} id
 * @returns {Promise<Motorista|null>}
 *
 * @method buscarPorCPF
 * @param {string} cpf
 * @returns {Promise<Motorista|null>}
 *
 * @method criar
 * @param {{ nome: string, cpf: string, placaVeiculo: string, status?: string }} dados
 * @returns {Promise<Motorista>}
 *
 * @method atualizar
 * @param {number} id
 * @param {object} dados
 * @returns {Promise<Motorista|null>}
 */
export class IMotoristasRepository {
  async listarTodos()        { throw new Error('Not implemented'); }
  async buscarPorId(id)      { throw new Error('Not implemented'); }
  async buscarPorCPF(cpf)    { throw new Error('Not implemented'); }
  async criar(dados)         { throw new Error('Not implemented'); }
  async atualizar(id, dados) { throw new Error('Not implemented'); }
}