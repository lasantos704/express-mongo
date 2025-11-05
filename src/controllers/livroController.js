import NotFound from "../errors/NotFound.js";
import livros from "../models/Livro.js";

class LivroController {
  constructor(app) {}

  static async listarLivros(req, res, next) {
    try {
      // using referencing
      const listaLivros = await livros.find().populate("autor").exec();
      res.status(200).json(listaLivros);
    } catch (error) {
      next(error);
    }
  }

  static async listarLivroPorId(req, res, next) {
    try {
      const id = req.params.id;
      const livroEncontrado = await livros
        .findById(id)
        .populate("autor", "nome")
        .exec();
      if (livroEncontrado === null) {
        next(new NotFound("Id do Livro não encontrado"));
      } else {
        res.status(200).json(livroEncontrado);
      }
    } catch (error) {
      next(error);
    }
  }

  static async cadastrarLivro(req, res, next) {
    try {
      let livro = new livros(req.body);
      const livroResultado = await livro.save();

      res.status(201).json({
        message: "Livro cadastrado com sucesso",
        livro: livroResultado.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  }

  static async atualizarLivro(req, res, next) {
    try {
      const id = req.params.id;
      const livroEncontrado = await livros.findByIdAndUpdate(id, {
        $set: req.body,
      });
      if (livroEncontrado === null) {
        next(new NotFound("Id do Livro não encontrado"));
      } else {
        res.status(200).json({ message: "Livro atualizado com sucesso" });
      }
    } catch (error) {
      next(error);
    }
  }

  static async excluirLivro(req, res, next) {
    try {
      const id = req.params.id;
      const livroEncontrado = await livros.findByIdAndDelete(id);
      if (livroEncontrado === null)
        next(new NotFound("Id do Livro não encontrado"));
      else {
        res.status(200).json({ message: "Livro excluído com sucesso" });
      }
    } catch (error) {
      next(error);
    }
  }

  static async listarLivrosPorEditora(req, res, next) {
    const editora = req.query.editora;
    try {
      const livrosPorEditora = await livros.find({ editora: editora });
      res.status(200).json(livrosPorEditora);
    } catch (error) {
      next(error);
    }
  }
}

export default LivroController;
