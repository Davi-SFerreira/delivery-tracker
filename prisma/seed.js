import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Limpando dados antigos...');
    
    await prisma.eventoEntrega.deleteMany();
    await prisma.entrega.deleteMany();
    await prisma.motorista.deleteMany();

    console.log('Criando motoristas...');
    const motorista1 = await prisma.motorista.create({
        data: { nome: 'Carlos Silva', cpf: '11122233344', placaVeiculo: 'ABC-1234', status: 'ATIVO' }
    });
    
    const motorista2 = await prisma.motorista.create({
        data: { nome: 'Ana Costa', cpf: '55566677788', placaVeiculo: 'XYZ-9876', status: 'ATIVO' }
    });
    
    const motorista3 = await prisma.motorista.create({
        data: { nome: 'Roberto Alves', cpf: '99988877766', placaVeiculo: 'DEF-5678', status: 'INATIVO' }
    });

    console.log('Criando entregas e eventos de histórico...');
    
    // Lista contendo 10 entregas variadas e o histórico atrelado
    const entregasMock = [
        // Status: CRIADA
        { descricao: 'Pacote de Livros', origem: 'São Paulo', destino: 'Rio de Janeiro', status: 'CRIADA', motoristaId: null, historico: ['Entrega criada no sistema.'] },
        { descricao: 'Monitor 144hz', origem: 'Curitiba', destino: 'Florianópolis', status: 'CRIADA', motoristaId: null, historico: ['Entrega criada no sistema.'] },
        { descricao: 'Cadeira de Escritório', origem: 'Belo Horizonte', destino: 'Vitória', status: 'CRIADA', motoristaId: null, historico: ['Entrega criada no sistema.'] },
        
        // Status: EM_TRANSITO
        { descricao: 'Teclado Mecânico', origem: 'Porto Alegre', destino: 'Brasília', status: 'EM_TRANSITO', motoristaId: motorista1.id, historico: ['Entrega criada no sistema.', 'Motorista Carlos Silva atribuído.', 'Pacote em trânsito.'] },
        { descricao: 'Processador', origem: 'Campinas', destino: 'Goiânia', status: 'EM_TRANSITO', motoristaId: motorista2.id, historico: ['Entrega criada no sistema.', 'Motorista Ana Costa atribuída.', 'Pacote em trânsito.'] },
        { descricao: 'Placa Mãe', origem: 'Salvador', destino: 'Recife', status: 'EM_TRANSITO', motoristaId: motorista1.id, historico: ['Entrega criada no sistema.', 'Motorista Carlos Silva atribuído.', 'Pacote em trânsito.'] },
        
        // Status: ENTREGUE
        { descricao: 'Smartphone', origem: 'Fortaleza', destino: 'Natal', status: 'ENTREGUE', motoristaId: motorista2.id, historico: ['Entrega criada no sistema.', 'Motorista Ana Costa atribuída.', 'Pacote em trânsito.', 'Entrega finalizada com sucesso.'] },
        { descricao: 'Fone Bluetooth', origem: 'Manaus', destino: 'Belém', status: 'ENTREGUE', motoristaId: motorista1.id, historico: ['Entrega criada no sistema.', 'Motorista Carlos Silva atribuído.', 'Pacote em trânsito.', 'Entrega finalizada com sucesso.'] },
        { descricao: 'SSD 1TB', origem: 'Cuiabá', destino: 'Campo Grande', status: 'ENTREGUE', motoristaId: motorista2.id, historico: ['Entrega criada no sistema.', 'Motorista Ana Costa atribuída.', 'Pacote em trânsito.', 'Entrega finalizada com sucesso.'] },
        
        // Status: CANCELADA
        { descricao: 'Mesa de Jantar', origem: 'Maceió', destino: 'Aracaju', status: 'CANCELADA', motoristaId: null, historico: ['Entrega criada no sistema.', 'Entrega cancelada pelo cliente.'] }
    ];

    // O Prisma permite aninhamento de queries (Nested Writes). 
    // Usamos o "historico: { create: [...] }" para inserir a entrega e seus eventos em uma única transação.
    for (const entrega of entregasMock) {
        await prisma.entrega.create({
            data: {
                descricao: entrega.descricao,
                origem: entrega.origem,
                destino: entrega.destino,
                status: entrega.status,
                motoristaId: entrega.motoristaId,
                historico: {
                    create: entrega.historico.map(desc => ({
                        descricao: desc
                    }))
                }
            }
        });
    }

    console.log('Seed concluído com sucesso!');
}

main()
    .catch((e) => {
        console.error('Erro ao executar o seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });