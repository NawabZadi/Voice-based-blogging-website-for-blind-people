const Article = require('../../models/ArticlesDirectory/article');

// Cloudinary Configuration
const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'dkj3d1vvs',
  api_key: '759763123283575',
  api_secret: '_px1mRCmIfA-b8bgz9NADudJCHY'
});

/**
 * function which uploads a given image in cloudinary and returns url and id.
 * It makes use of promise in javascript for better handling of asynchronous code.
 */
exports.uploadArticleCover = (path, cloudinaryFolder) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      path,
      { folder: cloudinaryFolder, type: 'private' },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

/**
 * This function is used to make an object of the new article
 * and save it to the database. It makes sure that the article
 * is created in a right way because there are two methods to
 * upload the article cover. One is locally and other is using
 * the search which at the end directly gives us a url.
 */
const createNewArticleObject = (article) => {
  return new Promise((resolve) => {
    resolve(
      new Article({
        Title: article.title,
        Body: article.body,
        Author: { id: article.author, authorName: article.authorName }
      }).save()
    );
  });
};

/**
 * actual function behind creating a new article which
 * calls other function createNewArticleObject for inner work.
 */
exports.createNewArticle = (res, next, article) => {
  return createNewArticleObject(article)
    .then((newArticle) => {
      return res.status(201).json({
        message: 'New Article Created Successfully',
        article: newArticle
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

/**
 * This function is used to edit object of the existing article
 * and save it to the database. It makes sure that the article
 * is edited in a right way because there are two methods to
 * upload the article cover. One is locally and other is using
 * the search which at the end directly gives us a url.
 */
const EditArticleObject = (foundArticle, article) => {
  return new Promise((resolve) => {
    //locally uploading of the cover image
    if (article.secure_url && article.public_id) {
      foundArticle.Title = article.title;
      foundArticle.Topic = article.topic;
      foundArticle.PictureSecureId = article.secure_url;
      foundArticle.PicturePublicId = article.public_id;
      foundArticle.Body = article.body;
      resolve(foundArticle.save());
    } else if (article.secure_url && !article.public_id) {
      //through google search image API
      foundArticle.Title = article.title;
      foundArticle.Topic = article.topic;
      foundArticle.PictureSecureId = article.secure_url;
      foundArticle.Body = article.body;
      resolve(foundArticle.save());
    } else {
      foundArticle.Title = article.title;
      foundArticle.Topic = article.topic;
      foundArticle.PictureSecureId = article.secure_url;
      foundArticle.Body = article.body;
      resolve(foundArticle.save());
    }
  });
};

/**
 * actual function behind editing an existing article which
 * calls other function EditArticleObject for inner work.
 */
exports.EditArticle = (res, next, foundArticle, article) => {
  return EditArticleObject(foundArticle, article)
    .then((editedArticle) => {
      return res.status(201).json({
        message: 'Article Edited Successfully',
        article: editedArticle
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};
