import NotFound from "../errors/NotFound.js";
import { autores, livros } from "../models/index.js";

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

  static async listarLivrosPorFiltro(req, res, next) {
    try {
      const busca = await processaBusca(req.query);

      if (busca !== null) {
        const livrosResultado = await livros.find(busca).populate("autor");
        res.status(200).json(livrosResultado);
      } else {
        res.status(200).send([]);
      }
    } catch (error) {
      next(error);
    }
  }
}

async function processaBusca(params) {
  const { editora, titulo, minPaginas, maxPaginas, nomeAutor } = params;

  let busca = {};
  if (editora) busca.editora = editora;
  if (titulo) busca.titulo = { $regex: titulo, $options: "i" };

  if (minPaginas || maxPaginas) busca.paginas = {};
  if (minPaginas) busca.paginas.$gte = minPaginas;
  if (maxPaginas) busca.paginas.$lte = maxPaginas;

  if (nomeAutor) {
    const autor = await autores.findOne({
      nome: nomeAutor,
    });

    if (autor !== null) {
      busca.autor = autor._id;
    } else {
      busca = null;
    }
  }

  return busca;
}

export default LivroController;
