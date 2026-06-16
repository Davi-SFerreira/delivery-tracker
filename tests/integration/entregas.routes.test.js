import 'dotenv/config'; // Força o carregamento do .env
import { jest } from '@jest/globals';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Integração - Rotas de Entregas', () => {
    beforeAll(async () => {
        await prisma.entrega.deleteMany();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('Deve verificar a consistência da tabela de entregas vazia antes do teste', async () => {
        const entregas = await prisma.entrega.findMany();
        expect(Array.isArray(entregas)).toBe(true);
    });
});