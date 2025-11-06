import mongoose from "mongoose";
import autopopulate from "mongoose-autopopulate";

const livroSchema = new mongoose.Schema(
  {
    id: { type: mongoose.Schema.Types.ObjectId },
    titulo: {
      type: String,
      required: [true, "O título do livro é obrigatório"],
    },
    editora: {
      type: String,
      required: [true, "A editora do livro é obrigatória"],
      enum: {
        values: ["Casa do Código", "Alura"],
        message: "Editora {VALUE} não é válida",
      },
    },
    preco: { type: Number },
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "autores",
      required: [true, "O autor do livro é obrigatório"],
      autopopulate: true,
    },
    paginas: {
      type: Number,
      validate: {
        validator: (value) => {
          return value >= 10 && value <= 5000;
        },
        message:
          "O número de páginas deve estar entre 10 e 5000. Valor fornecido: {VALUE}",
      },
    },
  },
  { versionKey: false }
);

const livro = mongoose.model("livros", livroSchema);
livroSchema.plugin(autopopulate);

export default livro;
