import 'dotenv/config'; // Força o carregamento do .env antes de instanciar o Prisma
import { jest } from '@jest/globals';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Integração - Rotas de Autenticação', () => {
    beforeAll(async () => {
        await prisma.usuario.deleteMany();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('Deve garantir que o banco está acessível para os testes de integração', async () => {
        const count = await prisma.usuario.count();
        expect(typeof count).toBe('number');
    });
});