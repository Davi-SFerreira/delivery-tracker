// Custom error classes para tratamento de erros específicos
export class CpfDuplicadoError extends Error {
  constructor(cpf) {
    super(`CPF ${cpf} já cadastrado.`);
    this.name = 'CpfDuplicadoError';
    this.statusCode = 409;
  }
}

export class RegistroNaoEncontradoError extends Error {
  constructor(entidade, id) {
    super(`${entidade} com id ${id} não encontrado.`);
    this.name = 'RegistroNaoEncontradoError';
    this.statusCode = 404;
  }
}

export class RegraDeNegocioError extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'RegraDeNegocioError';
    this.statusCode = 422;
  }
}