class ErroBase extends Error {
  constructor(message = "Erro interno do servidor", statusCode = 500) {
    super();
    this.message = message;
    this.status = statusCode;
  }

  enviarResposta(res) {
    res
      .status(this.status)
      .send({ message: this.message, status: this.status });
  }
}

export default ErroBase;
