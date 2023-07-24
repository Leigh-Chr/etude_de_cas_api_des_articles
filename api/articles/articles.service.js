const Article = require("./articles.model.js");

class ArticleService {
    create(data) {
        const article = new Article(data);
        return article.save();
    }

    update(id, data) {
        return Article.findByIdAndUpdate(id, data, { new: true });
    }

    delete(id) {
        return Article.deleteOne({ _id: id });
    }

    getAll(userId) {
        return Article.find({ user: userId }).populate("user", "-password");
    }
}

module.exports = new ArticleService();