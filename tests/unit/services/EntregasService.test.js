import { jest } from '@jest/globals';
import { EntregasService } from '../../../src/services/EntregasService.js';

describe('EntregasService - Testes Unitários', () => {
    let entregasService;
    let entregasRepositoryMock;
    let motoristasRepositoryMock;

    beforeEach(() => {
        entregasRepositoryMock = {
            listarTodos: jest.fn().mockResolvedValue({ data: [], total: 0, page: 1, limit: 10, totalPages: 1 }),
            buscarPorId: jest.fn(),
            criar: jest.fn(),
            atualizar: jest.fn()
        };

        motoristasRepositoryMock = {
            buscarPorId: jest.fn()
        };

        entregasService = new EntregasService(entregasRepositoryMock, motoristasRepositoryMock);
    });

    describe('criar()', () => {
        it('Deve lançar erro se a origem e o destino forem iguais', async () => {
            const dadosInvalidos = { origem: 'Maceió', destino: 'Maceió', descricao: 'Pacote' };
            // Ajustado para o texto exato que o seu service lança
            await expect(entregasService.criar(dadosInvalidos)).rejects.toThrow('Origem e destino não podem ser iguais.');
        });

        it('Deve criar a entrega com evento de histórico inicial', async () => {
            const dadosValidos = { origem: 'Maceió', destino: 'Recife', descricao: 'Pacote', criadorId: 1 };
            entregasRepositoryMock.criar.mockResolvedValue({ id: 1, status: 'CRIADA', ...dadosValidos });

            const resultado = await entregasService.criar(dadosValidos);

            expect(entregasRepositoryMock.criar).toHaveBeenCalled();
            expect(resultado.id).toBe(1);
        });
    });

    describe('avancar()', () => {
        it('Deve lançar erro se a entrega não for encontrada', async () => {
            entregasRepositoryMock.buscarPorId.mockResolvedValue(null);
            await expect(entregasService.avancar(999)).rejects.toThrow('Entrega não encontrada.');
        });

        it('Deve avançar de CRIADA para EM_TRANSITO', async () => {
            entregasRepositoryMock.buscarPorId.mockResolvedValue({ id: 1, status: 'CRIADA', historico: [] });
            entregasRepositoryMock.atualizar.mockResolvedValue({ id: 1, status: 'EM_TRANSITO' });

            const resultado = await entregasService.avancar(1);
            expect(resultado.status).toBe('EM_TRANSITO');
        });
    });
});