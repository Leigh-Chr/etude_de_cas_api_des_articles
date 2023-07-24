const NotFoundError = require("../../errors/not-found");
const articlesService = require("./articles.service");

class ArticlesController {
  async getAll(req, res, next) {
    try {
      const articles = await articlesService.getAll();
      res.json(articles);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const id = req.params.id;
      const article = await articlesService.get(id);
      if (!article) {
        throw new NotFoundError();
      }
      res.json(article);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const userId = req.user.id;
      const articleData = { ...req.body, user: userId };
      const article = await articlesService.create(articleData);
      article.password = undefined;
      req.io.emit("article:create", article);
      res.status(201).json(article);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const id = req.params.id;
      const data = req.body;

      // Vérification du rôle de l'utilisateur
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const articleModified = await articlesService.update(id, data);
      articleModified.password = undefined;
      req.io.emit("article:update", articleModified);
      res.json(articleModified);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const id = req.params.id;

      // Vérification du rôle de l'utilisateur
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized" });
      }

      await articlesService.delete(id);
      req.io.emit("article:delete", { id });
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ArticlesController();
