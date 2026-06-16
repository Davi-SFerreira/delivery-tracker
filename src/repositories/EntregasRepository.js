// src/repositories/EntregasRepository.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class EntregasRepository {
    async listarTodos(filtros = {}) {
        const { status, motoristaId, page = 1, limit = 10, createdDe, createdAte } = filtros;
        
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);

        const where = {};
        
        if (status) where.status = status;
        if (motoristaId) where.motoristaId = Number(motoristaId);
        
        // Filtro opcional por intervalo de datas ISO 8601
        if (createdDe || createdAte) {
            where.createdAt = {};
            if (createdDe) where.createdAt.gte = new Date(createdDe);
            if (createdAte) where.createdAt.lte = new Date(createdAte);
        }

        // Promise.all executa as duas consultas simultaneamente para melhor performance
        const [data, total] = await Promise.all([
            prisma.entrega.findMany({
                where,
                skip,
                take
            }),
            prisma.entrega.count({ where })
        ]);

        const totalPages = Math.ceil(total / take);

        return {
            data,
            total,
            page: Number(page),
            limit: take,
            totalPages
        };
    }

    async buscarPorId(id) {
        return await prisma.entrega.findUnique({
            where: { id: Number(id) },
            include: { historico: true } 
        });
    }

    async criar(dados) {
        return await prisma.entrega.create({
            data: dados
        });
    }

async atualizar(id, dados) {
    // 1. Extraímos o "novoEvento" e outros dados que podem quebrar o update
    const { novoEvento, historico, motorista, id: idEntrega, createdAt, updatedAt, ...dadosLimpos } = dados;

    // 2. Se o service enviou um 'novoEvento', traduzimos para o formato de relação do Prisma
    if (novoEvento) {
        dadosLimpos.historico = {
            create: {
                descricao: novoEvento.descricao
                // O Prisma cuida da data de criação (createdAt) automaticamente graças ao @default(now())
            }
        };
    }

    // 3. Executamos o update limpo
    return await prisma.entrega.update({
        where: { id: Number(id) },
        data: dadosLimpos
    });
} 
}