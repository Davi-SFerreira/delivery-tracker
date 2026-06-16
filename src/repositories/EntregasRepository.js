// src/repositories/EntregasRepository.js
import { IEntregasRepository } from './contracts/IEntregasRepository.js';

export class EntregasRepository extends IEntregasRepository {
  constructor(prisma) {
    super();
    this.prisma = prisma;
  }

  async listarTodos(filtros = {}) {
    const where = this._montarWhere(filtros);

    const page = Math.max(1, Number(filtros.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(filtros.limit) || 10));
    const skip = (page - 1) * limit;

    const [registros, total] = await Promise.all([
      this.prisma.entrega.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'asc' },
        include: { historico: true },
      }),
      this.prisma.entrega.count({ where }),
    ]);

    return {
      data: registros.map((r) => this._toDomain(r)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async buscarPorId(id) {
    const registro = await this.prisma.entrega.findUnique({
      where: { id },
      include: { historico: true },
    });
    return registro ? this._toDomain(registro) : null;
  }

  async criar(dados) {
    const eventosIniciais = dados.historico ?? [{ descricao: 'Entrega criada' }];

    const registro = await this.prisma.entrega.create({
      data: {
        descricao: dados.descricao,
        origem: dados.origem,
        destino: dados.destino,
        status: dados.status ?? 'CRIADA',
        motoristaId: dados.motoristaId ?? null,
        historico: {
          create: eventosIniciais.map((e) => ({ descricao: e.descricao })),
        },
      },
      include: { historico: true },
    });

    return this._toDomain(registro);
  }

  async atualizar(id, dados) {
    const existente = await this.prisma.entrega.findUnique({ where: { id } });
    if (!existente) return null;

    const dataUpdate = {};
    if (dados.descricao !== undefined) dataUpdate.descricao = dados.descricao;
    if (dados.origem !== undefined) dataUpdate.origem = dados.origem;
    if (dados.destino !== undefined) dataUpdate.destino = dados.destino;
    if (dados.status !== undefined) dataUpdate.status = dados.status;
    if (dados.motoristaId !== undefined) dataUpdate.motoristaId = dados.motoristaId;

    const novosEventos = [];
    if (dados.novoEvento) novosEventos.push({ descricao: dados.novoEvento.descricao });
    if (Array.isArray(dados.historico)) {
      novosEventos.push(...dados.historico.map((e) => ({ descricao: e.descricao })));
    }

    if (novosEventos.length > 0) {
      dataUpdate.historico = { create: novosEventos };
    }

    const registro = await this.prisma.entrega.update({
      where: { id },
      data: dataUpdate,
      include: { historico: true },
    });

    return this._toDomain(registro);
  }

  _montarWhere(filtros) {
    const where = {};

    if (filtros.status) where.status = filtros.status;
    if (filtros.motoristaId) where.motoristaId = Number(filtros.motoristaId);

    if (filtros.createdDe || filtros.createdAte) {
      where.createdAt = {};
      if (filtros.createdDe) where.createdAt.gte = new Date(filtros.createdDe);
      if (filtros.createdAte) where.createdAt.lte = new Date(filtros.createdAte);
    }

    return where;
  }

  _toDomain(registro) {
    return {
      id: registro.id,
      descricao: registro.descricao,
      origem: registro.origem,
      destino: registro.destino,
      status: registro.status,
      motoristaId: registro.motoristaId,
      historico: registro.historico
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .map((e) => ({
          data: e.createdAt.toISOString(),
          descricao: e.descricao,
        })),
    };
  }
}