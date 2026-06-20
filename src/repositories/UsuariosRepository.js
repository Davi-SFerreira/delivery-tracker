export class UsuariosRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async buscarPorEmail(email) {
    return await this.prisma.usuario.findUnique({
      where: { email },
    });
  }

  async criar(dados) {
    return await this.prisma.usuario.create({
      data: dados,
    });
  }
}