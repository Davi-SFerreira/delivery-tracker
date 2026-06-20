export class MotoristasRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async listarTodos() {
    return await this.prisma.motorista.findMany();
  }

  async buscarPorId(id) {
    return await this.prisma.motorista.findUnique({
      where: { id: Number(id) },
    });
  }

  async buscarPorCPF(cpf) {
    return await this.prisma.motorista.findUnique({
      where: { cpf },
    });
  }

  async criar(dados) {
    return await this.prisma.motorista.create({
      data: dados,
    });
  }

  async atualizar(id, dados) {
    return await this.prisma.motorista.update({
      where: { id: Number(id) },
      data: dados,
    });
  }
}