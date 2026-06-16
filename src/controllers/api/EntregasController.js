export class EntregasController {
    constructor(entregasService) {
        this.entregasService = entregasService;
    }

    async listarTodos(req, res) {
        try {
            const entregas = await this.entregasService.listarTodos(req.query);
            return res.status(200).json(entregas);
        } catch (erro) {
            return res.status(400).json({ erro: erro.message });
        }
    }

    async buscarPorId(req, res) {
        try {
            const entrega = await this.entregasService.buscarPorId(req.params.id);
            if (!entrega) return res.status(404).json({ erro: 'Entrega não encontrada' });
            return res.status(200).json(entrega);
        } catch (erro) {
            return res.status(400).json({ erro: erro.message });
        }
    }

    async criar(req, res) {
        try {
            // Injetamos o id do usuario autenticado que veio do middleware
            const dados = { ...req.body, criadorId: req.usuario.id };
            const novaEntrega = await this.entregasService.criar(dados);
            return res.status(201).json(novaEntrega);
        } catch (erro) {
            return res.status(400).json({ erro: erro.message });
        }
    }

    async avancar(req, res) {
        try {
            const entrega = await this.entregasService.avancar(req.params.id);
            return res.status(200).json(entrega);
        } catch (erro) {
            return res.status(422).json({ erro: erro.message });
        }
    }

    async cancelar(req, res) {
        try {
            const entrega = await this.entregasService.cancelar(req.params.id);
            return res.status(200).json(entrega);
        } catch (erro) {
            return res.status(422).json({ erro: erro.message });
        }
    }

    async atribuir(req, res) {
        try {
            const entrega = await this.entregasService.atribuir(req.params.id, req.body.motoristaId);
            return res.status(200).json(entrega);
        } catch (erro) {
            return res.status(422).json({ erro: erro.message });
        }
    }
}