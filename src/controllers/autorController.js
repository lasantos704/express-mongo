import NotFound from "../errors/NotFound.js";
import { autores } from "../models/index.js";

class AutorController {
  constructor(app) {}

  static async listarAutores(req, res, next) {
    try {
      const listaAutores = autores.find({});
      req.resultado = listaAutores;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async listarAutorPorId(req, res, next) {
    try {
      const id = req.params.id;
      const autorEncontrado = await autores.findById(id);

      if (autorEncontrado !== null) {
        res.status(200).json(autorEncontrado);
      } else {
        next(new NotFound("Id do Autor não encontrado"));
      }
    } catch (error) {
      next(error);
    }
  }

  static async cadastrarAutor(req, res, next) {
    try {
      let autor = new autores(req.body);
      const novoAutor = await autor.save();
      res.status(201).json({
        message: "Autor cadastrado com sucesso",
        autor: novoAutor.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  }

  static async atualizarAutor(req, res, next) {
    try {
      const id = req.params.id;
      const autorEncontrado = await autores.findByIdAndUpdate(id, req.body);
      if (autorEncontrado === null) {
        next(new NotFound("Id do Autor não encontrado"));
      } else {
        res.status(200).json({ message: "Autor atualizado com sucesso" });
      }
    } catch (error) {
      next(error);
    }
  }

  static async excluirAutor(req, res, next) {
    try {
      const id = req.params.id;
      const autorEncontrado = await autores.findByIdAndDelete(id);
      if (autorEncontrado === null)
        next(new NotFound("Id do Autor não encontrado"));
      else {
        res.status(200).json({ message: "Autor excluído com sucesso" });
      }
    } catch (error) {
      next(error);
    }
  }
}

export default AutorController;
