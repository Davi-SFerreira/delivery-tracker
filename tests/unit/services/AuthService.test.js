import { jest } from '@jest/globals';
import { AuthService } from '../../../src/services/AuthService.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

describe('AuthService - Testes Unitários', () => {
    let authService;
    let usuariosRepositoryMock;

    beforeEach(() => {
        usuariosRepositoryMock = {
            buscarPorEmail: jest.fn(),
            criar: jest.fn()
        };
        authService = new AuthService(usuariosRepositoryMock);
        
        process.env.JWT_SECRET = 'segredo_teste';
        process.env.JWT_EXPIRES_IN = '1h';
    });

    describe('registrar()', () => {
        it('Deve lançar erro 409 se o email já estiver registado', async () => {
            usuariosRepositoryMock.buscarPorEmail.mockResolvedValue({ id: 1, email: 'teste@teste.com' });

            await expect(authService.registrar({ email: 'teste@teste.com' }))
                .rejects
                .toThrow('Email já cadastrado');
        });

        it('Deve criar um utilizador com sucesso', async () => {
            usuariosRepositoryMock.buscarPorEmail.mockResolvedValue(null);
            usuariosRepositoryMock.criar.mockResolvedValue({
                id: 1, nome: 'Davi', email: 'teste@teste.com', senha: 'hash', papel: 'OPERADOR'
            });

            const resultado = await authService.registrar({ nome: 'Davi', email: 'teste@teste.com', senha: '123' });

            expect(usuariosRepositoryMock.criar).toHaveBeenCalled();
            expect(resultado).not.toHaveProperty('senha');
        });
    });

    describe('login()', () => {
        it('Deve lançar erro 401 para credenciais inválidas', async () => {
            usuariosRepositoryMock.buscarPorEmail.mockResolvedValue(null);
            await expect(authService.login('inexistente@teste.com', '123')).rejects.toThrow('Credenciais inválidas');
        });

        it('Deve devolver um token JWT', async () => {
            const hashVerdadeiro = await bcrypt.hash('senha_correta', 10);
            usuariosRepositoryMock.buscarPorEmail.mockResolvedValue({
                id: 1, nome: 'Davi', email: 'davi@teste.com', senha: hashVerdadeiro, papel: 'GESTOR'
            });

            const resultado = await authService.login('davi@teste.com', 'senha_correta');
            expect(resultado).toHaveProperty('token');
        });
    });
});