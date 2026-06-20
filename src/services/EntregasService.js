export class EntregasService {
    constructor(entregasRepository, motoristasRepository) {
        this.entregasRepository = entregasRepository;
        this.motoristasRepository = motoristasRepository;
    }

    async listarTodos(filtros) {
        return await this.entregasRepository.listarTodos(filtros);
    }

    async buscarPorId(id) {
        return await this.entregasRepository.buscarPorId(id);
    }

    async criar(dados) {
        if (dados.origem === dados.destino) {
            throw new Error('Origem e destino não podem ser iguais.');
        }

        const { data: todas } = await this.entregasRepository.listarTodos();
        const duplicada = todas.find(e => 
            e.descricao === dados.descricao && 
            e.origem === dados.origem && 
            e.destino === dados.destino && 
            e.status !== 'ENTREGUE' && 
            e.status !== 'CANCELADA'
        );
        
        if (duplicada) {
            throw new Error('Entrega duplicada ativa já existe.');
        }

        const novaEntrega = {
            ...dados,
            status: 'CRIADA',
            historico: {
                create: [{ descricao: 'Entrega criada no sistema.' }]
            }
        };

        return await this.entregasRepository.criar(novaEntrega);
    }

    async avancar(id) {
        const entrega = await this.entregasRepository.buscarPorId(id);
        if (!entrega) throw new Error('Entrega não encontrada.');

        let novoStatus;
        let descricaoEvento;

        if (entrega.status === 'CRIADA') {
            novoStatus = 'EM_TRANSITO';
            descricaoEvento = 'Status alterado para EM_TRANSITO';
        } else if (entrega.status === 'EM_TRANSITO') {
            novoStatus = 'ENTREGUE';
            descricaoEvento = 'Entrega finalizada com sucesso';
        } else {
            throw new Error('Não é possível avançar o status desta entrega.');
        }

        return await this.entregasRepository.atualizar(id, {
            status: novoStatus,
            novoEvento: { descricao: descricaoEvento }
        });
    }

    async cancelar(id) {
        const entrega = await this.entregasRepository.buscarPorId(id);
        if (!entrega) throw new Error('Entrega não encontrada.');
        if (entrega.status === 'ENTREGUE' || entrega.status === 'CANCELADA') {
            throw new Error('Não é possível cancelar esta entrega.');
        }

        return await this.entregasRepository.atualizar(id, {
            status: 'CANCELADA',
            novoEvento: { descricao: 'Entrega cancelada.' }
        });
    }

    async atribuir(id, motoristaId) {
        const entrega = await this.entregasRepository.buscarPorId(id);
        if (!entrega) throw new Error('Entrega não encontrada.');
        if (entrega.status !== 'CRIADA') throw new Error('Só é possível atribuir motorista para entregas CRIADAS.');

        const motorista = await this.motoristasRepository.buscarPorId(motoristaId);
        if (!motorista) throw new Error('Motorista não encontrado.');
        if (motorista.status !== 'ATIVO') throw new Error('Motorista inativo.');

        return await this.entregasRepository.atualizar(id, {
            motoristaId: Number(motoristaId),
            novoEvento: { descricao: `Motorista ${motorista.nome} atribuído.` }
        });
    }
}