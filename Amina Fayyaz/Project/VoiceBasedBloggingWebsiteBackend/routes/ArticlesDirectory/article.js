const express = require('express');
const { body } = require('express-validator/check');
const isAuth = require('../../middleware/is-auth');
const articlesController = require('../../controllers/ArticlesDirectory/article');

const router = express.Router();

router.get('/get-all-articles', articlesController.getAllArticles);

router.get('/get-latest-articles', articlesController.getLatestArticles);

router.get('/get-article/:id', articlesController.getArticle);

router.get('/get-fav-articles', isAuth, articlesController.getFavArticles);

router.get(
  '/get-latest-fav-articles/:userId',
  isAuth,
  articlesController.getLatestFavArticles
);

router.get('/get-my-blogs', isAuth, articlesController.getMyBlogs);

router.get(
  '/get-all-user-articles/:userId',
  articlesController.getAllUserArticles
);

router.get(
  '/get-user-latest-articles/:userId',
  articlesController.getUserLatestArticles
);

router.post('/search-all-articles', articlesController.searchAllArticles);

router.post(
  '/add-article',
  isAuth,
  [body('title').trim().not().isEmpty(), body('body').not().isEmpty()],
  articlesController.addArticle
);

router.post('/delete-article', isAuth, articlesController.deleteArticle);

router.post(
  '/edit-article',
  isAuth,
  [body('title').trim().not().isEmpty(), body('body').not().isEmpty()],
  articlesController.editArticle
);

router.get(
  '/get-articles-version-history/:articleId',
  isAuth,
  articlesController.getArticlesVersionHistory
);

router.post('/like-article', isAuth, articlesController.likeArticle);

module.exports = router;
