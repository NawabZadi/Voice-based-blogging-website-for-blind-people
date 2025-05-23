const { validationResult } = require("express-validator/check");
const Reply = require("../../../models/ArticlesDirectory/Comment/reply");
const Comment = require("./comment");

exports.addNewReply = (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error ('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const replyText = req.body.text;
    const commentId = req.body.commentId;
    const repliedToUserId = req.body.repliedTo;
    let comment, newReply;
    Comment.findById(commentId)
        .then(comment => {
            if (!comment) {
                res.status(422).json({
                    message: "Server could not process the comment"
                })
            }
            comment = comment;
            return new Reply({
                Text: replyText,
                Author: req.userId,
                repliedTo : repliedToUserId

            }).save();
        })
        .then(newReply => {
            if (newReply) {
                newReply = newReply;
                comment.Replies.push(newReply);
                return comment.save();
            }
        })
        .then(savedCommentWithReply => {
            res.status(201).json({
                message: "Reply successfuly added to the comment",
                reply: newReply
            });
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};

exports.deleteReply = (req,res,next) => {
};

exports.editReply = (req,res,next) => {

};

exports.likeReply = (req,res,next) => {

};