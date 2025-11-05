import NotFound from "../errors/NotFound.js";

function manipulador404(req, res, next) {
  next(new NotFound());
}

export default manipulador404;
