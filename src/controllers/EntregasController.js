// Controlador para gerenciar as rotas relacionadas às entregas

export class EntregasController {
  constructor(entregasService) {
    this.entregasService = entregasService;
  }

  listarTodos = async (req, res, next) => {
    try {
      const filtros = {};
      if (req.query.status) filtros.status = req.query.status;
      if (req.query.motoristaId) filtros.motoristaId = Number(req.query.motoristaId);

      const entregas = await this.entregasService.listarTodos(filtros);
      res.status(200).json(entregas);
    } catch (err) {
      next(err);
    }
  };

  buscarPorId = async (req, res, next) => {
    try {
      const entrega = await this.entregasService.buscarPorId(Number(req.params.id));
      res.status(200).json(entrega);
    } catch (err) {
      next(err);
    }
  };

  criar = async (req, res, next) => {
    try {
      const entrega = await this.entregasService.criar(req.body);
      res.status(201).json(entrega);
    } catch (err) {
      next(err);
    }
  };

  avancarStatus = async (req, res, next) => {
    try {
      const entrega = await this.entregasService.avancarStatus(Number(req.params.id));
      res.status(200).json(entrega);
    } catch (err) {
      next(err);
    }
  };

  cancelar = async (req, res, next) => {
    try {
      const entrega = await this.entregasService.cancelar(Number(req.params.id));
      res.status(200).json(entrega);
    } catch (err) {
      next(err);
    }
  };

  atribuirMotorista = async (req, res, next) => {
    try {
      const entrega = await this.entregasService.atribuirMotorista(
        Number(req.params.id),
        Number(req.body.motoristaId)
      );
      res.status(200).json(entrega);
    } catch (err) {
      next(err);
    }
  };

  buscarHistorico = async (req, res, next) => {
    try {
      const historico = await this.entregasService.buscarHistorico(
        Number(req.params.id)
      );
      res.status(200).json(historico);
    } catch (err) {
      next(err);
    }
  };
}