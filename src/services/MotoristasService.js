// Este serviço é responsável por toda a lógica de negócio relacionada aos motoristas, como validações e regras específicas.
import { RegraDeNegocioError } from '../utils/errors.js';

export class MotoristasService {
  constructor(motoristasRepository) {
    this.motoristasRepository = motoristasRepository;
  }

  async listarTodos() {
    return this.motoristasRepository.listarTodos();
  }

  async buscarPorId(id) {
    const motorista = await this.motoristasRepository.buscarPorId(id);
    if (!motorista) throw new RegraDeNegocioError(`Motorista ${id} não encontrado.`);
    return motorista;
  }

  async criar(dados) {
    const { nome, cpf, placaVeiculo } = dados;
    if (!nome || !cpf || !placaVeiculo) {
      throw new RegraDeNegocioError('Campos obrigatórios: nome, cpf, placaVeiculo.');
    }
    // CpfDuplicadoError é lançado pelo repository e propagado aqui
    return this.motoristasRepository.criar({ nome, cpf, placaVeiculo, status: 'ATIVO' });
  }

  async atualizar(id, dados) {
    // garante que o motorista existe antes de tentar atualizar
    await this.buscarPorId(id);

    const camposPermitidos = {};
    if (dados.nome !== undefined) camposPermitidos.nome = dados.nome;
    if (dados.cpf !== undefined) camposPermitidos.cpf = dados.cpf;
    if (dados.placaVeiculo !== undefined) camposPermitidos.placaVeiculo = dados.placaVeiculo;
    if (dados.status !== undefined) {
      if (!['ATIVO', 'INATIVO'].includes(dados.status)) {
        throw new RegraDeNegocioError('Status inválido. Use ATIVO ou INATIVO.');
      }
      camposPermitidos.status = dados.status;
    }

    return this.motoristasRepository.atualizar(id, camposPermitidos);
  }

  async listarEntregasPorMotorista(motoristaId, filtros = {}) {
    await this.buscarPorId(motoristaId); // garante que motorista existe
    return this.motoristasRepository.listarEntregasPorMotorista
      ? this.motoristasRepository.listarEntregasPorMotorista(motoristaId, filtros)
      : [];
  }
}