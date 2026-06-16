// Esse arquivo implementa a classe RelatoriosRepository, responsável por gerar relatórios sobre as entregas e motoristas.

const STATUS_VALIDOS = ['CRIADA', 'EM_TRANSITO', 'ENTREGUE', 'CANCELADA'];

export class RelatoriosRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async entregasPorStatus() {
    const agrupado = await this.prisma.entrega.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    const resultado = Object.fromEntries(STATUS_VALIDOS.map((s) => [s, 0]));
    for (const item of agrupado) {
      resultado[item.status] = item._count.status;
    }
    return resultado;
  }

  async motoristasAtivos() {
    const motoristas = await this.prisma.motorista.findMany({
      include: {
        entregas: {
          where: { status: { notIn: ['ENTREGUE', 'CANCELADA'] } },
        },
      },
    });

    return motoristas
      .filter((m) => m.entregas.length > 0)
      .map((m) => ({
        motoristaId: m.id,
        nome: m.nome,
        entregasEmAberto: m.entregas.length,
      }));
  }
}