const { validationResult } = require('express-validator/check');
const Article = require('../../models/ArticlesDirectory/article');
const ArticleVersionHistory = require('../../models/ArticlesDirectory/article-history');
const { addNewComment } = require('./Comment/comment');
const helperFunctions = require('./helperFunctions');
const User = require('../../models/User/user');

/**
 * controller to fetch all articles from database
 *  and send it as json response to the client.
 */
exports.getAllArticles = (req, res, next) => {
  Article.find()
    .then((articles) => {
      if (!articles) {
        res.status(404).json({
          message: 'No Articles Found',
          articles: articles
        });
      }
      res.status(200).json({
        message: 'Articles fetched Successfuly',
        articles: articles
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
 * controller to fetch a particular user's favourite articles.
 * it first fetches all articles and then checks whether
 * or not a given user has liked it and based on it,
 * it filters out those articles which a current user
 * has put into his favourite list and sends
 * as a response to the client
 */

exports.getFavArticles = (req, res, next) => {
  Article.find()
    .then((articles) => {
      if (!articles) {
        res.status(404).json({
          message: 'No Articles Found',
          articles: articles
        });
      }

      // extracting out fav articles
      favArticles = articles.map((article) => {
        let isArticleFav = false;
        article.Likes.forEach((like) => {
          if (like == req.userId) {
            isArticleFav = true;
          }
        });

        if (isArticleFav) {
          return article;
        }
        return false;
      });

      // filtering false values from the articles array
      return favArticles.filter((favArticle) => {
        if (favArticle != null) {
          return favArticle;
        }
      });
    })
    .then((result) => {
      res.status(200).json({
        message: 'Fav Articles Fetched',
        favArticles: result
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        error.statusCode = 500;
      }
      next(err);
    });
};

/**
 * controller to fetch a particular user's latest favourite articles.
 * it first fetches all articles and then checks whether
 * or not a given user has liked it and based on it,
 * it filters out those articles which a current user
 * has put into his favourite list and sends
 * as a response to the client
 */
exports.getLatestFavArticles = (req, res, next) => {
  Article.find()
    .then((articles) => {
      if (!articles) {
        res.status(404).json({
          message: 'No Articles Found',
          articles: articles
        });
      }

      // extracting out fav articles
      favArticles = articles.map((article) => {
        let isArticleFav = false;
        article.Likes.forEach((like) => {
          if (like == req.userId) {
            isArticleFav = true;
          }
        });

        if (isArticleFav) {
          return article;
        }
        return false;
      });

      // filtering false values from the articles array
      return favArticles.filter((favArticle) => {
        if (favArticle != null) {
          return favArticle;
        }
      });
    })
    .then((favArticles) => {
      /**
       * checking if favourite articles are more than
       * 3 and if that is the case only storing latest
       * 3 articles.
       */
      if (favArticles.length > 4) {
        return [favArticles[0], favArticles[1], favArticles[2], favArticles[3]];
      }
      return favArticles;
    })
    .then((result) => {
      res.status(200).json({
        message: 'Latest Favourite Articles Fetched',
        favArticles: result
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        error.statusCode = 500;
      }
      next(err);
    });
};

/**
 * controller function to fetch all the articles
 * of the current user online by comparing
 * the current user id in the request with
 * the author id of the article.
 */
exports.getMyBlogs = (req, res, next) => {
  Article.find()
    .then((articles) => {
      if (!articles) {
        res.status(404).json({
          message: 'No Articles Found For this User',
          articles: articles
        });
      }
      articles = articles.filter((article) => {
        return article.Author.id == req.userId; // comparing ids
      });
      res.status(200).json({
        message: 'Articles created by current user fetched successfuly',
        articles: articles
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
 * get a particular user's latest articles
 * and the userId for that user is sent
 * from the client side in the params
 * of the request. It uses mongodb sort
 * and limit functions to get latest 4 articles.
 */
exports.getUserLatestArticles = (req, res, next) => {
  const userId = req.params.userId;
  Article.find()
    .sort({ _id: -1 })
    .limit(4)
    .then((articles) => {
      if (!articles) {
        res.status(404).json({
          message: 'No Articles Found For this User',
          articles: articles
        });
      }
      // console.log(articles);
      articles = articles.filter((article) => {
        return article.Author.id == userId; //filtering only required user's articles
      });
      res.status(200).json({
        message: 'Latest articles created by current user fetched successfuly',
        articles: articles
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
 * get a particular user's all articles
 * and the userId for that user is sent
 * from the client side in the params
 * of the request. It uses mongodb sort
 * function to get latest articles.
 */
exports.getAllUserArticles = (req, res, next) => {
  const userId = req.params.userId;
  Article.find()
    .sort({ _id: -1 })
    .then((articles) => {
      if (!articles) {
        res.status(404).json({
          message: 'No Articles Found For this User',
          articles: articles
        });
      }
      // console.log(articles);
      articles = articles.filter((article) => {
        return article.Author.id == userId;
      });
      res.status(200).json({
        message: 'Latest articles created by current user fetched successfuly',
        articles: articles
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
 * controller function to get latest articles
 * regardless of a user or any topic.
 * this makes use of sort and limit function
 * in the mongodb query.
 */
exports.getLatestArticles = (req, res, next) => {
  Article.find()
    .sort({ _id: -1 })
    .limit(3)
    .then((articles) => {
      if (!articles) {
        res.status(404).json({
          message: 'No Articles Yet'
        });
      }
      res.status(200).json({
        message: 'Latest articles fetched successfully',
        articles: articles
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
 * controller function to get a particular
 * article by article id. The article
 * id is sent in the params of the url from
 * the client side and is extracted in the
 * controller before further proceedings.
 */
exports.getArticle = (req, res, next) => {
  const articleId = req.params.id;

  Article.findById(articleId)
    .then((article) => {
      if (!article) {
        res.status(404).json({
          message: 'Article Not Found',
          article: article
        });
      }
      res.status(200).json({
        message: 'Article fetched Successfuly',
        article: article
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
 * controller function for full text search.
 * the phrase or keyword is sent
 * from the client side in the body of the
 * request which is extracted as the first
 * step. Then query is written using or
 * operator which checks if the given string
 * is there in the title, body, topic or authorname
 * and if that is the case then those articles
 * are sent back to the client side in the json
 * format. Moreover, regular expressions are used
 * to make partial search possible and by this the
 * search results are enhanced.
 */
exports.searchAllArticles = (req, res, next) => {
  const keyword = req.body.keyword;

  Article.find(
    {
      $or: [
        {
          Title: {
            $regex: new RegExp(keyword, 'i') // i is given as a second argument to ensure case insensitivity
          }
        },
        {
          Body: {
            $regex: new RegExp(keyword, 'i')
          }
        },
        {
          'Author.authorName': {
            $regex: new RegExp(keyword, 'i')
          }
        },
        {
          Topic: {
            $regex: new RegExp(keyword, 'i')
          }
        }
      ]
    },
    {
      __v: 0
    }
  )
    .then((articles) => {
      res.status(200).json({
        message: 'Articles fetched',
        articles: articles
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

/**
 * controller function to add a new article.
 * The first step is to validate the body
 * and if there is any validation error in any
 * field of the body or something is not as it is
 * required then without any proceedings the error is thrown.
 * If there is no error the body elements are stored.
 * Next, it is checked that whether there is any file
 * with the request and based on that new article is ceated
 * without giving any error.
 */
exports.addArticle = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const title = req.body.title;
  const body = req.body.body;
  const author = req.userId;
  const authorName = req.username;

  // createNewArticle is the function which actually creates a new article in the datbase
  return helperFunctions.createNewArticle(res, next, {
    title,
    body,
    author,
    authorName
  });
};

/**
 * controller function to edit a particular article.
 * This function does two tasks at a given time.
 * One it updates the article and second it
 * creates of updates the version history of the
 * article depending upon the edit history.
 */
exports.editArticle = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const articleId = req.body.articleId;
  const title = req.body.title;
  const topic = req.body.topic;
  const body = req.body.body;
  const author = req.userId;
  const authorName = req.username;
  let secure_url = req.body.secure_url;
  const public_id = req.body.public_id;

  let storeFoundArticle;

  Article.findById(articleId)
    .then((foundArticle) => {
      if (!foundArticle) {
        res.status(404).json({
          message: 'Article not found'
        });
      }
      if (foundArticle.Author.id != author) {
        return res.status(401).json({
          message: 'Not Authorized!'
        });
      }

      storeFoundArticle = foundArticle; //storing the article found to access it for later use

      return ArticleVersionHistory.findById(articleId);
    })
    .then((foundArticleVersionHistory) => {
      //if the version history does not exist then it creates one
      if (!foundArticleVersionHistory) {
        return new ArticleVersionHistory({
          _id: articleId
        }).save();
      }
      return foundArticleVersionHistory;
    })
    .then((foundArticleVersionHistory) => {
      // pushing previous version in the version history and saving the updated version history
      foundArticleVersionHistory.Version_History.push({
        article: storeFoundArticle
      });
      foundArticleVersionHistory.save();

      /**
       * depending on the availability of the file in the request
       * the request if further proceeded.
       */
      if (req.file) {
        // if new file is there then uploading it to the cloud and calling editArticle function to save new paths.
        helperFunctions
          .uploadArticleCover(req.file.path, 'articles/')
          .then((result) => {
            // console.log(result);
            const secure_url = result.secure_url;
            const public_id = result.public_id;
            return helperFunctions.EditArticle(res, next, storeFoundArticle, {
              title,
              topic,
              secure_url,
              public_id,
              body,
              author,
              authorName
            });
          });
      } else {
        // if there's no new local file and file is not changed or there is another method of file uploading
        return helperFunctions.EditArticle(res, next, storeFoundArticle, {
          title,
          topic,
          secure_url,
          public_id,
          body,
          author,
          authorName
        });
      }
    });
};

/**
 * controller function to get the version
 * history of a particular article whose
 * id is sent via the param in the request.
 */
exports.getArticlesVersionHistory = (req, res, next) => {
  const articleId = req.params.articleId;

  ArticleVersionHistory.findById(articleId)
    .then((versionHistory) => {
      if (!versionHistory) {
        res.status(404).json({
          message: 'Version History Not Found'
        });
      }
      return res.status(200).json({
        message: 'Version History Fetched Successfully',
        version_history: versionHistory
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

/**
 * controller function to delete a particular
 * article whose id is sent in the body of the request.
 * It makes sure that the current user is the user who
 * created that given article.
 */
exports.deleteArticle = (req, res, next) => {
  const articleId = req.body.articleId;
  const author = req.userId;
  User.findById(author)
    .then((user) => {
      Article.findById(articleId)
        .then((article) => {
          if (!article) {
            res.status(404).json({
              message: 'Article not found!'
            });
          }
          if (article.Author.id == user.id) {
            //makes sure the owner is deleting the article
            return Article.deleteOne({ _id: articleId });
          }
          if (user.IsAdmin == true) {
            return Article.deleteOne({ _id: articleId });
          }
          res.status(401).json({
            message: 'Not Authorized'
          });
        })
        .then((articleRemoved) => {
          if (articleRemoved) {
            res.status(200).json({
              message: 'Article Successfully Removed'
            });
          }
        })
        .catch((error) => {
          if (!error.statusCode) {
            error.statusCode = 500;
          }
          next(error);
        });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 401;
      }
      next(error);
    });
};

/**
 * controller function which does both tasks
 * at the same time. The task to like or unlike
 * the article and keep it in the favorite list.
 * It checks whether or not the article is liked before
 * by the same user and depending on it, it likes or
 * unlikes the given article for the particular user
 * and updates the Likes list in the database
 */
exports.likeArticle = (req, res, next) => {
  Article.findById(req.body.articleId)
    .then((article) => {
      if (!article) {
        return res.status(404).json({
          message: 'Article not found!'
        });
      }
      let wasLiked;
      article.Likes = article.Likes.filter((like) => {
        // if the user has already liked then unliking and filtering out the user
        if (like == req.userId) {
          wasLiked = true;
        }
        return like != req.userId;
      });

      if (!wasLiked) {
        //if the user had not liked it then pushing userid in the likes list of the article
        article.Likes.push(req.userId);
      }
      return article.save();
    })
    .then((likeStatusUpdated) => {
      if (likeStatusUpdated) {
        res.status(200).json({
          message: 'Article Like Status Updated'
        });
      }
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};
