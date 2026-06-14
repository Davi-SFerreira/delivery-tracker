// Serviço de negócios para gerenciamento de entregas

import { RegraDeNegocioError } from '../utils/errors.js';

export class EntregasService {
  constructor(entregasRepository, motoristasRepository) {
    this.entregasRepository = entregasRepository;
    this.motoristasRepository = motoristasRepository;
  }

  async listarTodos(filtros = {}) {
    return this.entregasRepository.listarTodos(filtros);
  }

  async buscarPorId(id) {
    const entrega = await this.entregasRepository.buscarPorId(id);
    if (!entrega) throw new RegraDeNegocioError(`Entrega ${id} não encontrada.`);
    return entrega;
  }

  async criar(dados) {
    const { descricao, origem, destino } = dados;

    if (!descricao || !origem || !destino) {
      throw new RegraDeNegocioError('Campos obrigatórios: descricao, origem, destino.');
    }

    if (origem === destino) {
      throw new RegraDeNegocioError('Origem e destino não podem ser iguais.');
    }

    // Verifica duplicidade ativa
    const todas = await this.entregasRepository.listarTodos();
    const duplicada = todas.find(
      (e) =>
        e.descricao === descricao &&
        e.origem === origem &&
        e.destino === destino &&
        !['ENTREGUE', 'CANCELADA'].includes(e.status)
    );
    if (duplicada) {
      throw new RegraDeNegocioError('Já existe uma entrega ativa com esses dados.');
    }

    return this.entregasRepository.criar({
      descricao,
      origem,
      destino,
      status: 'CRIADA',
      historico: [{ descricao: 'Entrega criada', data: new Date().toISOString() }],
    });
  }

  async avancarStatus(id) {
    const entrega = await this.buscarPorId(id);

    const transicoes = {
      CRIADA: 'EM_TRANSITO',
      EM_TRANSITO: 'ENTREGUE',
    };

    const proximo = transicoes[entrega.status];
    if (!proximo) {
      throw new RegraDeNegocioError(
        `Não é possível avançar o status de uma entrega ${entrega.status}.`
      );
    }

    const novoEvento = {
      descricao: `Status alterado para ${proximo}`,
      data: new Date().toISOString(),
    };

    return this.entregasRepository.atualizar(id, {
      status: proximo,
      novoEvento,
    });
  }

  async cancelar(id) {
    const entrega = await this.buscarPorId(id);

    if (['ENTREGUE', 'CANCELADA'].includes(entrega.status)) {
      throw new RegraDeNegocioError(
        `Não é possível cancelar uma entrega ${entrega.status}.`
      );
    }

    const novoEvento = {
      descricao: 'Entrega cancelada',
      data: new Date().toISOString(),
    };

    return this.entregasRepository.atualizar(id, {
      status: 'CANCELADA',
      novoEvento,
    });
  }

  async atribuirMotorista(id, motoristaId) {
    const entrega = await this.buscarPorId(id);

    if (entrega.status !== 'CRIADA') {
      throw new RegraDeNegocioError(
        'Só é possível atribuir motorista a entregas com status CRIADA.'
      );
    }

    const motorista = await this.motoristasRepository.buscarPorId(motoristaId);
    if (!motorista) {
      throw new RegraDeNegocioError(`Motorista ${motoristaId} não encontrado.`);
    }

    if (motorista.status !== 'ATIVO') {
      throw new RegraDeNegocioError('Não é possível atribuir um motorista INATIVO.');
    }

    const novoEvento = {
      descricao: `Motorista ${motorista.nome} atribuído à entrega`,
      data: new Date().toISOString(),
    };

    return this.entregasRepository.atualizar(id, {
      motoristaId,
      novoEvento,
    });
  }

  async buscarHistorico(id) {
    const entrega = await this.buscarPorId(id);
    return entrega.historico;
  }
}