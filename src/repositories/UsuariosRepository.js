import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class UsuariosRepository {
    async buscarPorEmail(email) {
        return await prisma.usuario.findUnique({
            where: { email }
        });
    }

    async criar(dados) {
        return await prisma.usuario.create({
            data: dados
        });
    }
}