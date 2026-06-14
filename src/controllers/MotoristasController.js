// Controlador para gerenciar motoristas e suas entregas

export class MotoristasController {
  constructor(motoristasService, entregasService) {
    this.motoristasService = motoristasService;
    this.entregasService = entregasService;
  }

  listarTodos = async (req, res, next) => {
    try {
      const motoristas = await this.motoristasService.listarTodos();
      res.status(200).json(motoristas);
    } catch (err) {
      next(err);
    }
  };

  buscarPorId = async (req, res, next) => {
    try {
      const motorista = await this.motoristasService.buscarPorId(
        Number(req.params.id)
      );
      res.status(200).json(motorista);
    } catch (err) {
      next(err);
    }
  };

  criar = async (req, res, next) => {
    try {
      const motorista = await this.motoristasService.criar(req.body);
      res.status(201).json(motorista);
    } catch (err) {
      next(err);
    }
  };

  listarEntregas = async (req, res, next) => {
    try {
      const filtros = {};
      if (req.query.status) filtros.status = req.query.status;

      const entregas = await this.entregasService.listarTodos({
        ...filtros,
        motoristaId: Number(req.params.id),
      });
      res.status(200).json(entregas);
    } catch (err) {
      next(err);
    }
  };
}