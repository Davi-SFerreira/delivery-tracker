// src/repositories/MotoristasRepository.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class MotoristasRepository {
    async listarTodos() {
        return await prisma.motorista.findMany();
    }

    async buscarPorId(id) {
        return await prisma.motorista.findUnique({
            where: { id: Number(id) }
        });
    }

    async buscarPorCPF(cpf) {
        return await prisma.motorista.findUnique({
            where: { cpf }
        });
    }

    async criar(dados) {
        return await prisma.motorista.create({
            data: dados
        });
    }

    async atualizar(id, dados) {
        return await prisma.motorista.update({
            where: { id: Number(id) },
            data: dados
        });
    }
}