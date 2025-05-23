const { validationResult } = require("express-validator/check");
const Comment = require("../../../models/ArticlesDirectory/Comment/comment");
const Reply = require("../../../models/ArticlesDirectory/Comment/reply");
const Article = require("../../../models/ArticlesDirectory/article");
const User = require("../../../models/User/user");



/**
 * controller to get all the comments for a particular 
 * article whose id is sent via the params in the url.
 * Article has a comments array which are only references 
 * and to get the data of those comments populate function 
 * is used and inside it the nested populate is used to get
 * author information because in comments there is a field 
 * which references author which is a User object.
 */
exports.getArticleCommentsWithReplies = async (req,res,next) => {
    const articleId = req.params.articleId;

    articleComments = await Article.findById(articleId)
        .populate([
            {
            path: "Comments",
            model: "Comment",
            populate: {
                path: 'Author',
                model: 'User',
                select: "Username Email _id",
              }
            },
        ]);

    res.status(200).json({
        message: "Comments fetched successfully",
        comments: articleComments.Comments
    });
}


/**
 * controller function to add a new comment in the article.
 * It first validates the body and if there's any validation
 * error it throws it. Then it checks if the article exists or 
 * not because someone can manipulate the article id or even
 * send a bogus id from postman or some other tool. If 
 * article is found then the comment is created and pushed 
 * in the Comments[] of the article.
 */
exports.addNewComment = (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error ('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const commentText = req.body.text;
    const articleId      = req.body.articleId;

    let loadedArticle, newComment;
    Article.findById(articleId)
        .then(article => {
            if (!article) {
                res.status(404).json({
                    message: "Article Not found!"
                })
            }
            loadedArticle = article;
            return new Comment({
                Text: commentText,
                Author: req.userId
            }).save();
        })
        .then(newComment => {
            if (newComment) {
                newComment = newComment;
                loadedArticle.Comments.push(newComment);
                return loadedArticle.save();
            }
        })
        .then(savedArticleWithComment => {
            res.status(201).json({
                message: "Comment successfuly added to the article",
                comment: newComment
            });
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};


/**
 * controller to delete a particular comment from the article.
 * The id for that comment is sent via the body of the request.
 */
exports.deleteComment = (req, res, next) => {
    let loadedArticle;
    let loadedComment;
    Article.findById(req.body.articleId) // if the article exists
        .then(article => {
            if (!article) {
                return res.status(404).json({
                    message: "Article not found!"
                })
            }
            loadedArticle = article; //storing it for later use
            return Comment.findById(req.body.commentId); // finding a given comment
        })
        .then(comment => {
            if (!comment) {
                return res.status(404).json({ //if not found return error in json format
                    message: "Comment not found!"
                })
            }
            loadedComment = comment;
            if (loadedComment.Author == req.userId) { //checking whether the author of the comment is deleting it
                loadedArticle.Comments = loadedArticle.Comments.filter(comment => { //filter article comments
                    return comment != req.body.commentId;
                })
            }
            else {
                return res.status(401).json({ //if the author is not deleting then returning unauthorized error
                    message: "Not Authorized"
                });
            }
            return loadedArticle.save(); // saving article after deleting the comment
        })
        .then(articleSaved => {
            if (articleSaved) {
                return loadedComment.remove(); 
            }
        })
        .then (commentRemoved => {
            if (commentRemoved) {
                res.status(200).json({
                    message: "Comment Successuly Deleted!"
                })
            }
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
        
};
/**
 * controller function to edit the comment. 
 * This makes sure that the current user is the author of 
 * the comment who is editing it.
 */
exports.editComment = (req, res, next) => {
        Comment.findById(req.body.commentId)
        .then(comment => {
            if (!comment) {
                return res.status(404).json({
                    message: "Comment not found"
                });
            } else {
                if (comment.Author == req.userId) { // if the author of the comment is editing it
                    comment.Text = req.body.updatedText;
                    return comment.save();
                }
                return res.status(401).json({
                    message: "Not Authorized"
                });
            }
        })
        .then(commentSaved => {
            if (commentSaved) {
                return res.status(200).json({
                    message: "Comment edited successfully"
                });
            }
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};

/**
 * controller to like and unlike the comment 
 * based on the status of the previous activity. 
 * If it was liked before then it removes the like or
 * else push the User object Id in the Likes [] array of the comment.
 */
exports.likeComment = (req,res,next) => {
    Comment.findById(req.body.commentId)
        .then(comment => {
            if (!comment) {
                return res.status(404).json({
                    message: "Comment not found!"
                })
            }
            let wasLiked;
            comment.Likes = comment.Likes.filter(like => {
                if (like == req.userId) {
                    wasLiked = true;
                }
                return like!=req.userId;
            });
            
            if (!wasLiked) {
                comment.Likes.push(req.userId);
            }
            return comment.save();
        })
        .then(likeStatusUpdated => {
            if (likeStatusUpdated) {
                res.status(200).json({
                    message: "Comment Like Status Updated"
                })
            }
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};