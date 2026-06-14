// Este arquivo define o controlador para os relatórios, que lida com as requisições relacionadas aos relatórios de entregas e motoristas.

export class RelatoriosController {
  constructor(relatoriosRepository) {
    this.relatoriosRepository = relatoriosRepository;
  }

  entregasPorStatus = async (req, res, next) => {
    try {
      const resultado = await this.relatoriosRepository.entregasPorStatus();
      res.status(200).json(resultado);
    } catch (err) {
      next(err);
    }
  };

  motoristasAtivos = async (req, res, next) => {
    try {
      const resultado = await this.relatoriosRepository.motoristasAtivos();
      res.status(200).json(resultado);
    } catch (err) {
      next(err);
    }
  };
}