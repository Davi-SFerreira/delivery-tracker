// Repositório de motoristas em memória
import { IMotoristasRepository } from './contracts/IMotoristasRepository.js';
import { CpfDuplicadoError } from '../utils/errors.js';

export class InMemoryMotoristasRepository extends IMotoristasRepository {
  constructor(database) {
    super();
    this.database = database;
  }

  async listarTodos() {
    return this.database.getMotoristas();
  }

  async buscarPorId(id) {
    const motorista = this.database.getMotoristas().find((m) => m.id === id);
    return motorista ?? null;
  }

  async buscarPorCPF(cpf) {
    const motorista = this.database.getMotoristas().find((m) => m.cpf === cpf);
    return motorista ?? null;
  }

  async criar(dados) {
    const existe = await this.buscarPorCPF(dados.cpf);
    if (existe) throw new CpfDuplicadoError(dados.cpf);

    const novoMotorista = {
      id: this.database.generateMotoristaId(),
      nome: dados.nome,
      cpf: dados.cpf,
      placaVeiculo: dados.placaVeiculo,
      status: dados.status ?? 'ATIVO',
    };

    this.database.getMotoristas().push(novoMotorista);
    return novoMotorista;
  }

  async atualizar(id, dados) {
    const motoristas = this.database.getMotoristas();
    const index = motoristas.findIndex((m) => m.id === id);

    if (index === -1) return null;

    if (dados.cpf && dados.cpf !== motoristas[index].cpf) {
      const existe = await this.buscarPorCPF(dados.cpf);
      if (existe) throw new CpfDuplicadoError(dados.cpf);
    }

    motoristas[index] = { ...motoristas[index], ...dados };
    return motoristas[index];
  }
}