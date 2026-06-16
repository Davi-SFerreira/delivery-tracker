export class MotoristasControllerPainel {
    constructor(motoristasService) {
        this.motoristasService = motoristasService;
    }

    async index(req, res) {
        try {
            const motoristas = await this.motoristasService.listarTodos();
            res.render('motoristas/index', { motoristas });
        } catch (erro) {
            req.flash('erro', 'Erro ao listar motoristas.');
            res.render('motoristas/index', { motoristas: [] });
        }
    }

    async novo(req, res) {
        const flashAntigos = req.flash('dadosAntigos');
        const dadosAntigos = flashAntigos.length > 0 ? flashAntigos[0] : {};
        res.render('motoristas/novo', { dadosAntigos });
    }

    async criar(req, res) {
        try {
            await this.motoristasService.criar(req.body);
            req.flash('sucesso', 'Motorista cadastrado com sucesso!');
            res.redirect('/painel/motoristas');
        } catch (erro) {
            req.flash('erro', erro.message);
            req.flash('dadosAntigos', req.body);
            res.redirect('/painel/motoristas/novo');
        }
    }
}