export class EntregasControllerPainel {
    constructor(entregasService) {
        this.entregasService = entregasService;
    }

    async index(req, res) {
    try {
        // Busca as entregas através do Service (reaproveitando a lógica REST)
        const resultado = await this.entregasService.listarTodos({
            ...req.query,
            limit: req.query.limit || 100,
        });
        
        // Renderiza a view passando as entregas e as mensagens flash
        res.render('entregas/index', { 
            entregas: resultado.data,
            metadados: resultado
        });
    } catch (erro) {
        console.error('ERRO REAL NO INDEX:', erro); // temporário
        req.flash('erro', 'Ocorreu um erro ao buscar as entregas.');
        res.render('entregas/index', { entregas: [], metadados: { total: 0, page: 1, totalPages: 1 } });
    }
}

    async nova(req, res) {
        // Se houver um erro de validação, resgatamos os dados enviados anteriormente
        const flashAntigos = req.flash('dadosAntigos');
        const dadosAntigos = flashAntigos.length > 0 ? flashAntigos[0] : {};
        
        res.render('entregas/nova', { dadosAntigos });
    }

    async criar(req, res) {
        try {
            await this.entregasService.criar(req.body);
            req.flash('sucesso', 'Entrega criada com sucesso!');
            
            // Padrão PRG: Redireciona para a listagem (GET) após sucesso no POST
            res.redirect('/painel/entregas');
        } catch (erro) {
            // Padrão PRG: Grava a mensagem de erro e os dados preenchidos, depois redireciona de volta
            req.flash('erro', erro.message);
            req.flash('dadosAntigos', req.body);
            res.redirect('/painel/entregas/nova');
        }
    }

    async detalhe(req, res) {
        try {
            const entrega = await this.entregasService.buscarPorId(req.params.id);
            res.render('entregas/detalhe', { entrega });
        } catch (erro) {
            req.flash('erro', 'Entrega não encontrada.');
            res.redirect('/painel/entregas');
        }
    }

    async avancar(req, res) {
        try {
            await this.entregasService.avancar(req.params.id);
            req.flash('sucesso', 'Status avançado com sucesso!');
        } catch (erro) {
            req.flash('erro', erro.message);
        }
        res.redirect(`/painel/entregas/${req.params.id}`);
    }

    async cancelar(req, res) {
        try {
            await this.entregasService.cancelar(req.params.id);
            req.flash('sucesso', 'Entrega cancelada com sucesso!');
        } catch (erro) {
            req.flash('erro', erro.message);
        }
        res.redirect(`/painel/entregas/${req.params.id}`);
    }
}