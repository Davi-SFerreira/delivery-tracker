// prisma/seed.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Limpando dados existentes...');
  await prisma.eventoEntrega.deleteMany();
  await prisma.entrega.deleteMany();
  await prisma.motorista.deleteMany();

  console.log('Criando motoristas...');
  const motoristas = await Promise.all([
    prisma.motorista.create({
      data: { nome: 'João Silva', cpf: '11111111111', placaVeiculo: 'ABC1234' },
    }),
    prisma.motorista.create({
      data: { nome: 'Maria Souza', cpf: '22222222222', placaVeiculo: 'DEF5678' },
    }),
    prisma.motorista.create({
      data: { nome: 'Carlos Lima', cpf: '33333333333', placaVeiculo: 'GHI9012', status: 'INATIVO' },
    }),
  ]);

  console.log('Criando entregas...');

  const entregasSeed = [
    { descricao: 'Notebook Dell', origem: 'São Paulo', destino: 'Rio de Janeiro', status: 'CRIADA' },
    { descricao: 'Caixa de livros', origem: 'Curitiba', destino: 'Florianópolis', status: 'CRIADA' },
    { descricao: 'Monitor LG', origem: 'Belo Horizonte', destino: 'Vitória', status: 'EM_TRANSITO', motoristaId: motoristas[0].id },
    { descricao: 'Kit ferramentas', origem: 'Salvador', destino: 'Recife', status: 'EM_TRANSITO', motoristaId: motoristas[1].id },
    { descricao: 'Smartphone Samsung', origem: 'Porto Alegre', destino: 'São Paulo', status: 'EM_TRANSITO', motoristaId: motoristas[0].id },
    { descricao: 'Cadeira de escritório', origem: 'Fortaleza', destino: 'Natal', status: 'ENTREGUE', motoristaId: motoristas[1].id },
    { descricao: 'Impressora HP', origem: 'Manaus', destino: 'Belém', status: 'ENTREGUE', motoristaId: motoristas[0].id },
    { descricao: 'Mesa de centro', origem: 'Goiânia', destino: 'Brasília', status: 'ENTREGUE' },
    { descricao: 'Pacote de roupas', origem: 'Campinas', destino: 'Santos', status: 'CANCELADA' },
    { descricao: 'Equipamento médico', origem: 'João Pessoa', destino: 'Maceió', status: 'CANCELADA' },
  ];

  const historicoPorStatus = {
    CRIADA: ['Entrega criada'],
    EM_TRANSITO: ['Entrega criada', 'Status alterado para EM_TRANSITO'],
    ENTREGUE: ['Entrega criada', 'Status alterado para EM_TRANSITO', 'Status alterado para ENTREGUE'],
    CANCELADA: ['Entrega criada', 'Entrega cancelada'],
  };

  for (const item of entregasSeed) {
    await prisma.entrega.create({
      data: {
        descricao: item.descricao,
        origem: item.origem,
        destino: item.destino,
        status: item.status,
        motoristaId: item.motoristaId ?? null,
        historico: {
          create: historicoPorStatus[item.status].map((descricao) => ({ descricao })),
        },
      },
    });
  }

  console.log('Seed concluído!');
}

main()
  .catch((err) => {
    console.error('Erro ao executar seed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });