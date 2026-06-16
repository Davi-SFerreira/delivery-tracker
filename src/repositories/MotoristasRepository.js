// Esse arquivo implementa a classe MotoristasRepository.

import { IMotoristasRepository } from './contracts/IMotoristasRepository.js';
import { CpfDuplicadoError } from '../utils/errors.js';

const PRISMA_UNIQUE_VIOLATION = 'P2002';

export class MotoristasRepository extends IMotoristasRepository {
  constructor(prisma) {
    super();
    this.prisma = prisma;
  }

  async listarTodos() {
    const registros = await this.prisma.motorista.findMany({ orderBy: { id: 'asc' } });
    return registros.map((r) => this._toDomain(r));
  }

  async buscarPorId(id) {
    const registro = await this.prisma.motorista.findUnique({ where: { id } });
    return registro ? this._toDomain(registro) : null;
  }

  async buscarPorCPF(cpf) {
    const registro = await this.prisma.motorista.findUnique({ where: { cpf } });
    return registro ? this._toDomain(registro) : null;
  }

  async criar(dados) {
    try {
      const registro = await this.prisma.motorista.create({
        data: {
          nome: dados.nome,
          cpf: dados.cpf,
          placaVeiculo: dados.placaVeiculo,
          status: dados.status ?? 'ATIVO',
        },
      });
      return this._toDomain(registro);
    } catch (err) {
      if (err.code === PRISMA_UNIQUE_VIOLATION) {
        throw new CpfDuplicadoError(dados.cpf);
      }
      throw err;
    }
  }

  async atualizar(id, dados) {
    const existente = await this.prisma.motorista.findUnique({ where: { id } });
    if (!existente) return null;

    try {
      const registro = await this.prisma.motorista.update({
        where: { id },
        data: {
          ...(dados.nome !== undefined && { nome: dados.nome }),
          ...(dados.cpf !== undefined && { cpf: dados.cpf }),
          ...(dados.placaVeiculo !== undefined && { placaVeiculo: dados.placaVeiculo }),
          ...(dados.status !== undefined && { status: dados.status }),
        },
      });
      return this._toDomain(registro);
    } catch (err) {
      if (err.code === PRISMA_UNIQUE_VIOLATION) {
        throw new CpfDuplicadoError(dados.cpf);
      }
      throw err;
    }
  }

  _toDomain(registro) {
    return {
      id: registro.id,
      nome: registro.nome,
      cpf: registro.cpf,
      placaVeiculo: registro.placaVeiculo,
      status: registro.status,
    };
  }
}