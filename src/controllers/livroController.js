import livros from "../models/Livro.js";

class LivroController {
  constructor(app) {}

  static async listarLivros(req, res) {
    try {
      // using referencing
      const listaLivros = await livros.find().populate("autor").exec();
      res.status(200).json(listaLivros);
    } catch (error) {
      res
        .status(500)
        .json({ message: `${error.message} - Falha ao listar livros` });
    }
  }

  static async listarLivroPorId(req, res) {
    try {
      const id = req.params.id;
      const livroEncontrado = await livros
        .findById(id)
        .populate("autor", "nome")
        .exec();
      res.status(200).json(livroEncontrado);
    } catch (error) {
      res
        .status(500)
        .json({ message: `${error.message} - Falha ao buscar livro` });
    }
  }

  static async cadastrarLivro(req, res) {
    try {
      let livro = new livros(req.body);
      const livroResultado = await livro.save();

      res
        .status(201)
        .json({
          message: "Livro cadastrado com sucesso",
          livro: livroResultado.toJSON(),
        });
    } catch (error) {
      res
        .status(500)
        .json({ message: `${error.message} - Falha ao cadastrar livro` });
    }
  }

  static async atualizarLivro(req, res) {
    try {
      const id = req.params.id;
      await livros.findByIdAndUpdate(id, {$set: req.body});
      res.status(200).json({ message: "Livro atualizado com sucesso" });
    } catch (error) {
      res
        .status(500)
        .json({ message: `${error.message} - Falha na atualização do livro` });
    }
  }

  static async excluirLivro(req, res) {
    try {
      const id = req.params.id;
      await livros.findByIdAndDelete(id);
      res.status(200).json({ message: "Livro excluído com sucesso" });
    } catch (error) {
      res
        .status(500)
        .json({ message: `${error.message} - Falha na exclusão do livro` });
    }
  }

  static async listarLivrosPorEditora(req, res) {
    const editora = req.query.editora;
    try {
      const livrosPorEditora = await livros.find({ editora: editora });
      res.status(200).json(livrosPorEditora);
    } catch (error) {
      res.status(500).json({
        message: `${error.message} - Falha ao listar livros por editora`,
      });
    }
  }
}

export default LivroController;
